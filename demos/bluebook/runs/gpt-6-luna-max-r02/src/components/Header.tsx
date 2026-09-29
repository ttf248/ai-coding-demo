import { useFeed } from '../store';

export default function Header() {
  const query = useFeed((s) => s.query), setQuery = useFeed((s) => s.setQuery);
  return <header className="site-header sticky top-0 z-10 flex items-center bg-white/90"><a className="brand flex items-center gap-2" href="#top" aria-label="小蓝书首页"><span className="brand-mark grid place-items-center rounded-lg bg-bluebook text-white">蓝</span><span className="brand-name font-semibold">小蓝书</span></a><label className="search-box flex items-center rounded-lg"><span aria-hidden="true">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜索你感兴趣的内容" /><kbd>⌘ K</kbd></label><div className="header-actions ml-auto flex items-center gap-4"><button className="icon-button" aria-label="通知">♧<i /></button><button className="publish-button rounded-md bg-bluebook text-white" onClick={() => window.alert('发布入口原型：选择图片后创建一篇新笔记。')}>＋ <span>发布</span></button><button className="user-avatar" aria-label="个人中心">予</button></div></header>;
}
