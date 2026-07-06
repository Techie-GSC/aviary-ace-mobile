(function () {
  const MOBILE_BREAKPOINT = 720;

  function getOrCreateUi() {
    let backdrop = document.querySelector(".mobile-drawer-backdrop");
    let dock = document.querySelector(".mobile-drawer-dock");

    if (!backdrop) {
      backdrop = document.createElement("button");
      backdrop.type = "button";
      backdrop.className = "mobile-drawer-backdrop";
      backdrop.setAttribute("aria-label", "Close drawer");
      backdrop.hidden = true;
      backdrop.addEventListener("click", () => setDrawer(""));
      document.body.appendChild(backdrop);
    }

    if (!dock) {
      dock = document.createElement("div");
      dock.className = "mobile-drawer-dock";
      dock.hidden = true;
      dock.innerHTML = `
        <button type="button" class="mobile-drawer-tab" data-drawer-target="left">
          <span class="mobile-drawer-tab__chevron">^</span>
          <span class="mobile-drawer-tab__label">Cards</span>
        </button>
        <button type="button" class="mobile-drawer-tab" data-drawer-target="right">
          <span class="mobile-drawer-tab__chevron">^</span>
          <span class="mobile-drawer-tab__label">Score</span>
        </button>
      `;
      dock.addEventListener("click", (event) => {
        const button = event.target.closest("[data-drawer-target]");
        if (!button) return;
        const target = button.getAttribute("data-drawer-target");
        const next = document.body.dataset.mobileDrawer === target ? "" : target;
        setDrawer(next);
      });
      document.body.appendChild(dock);
    }

    return { backdrop, dock };
  }

  function setDrawer(name) {
    document.body.dataset.mobileDrawer = name;
    const backdrop = document.querySelector(".mobile-drawer-backdrop");
    if (backdrop) {
      backdrop.hidden = !name;
    }
    document.body.classList.toggle("mobile-drawer-open", Boolean(name));
  }

  function shouldOpenInspectorDrawer(card) {
    if (!document.body.classList.contains("mobile-drawers-ready")) return false;
    if (!card || card.closest(".setup-panel")) return false;
    if (!card.closest(".board, .rail--left, .rail--right")) return false;
    return true;
  }

  function syncDrawers() {
    const appShell = document.querySelector(".app-shell");
    const workspace = document.querySelector(".workspace");
    const leftRail = document.querySelector(".rail--left");
    const rightRail = document.querySelector(".rail--right");
    const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    const { backdrop, dock } = getOrCreateUi();

    const ready = Boolean(appShell && workspace && leftRail && rightRail && isMobile);

    document.body.classList.toggle("mobile-drawers-ready", ready);
    dock.hidden = !ready;
    backdrop.hidden = !ready || !document.body.dataset.mobileDrawer;

    if (!ready) {
      setDrawer("");
      return;
    }

    leftRail.setAttribute("data-mobile-drawer", "left");
    rightRail.setAttribute("data-mobile-drawer", "right");
  }

  const observer = new MutationObserver(() => syncDrawers());

  document.addEventListener("DOMContentLoaded", () => {
    syncDrawers();
    observer.observe(document.body, { childList: true, subtree: true });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      setDrawer("");
    }
    syncDrawers();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setDrawer("");
    }
  });

  document.addEventListener("click", (event) => {
    const card = event.target.closest(".compact-bird");
    if (!shouldOpenInspectorDrawer(card)) return;
    window.setTimeout(() => setDrawer("left"), 40);
  });
})();
