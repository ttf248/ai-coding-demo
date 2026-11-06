import type { Note } from "./types";

const TITLES = [
  "周末的citywalk路线分享，这条老街真的出片",
  "三分钟搞定的早餐，打工人也能好好吃饭",
  "第一次露营就成功！装备清单全记录",
  "秋天的第一杯桂花乌龙，自制配方公开",
  "小户型爆改：40㎡也能拥有衣帽间",
  "新手化妆避雷指南，这几个坑我都踩过",
  "公司楼下新开的咖啡店，拿铁居然只要9块",
  "养猫三年总结的省钱攻略，猫粮这样选",
  "海边日落拍照参数，手机也能拍大片",
  "独居生活第100天，我在阳台种满了菜",
  "面试复盘：HR最想听到的自我介绍模板",
  "这条通勤路线承包了我一整年的照片",
  "低卡零食红黑榜，解馋不长胖",
  "把旧牛仔裤改成托特包，手残党友好教程",
  "雨天在家看电影，我的片单和零食搭配",
  "第一次做提拉米苏，居然没有翻车",
  "山系穿搭入门：这五件单品闭眼入",
  "出租房改造：不钻孔的收纳神器合集",
  "夜跑半年，我瘦了十二斤的方法总结",
  "周末去哪儿玩？这八个免费展览别错过",
  "猫和狗第一次见面，全程高能",
  "办公室工位改造，摸鱼幸福感直接拉满",
];

const AUTHORS = [
  "小蓝同学",
  "阿茶日记",
  "山与海",
  "豆花不加糖",
  "深夜食堂",
  "慢速生活",
  "一只柚子",
  "风早",
  "栖迟",
  "桃子汽水",
  "北屿",
  "今天也很困",
];

// 已验证可访问的 Unsplash 图源；配合 w/h/fit=crop 参数裁出不同高度
const PHOTOS = [
  "photo-1470071459604-3b5ec3a7fe05",
  "photo-1506905925346-21bda4d32df4",
  "photo-1519681393784-d120267933ba",
  "photo-1441974231531-c6227db76b6e",
  "photo-1506744038136-46273834b3fb",
  "photo-1470225620780-dba8ba36b745",
  "photo-1542751371-adc38448a05e",
  "photo-1419242902214-272b3f66ee7a",
  "photo-1470252649378-9c29740c9fa8",
  "photo-1499209974431-9dddcece7f88",
  "photo-1519823551278-64ac92734fb1",
  "photo-1593810450967-f9c42742e326",
];

const AVATARS = [
  "photo-1494790108377-be9c29b29330",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1438761681033-6461ffad8d80",
];

// LCG：同一 seed 稳定复现，保证分页数据一致
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function makeNotes(page: number, size = 20): Note[] {
  const rand = lcg(page * 7919 + 20261106);
  return Array.from({ length: size }, (_, i) => {
    const id = `n${page}-${i}`;
    const h = Math.round(560 + rand() * 620);
    return {
      id,
      title: TITLES[Math.floor(rand() * TITLES.length)],
      author: AUTHORS[Math.floor(rand() * AUTHORS.length)],
      avatar: `https://images.unsplash.com/${
        AVATARS[Math.floor(rand() * AVATARS.length)]
      }?w=96&h=96&fit=crop&q=80`,
      likes: Math.floor(rand() * 5200) + 3,
      img: `https://images.unsplash.com/${
        PHOTOS[Math.floor(rand() * PHOTOS.length)]
      }?w=480&h=${h}&fit=crop&q=80`,
      ratio: 480 / h,
    };
  });
}
