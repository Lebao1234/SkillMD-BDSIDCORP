/* Minimal MCP-over-HTTP client for the Epod server */
const https = require('https');
const fs = require('fs');
const path = require('path');

const URL_ = 'https://mcp.epodsystem.com/mcp';
const mcpConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../.mcp.json'), 'utf8'));
const authHeader = mcpConfig.mcpServers.epodsystem.headers.Authorization;
const TOKEN = authHeader.replace(/^Bearer\s+/, '').replace(/^\{/, '').replace(/\}$/, '');

let session = null;
let id = 0;

function post(body) {
  return new Promise((res, rej) => {
    const u = new URL(URL_);
    const data = JSON.stringify(body);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      'Authorization': 'Bearer ' + TOKEN,
      'Content-Length': Buffer.byteLength(data),
    };
    if (session) headers['mcp-session-id'] = session;
    const req = https.request({ hostname: u.hostname, path: u.pathname, method: 'POST', headers }, (r) => {
      if (r.headers['mcp-session-id']) session = r.headers['mcp-session-id'];
      let s = '';
      r.on('data', (c) => (s += c));
      r.on('end', () => {
        const events = [];
        let buf = [];
        s.split('\n').forEach((l) => {
          const t = l.replace(/\r$/, '');
          if (t.startsWith('data:')) buf.push(t.slice(t[5] === ' ' ? 6 : 5));
          else if (t === '' && buf.length) { events.push(buf.join('\n')); buf = []; }
        });
        if (buf.length) events.push(buf.join('\n'));
        for (const e of events) {
          try { return res(JSON.parse(e)); } catch (err) {}
        }
        res(s ? { raw: s } : {});
      });
    });
    req.on('error', rej);
    req.end(data);
  });
}

async function init() {
  await post({
    jsonrpc: '2.0',
    id: ++id,
    method: 'initialize',
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'antigravity', version: '1' } }
  });
  await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
}

async function listTools() {
  const r = await post({ jsonrpc: '2.0', id: ++id, method: 'tools/list', params: {} });
  return (r.result && r.result.tools) || [];
}

async function call(name, args) {
  const r = await post({ jsonrpc: '2.0', id: ++id, method: 'tools/call', params: { name, arguments: args || {} } });
  if (r.error) return { ERROR: r.error.message || r.error };
  const c = (r.result && r.result.content) || [];
  const txt = c.map((x) => x.text || '').join('\n');
  try { return JSON.parse(txt); } catch (e) {}
  if (txt.trimStart()[0] === '{') {
    const s = txt.indexOf('{');
    let depth = 0, inStr = false, escaped = false;
    for (let i = s; i < txt.length; i++) {
      const c = txt[i];
      if (inStr) {
        if (escaped) escaped = false;
        else if (c === '\\') escaped = true;
        else if (c === '"') inStr = false;
      } else if (c === '"') inStr = true;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) {
        try { return JSON.parse(txt.slice(s, i + 1)); } catch (err) { break; }
      }
    }
  }
  return txt;
}

module.exports = { init, call, listTools };

if (require.main === module) {
  (async () => {
    await init();
    const [, , tool, json] = process.argv;
    if (!tool) {
      const tools = await listTools();
      console.log(`Found ${tools.length} tools:`);
      tools.forEach(t => console.log(`- ${t.name}: ${t.description.slice(0, 80)}`));
    } else {
      console.log(JSON.stringify(await call(tool, json ? JSON.parse(json) : {}), null, 2));
    }
  })();
}

