/* ==========================================================================
   TRẠNG THÁI LƯU TRÊN MÁY NGƯỜI DÙNG

   Bản dựng này không có máy chủ. Mọi thứ người dùng tạo ra (đăng ký sự kiện,
   hồ sơ, nội dung gửi lên, thay đổi trong CMS) nằm trong localStorage của
   chính trình duyệt họ, và không đi đâu cả.

   Mọi lần đọc và ghi đều bọc try/catch: cửa sổ riêng tư hoặc trình duyệt chặn
   lưu trữ sẽ rơi về trạng thái trong bộ nhớ cho phiên đó, thay vì làm vỡ trang.
   ========================================================================== */

(function () {
  'use strict';

  var KEY = 'neu-alumni:';
  var mem = {};

  function read(name, fallback) {
    try {
      var raw = localStorage.getItem(KEY + name);
      if (raw === null) return name in mem ? mem[name] : fallback;
      return JSON.parse(raw);
    } catch (e) {
      return name in mem ? mem[name] : fallback;
    }
  }

  function write(name, value) {
    mem[name] = value;
    try {
      localStorage.setItem(KEY + name, JSON.stringify(value));
    } catch (e) {
      /* Hết dung lượng hoặc bị chặn. Giá trị vẫn sống trong mem cho phiên này. */
    }
    return value;
  }

  function remove(name) {
    delete mem[name];
    try { localStorage.removeItem(KEY + name); } catch (e) {}
  }

  /* ------------------------------------------------------------------------
     Chủ đề sáng tối
     ------------------------------------------------------------------------ */
  function getTheme() { return read('theme', 'auto'); }
  function setTheme(v) {
    write('theme', v);
    applyTheme();
    return v;
  }
  function applyTheme() {
    var t = getTheme();
    var el = document.documentElement;
    if (t === 'auto') el.removeAttribute('data-theme');
    else el.setAttribute('data-theme', t);
  }

  /* ------------------------------------------------------------------------
     Phiên đăng nhập

     Đây là phiên giả lập cho bản demo. Không có mật khẩu nào được kiểm tra và
     không có gì được truyền đi. Nó tồn tại để trình bày sự khác nhau giữa
     khách vãng lai, thành viên đã đăng nhập, biên tập viên và quản trị viên.
     ------------------------------------------------------------------------ */
  function getSession() { return read('session', null); }
  function signIn(user) { return write('session', user); }
  function signOut() { remove('session'); }
  function isAdmin() { var s = getSession(); return !!s && s.vaitro === 'admin'; }
  function isEditor() { var s = getSession(); return !!s && (s.vaitro === 'admin' || s.vaitro === 'editor'); }
  function isMember() { return !!getSession(); }

  /* ------------------------------------------------------------------------
     Đăng ký sự kiện
     ------------------------------------------------------------------------ */
  function getRegistrations() { return read('registrations', []); }
  function register(entry) {
    var list = getRegistrations();
    var i = list.findIndex(function (r) { return r.eventId === entry.eventId && r.email === entry.email; });
    if (i >= 0) return { ok: false, lyDo: 'trung' };
    list.push(Object.assign({ id: 'r-' + Date.now().toString(36), luc: new Date().toISOString() }, entry));
    write('registrations', list);
    return { ok: true };
  }
  function cancelRegistration(id) {
    write('registrations', getRegistrations().filter(function (r) { return r.id !== id; }));
  }
  function registrationsFor(eventId) {
    return getRegistrations().filter(function (r) { return r.eventId === eventId; });
  }

  /* ------------------------------------------------------------------------
     Hồ sơ do người dùng tự tạo, cộng vào bộ dữ liệu sẵn có
     ------------------------------------------------------------------------ */
  function getProfiles() { return read('profiles', []); }
  function saveProfile(p) {
    var list = getProfiles();
    var i = list.findIndex(function (x) { return x.id === p.id; });
    if (i >= 0) list[i] = p; else list.push(p);
    return write('profiles', list);
  }

  /* ------------------------------------------------------------------------
     Nội dung người dùng gửi lên, chờ quản trị duyệt
     ------------------------------------------------------------------------ */
  function getSubmissions() {
    var seeded = (window.__SUBMISSIONS || []).slice();
    var extra = read('submissions', []);
    var overrides = read('submissionStatus', {});
    return seeded.concat(extra).map(function (s) {
      return overrides[s.id] ? Object.assign({}, s, { trangthai: overrides[s.id] }) : s;
    });
  }
  function submit(entry) {
    var list = read('submissions', []);
    var rec = Object.assign({
      id: 's-u-' + Date.now().toString(36),
      ngayGui: new Date().toISOString().slice(0, 10),
      trangthai: 'cho-duyet',
      anh: [],
    }, entry);
    list.push(rec);
    write('submissions', list);
    return rec;
  }
  function setSubmissionStatus(id, status) {
    var o = read('submissionStatus', {});
    o[id] = status;
    return write('submissionStatus', o);
  }

  /* ------------------------------------------------------------------------
     Thay đổi nội dung từ CMS

     CMS không sửa file dữ liệu gốc. Nó ghi một lớp đè lên: bản vá theo id,
     danh sách id đã xóa, và các bản ghi mới. Hàm merge dưới đây ráp ba thứ đó
     lại thành bộ dữ liệu mà trang công khai đọc.
     ------------------------------------------------------------------------ */
  function overlayKey(kind) { return 'overlay:' + kind; }

  function getOverlay(kind) {
    return read(overlayKey(kind), { patch: {}, deleted: [], added: [] });
  }

  function merge(kind, base) {
    var o = getOverlay(kind);
    var out = base
      .filter(function (r) { return o.deleted.indexOf(r.id) < 0; })
      .map(function (r) { return o.patch[r.id] ? Object.assign({}, r, o.patch[r.id]) : r; });
    return o.added.concat(out);
  }

  function patchRecord(kind, id, fields) {
    var o = getOverlay(kind);
    o.patch[id] = Object.assign({}, o.patch[id], fields);
    return write(overlayKey(kind), o);
  }

  function addRecord(kind, record) {
    var o = getOverlay(kind);
    o.added.unshift(record);
    return write(overlayKey(kind), o);
  }

  function deleteRecord(kind, id) {
    var o = getOverlay(kind);
    var wasAdded = o.added.findIndex(function (r) { return r.id === id; });
    if (wasAdded >= 0) o.added.splice(wasAdded, 1);
    else if (o.deleted.indexOf(id) < 0) o.deleted.push(id);
    delete o.patch[id];
    return write(overlayKey(kind), o);
  }

  /* ------------------------------------------------------------------------
     Sao lưu và khôi phục

     Xuất ra một tệp JSON gồm toàn bộ thay đổi trong trình duyệt này. Nhập lại
     tệp đó khôi phục đúng trạng thái. Trong bản chạy thật, đây là chỗ nối vào
     lệnh kết xuất cơ sở dữ liệu của máy chủ.
     ------------------------------------------------------------------------ */
  var BACKUP_KEYS = [
    'registrations', 'profiles', 'submissions', 'submissionStatus',
    'overlay:posts', 'overlay:events', 'overlay:albums',
    'overlay:jobs', 'overlay:alumni', 'overlay:users',
  ];

  function exportAll() {
    var payload = { phienBan: 1, xuatLuc: new Date().toISOString(), duLieu: {} };
    BACKUP_KEYS.forEach(function (k) {
      var v = read(k, null);
      if (v !== null) payload.duLieu[k] = v;
    });
    return payload;
  }

  function importAll(payload) {
    if (!payload || typeof payload !== 'object' || !payload.duLieu) {
      return { ok: false, lyDo: 'Tệp không đúng định dạng sao lưu.' };
    }
    var n = 0;
    Object.keys(payload.duLieu).forEach(function (k) {
      if (BACKUP_KEYS.indexOf(k) < 0) return;
      write(k, payload.duLieu[k]);
      n++;
    });
    return { ok: true, soMuc: n };
  }

  function resetAll() {
    BACKUP_KEYS.concat(['session']).forEach(remove);
  }

  window.__STORE = {
    read: read, write: write, remove: remove,
    getTheme: getTheme, setTheme: setTheme, applyTheme: applyTheme,
    getSession: getSession, signIn: signIn, signOut: signOut,
    isAdmin: isAdmin, isEditor: isEditor, isMember: isMember,
    getRegistrations: getRegistrations, register: register,
    cancelRegistration: cancelRegistration, registrationsFor: registrationsFor,
    getProfiles: getProfiles, saveProfile: saveProfile,
    getSubmissions: getSubmissions, submit: submit, setSubmissionStatus: setSubmissionStatus,
    merge: merge, patchRecord: patchRecord, addRecord: addRecord, deleteRecord: deleteRecord,
    exportAll: exportAll, importAll: importAll, resetAll: resetAll,
  };

  /* Áp chủ đề ngay, trước khi trang vẽ, để không chớp sáng rồi mới tối. */
  applyTheme();
})();
