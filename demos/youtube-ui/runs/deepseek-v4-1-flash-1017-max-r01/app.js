(() => {
  "use strict";

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  let toastTimer = null;

  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2100);
  }

  document.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-chips] .chip");
    if (chip) {
      chip.parentElement.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      if (chip.dataset.toast) notify(chip.dataset.toast);
      return;
    }

    const subscribe = event.target.closest("[data-subscribe]");
    if (subscribe) {
      const subscribed = subscribe.classList.toggle("subscribed");
      subscribe.textContent = subscribed ? "已订阅" : "订阅";
      notify(subscribed ? `已订阅 ${subscribe.dataset.subscribe}` : `已取消订阅 ${subscribe.dataset.subscribe}`);
      return;
    }

    const like = event.target.closest("[data-like]");
    if (like) {
      const liked = like.classList.toggle("liked");
      const count = like.querySelector("[data-like-count]");
      if (count) {
        const base = Number(like.dataset.likes || 0);
        count.textContent = liked ? `${base + 1}万` : `${base}万`;
      }
      notify(liked ? "已点赞" : "已取消点赞");
      return;
    }

    const tab = event.target.closest(".tabbar [data-tab]");
    if (tab) {
      tab.closest(".tabbar").querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      return;
    }

    const action = event.target.closest("[data-toast]");
    if (action) {
      if (action.tagName === "INPUT") return;
      notify(action.dataset.toast);
    }
  });

  document.querySelectorAll("input[data-enter-toast]").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        notify(input.dataset.enterToast || "已提交");
      }
    });
  });
})();
