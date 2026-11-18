const $ = (id) => document.getElementById(id);
const moduleId = document.body.dataset.module;
const modules = [
  ["discover", "index.html", "发现", "compass"],
  ["watch", "watch.html", "播放", "play"],
  ["library", "library.html", "媒体库", "library"],
];
const videos = [
  {
    id: "coast",
    title: "山坡来信",
    author: "北屿影像",
    type: "风景",
    photo: "1500534623283-312aade485b7",
    description: "沿着山坡走一段，把视角留给光线和远处的山脊。",
    made: "短片 · 风光",
  },
  {
    id: "coffee",
    title: "慢煮咖啡",
    author: "日常声场",
    type: "生活",
    photo: "1447933601403-0c6688de566e",
    description: "早晨的第一件事，是把手边的咖啡豆仔细闻一遍。",
    made: "短片 · 手作",
  },
  {
    id: "forest",
    title: "林间的六秒",
    author: "北屿影像",
    type: "风景",
    photo: "1448375240586-882707db888b",
    description: "沿着树冠之间的缝隙看向天空。窗外的光线一直在变化。",
    made: "短片 · 风光",
  },
  {
    id: "ceramics",
    title: "器物的微光",
    author: "有光制作",
    type: "创作",
    photo: "1490312278390-ab64016e0aa9",
    description: "留意材质的颜色和形状，看看一件日常器物在光下的模样。",
    made: "短片 · 手作",
  },
];
const current =
  videos.find((v) => v.id === new URLSearchParams(location.search).get("v")) ??
  videos[0];
const filled =
  "rounded-xl bg-[#343d9a] px-3.5 py-2.5 text-sm font-bold text-white hover:bg-[#454fb3] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#343d9a]";
const pale =
  "rounded-xl border border-white bg-white/75 px-3 py-2 text-xs font-bold text-[#3b4277] shadow-sm hover:bg-white focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#343d9a]";
const box = "rounded-2xl border border-white bg-white/70 p-3.5 shadow-sm";
const field =
  "min-w-0 flex-1 rounded-xl border border-[#e0e2f2] bg-white px-3 py-2 text-sm outline-[#5d67bd]";
const icon = (name, cls = "size-5") =>
  '<img alt="" class="' +
  cls +
  ' shrink-0 opacity-75" src="https://unpkg.com/lucide-static@0.468.0/icons/' +
  name +
  '.svg">';
const photo = (id, width = 620, height = 350) =>
  "https://images.unsplash.com/photo-" +
  id +
  "?fit=crop&w=" +
  width +
  "&h=" +
  height +
  "&auto=format&q=80";
const videoLink = (video) => "./watch.html?v=" + video.id;
const read = (key, def) => {
  try {
    return JSON.parse(localStorage.getItem("reelway:" + key)) ?? def;
  } catch {
    return def;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem("reelway:" + key, JSON.stringify(value));
  } catch {}
};
const esc = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let later = read("later", []);
let watched = read("watched", []);
let followed = read("followed", []);
const check = (ids, id) => ids.includes(id);
const toggle = (ids, id) =>
  check(ids, id) ? ids.filter((x) => x !== id) : [...ids, id];

function nav() {
  return modules
    .map(
      ([id, url, label, glyph]) =>
        '<a href="./' +
        url +
        '" ' +
        (moduleId === id ? 'aria-current="page" ' : "") +
        'class="grid min-w-0 justify-items-center gap-1 rounded-lg px-1 py-1 text-[10px] ' +
        (id === moduleId ? "font-bold text-[#343d9a]" : "text-[#616982]") +
        '">' +
        icon(glyph, "size-4") +
        label +
        "</a>",
    )
    .join("");
}
function frame(title, markup) {
  return (
    '<section class="w-full max-w-[355px] min-w-0 md:flex-1" aria-label="' +
    title +
    '">' +
    '<h2 class="mb-1.5 pl-2 text-xs font-bold text-[#515878]">' +
    title +
    "</h2>" +
    '<div class="isolate grid h-[658px] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-[31px] border-[5px] border-[#353a55] bg-gradient-to-br from-[#f6f6fd] via-[#e9ebfa] to-[#eaeef5] shadow-[0_13px_25px_#383a5725]">' +
    '<div class="flex justify-between px-5 pt-3 text-[11px] font-bold" aria-hidden="true"><span>9:41</span><span>▮▮▮ ▰</span></div>' +
    '<div class="min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain px-3.5 py-3 [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">' +
    markup +
    "</div>" +
    '<nav aria-label="应用主导航" class="grid grid-cols-3 border-t border-white/90 bg-[#f9f9fd]/75 px-1 py-1.5 backdrop-blur-xl">' +
    nav() +
    "</nav></div></section>"
  );
}
function heading(title, sub) {
  return (
    '<h3 class="text-2xl font-black tracking-tight">' +
    title +
    '</h3><p class="mt-1 text-xs leading-relaxed text-[#596384]">' +
    sub +
    "</p>"
  );
}
function card(video, compact = false) {
  return (
    '<a class="block overflow-hidden rounded-xl border border-white bg-white/70 hover:bg-white ' +
    (compact ? "p-1.5" : "") +
    '" href="' +
    videoLink(video) +
    '">' +
    '<div class="relative aspect-video overflow-hidden rounded-lg bg-[#d4d8e7]"><img class="h-full w-full object-cover" alt="" loading="lazy" src="' +
    photo(video.photo, compact ? 330 : 620, compact ? 186 : 350) +
    '"><span class="absolute bottom-1.5 right-1.5 rounded bg-[#252a47]/85 px-1.5 py-0.5 text-[10px] text-white">0:06</span></div>' +
    '<div class="' +
    (compact ? "px-1 py-2" : "p-2.5") +
    '"><strong class="block text-sm">' +
    video.title +
    '</strong><p class="mt-0.5 break-words text-[11px] text-[#585f7b]">' +
    video.author +
    " · " +
    video.type +
    "</p></div></a>"
  );
}
function row(video, extra = "") {
  return (
    '<div class="flex items-center gap-2 rounded-xl bg-white/65 p-1.5"><a class="flex min-w-0 flex-1 items-center gap-2" href="' +
    videoLink(video) +
    '"><img class="h-11 w-[76px] shrink-0 rounded-lg bg-[#ced3e5] object-cover" alt="" src="' +
    photo(video.photo, 184, 116) +
    '"><span class="min-w-0"><strong class="block text-sm">' +
    video.title +
    '</strong><span class="mt-1 block text-[10px] text-[#596384]">' +
    video.author +
    "</span></span></a>" +
    extra +
    "</div>"
  );
}
function searchPanel() {
  return (
    '<form id="search-form" class="' +
    box +
    ' mt-4 flex items-center gap-2">' +
    icon("search", "size-4") +
    '<input id="query" maxlength="45" placeholder="片名、主题或作者" aria-label="搜索视频" class="' +
    field +
    '"><button type="submit" class="' +
    pale +
    '">搜索</button></form>' +
    '<div class="mt-3 flex flex-wrap gap-2">' +
    ["风景", "生活", "创作"]
      .map(
        (label) =>
          '<button class="' +
          pale +
          '" data-query="' +
          label +
          '">' +
          label +
          "</button>",
      )
      .join("") +
    "</div>" +
    '<div class="mt-4"><p id="search-label" role="status" class="mb-2 text-xs font-bold text-[#596384]">全部短片</p><div id="search-results" class="grid gap-2"></div></div>'
  );
}
function imageHero(video) {
  return (
    '<a href="' +
    videoLink(video) +
    '" class="relative mt-4 block aspect-[5/4] overflow-hidden rounded-[20px] bg-[#555d85]">' +
    '<img class="h-full w-full object-cover" alt="" src="' +
    photo(video.photo, 680, 550) +
    '"><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f2348] to-transparent p-4 pt-16 text-white">' +
    '<p class="text-xs font-semibold">精选 · ' +
    video.made +
    '</p><p class="mt-1 text-2xl font-black">' +
    video.title +
    ' <span aria-hidden="true">↗</span></p></div></a>'
  );
}
function discover() {
  $("screens").innerHTML = [
    frame(
      "发现首页",
      heading("今天看什么？", "精选短片和独立作者") +
        imageHero(videos[0]) +
        '<div id="categories" class="my-3 flex flex-wrap gap-1.5">' +
        ["全部", "风景", "生活", "创作"]
          .map(
            (label) =>
              '<button class="' +
              pale +
              ' aria-pressed:bg-[#d9dcff]" aria-pressed="' +
              (label === "全部") +
              '" data-category="' +
              label +
              '">' +
              label +
              "</button>",
          )
          .join("") +
        "</div>" +
        '<div class="grid grid-cols-2 gap-2" id="cards"></div>',
    ),
    frame(
      "搜索与结果",
      heading("找一段短片", "按片名、作者或主题搜索。") + searchPanel(),
    ),
  ].join("");
  const fill = (category) => {
    $("cards").innerHTML = videos
      .filter((v) => category === "全部" || v.type === category)
      .map((v) => card(v, true))
      .join("");
    for (const b of $("categories").children)
      b.setAttribute("aria-pressed", b.dataset.category === category);
  };
  function search() {
    const query = $("query").value.trim();
    const matches = videos.filter((v) =>
      [v.title, v.author, v.type].some((x) => x.includes(query)),
    );
    $("search-label").textContent = query
      ? matches.length + " 条搜索结果"
      : "全部短片";
    $("search-results").innerHTML =
      matches.map((v) => row(v)).join("") ||
      '<p class="text-sm text-[#596384]">没有匹配的视频。</p>';
  }
  $("categories").onclick = (event) => {
    const node = event.target.closest("[data-category]");
    if (node) fill(node.dataset.category);
  };
  $("search-form").onsubmit = (event) => {
    event.preventDefault();
    search();
  };
  $("query").oninput = search;
  for (const b of document.querySelectorAll("[data-query]"))
    b.onclick = () => {
      $("query").value = b.dataset.query;
      search();
    };
  fill("全部");
  search();
}
function watch() {
  $("screens").innerHTML = [
    frame(
      "播放详情",
      '<div class="aspect-video overflow-hidden rounded-xl bg-[#28304b]">' +
        '<video id="video" class="h-full w-full" controls playsinline preload="metadata" poster="' +
        photo(current.photo) +
        '" src="./clips/' +
        current.id +
        '.mp4" aria-label="' +
        current.title +
        '"></video></div>' +
        '<div class="mt-3">' +
        heading(current.title, current.made + " · " + current.author) +
        "</div>" +
        '<div class="mt-4 flex flex-wrap gap-2"><button id="save" type="button" class="' +
        filled +
        '"></button><button id="follow" type="button" class="' +
        pale +
        '"></button></div>' +
        '<p id="video-state" role="status" class="mt-2 text-xs text-[#596384]"></p>' +
        '<details class="' +
        box +
        ' mt-3"><summary class="cursor-pointer text-sm font-bold">短片简介</summary><p class="mt-2 text-xs leading-relaxed text-[#596384]">' +
        current.description +
        "</p></details>" +
        '<h4 class="mb-2 mt-4 text-sm font-bold">继续探索</h4><div class="grid gap-2">' +
        videos
          .filter((v) => v !== current)
          .map((v) => row(v))
          .join("") +
        "</div>",
    ),
    frame(
      "评论讨论",
      heading("短片讨论", current.title + " · " + current.author) +
        '<div id="comments" class="' +
        box +
        ' mt-4 grid gap-2 break-words" aria-live="polite"></div>' +
        '<form id="comment-form" class="mt-3 flex gap-2"><input id="comment" maxlength="180" required placeholder="写下你的感想" class="' +
        field +
        '" aria-label="评论内容"><button class="' +
        filled +
        '">发布</button></form>',
    ),
  ].join("");
  function actions() {
    $("save").textContent = check(later, current.id)
      ? "移出稍后播放"
      : "添加到稍后播放";
    $("save").setAttribute("aria-pressed", check(later, current.id));
    $("follow").textContent = check(followed, current.author)
      ? "已关注"
      : "关注作者";
    $("follow").setAttribute("aria-pressed", check(followed, current.author));
  }
  const sample = [{ name: "溪径", text: "希望把这个镜头留在今天的片单里。" }];
  let comments = read("comments:" + current.id, sample);
  const renderComments = () => {
    $("comments").innerHTML = comments
      .map(
        (c) =>
          '<article class="rounded-lg bg-white/75 p-2.5"><p class="text-xs font-bold text-[#454b7b]">' +
          esc(c.name) +
          '</p><p class="mt-1 break-words text-sm">' +
          esc(c.text) +
          "</p></article>",
      )
      .join("");
  };
  $("save").onclick = () => {
    later = toggle(later, current.id);
    write("later", later);
    actions();
    $("video-state").textContent = check(later, current.id)
      ? "已加入媒体库。"
      : "已从稍后播放移除。";
  };
  $("follow").onclick = () => {
    followed = toggle(followed, current.author);
    write("followed", followed);
    actions();
  };
  $("video").onplay = () => {
    watched = [current.id, ...watched.filter((id) => id !== current.id)];
    write("watched", watched);
  };
  $("video").onerror = () => {
    $("video-state").textContent = "这个浏览器无法播放本地短片。";
  };
  $("comment-form").onsubmit = (event) => {
    event.preventDefault();
    const text = $("comment").value.trim();
    if (!text) return;
    comments.push({ name: "我", text });
    write("comments:" + current.id, comments);
    $("comment").value = "";
    renderComments();
  };
  actions();
  renderComments();
}
function library() {
  $("screens").innerHTML = [
    frame(
      "稍后播放",
      heading("我的片单", "整理想稍后观看的影片。") +
        '<div class="' +
        box +
        ' mt-4"><h4 class="mb-2 text-sm font-bold">稍后播放</h4><div class="grid gap-2" id="later"></div></div>',
    ),
    frame(
      "观看历史",
      heading("最近观看", "打开已播放的短片。") +
        '<div class="mt-4 grid gap-2" id="history"></div>',
    ),
    frame(
      "已关注作者",
      heading("关注", "从你关注的作者开始找片。") +
        '<div class="mt-4 grid gap-2" id="authors"></div>',
    ),
  ].join("");
  const empty = (message) =>
    '<p class="text-xs leading-relaxed text-[#596384]">' + message + "</p>";
  const renderLater = () => {
    $("later").innerHTML =
      later
        .map((id) => videos.find((v) => v.id === id))
        .filter(Boolean)
        .map((v) =>
          row(
            v,
            '<button class="' +
              pale +
              ' shrink-0 px-1.5" data-remove="' +
              v.id +
              '" aria-label="移除 ' +
              v.title +
              '">移除</button>',
          ),
        )
        .join("") || empty("在播放页添加短片，之后就能在这里找到。");
  };
  $("later").onclick = (event) => {
    const remove = event.target.closest("[data-remove]");
    if (!remove) return;
    later = later.filter((id) => id !== remove.dataset.remove);
    write("later", later);
    renderLater();
  };
  $("history").innerHTML =
    watched
      .map((id) => videos.find((v) => v.id === id))
      .filter(Boolean)
      .map((v) => row(v))
      .join("") || empty("播放第一段短片后，这里会出现记录。");
  $("authors").innerHTML =
    followed
      .map(
        (name) =>
          '<div class="' +
          box +
          '"><h4 class="mb-2 text-sm font-bold">' +
          esc(name) +
          '</h4><div class="grid gap-1.5">' +
          videos
            .filter((v) => v.author === name)
            .map((v) => row(v))
            .join("") +
          "</div></div>",
      )
      .join("") || empty("在播放页关注作者，之后就能从这里打开他们的短片。");
  renderLater();
}

$("modules").innerHTML = modules
  .map(
    ([id, url, label]) =>
      '<a class="' +
      (id === moduleId ? filled : pale) +
      '" href="./' +
      url +
      '" ' +
      (id === moduleId ? 'aria-current="page"' : "") +
      ">" +
      label +
      "</a>",
  )
  .join("");
({ discover, watch, library })[moduleId]();
