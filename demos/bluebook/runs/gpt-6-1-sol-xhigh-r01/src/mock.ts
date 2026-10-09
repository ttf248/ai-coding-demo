export type Note={id:string;title:string;author:string;category:string;image:string;width:number;height:number;likes:number;body:string;following:boolean};
const topics=[['旅行','在山野里，找回慢一点的自己','南山有风'],['家居','把日子过成一间温柔的小屋','阿橙的房间'],['美食','今天也要好好吃早餐呀','早安厨房'],['摄影','日落之前，收藏一片粉色的天','半格胶片'],['穿搭','不费力的松弛感，藏在这些颜色里','小鹿同学'],['生活','普通的周末，也有值得记住的瞬间','林间来信']];
export const categories=['推荐','关注','旅行','家居','美食','摄影','穿搭','生活','已收藏'];
export const notes:Note[]=Array.from({length:120},(_,i)=>{const[category,title,author]=topics[i%6];return{id:'note-'+i,title:i<6?title:[title,'给生活留一点空白','记录这个被阳光照亮的下午'][i%3],author,category,image:`${import.meta.env.BASE_URL}images/scene-${i%12}.svg`,width:600,height:700+(i%4)*120,likes:38+(i*137)%2300,body:'把喜欢的瞬间留在这里。也许是一阵风、一束光，或者一次没有目的地的出发。\n\n这些由本地插画组成的示例笔记，是对理想生活的一次小小描绘。欢迎写下属于你的故事。',following:i%4===0};});
export const fallback=`${import.meta.env.BASE_URL}images/fallback.svg`;
