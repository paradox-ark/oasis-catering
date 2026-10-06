/* Oasis — Core shared interactions, menu data & booking engine (no external backend) */
(function() {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- header / drawer ---------- */
  const header = $(".site-header");
  addEventListener("scroll", () => {
    header && header.classList.toggle("scrolled", scrollY > 15);
    const t = $("#fabTop");
    if (t) t.style.display = scrollY > 600 ? "grid" : "none";
  }, { passive: true });

  const drawer = $("#drawer");
  $$("[data-open-drawer]").forEach(b => b.addEventListener("click", () => drawer && drawer.classList.add("open")));
  $$("[data-close-drawer]").forEach(b => b.addEventListener("click", () => drawer && drawer.classList.remove("open")));

  /* active navigation */
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  $$(".nav-links a, .drawer-panel a.dlink").forEach(a => {
    const h = (a.getAttribute("href") || "").toLowerCase().split("#")[0];
    if (h === page || (page === "" && h === "index.html")) a.classList.add("active");
  });

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---------- hero slideshow ---------- */
  const slides = $$(".hero-slides .hero-slide, .hero-slides > img"), dotsWrap = $("#heroDots");
  if (slides.length) {
    let cur = 0;
    slides[0].classList.add("on");
    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, k) => {
        const d = document.createElement("button");
        d.setAttribute("aria-label", "Slide " + (k + 1));
        if (!k) d.classList.add("on");
        d.addEventListener("click", () => go(k));
        dotsWrap.appendChild(d);
      });
    }
    const dots = dotsWrap ? [...dotsWrap.children] : [];
    function go(k) {
      cur = k;
      slides.forEach((s, j) => s.classList.toggle("on", j === cur));
      dots.forEach((d, j) => d.classList.toggle("on", j === cur));
    }
    setInterval(() => go((cur + 1) % slides.length), 6000);
  }

  /* ---------- back to top ---------- */
  const fabTop = $("#fabTop");
  if (fabTop) {
    fabTop.addEventListener("click", e => {
      e.preventDefault();
      scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- date inputs: no past dates ---------- */
  $$('input[type="date"]').forEach(inp => {
    inp.min = new Date().toISOString().slice(0, 10);
  });

  /* ---------- footer year ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ============================================================
     FULL OASIS MENU (16 authentic Pakistani & event categories)
     ============================================================ */
  const MENU = [
    ["Rice", "From the deg & the dum", ["Chicken Biryani", "Mutton Biryani", "Sindhi Biryani", "Delhi Biryani", "Hyderabadi Biryani", "Chicken Pulao", "Vegetable Pulao", "Mutton Pulao", "Brown Rice", "Afghani Pulao", "Peas Pulao", "Buttered Rice", "Fried Rice", "Tehri Pulao"]],
    ["Pakistani Selection", "Desi heritage favourites", ["Chicken Qorma", "Mutton Qorma", "Mutton Ginger", "Mutton Khara Masala", "Mutton Qeema", "Qeema Gurday", "Chicken Dahiwala", "Chicken Karahi", "Qeema Makhanay", "Mutton Dahiwala", "Mutton Karahi Palak", "Mutton Karahi", "Palak Maghaz", "Chicken Ginger", "Chicken Khara Masala"]],
    ["Chicken Specialties", "Crowd-pleasers, wedding style", ["Sajji Roast", "Chargha Roast", "Chicken Shawarma", "Chicken Kiev", "Crispy Broast Chicken", "Steamed Chicken Roast", "Chicken Chapli Kabab", "Creamy Handi Chicken", "Chicken Kofta Curry", "Chicken Stew", "Ala King Chicken", "Whole Spice Chicken", "Chili Chicken Toss", "Chicken Mushroom Bake", "Herb Chicken Curry", "Foil Chicken Roast", "Cheesy Chicken Fingers", "Chicken Cordon Bleu", "Butter Cream Chicken", "Dynamite Chicken Bites", "Balochi Chicken Tikka", "Ottoman Turkish Kabab"]],
    ["Mutton Specialties", "Slow, rich & celebratory", ["Whole Stuffed Lamb", "Mutton Roast", "Foil Mutton Roast", "Multani Kunna", "Tawa Khata Khat", "Whole Spice Mutton", "Creamy Handi Mutton", "Makhani Mutton", "Achari Gosht", "Do Piyaza Mutton", "Palak Mutton", "Mutton Paya", "Mutton Joint Roast", "Surf & Turf (Mutton-Prawn)"]],
    ["Beef Selections", "Deep flavour, generous cuts", ["Mughlai Gola Kabab", "Beef Seekh Kabab", "Behari Strip Kabab", "Beef Chapli Kabab", "Beef Shami Kabab", "Beef Kofta Curry", "Nargisi Kofta", "Beef Shashlik", "Beef Shawarma", "Beef Stir-Fry", "Bohri Beef Cutlets", "Mughlai Beef Qorma", "Tawa Beef Kabab", "BBQ Beef Boti", "Beef Nihari", "Pasanda Beef Curry", "Beef Lasagna", "Beef Haleem"]],
    ["Ocean Specials", "Fresh from the water", ["Prawn Sizzlers", "Tempura Prawns", "Fish Tempura", "Fish Cakes", "Crumb Fried Fish", "Fish Orly", "Whole Pomfret", "Fish Cheese Crispers", "Fish Karahi", "Tawa Surmai", "Dynamite Prawns", "BBQ Crab", "Shrimp Curry"]],
    ["Barbecue", "Live fire & smoke", ["Chicken Tikka", "Kidney / Liver", "Ribs", "Chicken Shashlyk", "Seekh Kebab", "Prawns", "Chicken Boti", "Bihari Kebab", "Fish Tikka", "Mutton Boti", "Gola Kebab", "Hot Dogs", "Lamb Chops", "T-Bone Steak"]],
    ["Vegetables", "Garden-fresh & desi", ["Vegetable Bhujia", "Palak Paneer", "Aloo Achari", "Mirchay Ka Salan", "Baghary Baingan", "Vegetables Sautee", "Khata Tamatar", "Aloo Methi", "Potato Bhujia with Puri", "Mixed Vegetable Medley", "Veggie Cutlets", "Veg Spring Rolls", "Palak Aloo", "Vegetable Biryani", "Tadka Dal", "Bhindi Crisp", "Aloo Matar", "Masala Dosa", "Malai Kofta", "Mushroom Karahi", "Paneer Skewers", "Paneer Karahi", "Sarson Saag & Makki Roti"]],
    ["Soups", "To open the appetite", ["Chicken Corn Soup", "Cream of Chicken", "Hot & Sour Soup", "Thai Coconut Soup", "Cream of Mushroom", "Roasted Tomato Soup", "Masala Lentil Soup", "Chicken Consommé", "Spanish Gazpacho"]],
    ["Exotic Additions", "Crisp, sizzling & special", ["Finger Fish", "Lahori Fried Fish", "Tempura", "Fried Prawns", "Haleem", "Dahi Baray", "Chicken Lollipops", "Chicken Nuggets", "Chicken Croquettes", "Chicken Wontons", "Sizzling Tawa Chicken"]],
    ["Snacks / Hi-Tea", "Evening tables & tea-time", ["Alfredo Pasta", "Tea Sandwiches", "Chicken Puff", "Vol-au-Vent", "Pizza Bites", "Chicken Samosa", "Mince Samosa", "Cheese Samosa", "Veg Samosa", "Spring Rolls", "Fish Fingers", "French Fries", "Dahi Phulki", "Chana Chaat", "Mini Sliders", "Tea Cake", "Marble Cake", "Fruit Loaf", "Cookie Medley", "Pastry Assortment", "Pani Puri (Live)", "Chicken Wings", "Zesty Drumsticks", "Chicken Cheese Bites"]],
    ["Salads", "Fresh & bright", ["Russian Salad", "Egg & Potato Salad", "Macaroni Salad", "Beet Root & Potato Salad", "Cole Slaw", "Kidney Beans Salad", "Katchumar Salad", "Fresh Green Salad", "Beet Root Salad"]],
    ["Desserts", "A sweet farewell", ["Ice Cream", "Jalebi", "Cheese Cake", "Apricot with Cream", "Fruit Trifle", "Gulab Jamun", "Halwa Gajar", "Firni", "Ras Malai", "Halwa Akhrot", "Kheer", "Shahi Tukra", "Halwa Loki", "Kulfi Falooda", "Caramel Custard", "Halwa Petha", "Suji Delight", "Lauki Delight", "Mughlai Bread Pudding", "Saffron Rice", "Royal Motanjan", "Lab-e-Sheeren", "Doodh Dulari", "Swiss Rolls", "British Pudding"]],
    ["Hot Beverages", "Served steaming", ["Tea", "Coffee", "Green Tea", "Kashmiri Tea"]],
    ["Cold Drinks / Refreshments", "Cool & celebratory", ["Iced Tea", "Iced Mocha", "Fruit Smoothies", "Mint Cooler", "Pina Colada", "Fruit Mocktails", "Fruit Slushes", "Fresh Juices", "Rose Milk", "Falooda Shake"]],
    ["Newly Added Selections", "Fresh from the Oasis kitchen", ["Desi Potato Bhujia with Puri", "Malai Kofta Curry", "Chocolate Mousse", "Fresh Lime Soda", "Chicken Shawarma Wrap", "Grilled Fish with Lemon Butter", "Rasmalai Cheesecake", "Virgin Mojito", "Royal Mutton Kunna", "Beef Seekh Rolls", "Mango Delight", "Mint Margarita", "Vegetable Spring Rolls", "Chicken Tikka Pizza", "Saffron Phirni", "Gulab Jamun Brownie", "Peshawari Chapli Kebab", "Nihari (Beef / Mutton)", "Blue Lagoon Mocktail"]]
  ];

  /* shortlist stored in localStorage */
  const KEY = "oasis_shortlist_v1";
  const getList = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
  const setList = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch {} };
  let shortlist = getList();

  function syncShortlistUI() {
    $$("#shortCount").forEach(el => el.textContent = shortlist.length);
    const box = $("#shortBox");
    if (box) {
      box.innerHTML = shortlist.length
        ? shortlist.map(x => `<span class="pill" style="display:inline-flex;align-items:center;gap:.35rem;background:#fff;border:1px solid var(--line);border-radius:100px;padding:.35rem .85rem;font-size:.82rem">${x} <button data-rm="${x}" aria-label="remove" style="border:none;background:none;cursor:pointer;color:var(--maroon);font-size:1.1rem;line-height:1">×</button></span>`).join(" ")
        : `<p class="form-note">Tap “+ Add” on any dish to build your shortlist. It travels with you to the booking form.</p>`;
      $$("#shortBox [data-rm]").forEach(b => b.addEventListener("click", () => {
        shortlist = shortlist.filter(v => v !== b.dataset.rm);
        setList(shortlist);
        syncShortlistUI();
        paintAdds();
      }));
    }
    const req = $("#f-req");
    if (req && !req.value && shortlist.length) {
      req.value = "Selected dishes: " + shortlist.join(", ") + "\n\n";
    }
  }

  function paintAdds() {
    $$("[data-add]").forEach(b => {
      const on = shortlist.includes(b.dataset.add);
      b.classList.toggle("added", on);
      b.textContent = on ? "✓ Added" : "+ Add";
    });
  }

  function toggleAdd(name) {
    shortlist.includes(name) ? shortlist = shortlist.filter(v => v !== name) : shortlist.push(name);
    setList(shortlist);
    syncShortlistUI();
    paintAdds();
  }

  /* ---------- render menu page ---------- */
  const menuRoot = $("#menuRoot"), catNav = $("#catNav");
  if (menuRoot) {
    const q = $("#menuSearch"), sel = $("#menuFilter");
    if (catNav) {
      const all = document.createElement("button");
      all.className = "cat on";
      all.textContent = "All Categories";
      all.dataset.cat = "";
      all.addEventListener("click", () => {
        catNav.querySelectorAll(".cat").forEach(x => x.classList.remove("on"));
        all.classList.add("on");
        if (sel) sel.value = "";
        renderMenu();
      });
      catNav.appendChild(all);
    }
    MENU.forEach(([c]) => {
      if (catNav) {
        const b = document.createElement("button");
        b.className = "cat";
        b.textContent = c;
        b.dataset.cat = c;
        b.addEventListener("click", () => {
          catNav.querySelectorAll(".cat").forEach(x => x.classList.remove("on"));
          b.classList.add("on");
          if (sel) sel.value = c;
          renderMenu();
          menuRoot.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        catNav.appendChild(b);
      }
      if (sel) {
        const o = document.createElement("option");
        o.value = c;
        o.textContent = c;
        sel.appendChild(o);
      }
    });
    if (sel) sel.insertAdjacentHTML("afterbegin", `<option value="">All categories</option>`);

    function renderMenu() {
      const term = (q && q.value || "").trim().toLowerCase();
      const active = catNav ? ((catNav.querySelector(".cat.on") || {}).dataset || {}).cat : "";
      const only = sel && sel.value ? sel.value : active;
      let total = 0;
      menuRoot.innerHTML = MENU.map((m, k) => [m, k]).filter(([[c]]) => !only || c === only).map(([[c, sub, items], k]) => {
        const hit = items.filter(n => !term || n.toLowerCase().includes(term));
        if (term && !hit.length) return "";
        total += hit.length;
        return `<div class="menu-block" id="cat-${c.replace(/[^a-z0-9]+/gi, "-")}" style="background:#fff;border:1px solid var(--line);border-radius:var(--r-md);padding:1.4rem;box-shadow:var(--shadow-sm)">
          <div class="kicker-row" style="margin-bottom:1rem">
            <div><span class="eyebrow">${String(k + 1).padStart(2, "0")} · ${sub}</span><h2 class="h2" style="font-size:1.6rem;margin-top:.3rem">${c}</h2></div>
            <span class="pill" style="background:var(--cream-2);font-weight:600;font-size:.78rem;padding:.3rem .8rem;border-radius:100px;border:1px solid var(--line)">${hit.length} item${hit.length === 1 ? "" : "s"}</span>
          </div>
          <div class="menu-grid">${hit.map(n => `<div class="menu-item"><div><b>${n}</b><small>${c}</small></div><button class="add" data-add="${n}">+ Add</button></div>`).join("")}</div>
        </div>`;
      }).join("") || `<div class="form-card center" style="padding:3rem 1.5rem"><h3 style="color:var(--maroon);font-size:1.4rem">No dishes match “${esc(q.value)}”.</h3><p class="form-note" style="margin-top:.5rem">Try a simpler word — e.g. “biryani”, “karahi”, “kebab”, or browse categories.</p><p style="margin-top:1.2rem"><button class="btn btn-outline btn-sm" id="clearSearch">Clear search ✕</button></p></div>`;

      const cnt = $("#menuCount");
      if (cnt) cnt.textContent = term || only ? `${total} dish${total === 1 ? "" : "es"} shown` : `${MENU.reduce((a, [,, i]) => a + i.length, 0)} dishes · ${MENU.length} categories`;
      const cs = $("#clearSearch");
      if (cs) cs.addEventListener("click", () => {
        if (q) q.value = "";
        if (sel) sel.value = "";
        if (catNav) catNav.querySelectorAll(".cat").forEach(x => x.classList.toggle("on", x.dataset.cat === ""));
        renderMenu();
      });
      $$("#menuRoot [data-add]").forEach(b => b.addEventListener("click", () => toggleAdd(b.dataset.add)));
      paintAdds();
    }

    if (q) q.addEventListener("input", renderMenu);
    if (sel) sel.addEventListener("change", () => {
      if (catNav) catNav.querySelectorAll(".cat").forEach(x => x.classList.toggle("on", x.dataset.cat === sel.value));
      renderMenu();
    });
    renderMenu();
  }
  syncShortlistUI();
  paintAdds();

  /* ---------- gallery filter + lightbox & video modal ---------- */
  const gItems = $$(".g-item");
  $$("[data-gfilter]").forEach(b => b.addEventListener("click", () => {
    $$("[data-gfilter]").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    const f = b.dataset.gfilter;
    gItems.forEach(g => {
      const isVid = !!g.dataset.video;
      const cat = g.dataset.cat;
      let show = false;
      if (f === "all") show = true;
      else if (f === "videos") show = isVid;
      else if (f === "photos") show = !isVid;
      else show = (cat === f);
      g.style.display = show ? "" : "none";
    });
  }));

  /* lightbox for photos */
  const lb = $("#lightbox");
  if (lb && gItems.length) {
    const img = $("#lbImg"), cap = $("#lbCap");
    let idx = 0;
    const photoItems = () => gItems.filter(g => !g.dataset.video && g.style.display !== "none");
    function showPhoto(k) {
      const v = photoItems();
      if (!v.length) return;
      idx = (k + v.length) % v.length;
      const target = v[idx];
      const im = $("img", target);
      if (im) {
        img.src = im.src;
        img.alt = im.alt || "Oasis Event";
        const fig = $("figcaption", target);
        if (cap) cap.textContent = fig ? fig.textContent : im.alt;
      }
    }
    gItems.forEach(g => {
      if (!g.dataset.video) {
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "button");
        g.addEventListener("click", () => {
          lb.classList.add("open");
          document.body.style.overflow = "hidden";
          showPhoto(photoItems().indexOf(g));
        });
        g.addEventListener("keydown", e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            g.click();
          }
        });
      }
    });
    $("[data-lb-close]", lb)?.addEventListener("click", closeLb);
    $(".lb-prev", lb)?.addEventListener("click", e => { e.stopPropagation(); showPhoto(idx - 1); });
    $(".lb-next", lb)?.addEventListener("click", e => { e.stopPropagation(); showPhoto(idx + 1); });
    lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
    addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") showPhoto(idx + 1);
      if (e.key === "ArrowLeft") showPhoto(idx - 1);
    });
    function closeLb() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  /* video modal for real MP4s */
  const vm = $("#videoModal");
  if (vm) {
    const frame = $("#videoFrame"), cap = $("#videoCap");
    const vBox = vm.querySelector(".video-box");
    $$("[data-video]").forEach(c => {
      c.setAttribute("tabindex", "0");
      c.setAttribute("role", "button");

      const thumbVid = c.querySelector("video.g-video-thumb");
      if (thumbVid) {
        c.addEventListener("mouseenter", () => {
          thumbVid.play().catch(() => {});
        });
        c.addEventListener("mouseleave", () => {
          thumbVid.pause();
          try { thumbVid.currentTime = 0.1; } catch (e) {}
        });
      }

      const openVideo = () => {
        const src = c.dataset.video;
        const title = c.dataset.title || "Oasis Event Video";
        if (cap) cap.textContent = title;
        if (vBox) {
          vBox.classList.remove("is-portrait", "is-landscape");
        }
        frame.innerHTML = `<video src="${src}" controls autoplay playsinline style="width:100%;height:100%;background:#000;display:block;outline:none"></video>`;
        const vid = frame.querySelector("video");
        if (vid) {
          vid.addEventListener("loadedmetadata", () => {
            const isPortrait = vid.videoHeight > vid.videoWidth;
            if (vBox) {
              vBox.classList.toggle("is-portrait", isPortrait);
              vBox.classList.toggle("is-landscape", !isPortrait);
            }
          });
        }
        vm.classList.add("open");
        document.body.style.overflow = "hidden";
      };
      c.addEventListener("click", openVideo);
      c.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openVideo();
        }
      });
    });
    $("[data-vm-close]", vm)?.addEventListener("click", closeVm);
    vm.addEventListener("click", e => { if (e.target === vm) closeVm(); });
    addEventListener("keydown", e => { if (e.key === "Escape") closeVm(); });
    function closeVm() {
      vm.classList.remove("open");
      frame.innerHTML = "";
      if (vBox) vBox.classList.remove("is-portrait", "is-landscape");
      document.body.style.overflow = "";
    }
  }

  /* ---------- FAQ Accordion ---------- */
  $$(".faq-item").forEach(it => {
    $(".faq-q", it)?.addEventListener("click", () => {
      const open = it.classList.contains("open");
      $$(".faq-item.open").forEach(o => {
        o.classList.remove("open");
        const pm = $(".pm", o);
        if (pm) pm.textContent = "+";
      });
      if (!open) {
        it.classList.add("open");
        const pm = $(".pm", it);
        if (pm) pm.textContent = "–";
      }
    });
  });

  /* ---------- Booking & Contact Forms ---------- */
  const WA = "923295977659"; // Waqar Ahmed WhatsApp
  function collectBooking(form) {
    const v = id => ((form.querySelector("#" + id) || {}).value || "").trim();
    const services = $$('input[name="services"]:checked', form).map(c => c.value);
    return {
      name: v("f-name") || v("b-name"),
      phone: v("f-phone") || v("b-phone"),
      email: v("f-email") || v("b-email"),
      type: v("f-type") || v("b-type"),
      date: v("f-date") || v("b-date"),
      guests: v("f-guests") || v("b-guests"),
      loc: v("f-loc") || v("b-loc"),
      services,
      req: v("f-req") || v("b-req"),
      details: v("f-details") || v("b-details")
    };
  }

  function formatWaText(d) {
    return `Assalam-o-Alaikum Oasis! I want to book / request a quote.%0A%0A` +
      `*Name:* ${encodeURIComponent(d.name)}%0A` +
      `*Phone:* ${encodeURIComponent(d.phone)}%0A` +
      (d.email ? `*Email:* ${encodeURIComponent(d.email)}%0A` : "") +
      (d.type ? `*Event Type:* ${encodeURIComponent(d.type)}%0A` : "") +
      (d.date ? `*Date:* ${encodeURIComponent(d.date)}%0A` : "") +
      (d.guests ? `*Guests:* ${encodeURIComponent(d.guests)}%0A` : "") +
      (d.loc ? `*Venue / Area:* ${encodeURIComponent(d.loc)}%0A` : "") +
      (d.services.length ? `*Services:* ${encodeURIComponent(d.services.join(", "))}%0A` : "") +
      (d.req ? `*Menu / Dishes:* ${encodeURIComponent(d.req)}%0A` : "") +
      (d.details ? `*Details:* ${encodeURIComponent(d.details)}` : "");
  }

  const bf = $("#quoteForm") || $("#bookingForm");
  if (bf) {
    bf.addEventListener("submit", e => {
      e.preventDefault();
      const d = collectBooking(bf);
      if (!d.name || !d.phone) {
        flash("Please enter your name and phone number.");
        return;
      }
      const rawMsg = decodeURIComponent(formatWaText(d)).replace(/%0A/g, "\n").replace(/\*/g, "");
      const box = $("#quoteDone");
      if (box) {
        box.classList.add("show");
        box.innerHTML = `<b style="font-family:var(--font-display);font-size:1.25rem;color:#fff">Shukriya, ${esc(d.name.split(" ")[0])}! Your enquiry is ready.</b>
          <p style="margin:.4rem 0 1.2rem;font-size:.92rem;color:#e8cfb3">Click below to send via WhatsApp directly to our bookings desk or via Email:</p>
          <div style="display:flex;gap:.7rem;flex-wrap:wrap">
            <a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${formatWaText(d)}">
              <img src="assets/images/icons/whatsapp-maroon.svg" alt="" style="width:18px;height:18px"> Send via WhatsApp
            </a>
            <a class="btn btn-ghost btn-sm" href="mailto:oasiscatering.pk@gmail.com?subject=${encodeURIComponent("Event Enquiry — " + d.name)}&body=${encodeURIComponent(rawMsg)}">
              <img src="assets/images/icons/email-white.svg" alt="" style="width:18px;height:18px"> Send via Email
            </a>
          </div>`;
        box.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        open(`https://wa.me/${WA}?text=${formatWaText(d)}`, "_blank");
      }
    });
  }

  const cf = $("#contactForm");
  if (cf) {
    cf.addEventListener("submit", e => {
      e.preventDefault();
      const name = ($("#c-name", cf)?.value || "").trim();
      const phone = ($("#c-phone", cf)?.value || "").trim();
      const msg = ($("#c-msg", cf)?.value || "").trim();
      if (!name || !phone) {
        flash("Please provide your name and phone number.");
        return;
      }
      const text = `Assalam-o-Alaikum Oasis!%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Message:* ${encodeURIComponent(msg)}`;
      open(`https://wa.me/${WA}?text=${text}`, "_blank");
      flash("Opening WhatsApp with your message...");
    });
  }

  function flash(msg) {
    let n = $("#flash");
    if (!n) {
      n = document.createElement("div");
      n.id = "flash";
      n.style.cssText = "position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#26060c;color:#f6e3c2;padding:.85rem 1.4rem;border-radius:12px;z-index:200;border:1px solid rgba(233,207,138,.5);box-shadow:0 18px 45px rgba(0,0,0,.5);font-size:.9rem;text-align:center;max-width:min(480px,92vw)";
      document.body.appendChild(n);
    }
    n.textContent = msg;
    n.style.display = "block";
    clearTimeout(n._t);
    n._t = setTimeout(() => n.style.display = "none", 4000);
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
})();
