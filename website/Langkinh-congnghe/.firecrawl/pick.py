import glob,os,urllib.request,concurrent.futures as cf
pick={
'hero-cam':'rangefinder-camera__17','cam-bac-toi':'rangefinder-camera__13','cam-bac-2':'rangefinder-camera__18','cam-den-pro':'rangefinder-camera__16','cam-bac-go':'rangefinder-camera__11',
'cam-dial-trang':'mirrorless-camera__03','cam-den-trang':'mirrorless-camera__07','cam-ben':'mirrorless-camera__13','cam-lens-trang':'mirrorless-camera__14','cam-gimbal':'mirrorless-camera__18','cam-den-toi':'mirrorless-camera__16','cam-dong':'mirrorless-camera__15','cam-dem':'mirrorless-camera__06',
'lens-trang':'camera-lens__11','lens-toi':'camera-lens__06','lens-xanh':'camera-lens__08','lens-bokeh':'camera-lens__16','lens-den':'camera-lens__17','lens-mau':'camera-lens__13','lens-cam':'camera-lens__03','lens-do':'camera-lens__19','lens-pho':'camera-lens__14','lens-la':'camera-lens__10','lens-4':'camera-lens__12',
'dial-toc-do':'camera-dial__08','dial-bac':'camera-dial__04','dial-num':'camera-dial__09','dial-do':'camera-dial__10','dial-go':'camera-dial__19',
'pho-quan':'hanoi-street__02','pho-quang-ganh':'hanoi-street__07','pho-cau':'hanoi-street__09','pho-xich-lo':'hanoi-street__12','pho-tau':'hanoi-street__13','pho-tau-dem':'hanoi-street__17','pho-den':'hanoi-street__08',
'canh-ruong':'vietnam-landscape__05','canh-nui':'vietnam-landscape__08','canh-bac':'vietnam-landscape__14','canh-vinh':'vietnam-landscape__00','canh-long-den':'vietnam-landscape__13','canh-thuyen':'vietnam-landscape__17',
'dem-pho':'saigon-night__05','dem-bui-vien':'saigon-night__02','dem-song':'saigon-night__08',
'chan-dung-1':'portrait-film__03','chan-dung-2':'portrait-film__07','chan-dung-3':'portrait-film__13','chan-dung-bw':'portrait-film__09',
'nhiep-anh-dem':'photographer-street__00','nhiep-anh-pho':'photographer-street__05','nhiep-anh-cam':'photographer-street__13','nhiep-anh-hem':'photographer-street__19',
'tay-cam-dem':'camera-in-hand__04','tay-film':'camera-in-hand__11',
}
m={}
for k,v in pick.items():
    q,i=v.split('__'); f=glob.glob(f'.firecrawl/thumbs/{q}__{i}__*.jpg')[0]; m[k]=os.path.basename(f).split('__')[2][:-4]
def dl(kv):
    k,pid=kv
    req=urllib.request.Request(f'https://images.unsplash.com/{pid}?w=1600&q=78&fm=jpg&fit=max',headers={'User-Agent':'Mozilla/5.0'})
    open(f'assets/img/{k}.jpg','wb').write(urllib.request.urlopen(req,timeout=60).read())
with cf.ThreadPoolExecutor(10) as ex: list(ex.map(dl,m.items()))
from PIL import Image, ImageDraw
fs=sorted(glob.glob('assets/img/*.jpg'))
for f in fs:
    im=Image.open(f).convert('RGB'); im.thumbnail((1600,1600)); im.save(f,quality=76,optimize=True,progressive=True)
W,H=210,160;cols=8;rows=(len(fs)+cols-1)//cols
sh=Image.new('RGB',(cols*W,rows*(H+16)),'white');d=ImageDraw.Draw(sh)
for k,f in enumerate(fs):
    im=Image.open(f);sz=im.size;im.thumbnail((W,H));x=(k%cols)*W;y=(k//cols)*(H+16);sh.paste(im,(x,y));d.text((x+3,y+H+2),os.path.basename(f)[:-4]+f' {sz[0]}x{sz[1]}',fill='red')
sh.save('.firecrawl/final-sheet.png')
print(len(fs), sum(os.path.getsize(f) for f in fs)//1024,'KB')
