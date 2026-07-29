(() => {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const countCurrent = document.querySelector(".deck-chrome__count .current");
  const countTotal = document.querySelector(".deck-chrome__count .total");
  const total = slides.length;
  let index = 0;

  const pad = (n) => String(n).padStart(2, "0");

  const syncCounts = () => {
    if (countCurrent) countCurrent.textContent = pad(index + 1);
    if (countTotal) countTotal.textContent = pad(total);
  };

  /* —— Research desktop carousel —— */
  const researchSlide = document.querySelector(".slide--research");
  const researchFigures = researchSlide
    ? Array.from(researchSlide.querySelectorAll(".desktop__slide"))
    : [];
  const researchDots = document.getElementById("research-dots");
  const researchActive = document.getElementById("research-active");
  const researchActiveTitle = researchActive?.querySelector(".research-active__title");
  const researchActiveDesc = researchActive?.querySelector(".research-active__desc");

  const RESEARCH_COPY = {};

  let researchIndex = 0;
  let researchTimer = null;

  const markImages = () => {
    researchFigures.forEach((figure) => {
      const img = figure.querySelector("img");
      if (!img) return;
      const apply = () => {
        if (img.naturalWidth > 0) figure.classList.add("has-image");
      };
      if (img.complete) apply();
      else img.addEventListener("load", apply, { once: true });
      img.addEventListener("error", () => figure.classList.remove("has-image"), {
        once: true,
      });
    });
  };

  const buildDots = () => {
    if (!researchDots) return;
    researchDots.innerHTML = "";
    researchFigures.forEach((figure, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "desktop__dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute(
        "aria-label",
        figure.dataset.label || `Research slide ${i + 1}`
      );
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showResearch(i, true);
      });
      researchDots.appendChild(btn);
    });
  };

  const syncActiveCopy = () => {
    const figure = researchFigures[researchIndex];
    const group = figure?.dataset.group;
    const copy =
      (group != null && RESEARCH_COPY[group]) ||
      (figure && {
        title: figure.dataset.label || "",
        desc: figure.dataset.desc || "",
      }) ||
      { title: "", desc: "" };
    if (researchActiveTitle) researchActiveTitle.textContent = copy.title || "";
    if (researchActiveDesc) {
      researchActiveDesc.textContent = copy.desc || "";
      researchActiveDesc.hidden = !copy.desc;
    }
  };

  const showResearch = (next, resetTimer = false) => {
    if (!researchFigures.length) return;
    const len = researchFigures.length;
    researchIndex = ((next % len) + len) % len;

    researchFigures.forEach((figure, i) => {
      figure.classList.toggle("is-active", i === researchIndex);
    });

    if (researchDots) {
      Array.from(researchDots.children).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === researchIndex);
      });
    }

    syncActiveCopy();

    if (resetTimer) restartResearchTimer();
  };

  const stopResearchTimer = () => {
    if (researchTimer) {
      clearInterval(researchTimer);
      researchTimer = null;
    }
  };

  const restartResearchTimer = () => {
    stopResearchTimer();
    if (!researchSlide?.classList.contains("is-active")) return;
    researchTimer = setInterval(() => {
      showResearch(researchIndex + 1);
    }, 4200);
  };

  markImages();
  buildDots();
  showResearch(0);

  /* —— Portfolio phones: keep wheel scroll inside devices —— */
  const portfolioSlide = document.querySelector(".slide--portfolio");
  portfolioSlide
    ?.querySelectorAll(".phone__screen--scroll")
    .forEach((screen) => {
      screen.addEventListener(
        "wheel",
        (e) => {
          e.stopPropagation();
        },
        { passive: true }
      );
    });

  /* —— Shared architecture: static 3-across —— */
  const scaffoldSlide = document.querySelector(".slide--scaffold");
  scaffoldSlide
    ?.querySelectorAll(".scaffold-pane__scroll")
    .forEach((screen) => {
      screen.addEventListener(
        "wheel",
        (e) => {
          e.stopPropagation();
        },
        { passive: true }
      );
    });

  /* —— Reflection example panel —— */
  const reflectSlide = document.querySelector(".slide--reflect");
  const reflectExampleBtn = document.getElementById("reflect-example-btn");
  const reflectExample = document.getElementById("reflect-example");
  const reflectExampleClose = document.getElementById("reflect-example-close");

  const setReflectExampleOpen = (open) => {
    if (!reflectExample || !reflectExampleBtn) return;
    reflectExample.classList.toggle("is-open", open);
    reflectExample.hidden = !open;
    reflectExampleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  };

  reflectExampleBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = reflectExampleBtn.getAttribute("aria-expanded") !== "true";
    setReflectExampleOpen(open);
  });

  reflectExampleClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    setReflectExampleOpen(false);
    reflectExampleBtn?.focus();
  });

  /* —— Kitchen Sink flow lightbox —— */
  const decisionsSlide = document.querySelector(".slide--decisions");
  const kitchenFlowBtn = document.getElementById("kitchen-flow-btn");
  const kitchenFlowPanel = document.getElementById("kitchen-flow-panel");
  const kitchenFlowClose = document.getElementById("kitchen-flow-close");
  const flowSlides = kitchenFlowPanel
    ? Array.from(kitchenFlowPanel.querySelectorAll(".flow-carousel__slide"))
    : [];
  const flowDots = document.getElementById("flow-carousel-dots");
  const flowLabel = document.getElementById("flow-carousel-label");
  const flowCaption = document.getElementById("flow-carousel-caption");
  const flowPrev = document.getElementById("flow-prev");
  const flowNext = document.getElementById("flow-next");
  let flowIndex = 0;

  const syncFlowSlide = () => {
    if (!flowSlides.length) return;
    flowSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === flowIndex);
    });
    if (flowDots) {
      Array.from(flowDots.children).forEach((dot, i) => {
        dot.classList.toggle("is-active", i === flowIndex);
      });
    }
    const active = flowSlides[flowIndex];
    if (flowLabel) flowLabel.textContent = active?.dataset.label || "";
    if (flowCaption) flowCaption.textContent = active?.dataset.desc || "";
  };

  const showFlow = (next) => {
    if (!flowSlides.length) return;
    const len = flowSlides.length;
    flowIndex = ((next % len) + len) % len;
    syncFlowSlide();
  };

  const buildFlowDots = () => {
    if (!flowDots) return;
    flowDots.innerHTML = "";
    flowSlides.forEach((slide, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "flow-carousel__dot" + (i === 0 ? " is-active" : "");
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", slide.dataset.label || `Flow ${i + 1}`);
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        showFlow(i);
      });
      flowDots.appendChild(btn);
    });
  };

  const setKitchenFlowOpen = (open) => {
    if (!kitchenFlowPanel || !kitchenFlowBtn) return;
    kitchenFlowPanel.classList.toggle("is-open", open);
    kitchenFlowPanel.hidden = !open;
    kitchenFlowBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) showFlow(0);
  };

  buildFlowDots();
  syncFlowSlide();

  kitchenFlowBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = kitchenFlowBtn.getAttribute("aria-expanded") !== "true";
    setKitchenFlowOpen(open);
  });

  kitchenFlowClose?.addEventListener("click", (e) => {
    e.stopPropagation();
    setKitchenFlowOpen(false);
    kitchenFlowBtn?.focus();
  });

  kitchenFlowPanel?.addEventListener("click", (e) => {
    if (e.target === kitchenFlowPanel) {
      setKitchenFlowOpen(false);
      kitchenFlowBtn?.focus();
    }
  });

  flowPrev?.addEventListener("click", (e) => {
    e.stopPropagation();
    showFlow(flowIndex - 1);
  });

  flowNext?.addEventListener("click", (e) => {
    e.stopPropagation();
    showFlow(flowIndex + 1);
  });

  const show = (next) => {
    if (next < 0 || next >= total) return;
    slides[index].classList.remove("is-active");
    index = next;
    slides[index].classList.add("is-active");
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    syncCounts();
    history.replaceState(null, "", `#${index + 1}`);

    if (slides[index] === researchSlide) restartResearchTimer();
    else stopResearchTimer();

    if (slides[index] !== reflectSlide) setReflectExampleOpen(false);
    if (slides[index] !== decisionsSlide) setKitchenFlowOpen(false);
  };

  const fromHash = () => {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n) && n >= 1 && n <= total) return n - 1;
    return 0;
  };

  syncCounts();
  show(fromHash());

  document.querySelectorAll(".contents-link").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const go = parseInt(btn.dataset.go, 10);
      if (!Number.isNaN(go)) show(go - 1);
    });
  });

  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));

  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
    if (e.key === " " && e.target?.closest?.(".phone__screen, .scaffold-pane__scroll, .reflect-example-btn, .reflect-example, .decision-cta, .decision-lightbox, .flow-carousel__nav, .flow-carousel__dot, .contents-link")) {
      return;
    }
    if (e.key === "Escape" && kitchenFlowPanel?.classList.contains("is-open")) {
      e.preventDefault();
      setKitchenFlowOpen(false);
      kitchenFlowBtn?.focus();
      return;
    }
    if (
      kitchenFlowPanel?.classList.contains("is-open") &&
      (e.key === "ArrowLeft" || e.key === "ArrowRight")
    ) {
      e.preventDefault();
      e.stopPropagation();
      showFlow(flowIndex + (e.key === "ArrowRight" ? 1 : -1));
      return;
    }
    if (e.key === "Escape" && reflectExample?.classList.contains("is-open")) {
      e.preventDefault();
      setReflectExampleOpen(false);
      return;
    }
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      show(index + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      show(index - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
    } else if (e.key === "End") {
      e.preventDefault();
      show(total - 1);
    }
  });

  window.addEventListener("hashchange", () => show(fromHash()));
})();
