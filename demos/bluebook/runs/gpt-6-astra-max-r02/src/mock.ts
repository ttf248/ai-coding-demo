export type Note={id:string;title:string;author:string;image:string;ratio:number;likes:number;category:string;description:string;avatar:string};
export const categories=['推荐','旅行','美食','家居','摄影','生活'];
export const fallback='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750"><rect width="600" height="750" fill="#e7e9e0"/><circle cx="430" cy="210" r="85" fill="#f5d4aa"/><path d="M0 600L210 290 480 700H0M200 750L510 430 600 520V750" fill="#a9bdb2"/><text x="300" y="680" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#50685e">生活，慢慢看 · 图片暂未加载</text></svg>');
const scenes=[
 ['把周末交给山野，风会给你答案','旅行','photo-1464822759023-fed622ff2c3b',.8,'山也'],
 ['一杯拿铁的时间，刚好用来放空','美食','photo-1447933601403-0c6688de566e',1.12,'阿柚的咖啡日记'],
 ['住进阳光里｜我的小家终于毕业啦','家居','photo-1600210492486-724fe5c67fb0',.82,'一颗橙子'],
 ['在海边，收集一整天的蓝','旅行','photo-1473116763249-2faaef81ccda',.76,'岛屿来信'],
 ['今天也要好好吃饭呀 🍅','美食','photo-1547592180-85f173990554',1.02,'小满食堂'],
 ['留一束花，把平凡日子过成诗','生活','photo-1490750967868-88aa4486c946',.75,'阿棉'],
 ['城市散步计划：没有目的地也很好','摄影','photo-1519608487953-e999c86e7455',.8,'林间晚风'],
 ['书桌是属于自己的小小宇宙','家居','photo-1497215728101-856f4ea42174',1.12,'Momo'],
 ['追到了人生中的第一场日落','摄影','photo-1472120435266-53107fd0c44a',.84,'落日收藏家'],
 ['简单早餐，也有认真生活的仪式感','美食','photo-1490645935967-10de6ba17061',.92,'今天吃什么'],
 ['把绿色带回家，和植物一起呼吸','家居','photo-1416879595882-3373a0480b5b',.77,'绿萝同学'],
 ['风从旷野来｜一次说走就走的出逃','旅行','photo-1469474968028-56623f02e42e',1.05,'北纬三十度'],
 ['慢下来，才能听见自己的声音','生活','photo-1441974231531-c6227db76b6e',.8,'森林电台'],
 ['复刻了这份意面！真的零失败','美食','photo-1473093295043-cdd812d0e601',.92,'厨房小白'],
 ['小房间改造，让每一平米都有温度','家居','photo-1616486338812-3dadae4b4ace',.8,'住在春天'],
 ['胶片里保存的，是那天的风','摄影','photo-1470770841072-f978cf4d019e',.9,'胶片旅人'],
 ['周末逛花市，是我的充电方式','生活','photo-1457089328109-e5d9bd499191',.8,'春日小事'],
 ['躲进山里的民宿，睡到自然醒','旅行','photo-1449158743715-0a90ebb6d2d8',.82,'山居笔记'],
 ['秋天的第一块苹果派，分享给你','美食','photo-1484723091739-30a097e8f929',.97,'糖分研究员'],
 ['和喜欢的人，一起走一段慢路','生活','photo-1472396961693-142e6e269027',.8,'小鹿同学']
] as const;
function avatar(author:string,index:number){
 const colors=['#b7ccbd','#e7c9b8','#bfc7dc','#d4c9ab','#cbbfd1'];
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="24" fill="'+colors[index%colors.length]+'"/><text x="24" y="31" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#46544f">'+author.slice(0,1)+'</text></svg>');
}
export const notes:Note[]=Array.from({length:100},(_,i)=>{const [title,category,photo,ratio,author]=scenes[i%scenes.length];return {id:'note-'+i,title,category,author,ratio,likes:27+(i*137)%2800,image:'https://images.unsplash.com/'+photo+'?auto=format&fit=crop&w=650&q=80',avatar:avatar(author,i),description:'把生活里喜欢的片刻认真记录下来。那天的天气刚刚好，遇到的风景也刚刚好。\n\n这是小蓝书的本地演示笔记。一起发现日常里的美好吧。#'+category+' #生活记录'}})
