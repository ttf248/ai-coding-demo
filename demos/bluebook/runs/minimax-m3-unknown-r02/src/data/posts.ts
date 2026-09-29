import type { Category, Post, Author } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'recommend', label: '推荐' },
  { id: 'food', label: '美食' },
  { id: 'travel', label: '旅行' },
  { id: 'fashion', label: '穿搭' },
  { id: 'beauty', label: '美妆' },
  { id: 'fitness', label: '运动' },
  { id: 'home', label: '家居' },
  { id: 'pets', label: '宠物' },
  { id: 'handmade', label: '手工' },
  { id: 'photography', label: '摄影' },
];

const AUTHORS: Author[] = [
  { id: 'a1', name: '小仙女苏苏', initial: '苏', color: '#fe2c55' },
  { id: 'a2', name: '美食探长', initial: '美', color: '#ff8a3d' },
  { id: 'a3', name: '摄影师 Jerry', initial: 'J', color: '#3b82f6' },
  { id: 'a4', name: '旅行的阿瑶', initial: '瑶', color: '#10b981' },
  { id: 'a5', name: '时尚博主 Lisa', initial: 'L', color: '#a855f7' },
  { id: 'a6', name: '健身教练凯哥', initial: '凯', color: '#ef4444' },
  { id: 'a7', name: '甜品师小白', initial: '白', color: '#f472b6' },
  { id: 'a8', name: '铲屎官阿喵', initial: '喵', color: '#f59e0b' },
  { id: 'a9', name: '手作艺人岚岚', initial: '岚', color: '#0ea5e9' },
  { id: 'a10', name: '家居设计师 小原', initial: '原', color: '#22c55e' },
  { id: 'a11', name: '植物生活家', initial: '植', color: '#16a34a' },
  { id: 'a12', name: '彩妆控 NANA', initial: 'N', color: '#ec4899' },
];

const TITLES: Record<string, string[]> = {
  recommend: [
    '夏日周末的城市漫步日记',
    '今天份的甜系心情分享给大家',
    '把生活调成喜欢的颜色',
    '下班路上发现的小美好',
    '今日份好物推荐 第 12 期',
    '九月的小确幸都是这样攒下的',
  ],
  food: [
    '在家也能做的奶油培根意面 🍝',
    '三步完成的日式厚蛋烧',
    '便利店早餐新搭配 一周不重样',
    '周末 brunch 复古风摆盘指南',
    '今日晚餐：低脂番茄牛腩煲',
    '夏末的桂花酿，治愈一整天',
    '外婆家的红烧肉配方大公开',
    '手冲咖啡的第一次尝试 ☕',
  ],
  travel: [
    '京都四日漫游路线分享 🏯',
    '镰仓一日：江之电与海',
    '云南雨崩徒步｜与世隔绝的小村',
    '大理洱海边的慢生活片段',
    '东京表参道逛街地图 🗺️',
    '南疆十日环线摄影记录',
    '青甘大环线最全避坑攻略',
    '稻城亚丁秋色写真合集',
  ],
  fashion: [
    '秋季基础款叠穿思路 5 套',
    '梨形身材的通勤穿搭',
    '复古港风｜一条红裙的 N 种穿法',
    'Clean Fit 风格衣橱整理',
    '小香风外套的秋季搭配模板',
    '平价包包｜本周通勤最爱',
    'oversize 卫衣 + 半裙慵懒风',
    '出游穿搭｜户外机能风初尝试',
  ],
  beauty: [
    '换季敏感肌的护肤流程',
    '伪素颜底妆的三件法宝',
    '日常温柔感眼妆教程',
    '热门卸妆膏横评实测',
    '近期空瓶分享·混油皮友好',
    '柔雾唇釉试色合集',
    '在家就能做的头皮护理',
    '新手友好的简易修容画法',
  ],
  fitness: [
    '居家 30 分钟燃脂训练计划',
    '瑜伽入门｜一周体态变化',
    '新手友好的哑铃训练安排',
    '跑步 5 公里｜突破瓶颈的方法',
    '清晨 15 分钟拉伸唤醒身体',
    '跳绳一个月真实效果对比',
  ],
  home: [
    '8 平出租屋改造记录 🏠',
    '厨房收纳｜让台面空无一物',
    '原木风小窝的软装清单',
    '阳台花园打造：月季与绣球',
    '卧室灯光布置：温馨感拉满',
    '懒人友好扫地机选购指南',
  ],
  pets: [
    '我家英短的迷惑睡姿合集',
    '养狗新手｜外出包怎么选',
    '布偶猫日常的颜值暴击 🐱',
    '柯基的一天：走路带风的小短腿',
    '兔兔饲养零基础入门指南',
    '流浪猫救助与领养日记',
  ],
  handmade: [
    '自制复古风手账本详细流程',
    '羊毛毡小动物｜周末手作',
    '钩针入门｜一杯咖啡的午后',
    '永生花相框制作全过程',
    '我的手帐拼贴灵感分享',
    '自制香薰蜡烛｜治愈系礼物',
  ],
  photography: [
    '手机也能拍的胶片感照片',
    '城市夜景｜光轨拍摄技巧',
    'iPhone 长焦人像实战对比',
    '旅行街拍｜瞬间感的抓取',
    '秋日人像｜金色光线捕捉法',
    '新手友好的剪影拍摄教学',
  ],
};

const SVG_VARIANTS = [
  // 1. 渐变圆 + 抽象几何
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='g1' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='%23ffb88c'/>
        <stop offset='1' stop-color='%23de6262'/>
      </linearGradient>
    </defs>
    <rect width='400' height='300' fill='url(%23g1)'/>
    <circle cx='110' cy='100' r='70' fill='%23fff' fill-opacity='0.35'/>
    <circle cx='290' cy='200' r='100' fill='%23fff' fill-opacity='0.18'/>
    <rect x='200' y='40' width='120' height='120' rx='30' fill='%23fff' fill-opacity='0.22' transform='rotate(-12 260 100)'/>
  </svg>`,
  // 2. 波浪线条
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%234facfe'/>
    <path d='M0 200 Q100 140 200 200 T400 200 V300 H0Z' fill='%2300f2fe' fill-opacity='0.7'/>
    <path d='M0 240 Q100 180 200 240 T400 240 V300 H0Z' fill='%2300c9ff' fill-opacity='0.8'/>
    <circle cx='340' cy='70' r='36' fill='%23fff7ad'/>
  </svg>`,
  // 3. 山峦
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='sky' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='%23f6d365'/>
        <stop offset='1' stop-color='%23fda085'/>
      </linearGradient>
    </defs>
    <rect width='400' height='300' fill='url(%23sky)'/>
    <polygon points='0,260 80,170 150,230 230,140 320,220 400,180 400,300 0,300' fill='%23565471'/>
    <polygon points='0,300 90,220 180,260 260,210 350,250 400,230 400,300' fill='%2330364d'/>
    <circle cx='320' cy='90' r='30' fill='%23ffe29f'/>
  </svg>`,
  // 4. 复古相机
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fdfcfb'/>
    <rect x='80' y='90' width='240' height='150' rx='18' fill='%2328304a'/>
    <rect x='110' y='70' width='100' height='40' rx='8' fill='%2328304a'/>
    <circle cx='200' cy='170' r='58' fill='%231a1f33' stroke='%23fbbf24' stroke-width='6'/>
    <circle cx='200' cy='170' r='28' fill='%23060a17'/>
    <circle cx='285' cy='110' r='8' fill='%23ef4444'/>
    <rect x='95' y='110' width='36' height='14' rx='3' fill='%23fbbf24'/>
  </svg>`,
  // 5. 杯装咖啡
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23f4e3d7'/>
    <rect x='150' y='100' width='110' height='150' rx='14' fill='%23ffffff'/>
    <rect x='150' y='100' width='110' height='30' fill='%237b3f00'/>
    <path d='M260 140 q40 0 40 50 t-40 50' stroke='%237b3f00' stroke-width='10' fill='none' stroke-linecap='round'/>
    <circle cx='180' cy='70' r='12' fill='%23ffffff' fill-opacity='0.7'/>
    <circle cx='200' cy='50' r='10' fill='%23ffffff' fill-opacity='0.6'/>
    <circle cx='230' cy='70' r='12' fill='%23ffffff' fill-opacity='0.7'/>
  </svg>`,
  // 6. 植物
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23d4f1d0'/>
    <ellipse cx='200' cy='240' rx='110' ry='22' fill='%23a3d9a5'/>
    <rect x='160' y='180' width='80' height='70' rx='8' fill='%238b5e3c'/>
    <path d='M200 180 C 140 140 140 80 200 60 C 260 80 260 140 200 180 Z' fill='%236abe6f'/>
    <path d='M200 180 C 150 150 130 110 150 70' stroke='%23548b54' stroke-width='6' fill='none' stroke-linecap='round'/>
    <path d='M200 180 C 250 150 270 110 250 70' stroke='%23548b54' stroke-width='6' fill='none' stroke-linecap='round'/>
  </svg>`,
  // 7. 抽象三角形
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%231e3a8a'/>
    <polygon points='80,260 200,80 320,260' fill='%23f472b6'/>
    <polygon points='220,260 320,140 400,260' fill='%23fb7185' fill-opacity='0.85'/>
    <polygon points='0,260 80,170 160,260' fill='%2360a5fa' fill-opacity='0.85'/>
    <circle cx='320' cy='80' r='28' fill='%23fde68a'/>
  </svg>`,
  // 8. 喵星人
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fde68a'/>
    <ellipse cx='200' cy='230' rx='120' ry='80' fill='%23f59e0b'/>
    <circle cx='200' cy='140' r='70' fill='%23f59e0b'/>
    <polygon points='150,90 170,40 195,85' fill='%23f59e0b'/>
    <polygon points='250,90 230,40 205,85' fill='%23f59e0b'/>
    <circle cx='178' cy='140' r='8' fill='%23111827'/>
    <circle cx='222' cy='140' r='8' fill='%23111827'/>
    <path d='M195 158 q5 6 10 0' stroke='%23111827' stroke-width='4' fill='none' stroke-linecap='round'/>
    <path d='M198 168 v8' stroke='%23111827' stroke-width='4'/>
  </svg>`,
  // 9. 寿司拼盘
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fff7ed'/>
    <ellipse cx='200' cy='180' rx='170' ry='90' fill='%23312e81'/>
    <rect x='80' y='160' width='60' height='40' rx='6' fill='%23fef3c7'/>
    <rect x='80' y='155' width='60' height='10' rx='4' fill='%23ef4444'/>
    <rect x='160' y='160' width='60' height='40' rx='6' fill='%23fef3c7'/>
    <rect x='160' y='155' width='60' height='10' rx='4' fill='%2310b981'/>
    <rect x='240' y='160' width='60' height='40' rx='6' fill='%23fef3c7'/>
    <rect x='240' y='155' width='60' height='10' rx='4' fill='%23f472b6'/>
    <circle cx='200' cy='100' r='14' fill='%23fff' stroke='%230f766e' stroke-width='3'/>
  </svg>`,
  // 10. 抽象几何圆形
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fbcfe8'/>
    <circle cx='200' cy='150' r='90' fill='%23ec4899'/>
    <circle cx='200' cy='150' r='60' fill='%23f9a8d4'/>
    <circle cx='200' cy='150' r='30' fill='%23fff'/>
    <circle cx='80' cy='80' r='14' fill='%23a855f7'/>
    <circle cx='330' cy='240' r='20' fill='%23f472b6'/>
  </svg>`,
  // 11. 极简条纹
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%230f172a'/>
    <rect x='40' y='40' width='320' height='40' fill='%23f472b6'/>
    <rect x='40' y='100' width='320' height='40' fill='%2360a5fa'/>
    <rect x='40' y='160' width='320' height='40' fill='%2334d399'/>
    <rect x='40' y='220' width='320' height='40' fill='%23fbbf24'/>
  </svg>`,
  // 12. 相机光圈
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%231f2937'/>
    <circle cx='200' cy='150' r='110' fill='%23111827' stroke='%23fbbf24' stroke-width='4'/>
    <g fill='%2360a5fa'>
      <polygon points='200,80 230,140 170,140'/>
      <polygon points='270,150 210,180 210,120'/>
      <polygon points='200,220 170,160 230,160'/>
      <polygon points='130,150 190,120 190,180'/>
    </g>
    <circle cx='200' cy='150' r='24' fill='%23f9fafb'/>
  </svg>`,
  // 13. 抽象山峰
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <linearGradient id='g13' x1='0' y1='0' x2='0' y2='1'>
        <stop offset='0' stop-color='%23fef9c3'/>
        <stop offset='1' stop-color='%23fdba74'/>
      </linearGradient>
    </defs>
    <rect width='400' height='300' fill='url(%23g13)'/>
    <polygon points='0,300 90,140 180,260 260,120 360,240 400,200 400,300' fill='%23047857'/>
    <polygon points='0,300 60,200 160,290 220,210 300,280 400,230 400,300' fill='%23064e3b'/>
  </svg>`,
  // 14. 行李箱
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fee2e2'/>
    <rect x='110' y='110' width='180' height='130' rx='14' fill='%23b91c1c'/>
    <rect x='110' y='110' width='180' height='20' fill='%237f1d1d'/>
    <rect x='180' y='80' width='40' height='30' rx='6' fill='%237f1d1d'/>
    <rect x='195' y='80' width='10' height='20' fill='%23b91c1c'/>
    <circle cx='140' cy='240' r='14' fill='%23111827'/>
    <circle cx='260' cy='240' r='14' fill='%23111827'/>
    <rect x='150' y='150' width='100' height='50' rx='6' fill='%23fef3c7'/>
    <text x='200' y='180' font-size='22' text-anchor='middle' fill='%23b91c1c' font-family='sans-serif'>PASS</text>
  </svg>`,
  // 15. 笔记本
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23e0e7ff'/>
    <rect x='90' y='60' width='220' height='180' rx='10' fill='%23f9fafb' stroke='%234f46e5' stroke-width='4'/>
    <rect x='90' y='60' width='20' height='180' fill='%234f46e5'/>
    <line x1='130' y1='100' x2='290' y2='100' stroke='%23a5b4fc' stroke-width='3'/>
    <line x1='130' y1='130' x2='290' y2='130' stroke='%23a5b4fc' stroke-width='3'/>
    <line x1='130' y1='160' x2='270' y2='160' stroke='%23a5b4fc' stroke-width='3'/>
    <line x1='130' y1='190' x2='290' y2='190' stroke='%23a5b4fc' stroke-width='3'/>
    <line x1='130' y1='220' x2='260' y2='220' stroke='%23a5b4fc' stroke-width='3'/>
  </svg>`,
  // 16. 抽象大色块
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%2310b981'/>
    <rect x='0' y='150' width='400' height='150' fill='%23064e3b'/>
    <circle cx='80' cy='80' r='40' fill='%23fde68a'/>
    <rect x='200' y='40' width='160' height='100' rx='10' fill='%23a7f3d0'/>
  </svg>`,
  // 17. 太阳镜
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fde68a'/>
    <rect x='80' y='130' width='100' height='50' rx='14' fill='%23111827'/>
    <rect x='220' y='130' width='100' height='50' rx='14' fill='%23111827'/>
    <rect x='180' y='150' width='40' height='8' fill='%23111827'/>
    <rect x='80' y='145' width='100' height='22' fill='%23facc15' opacity='0.7'/>
    <rect x='220' y='145' width='100' height='22' fill='%23facc15' opacity='0.7'/>
  </svg>`,
  // 18. 抽象圆形渐变
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <defs>
      <radialGradient id='r18' cx='0.5' cy='0.5' r='0.6'>
        <stop offset='0' stop-color='%23fff'/>
        <stop offset='1' stop-color='%23a78bfa'/>
      </radialGradient>
    </defs>
    <rect width='400' height='300' fill='url(%23r18)'/>
    <circle cx='320' cy='80' r='40' fill='%23f0abfc'/>
    <circle cx='70' cy='220' r='50' fill='%23fbcfe8'/>
  </svg>`,
  // 19. 树与鸟
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23bae6fd'/>
    <rect x='0' y='230' width='400' height='70' fill='%2386efac'/>
    <rect x='180' y='140' width='40' height='100' fill='%2378350f'/>
    <circle cx='200' cy='130' r='60' fill='%2315803d'/>
    <path d='M70 80 q15 -20 30 0' stroke='%23111827' stroke-width='3' fill='none'/>
    <path d='M320 60 q15 -20 30 0' stroke='%23111827' stroke-width='3' fill='none'/>
    <circle cx='85' cy='80' r='4' fill='%23111827'/>
    <circle cx='335' cy='60' r='4' fill='%23111827'/>
  </svg>`,
  // 20. 抽象迷幻
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%231e1b4b'/>
    <circle cx='80' cy='80' r='50' fill='%23a855f7' opacity='0.85'/>
    <circle cx='320' cy='220' r='80' fill='%23ec4899' opacity='0.85'/>
    <circle cx='200' cy='150' r='30' fill='%23fde68a' opacity='0.9'/>
  </svg>`,
  // 21. 椅子
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fef3c7'/>
    <rect x='130' y='80' width='140' height='120' rx='14' fill='%23fbbf24'/>
    <rect x='130' y='200' width='140' height='40' rx='8' fill='%23b45309'/>
    <rect x='140' y='240' width='20' height='40' fill='%23713f12'/>
    <rect x='240' y='240' width='20' height='40' fill='%23713f12'/>
    <rect x='130' y='280' width='140' height='10' fill='%23713f12'/>
  </svg>`,
  // 22. 跑步
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23fee2e2'/>
    <circle cx='200' cy='110' r='30' fill='%23fda4af'/>
    <path d='M170 140 q30 30 60 0 l -10 60 h-40 z' fill='%23ef4444'/>
    <path d='M165 200 l -20 40' stroke='%23111827' stroke-width='8' stroke-linecap='round'/>
    <path d='M235 200 l 30 30' stroke='%23111827' stroke-width='8' stroke-linecap='round'/>
    <path d='M180 200 l 10 60' stroke='%23111827' stroke-width='8' stroke-linecap='round'/>
    <path d='M220 200 l 30 50' stroke='%23111827' stroke-width='8' stroke-linecap='round'/>
  </svg>`,
  // 23. 花朵
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23ecfdf5'/>
    <g transform='translate(200 160)'>
      <circle cx='0' cy='-50' r='28' fill='%23fb7185'/>
      <circle cx='48' cy='-15' r='28' fill='%23fb7185'/>
      <circle cx='30' cy='40' r='28' fill='%23fb7185'/>
      <circle cx='-30' cy='40' r='28' fill='%23fb7185'/>
      <circle cx='-48' cy='-15' r='28' fill='%23fb7185'/>
      <circle cx='0' cy='0' r='22' fill='%23fde68a'/>
    </g>
    <rect x='195' y='200' width='10' height='80' fill='%2315803d'/>
    <ellipse cx='200' cy='290' rx='90' ry='8' fill='%2386efac'/>
  </svg>`,
  // 24. 星球
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' preserveAspectRatio='xMidYMid slice'>
    <rect width='400' height='300' fill='%23030a1c'/>
    <circle cx='100' cy='60' r='2' fill='%23fff'/>
    <circle cx='340' cy='40' r='1.5' fill='%23fff'/>
    <circle cx='60' cy='200' r='1.5' fill='%23fff'/>
    <circle cx='360' cy='220' r='2' fill='%23fff'/>
    <circle cx='200' cy='160' r='90' fill='%23f97316'/>
    <ellipse cx='200' cy='160' rx='140' ry='22' fill='none' stroke='%23fde68a' stroke-width='4' transform='rotate(-18 200 160)'/>
  </svg>`,
];

const GRADIENTS = [
  'linear-gradient(135deg, #fe2c55 0%, #ff6b9d 100%)',
  'linear-gradient(135deg, #ff8a3d 0%, #fe2c55 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%)',
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
  'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
  'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
  'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  'linear-gradient(135deg, #fc6076 0%, #ff9a44 100%)',
  'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
  'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
  'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
  'linear-gradient(135deg, #7b4397 0%, #dc2430 100%)',
  'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
  'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)',
  'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)',
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
];

const HEIGHT_OPTIONS = [240, 260, 280, 300, 320, 340, 360, 380, 400, 420, 440];

const CATEGORY_IDS: Array<
  | 'recommend'
  | 'food'
  | 'travel'
  | 'fashion'
  | 'beauty'
  | 'fitness'
  | 'home'
  | 'pets'
  | 'handmade'
  | 'photography'
> = [
  'recommend',
  'food',
  'travel',
  'fashion',
  'beauty',
  'fitness',
  'home',
  'pets',
  'handmade',
  'photography',
];

const CATEGORY_TITLES: Record<string, string[]> = TITLES;

function buildPost(index: number): Post {
  const category = CATEGORY_IDS[index % CATEGORY_IDS.length];
  const categoryTitles = CATEGORY_TITLES[category] ?? CATEGORY_TITLES.recommend;
  const title = categoryTitles[index % categoryTitles.length];
  const author = AUTHORS[index % AUTHORS.length];
  const variant = SVG_VARIANTS[index % SVG_VARIANTS.length];
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const height = HEIGHT_OPTIONS[index % HEIGHT_OPTIONS.length];
  const likeBase = ((index * 173) % 9000) + 35;
  const imageIndex = (index % 35) + 1;
  const imageUrl = `${import.meta.env.BASE_URL}images/${imageIndex}.jpg`;

  return {
    id: `post-${index.toString().padStart(3, '0')}`,
    title,
    authorInitial: author.initial,
    authorName: author.name,
    authorColor: author.color,
    likes: likeBase,
    isLiked: index % 5 === 0,
    height,
    gradient,
    svg: variant,
    imageUrl,
    category,
  };
}

export const POSTS: Post[] = Array.from({ length: 28 }, (_, i) => buildPost(i));

export const TOTAL_POSTS = POSTS.length;
