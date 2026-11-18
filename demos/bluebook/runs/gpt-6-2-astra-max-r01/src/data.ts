export interface Note {
  id: string
  title: string
  category: string
  author: string
  avatar: string
  photo: string
  ratio: number
  likes: number
  body: string
}
const images = import.meta.glob<string>('./photos/*.jpg', { eager: true, import: 'default' })
export const photo = (name: string) => images['./photos/' + name + '.jpg']
const subjects: [string, number, string, string, string][] = [
  ['village',1114,'旅行','海岸线尽头，藏着一座彩色小镇','沿着石阶下到海边，回头才看见山坡上密密排着的房子。'],
  ['cafe',493,'咖啡','找到了一家适合独处的咖啡馆','靠窗的位置光线刚好，适合慢慢喝完一杯。'],
  ['architecture',493,'建筑','留白也能成为建筑的主角','绕到侧面，墙体的轮廓在天空里格外分明。'],
  ['deer',1221,'自然','林间散步，遇见一位安静的朋友','我们在林边停了一会儿，给这片栖息地留出距离。'],
  ['books',555,'日常','把周末留给没读完的书','翻到折角的一页，又找回上次中断的思绪。'],
  ['lake',493,'旅行','湖面像一张刚洗出的底片','山色倒映在水里，晨雾让边界轻了一层。'],
  ['city',926,'建筑','蓝调时刻的城市切片','屋顶的轮廓和亮起的灯，一起拼出了天际线。'],
  ['food',493,'日常','一碗把季节装满的午餐','挑几种不同颜色的蔬菜，清爽的一餐就准备好了。'],
  ['green',441,'自然','雾起的时候，山有了层次','沿小径上坡，抬头时正好看见雾在林间散开。'],
  ['coffee',493,'咖啡','从第一杯手冲开始放慢速度','记录这次研磨和注水，下次也许换一种豆子。'],
  ['camera',925,'日常','带一台相机出门的理由','不给行程列清单，把注意力留给身边的光。'],
  ['dunes',490,'旅行','风替沙丘画下了阴影','太阳偏西之后，沙脊的纹理变得分明。'],
  ['forest',493,'自然','沿着树林边缘走一公里','听着落叶的声音走了一段路。'],
  ['room',555,'建筑','窗边这一角的光刚刚好','自然光扫到木纹，平常的角落也值得停留。'],
  ['beach',492,'旅行','海风比闹钟温柔','沿着潮线走，沙地上只剩一串脚印。'],
  ['alps',493,'自然','抬头看山的那几秒','把山脊放到画面中央，记录云层散开的瞬间。'],
  ['night',703,'自然','把夜空收藏进相册','等眼睛适应暗处之后，天空慢慢有了颜色。'],
  ['walk',493,'旅行','树冠下的绿色小径','挑一条树荫多的小路，慢慢走到日落。'],
  ['field',493,'日常','日落之前，再散一会儿步','橙色的光停在草尖上，风里带着微凉。'],
  ['ocean',493,'旅行','看海的一百种方式','这次选了靠礁石的位置，静静等一道浪。'],
]
const authors = ['阿岚','栗子同学','程野','岛岛','北窗','小杉']
const avatars = ['portrait','coffee','man','lake','city','forest']
const angles = ['','手记｜','周末采集｜','镜头背后｜','再访｜']
export const collection: Note[] = angles.flatMap((prefix, page) => subjects.map((_, i) => {
  const [name, height, category, title, body] = subjects[(i + page * 7) % subjects.length]
  const author = (i + page) % authors.length
  return { id: page + '-' + i, title: prefix + title, category, body, author: authors[author], avatar: photo(avatars[author]), photo: photo(name), ratio: 740 / height, likes: 21 + ((i * 109 + page * 67) % 907) }
}))
export const fallback = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 210"><rect width="300" height="210" fill="#ece4dd"/><circle cx="216" cy="58" r="20" fill="#e8b693"/><path d="M0 182l84-88 48 48 40-33 128 101H0z" fill="#93a79c"/></svg>')
