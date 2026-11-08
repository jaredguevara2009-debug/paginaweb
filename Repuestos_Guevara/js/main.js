(function () {
  "use strict";

  const config = window.GuevaraConfig;
  const products = window.GuevaraProducts;
  const grid = document.getElementById("productGrid");
  const searchInput = document.getElementById("productSearch");
  const clearSearch = document.getElementById("clearSearch");
  const sortSelect = document.getElementById("productSort");
  const countLabel = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const modalElement = document.getElementById("productModal");
  const state = { category: "all", query: "", sort: "default" };
  const categoryNames = {
    all: "Todas las categorías",
    llantas: "Llantas y cámaras",
    lubricantes: "Lubricantes y mantenimiento",
    transmision: "Transmisión",
    frenos: "Frenos",
    electrico: "Sistema eléctrico"
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function normalize(value) {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");
  }

  function whatsappUrl(message) {
    return "https://wa.me/" + config.whatsappNumber + "?text=" + encodeURIComponent(message);
  }

  function prepareBusinessLinks() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Store",
      name: config.name,
      description: "Venta de repuestos y accesorios para motocicletas.",
      telephone: config.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: config.streetAddress,
        addressLocality: "Cochabamba",
        addressRegion: "Cochabamba",
        addressCountry: "BO"
      },
      sameAs: Object.values(config.social).filter(Boolean)
    };
    document.getElementById("businessSchema").textContent = JSON.stringify(schema);

    document.querySelectorAll("[data-wa]").forEach(function (link) {
      const messageType = link.getAttribute("data-wa");
      const message = config.messages[messageType] || config.messages.general;
      link.href = whatsappUrl(message);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.querySelectorAll("[data-map-link]").forEach(function (link) {
      link.href = config.mapUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    });

    document.querySelectorAll("[data-social]").forEach(function (link) {
      const platform = link.getAttribute("data-social");
      const destination = config.social[platform];
      if (destination) {
        link.href = destination;
        link.hidden = false;
      } else {
        link.hidden = true;
      }
    });

    document.querySelectorAll("[data-business-address]").forEach(function (item) {
      item.textContent = config.address;
    });
    document.querySelectorAll("[data-business-phone]").forEach(function (item) {
      item.textContent = config.phoneDisplay;
    });
    document.querySelectorAll("[data-copyright-year]").forEach(function (item) {
      item.textContent = String(config.copyrightYear);
    });
  }

  function productMatches(product) {
    const matchesCategory = state.category === "all" || product.categoryId === state.category;
    if (!matchesCategory) return false;
    if (!state.query) return true;

    const searchable = [
      product.name,
      product.category,
      product.shortDescription,
      product.description
    ].concat(product.keywords || []).join(" ");
    return normalize(searchable).includes(normalize(state.query));
  }

  function getVisibleProducts() {
    const visible = products.filter(productMatches);
    if (state.sort === "az") {
      visible.sort(function (a, b) {
        return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
      });
    } else if (state.sort === "za") {
      visible.sort(function (a, b) {
        return b.name.localeCompare(a.name, "es", { sensitivity: "base" });
      });
    }
    return visible;
  }

  function formatPrice(product) {
    if (typeof product.price === "number" && Number.isFinite(product.price)) {
      return "Bs. " + new Intl.NumberFormat("es-BO", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(product.price);
    }
    return "Consultar precio";
  }

  function cardMarkup(product) {
    const image = escapeHtml(product.image);
    const name = escapeHtml(product.name);
    const category = escapeHtml(product.category);
    const shortDescription = escapeHtml(product.shortDescription);
    const alt = escapeHtml(product.alt);
    const message = encodeURIComponent(config.messages.product(product.name));
    const productLink = "https://wa.me/" + config.whatsappNumber + "?text=" + message;

    return [
      '<article class="product-card reveal">',
      '  <div class="product-image-wrap">',
      '    <span class="product-image-index">' + escapeHtml(product.id.toUpperCase()) + '</span>',
      '    <img src="' + image + '" alt="' + alt + '" width="480" height="360" loading="lazy">',
      '    <span class="illustration-label"><i class="fas fa-drafting-compass" aria-hidden="true"></i> Ilustración referencial</span>',
      '  </div>',
      '  <div class="product-card-body">',
      '    <p class="product-category">' + category + '</p>',
      '    <h3>' + name + '</h3>',
      '    <p class="product-description">' + shortDescription + '</p>',
      '    <div class="product-card-bottom"><span class="product-price">' + escapeHtml(formatPrice(product)) + '</span><span class="product-divider"></span></div>',
      '    <div class="product-actions">',
      '      <button class="button button-product-details" type="button" data-product-details="' + escapeHtml(product.id) + '">Ver detalles <i class="fas fa-arrow-right" aria-hidden="true"></i></button>',
      '      <a class="button button-product-ask" href="' + productLink + '" target="_blank" rel="noopener noreferrer" aria-label="Consultar ' + name + ' por WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i><span>Consultar</span></a>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function updateResultLabel(count) {
    const categoryLabel = state.category === "all" ? "" : " · " + categoryNames[state.category];
    const noun = count === 1 ? "producto" : "productos";
    countLabel.textContent = "Mostrando " + count + " " + noun + categoryLabel;
  }

  function renderCatalog() {
    const visible = getVisibleProducts();
    grid.innerHTML = visible.map(cardMarkup).join("");
    grid.hidden = visible.length === 0;
    emptyState.hidden = visible.length !== 0;
    updateResultLabel(visible.length);
    clearSearch.hidden = state.query.length === 0;
    observeReveals(grid);
  }

  function setCategory(category) {
    state.category = category;
    filterButtons.forEach(function (button) {
      const active = button.dataset.filter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderCatalog();
  }

  function resetCatalog() {
    state.category = "all";
    state.query = "";
    state.sort = "default";
    searchInput.value = "";
    sortSelect.value = "default";
    setCategory("all");
    searchInput.focus();
  }

  function openProductDetails(productId) {
    const product = products.find(function (item) {
      return item.id === productId;
    });
    if (!product) return;

    const modalVisual = document.getElementById("modalProductVisual");
    const modalTitle = document.getElementById("productModalTitle");
    const modalDescription = document.getElementById("modalProductDescription");
    const modalCategory = document.getElementById("modalProductCategory");
    const modalPrice = document.getElementById("modalProductPrice");
    const modalLink = document.getElementById("modalWhatsApp");

    modalVisual.replaceChildren();
    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.alt;
    image.width = 560;
    image.height = 420;
    modalVisual.appendChild(image);
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalCategory.textContent = product.category;
    modalPrice.textContent = formatPrice(product);
    modalLink.href = whatsappUrl(config.messages.product(product.name));
    modalLink.target = "_blank";
    modalLink.rel = "noopener noreferrer";

    if (window.bootstrap && window.bootstrap.Modal) {
      window.bootstrap.Modal.getOrCreateInstance(modalElement).show();
    }
  }

  function setupNavigation() {
    const header = document.querySelector(".site-header");
    const backToTop = document.getElementById("backToTop");
    const collapseElement = document.getElementById("mainNavigation");
    const menuToggle = document.querySelector(".navbar-toggler");

    collapseElement.addEventListener("shown.bs.collapse", function () {
      menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");
    });
    collapseElement.addEventListener("hidden.bs.collapse", function () {
      menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    });

    document.querySelectorAll("#mainNavigation .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.bootstrap && window.bootstrap.Collapse && collapseElement.classList.contains("show")) {
          window.bootstrap.Collapse.getOrCreateInstance(collapseElement).hide();
        }
      });
    });

    function onScroll() {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      header.classList.toggle("is-scrolled", scrollPosition > 16);
      backToTop.classList.toggle("is-visible", scrollPosition > 520);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });

    const navLinks = Array.from(document.querySelectorAll("#mainNavigation .nav-link"));
    const navSections = navLinks
      .map(function (link) { return document.querySelector(link.getAttribute("href")); })
      .filter(Boolean);
    if ("IntersectionObserver" in window) {
      const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        });
      }, { rootMargin: "-32% 0px -58% 0px", threshold: 0 });
      navSections.forEach(function (section) { sectionObserver.observe(section); });
    }
  }

  let revealObserver;
  function observeReveals(scope) {
    if (!revealObserver) return;
    (scope || document).querySelectorAll(".reveal:not(.is-visible)").forEach(function (element) {
      revealObserver.observe(element);
    });
  }

  function setupReveals() {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.body.dataset.motionReady = "true";
    observeReveals(document);
  }

  function setupCompatibilityForm() {
    const form = document.getElementById("compatibilityForm");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const additionalMessage = String(data.get("message") || "").trim();
      const lines = [
        "Hola, Repuestos Guevara.",
        "",
        "Quisiera consultar por un repuesto para mi motocicleta.",
        "",
        "Marca: " + String(data.get("brand")).trim() + ".",
        "Modelo: " + String(data.get("model")).trim() + ".",
        "Año: " + String(data.get("year")).trim() + ".",
        "Producto: " + String(data.get("product")).trim() + "."
      ];
      if (additionalMessage) lines.push("Información adicional: " + additionalMessage + ".");
      lines.push("", "¿Podrían ayudarme a confirmar su precio, disponibilidad y compatibilidad?");
      window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
    });
  }

  prepareBusinessLinks();
  renderCatalog();
  setupNavigation();
  setupReveals();
  setupCompatibilityForm();

  searchInput.addEventListener("input", function () {
    state.query = searchInput.value.trim();
    renderCatalog();
  });
  clearSearch.addEventListener("click", function () {
    searchInput.value = "";
    state.query = "";
    renderCatalog();
    searchInput.focus();
  });
  sortSelect.addEventListener("change", function () {
    state.sort = sortSelect.value;
    renderCatalog();
  });
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setCategory(button.dataset.filter);
    });
  });
  document.querySelectorAll("[data-category-link]").forEach(function (button) {
    button.addEventListener("click", function () {
      setCategory(button.dataset.categoryLink);
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.getElementById("resetCatalog").addEventListener("click", resetCatalog);
  grid.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-product-details]");
    if (trigger) openProductDetails(trigger.dataset.productDetails);
  });
})();
