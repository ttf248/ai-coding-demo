(function () {
  "use strict";

  /*
   * Add a project here. The directory UI, filters, counters and cards are
   * generated from this list, so a new entry does not require new HTML.
   */
  var projectRecords = [
    {
      id: "voxel-construction-site-gpt-5-6-sol-high",
      number: "13",
      title: "筑境工地 · GPT 5.6 Sol High",
      kicker: "体素微缩工地沙盘 / 双场景施工切换",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "SINGLE HTML",
      year: "2026.09",
      model: "GPT 5.6 Sol High",
      description: "沿用同一施工沙盘提示词，增加高层综合施工区与地下综合管廊施工区两套布局，支持设备动画、昼夜天气和实体控制台。",
      stack: ["HTML", "Three.js r160", "WebGL", "InstancedMesh"],
      tags: ["体素沙盘", "双场景", "模型对比"],
      accent: "blue",
      order: 13,
      links: [
        { label: "打开 HTML 预览", href: "./voxel-construction-site-gpt-5.6-sol-high/index.html" },
        { label: "查看提示词", href: "./voxel-construction-site-gpt-5.6-sol-high/Readme.md" }
      ]
    },
    {
      id: "voxel-construction-site-gpt-5-6-luna-max",
      number: "12",
      title: "筑境工地 · GPT 5.6 Luna Max",
      kicker: "体素微缩建筑工地沙盘 / 可交互昼夜系统",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "SINGLE HTML",
      year: "2026.09",
      model: "GPT 5.6 Luna Max",
      description: "用 Three.js r160 与 InstancedMesh 搭建完整施工现场，支持设备作业、工人分工、日夜循环、尘土与暴雨控制。",
      stack: ["HTML", "Three.js r160", "WebGL", "InstancedMesh"],
      tags: ["体素沙盘", "程序化场景", "模型对比"],
      accent: "coral",
      order: 12,
      links: [
        { label: "打开 HTML 预览", href: "./voxel-construction-site-gpt-5.6-luna-max/index.html" },
        { label: "查看提示词", href: "./voxel-construction-site-gpt-5.6-luna-max/Readme.md" }
      ]
    },
    {
      id: "neo-gothic-tower-city-gpt-6-high",
      number: "11",
      title: "雾隐之城 · GPT 6 High",
      kicker: "离线单文件的新哥特式海上城邦",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "SINGLE HTML",
      year: "2026.09",
      model: "GPT 6 High",
      description: "以统一米制尺度构建尖塔、圣堂、海堤与拱桥，支持镜头巡航、自由飞行、昼夜气候调整与程序化海浪音景。",
      stack: ["HTML", "Three.js", "WebGL"],
      tags: ["模型对比", "离线漫游"],
      accent: "teal",
      order: 11,
      links: [
        { label: "打开 HTML 预览", href: "./neo-gothic-tower-city-gpt-6-high/index.html" },
        { label: "查看提示词", href: "./neo-gothic-tower-city-gpt-6-high/Readme.md" }
      ]
    },
    {
      id: "neo-gothic-tower-city-gpt-6-default",
      number: "01",
      title: "雾隐之城 · GPT 6 Default",
      kicker: "可漫游的 3D 新哥特式塔楼城市",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "SINGLE HTML",
      year: "2026.09",
      model: "GPT 6 Default",
      description: "以单 HTML 文件重建一座海上塔楼城市，加入自由漫游、天气氛围、粒子火焰和实时环境控制。",
      stack: ["HTML", "Three.js", "WebGL"],
      tags: ["3D 漫游", "沉浸式场景"],
      accent: "teal",
      order: 10,
      links: [
        { label: "打开 HTML 预览", href: "./neo-gothic-tower-city-gpt-6-default/index.html" },
        { label: "查看提示词", href: "./neo-gothic-tower-city-gpt-6-default/Readme.md" }
      ]
    },
    {
      id: "neo-gothic-tower-city-gpt-5-6-luna-max",
      number: "02",
      title: "塔城漫游 · GPT 5.6 Luna Max",
      kicker: "真实比例的新哥特式城市动画",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "SINGLE HTML",
      year: "2026.09",
      model: "GPT 5.6 Luna Max",
      description: "围绕镜头巡游、海浪、火焰、雾气和 fallback 预览，测试模型完成复杂单文件视觉页面的能力。",
      stack: ["HTML", "Three.js", "WebGL"],
      tags: ["模型对比", "粒子氛围"],
      accent: "lavender",
      order: 9,
      links: [
        { label: "打开 HTML 预览", href: "./neo-gothic-tower-city-gpt-5.6-luna-max/index.html" },
        { label: "查看提示词", href: "./neo-gothic-tower-city-gpt-5.6-luna-max/Readme.md" }
      ]
    },
    {
      id: "bluebook-m2-1",
      number: "03",
      title: "小蓝书 · MiniMax M2.1",
      kicker: "瀑布流图片展示 / 模型版本",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "MODEL TEST",
      year: "2025.12",
      model: "MiniMax M2.1",
      description: "在相同产品目标下继续迭代瀑布流、搜索和移动端体验，观察模型版本变化带来的实现差异。",
      stack: ["React", "TypeScript", "Vite"],
      tags: ["模型对比", "响应式"],
      accent: "coral",
      order: 8,
      links: [
        { label: "打开 Pages 预览", href: "./ui-ux-redbook-waterfall-images-minimax-m2.1/" },
        { label: "查看记录", href: "./ui-ux-redbook-waterfall-images-minimax-m2.1/" }
      ]
    },
    {
      id: "bluebook-minimaxi-m2",
      number: "04",
      title: "小蓝书 · MiniMaxi M2",
      kicker: "瀑布流图片展示 / 模型版本",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "MODEL TEST",
      year: "2025.11",
      model: "MiniMaxi M2",
      description: "用另一个模型重做相同的图片社区方向，保留搜索、点赞、懒加载和移动端布局等细节。",
      stack: ["React", "TypeScript", "Zustand"],
      tags: ["模型对比", "瀑布流"],
      accent: "blue",
      order: 7,
      links: [
        { label: "打开 Pages 预览", href: "./ui-ux-redbook-waterfall-images-minimaxi-m2/" },
        { label: "查看记录", href: "./ui-ux-redbook-waterfall-images-minimaxi-m2/" }
      ]
    },
    {
      id: "pixel-flow",
      number: "05",
      title: "Pixel Flow",
      kicker: "图片粒子化与手势还原",
      category: "prompt",
      categoryLabel: "提示词记录",
      status: "PROMPT LOG",
      year: "2025.12",
      model: "Gemini 2.5 Pro",
      description: "用图片粒子化与手势交互，测试模型能否把复杂的视觉效果拆成真正可实现的 Web 体验。",
      stack: ["Vanilla JS", "Three.js", "MediaPipe"],
      tags: ["原始提示词", "视觉交互"],
      accent: "lime",
      order: 6,
      links: [{ label: "阅读提示词", href: "./pixel-flow/" }]
    },
    {
      id: "bluebook",
      number: "06",
      title: "小蓝书",
      kicker: "仿小红书的瀑布流图片展示页面",
      category: "frontend",
      categoryLabel: "前端应用",
      status: "LIVE DEMO",
      year: "2025.05",
      model: "Claude 4.0",
      description: "用瀑布流、搜索、点赞和移动端手势，检验模型对真实产品细节的处理。",
      stack: ["React", "Vite", "Vercel"],
      tags: ["线上 Demo", "无限滚动"],
      accent: "coral",
      order: 5,
      links: [
        { label: "打开线上 Demo", href: "https://bluebook.ttf248.life/", external: true },
        { label: "查看记录", href: "./ui-ux-redbook-waterfall-images/docs/" }
      ]
    },
    {
      id: "ui-prototypes",
      number: "07",
      title: "YouTube UI 模块",
      kicker: "从通用提示词拆出一组产品界面",
      category: "prototype",
      categoryLabel: "UI / UX",
      status: "5 MODULES",
      year: "2025.05",
      model: "Prompt Workflow",
      description: "把复杂产品拆成首页、播放、发现、个人中心和创作中心，逐个检查布局与交互。",
      stack: ["HTML", "CSS", "Responsive UI"],
      tags: ["模块化设计", "交互原型"],
      accent: "lavender",
      order: 4,
      links: [
        { label: "查看模块集合", href: "./ui-ux-common/" },
        { label: "打开首页", href: "./ui-ux-common/youtube-app-homepage.html" }
      ]
    },
    {
      id: "stock-watching",
      number: "08",
      title: "自选股实战",
      kicker: "前后端分离的股票自选系统",
      category: "fullstack",
      categoryLabel: "全栈工程",
      status: "FULL STACK",
      year: "2025.02",
      model: "多轮 AI 迭代",
      description: "从前端交互到后端接口，记录 AI 如何完成一个带数据操作和行情展示的全栈小系统。",
      stack: ["React", "Golang", "CRUD"],
      tags: ["接口", "响应式"],
      accent: "blue",
      order: 3,
      links: [{ label: "阅读项目说明", href: "./stock-watching-system/" }]
    },
    {
      id: "life-diary",
      number: "09",
      title: "生活情绪日记",
      kicker: "记录一天情绪的 iOS 风格应用",
      category: "prototype",
      categoryLabel: "UI / UX",
      status: "PROTOTYPE",
      year: "2025.05",
      model: "Prompt Workflow",
      description: "围绕情绪记录、回顾和生活片段，测试模型对产品信息层级与轻交互的理解。",
      stack: ["iOS UI", "Prototype", "HTML"],
      tags: ["情绪记录", "移动端"],
      accent: "teal",
      order: 2,
      links: [
        { label: "打开原型", href: "./ui-ux-ios-life-assistant-app/canghe_app_prototype.html" },
        { label: "查看记录", href: "./ui-ux-ios-life-assistant-app/" }
      ]
    },
    {
      id: "meditation",
      number: "10",
      title: "冥想 iOS App",
      kicker: "专注于呼吸与陪伴感的交互稿",
      category: "prototype",
      categoryLabel: "UI / UX",
      status: "PROTOTYPE",
      year: "2025.05",
      model: "Prompt Workflow",
      description: "从视觉氛围、内容卡片到播放状态，保留一次完整的移动端原型设计尝试。",
      stack: ["iOS UI", "Prototype", "HTML"],
      tags: ["冥想", "交互稿"],
      accent: "lavender",
      order: 1,
      links: [
        { label: "打开原型", href: "./ui-ux-ios-meditation-app/meditation-app-prototype.html" },
        { label: "查看记录", href: "./ui-ux-ios-meditation-app/" }
      ]
    }
  ];

  var guideRecords = [
    { title: "Tailwind CSS", type: "CSS 框架", slug: "tailwindcss", search: "tailwind css 样式 框架" },
    { title: "Lucide", type: "图标库", slug: "lucide", search: "lucide icon 图标" },
    { title: "Unsplash", type: "图片资源平台", slug: "unsplash", search: "unsplash image 图片 资源" },
    { title: "骨架屏", type: "加载占位技术", slug: "skeleton", search: "skeleton loading 加载 骨架屏" },
    { title: "Vue.js", type: "前端框架", slug: "vue", search: "vue javascript framework 框架" },
    { title: "React", type: "前端框架", slug: "react", search: "react javascript framework 框架" },
    { title: "TypeScript", type: "编程语言", slug: "typescript", search: "typescript javascript language 类型" },
    { title: "Vite", type: "构建工具", slug: "vite", search: "vite build tooling 构建" },
    { title: "JavaScript", type: "编程语言", slug: "javascript", search: "javascript js language 语言" },
    { title: "状态管理", type: "前端架构", slug: "state-management", search: "state management zustand 状态" },
    { title: "API / REST", type: "前后端通信", slug: "api-rest", search: "api rest http backend 前后端" },
    { title: "前端构建", type: "开发流程", slug: "frontend-build", search: "frontend build webpack bundle 构建" },
    { title: "NPM", type: "包管理器", slug: "npm", search: "npm node package 包管理" },
    { title: "组件化开发", type: "开发思想", slug: "component-based", search: "component components 组件化 react vue" }
  ];

  var state = {
    filter: "all",
    query: "",
    sort: "latest",
    view: "grid",
    visible: 9
  };
  var pageSize = 9;
  var revealObserver = null;
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var projectGrid = document.getElementById("project-grid");
  var projectCount = document.getElementById("project-count");
  var projectRange = document.getElementById("project-range");
  var projectSearch = document.getElementById("project-search");
  var projectSort = document.getElementById("project-sort");
  var loadMore = document.getElementById("load-more");
  var clearFilters = document.getElementById("clear-filters");
  var projectEmpty = document.getElementById("project-empty");
  var emptyReset = document.getElementById("empty-reset");

  var entities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return entities[character];
    });
  }

  function arrowIcon(external) {
    if (external) {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5h5v5M19 5l-9 9"></path><path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"></path></svg>';
  }

  function renderProjectLink(link, index) {
    var externalAttributes = link.external ? ' target="_blank" rel="noreferrer"' : "";
    var primaryClass = index === 0 ? " card-link--primary" : "";
    return (
      '<a class="card-link' +
      primaryClass +
      '" href="' +
      escapeHtml(link.href) +
      '"' +
      externalAttributes +
      ">" +
      escapeHtml(link.label) +
      arrowIcon(link.external) +
      "</a>"
    );
  }

  function renderProjectCard(project) {
    var tags = project.stack
      .concat(project.tags)
      .map(function (tag) {
        return '<span class="project-tag">' + escapeHtml(tag) + "</span>";
      })
      .join("");
    var links = project.links.map(renderProjectLink).join("");

    return (
      '<article class="project-card project-card--' +
      escapeHtml(project.accent) +
      ' reveal" data-project-id="' +
      escapeHtml(project.id) +
      '">' +
      '<div class="project-card-head">' +
      '<span class="project-number">PROJECT / ' +
      escapeHtml(project.number) +
      "</span>" +
      '<span class="project-status">' +
      escapeHtml(project.status) +
      "</span>" +
      '<span class="project-category">' +
      escapeHtml(project.categoryLabel) +
      "</span>" +
      "</div>" +
      '<div class="project-mark" data-mark="' +
      escapeHtml(project.number) +
      '" aria-hidden="true"><span class="mark-line"></span><span class="mark-dot"></span></div>' +
      '<div class="project-card-info">' +
      '<div class="project-meta"><span>' +
      escapeHtml(project.year) +
      '</span><i class="meta-divider"></i><span>' +
      escapeHtml(project.model) +
      "</span></div>" +
      "<h3>" +
      escapeHtml(project.title) +
      "</h3>" +
      '<p class="project-kicker">' +
      escapeHtml(project.kicker) +
      "</p>" +
      '<p class="project-description">' +
      escapeHtml(project.description) +
      "</p>" +
      '<div class="project-tags">' +
      tags +
      "</div>" +
      "</div>" +
      '<div class="project-card-actions">' +
      links +
      "</div>" +
      "</article>"
    );
  }

  function renderGuideCard(guide, index) {
    return (
      '<a class="topic-card reveal" data-guide-search="' +
      escapeHtml(guide.search) +
      '" href="./docs/' +
      escapeHtml(guide.slug) +
      '/">' +
      '<span class="topic-index">' +
      String(index + 1).padStart(2, "0") +
      "</span>" +
      "<strong>" +
      escapeHtml(guide.title) +
      "</strong>" +
      "<small>" +
      escapeHtml(guide.type) +
      '</small><span class="topic-arrow" aria-hidden="true">' +
      arrowIcon(false) +
      "</span></a>"
    );
  }

  function getFilteredProjects() {
    var keyword = state.query.trim().toLowerCase();
    var filtered = projectRecords.filter(function (project) {
      var matchesFilter = state.filter === "all" || project.category === state.filter;
      var searchable = [
        project.title,
        project.kicker,
        project.categoryLabel,
        project.status,
        project.year,
        project.model,
        project.description
      ]
        .concat(project.stack)
        .concat(project.tags)
        .join(" ")
        .toLowerCase();
      return matchesFilter && (!keyword || searchable.indexOf(keyword) !== -1);
    });

    if (state.sort === "title") {
      filtered.sort(function (first, second) {
        return first.title.localeCompare(second.title, "zh-CN");
      });
    } else if (state.sort === "category") {
      filtered.sort(function (first, second) {
        return (
          first.categoryLabel.localeCompare(second.categoryLabel, "zh-CN") ||
          second.order - first.order
        );
      });
    } else {
      filtered.sort(function (first, second) {
        return second.order - first.order;
      });
    }

    return filtered;
  }

  function updateClearButton() {
    clearFilters.hidden = state.filter === "all" && !state.query && state.sort === "latest";
  }

  function renderProjects(resetVisible) {
    if (resetVisible) {
      state.visible = pageSize;
    }

    var filtered = getFilteredProjects();
    var visibleProjects = filtered.slice(0, state.visible);
    var hasResults = filtered.length > 0;

    projectGrid.dataset.view = state.view;
    projectGrid.innerHTML = visibleProjects.map(renderProjectCard).join("");
    projectEmpty.hidden = hasResults;
    projectGrid.hidden = !hasResults;
    projectCount.textContent = state.query || state.filter !== "all"
      ? filtered.length + " 个匹配项目"
      : "显示 " + filtered.length + " 个项目";
    projectRange.textContent = hasResults && visibleProjects.length < filtered.length
      ? visibleProjects.length + " / " + filtered.length + " 已加载"
      : "全部项目";
    loadMore.hidden = visibleProjects.length >= filtered.length || !hasResults;
    updateClearButton();
    observeReveals();
  }

  function resetDirectory() {
    state.filter = "all";
    state.query = "";
    state.sort = "latest";
    projectSearch.value = "";
    projectSort.value = "latest";
    document.querySelectorAll(".filter-button").forEach(function (button) {
      var isActive = button.dataset.filter === "all";
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderProjects(true);
  }

  function renderGuides() {
    var topicGrid = document.getElementById("topic-grid");
    topicGrid.innerHTML = guideRecords.map(renderGuideCard).join("");
    document.getElementById("guide-count").textContent = guideRecords.length + " 个主题";
  }

  function filterGuides(keyword) {
    var normalized = keyword.trim().toLowerCase();
    var visibleCount = 0;
    var cards = document.querySelectorAll(".topic-card");

    cards.forEach(function (card) {
      var matches = !normalized || card.dataset.guideSearch.indexOf(normalized) !== -1;
      card.hidden = !matches;
      if (matches) {
        visibleCount += 1;
      }
    });

    document.getElementById("guide-count").textContent = normalized
      ? visibleCount + " / " + guideRecords.length + " 个主题"
      : guideRecords.length + " 个主题";
    document.getElementById("guide-empty").hidden = visibleCount !== 0;
  }

  function observeReveals() {
    var revealItems = document.querySelectorAll(".reveal:not(.is-visible)");
    if (reducedMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
    }

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  }

  function initNavigation() {
    var header = document.getElementById("site-header");
    var menuButton = document.querySelector(".menu-toggle");
    var nav = document.getElementById("primary-nav");

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    menuButton.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initDirectory() {
    document.querySelectorAll(".filter-button").forEach(function (button) {
      button.addEventListener("click", function () {
        state.filter = button.dataset.filter;
        document.querySelectorAll(".filter-button").forEach(function (otherButton) {
          var isActive = otherButton === button;
          otherButton.classList.toggle("is-active", isActive);
          otherButton.setAttribute("aria-pressed", String(isActive));
        });
        renderProjects(true);
      });
    });

    projectSearch.addEventListener("input", function (event) {
      state.query = event.target.value;
      renderProjects(true);
    });

    projectSort.addEventListener("change", function (event) {
      state.sort = event.target.value;
      renderProjects(true);
    });

    document.querySelectorAll(".view-button").forEach(function (button) {
      button.addEventListener("click", function () {
        state.view = button.dataset.view;
        document.querySelectorAll(".view-button").forEach(function (otherButton) {
          var isActive = otherButton === button;
          otherButton.classList.toggle("is-active", isActive);
          otherButton.setAttribute("aria-pressed", String(isActive));
        });
        renderProjects(false);
      });
    });

    loadMore.addEventListener("click", function () {
      state.visible += pageSize;
      renderProjects(false);
    });

    clearFilters.addEventListener("click", resetDirectory);
    emptyReset.addEventListener("click", resetDirectory);
  }

  function init() {
    document.getElementById("hero-project-total").textContent = String(projectRecords.length).padStart(2, "0");
    document.getElementById("project-total").textContent = String(projectRecords.length).padStart(2, "0");
    document.getElementById("guide-total").textContent = String(guideRecords.length).padStart(2, "0");
    renderGuides();
    initNavigation();
    initDirectory();
    projectSearch.setAttribute("aria-controls", "project-grid");
    document.getElementById("guide-search").setAttribute("aria-controls", "topic-grid");
    document.getElementById("guide-search").addEventListener("input", function (event) {
      filterGuides(event.target.value);
    });
    renderProjects(true);
    observeReveals();
  }

  init();
})();
