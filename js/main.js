/* inmoNode — Landing Page */
(() => {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const progress = document.querySelector(".scroll-progress");
  const desktop = window.matchMedia("(min-width: 1024px)");

  /* ---------- Menú móvil ---------- */
  const setMenu = (open) => {
    header.classList.toggle("menu-open", open);
    document.body.classList.toggle("menu-locked", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  toggle.addEventListener("click", () => {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Cerrar al elegir un enlace
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  // Cerrar con Escape y devolver el foco al botón
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Cerrar si se pasa a escritorio
  desktop.addEventListener("change", (event) => {
    if (event.matches) setMenu(false);
  });

  /* ---------- Header sólido y barra de progreso ---------- */
  // Sobre el hero oscuro el header es transparente; si no hay hero, siempre sólido.
  const hero = document.querySelector(".hero");
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", !hero || y > 16);

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Plano de lotes del hero ---------- */
  const map = document.querySelector(".lot-map");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (map && hero) {
    const SVG_NS = "http://www.w3.org/2000/svg";
    const el = (name, attrs) => {
      const node = document.createElementNS(SVG_NS, name);
      Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
      return node;
    };

    // Pseudoaleatorio con semilla: el plano se ve igual en cada carga
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Manzanas de 5 × 2 lotes separadas por calles
    const COLS = 7, ROWS = 5;
    const LOT_W = 26, LOT_H = 60, GAP = 3, STREET = 30;
    const BLOCK_W = 5 * LOT_W + 4 * GAP;
    const BLOCK_H = 2 * LOT_H + GAP;
    const OFFSET_X = (1200 - (COLS * BLOCK_W + (COLS - 1) * STREET)) / 2;
    const OFFSET_Y = (900 - (ROWS * BLOCK_H + (ROWS - 1) * STREET)) / 2;
    const fragment = document.createDocumentFragment();
    const lots = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const bx = OFFSET_X + c * (BLOCK_W + STREET);
        const by = OFFSET_Y + r * (BLOCK_H + STREET);
        for (let i = 0; i < 10; i++) {
          const roll = random();
          const lot = el("rect", {
            x: bx + (i % 5) * (LOT_W + GAP),
            y: by + Math.floor(i / 5) * (LOT_H + GAP),
            width: LOT_W,
            height: LOT_H,
            rx: 2,
            class: roll < 0.18 ? "lot is-reserved" : roll < 0.4 ? "lot is-sold" : "lot",
          });
          lots.push(lot);
          fragment.append(lot);
        }
      }
    }

    // Avenida central y anillos sobre un lote separado
    const roadY = OFFSET_Y + 2 * (BLOCK_H + STREET) - STREET / 2;
    fragment.append(el("line", { x1: 0, y1: roadY, x2: 1200, y2: roadY, class: "map-road" }));

    map.append(fragment);

    // Fila 4, manzana 5, tercer lote
    const target = lots[3 * COLS * 10 + 4 * 10 + 2];
    target.setAttribute("class", "lot is-lit");
    const box = target.getBBox();
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    map.append(
      el("circle", { cx, cy, r: 26, class: "map-ring" }),
      el("circle", { cx, cy, r: 26, class: "map-ring map-ring--delay" }),
      el("circle", { cx, cy, r: 5, class: "map-dot" })
    );

    // Lotes que se "encienden" (separaciones en vivo) mientras el hero está visible
    let litTimer = null;
    const lightUp = () => {
      const lot = lots[Math.floor(Math.random() * lots.length)];
      if (lot === target || lot.classList.contains("is-lit")) return;
      lot.classList.add("is-lit");
      setTimeout(() => lot.classList.remove("is-lit"), 2200);
    };

    const startLights = () => {
      if (!litTimer && !reduceMotion.matches) litTimer = setInterval(lightUp, 450);
    };
    const stopLights = () => {
      clearInterval(litTimer);
      litTimer = null;
    };

    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? startLights() : stopLights();
    }).observe(hero);

    // Parallax: el plano sigue al mouse y se desplaza más lento que el scroll
    let mouseX = 0, mouseY = 0, currentX = 0, currentY = 0, frame = null;

    const renderParallax = () => {
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      map.style.setProperty("--px", `${currentX.toFixed(2)}px`);
      map.style.setProperty("--py", `${currentY.toFixed(2)}px`);
      map.style.setProperty("--sy", `${(Math.min(window.scrollY, window.innerHeight) * 0.25).toFixed(1)}px`);
      const settled = Math.abs(mouseX - currentX) < 0.1 && Math.abs(mouseY - currentY) < 0.1;
      frame = settled ? null : requestAnimationFrame(renderParallax);
    };

    const requestParallax = () => {
      if (!frame && !reduceMotion.matches) frame = requestAnimationFrame(renderParallax);
    };

    hero.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse") return;
      mouseX = (event.clientX / window.innerWidth - 0.5) * -30;
      mouseY = (event.clientY / window.innerHeight - 0.5) * -20;
      requestParallax();
    });

    window.addEventListener("scroll", requestParallax, { passive: true });
  }

  /* ---------- Revelado al hacer scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach((item) => revealObserver.observe(item));
  }

  /* ---------- Cómo funciona: paso activo y pantalla del teléfono ---------- */
  const steps = document.querySelectorAll(".step[data-step]");
  const screens = document.querySelectorAll(".how-screen[data-screen]");

  const setActiveStep = (number) => {
    steps.forEach((step) => step.classList.toggle("is-active", step.dataset.step === number));
    screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === number));
  };

  if (steps.length && "IntersectionObserver" in window) {
    // El paso activo es el que cruza la franja central de la pantalla
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveStep(entry.target.dataset.step);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });

    steps.forEach((step) => stepObserver.observe(step));
    setActiveStep("1");
  }

  /* ---------- Contadores animados ---------- */
  // El HTML ya trae el valor final; sin JS o con movimiento reducido se queda así.
  const counters = document.querySelectorAll("[data-count]");

  const animateCounter = (node) => {
    const end = Number(node.dataset.count);
    const duration = 1600;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(end * eased);
      if (t < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (!reduceMotion.matches && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((node) => {
      if (Number(node.dataset.count) > 0) {
        node.textContent = "0";
        counterObserver.observe(node);
      }
    });
  }

  /* ---------- Formulario de demo ---------- */
  // Sin backend: valida en el navegador y muestra el mensaje de éxito sin enviar datos.
  const form = document.getElementById("demo-form");

  if (form) {
    const success = document.querySelector(".demo-success");
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const rules = {
      name: { test: (value) => value.length > 0, message: "Ingresa tu nombre" },
      email: { test: (value) => EMAIL.test(value), message: "Ingresa un correo válido" },
    };

    const validate = (input) => {
      const rule = rules[input.name];
      const valid = rule.test(input.value.trim());
      input.setAttribute("aria-invalid", String(!valid));
      document.getElementById(input.getAttribute("aria-describedby")).textContent = valid ? "" : rule.message;
      return valid;
    };

    const fields = Object.keys(rules).map((name) => form.elements[name]);

    fields.forEach((input) => {
      input.addEventListener("blur", () => {
        if (input.value.trim() || input.hasAttribute("aria-invalid")) validate(input);
      });
      // Si ya mostró un error, se quita apenas el dato es válido
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true") validate(input);
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const invalid = fields.filter((input) => !validate(input));

      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const name = form.elements.name.value.trim().split(/\s+/)[0];
      const message = document.createElement("p");
      message.className = "demo-success__text";
      message.tabIndex = -1;
      message.textContent = `¡Listo, ${name}! Te escribiremos pronto para coordinar tu demo.`;

      form.hidden = true;
      success.replaceChildren(message);
      message.focus();
    });
  }

  /* ---------- Footer: año actual ---------- */
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  /* ---------- CTA fijo en móvil ---------- */
  // Se muestra fuera del hero y se oculta sobre la sección de demo y el footer.
  const stickyCta = document.querySelector(".sticky-cta");
  const hideOver = [hero, document.getElementById("demo"), document.querySelector(".site-footer")].filter(Boolean);

  if (stickyCta && hideOver.length && "IntersectionObserver" in window) {
    const onScreen = new Set();

    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.isIntersecting ? onScreen.add(entry.target) : onScreen.delete(entry.target);
      });
      stickyCta.classList.toggle("is-visible", onScreen.size === 0);
    });

    hideOver.forEach((section) => ctaObserver.observe(section));
  }
})();
