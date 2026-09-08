/* Oasis — shared interactions + menu data (no auth, no backend) */
(function(){
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

  /* ---------- header / drawer ---------- */
  const header=$(".site-header");
  addEventListener("scroll",()=>{
    header&&header.classList.toggle("scrolled",scrollY>10);
    const t=$("#fabTop"); if(t) t.style.display=scrollY>700?"grid":"none";
  },{passive:true});
  const drawer=$("#drawer");
  $$("[data-open-drawer]").forEach(b=>b.addEventListener("click",()=>drawer&&drawer.classList.add("open")));
  $$("[data-close-drawer]").forEach(b=>b.addEventListener("click",()=>drawer&&drawer.classList.remove("open")));

  /* active nav */
  const page=(location.pathname.split("/").pop()||"index.html").toLowerCase();
  $$(".nav-links a, .drawer-panel a.dlink").forEach(a=>{
    const h=(a.getAttribute("href")||"").toLowerCase();
    if(h===page||(page===""&&h==="index.html")) a.classList.add("active");
  });

  /* ---------- reveal on scroll ---------- */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.12});
  $$(".reveal").forEach(el=>io.observe(el));

  /* ---------- hero slideshow ---------- */
  const slides=$$(".hero-slides img"), dotsWrap=$("#heroDots");
  if(slides.length){
    let i=0;
    slides[0].classList.add("on");
    if(dotsWrap){slides.forEach((_,k)=>{const d=document.createElement("button");d.setAttribute("aria-label","Slide "+(k+1));if(!k)d.classList.add("on");d.addEventListener("click",()=>go(k));dotsWrap.appendChild(d);});}
    const dots=dotsWrap?[...dotsWrap.children]:[];
    function go(k){i=k;slides.forEach((s,j)=>s.classList.toggle("on",j===i));dots.forEach((d,j)=>d.classList.toggle("on",j===i));}
    setInterval(()=>go((i+1)%slides.length),6000);
  }

  /* ---------- back-to-top ---------- */
  const fabTop=$("#fabTop");
  if(fabTop) fabTop.addEventListener("click",e=>{e.preventDefault();scrollTo({top:0,behavior:"smooth"});});

  /* ---------- date inputs: no past dates ---------- */
  const dateInput=$("#f-date");
  if(dateInput) dateInput.min=new Date().toISOString().slice(0,10);

  /* ---------- keyboard access for gallery + video cards ---------- */
  $$(".g-item, .v-card").forEach(el=>{
    el.setAttribute("tabindex","0");el.setAttribute("role","button");
    el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();el.click();}});
  });

  /* ---------- footer year ---------- */
  const y=$("#year"); if(y) y.textContent=new Date().getFullYear();

  /* ============================================================
     FULL OASIS MENU (source of truth from business brief)
  ============================================================ */
  const MENU=[
    ["Rice","From the deg & the dum",["Chicken Biryani","Mutton Biryani","Sindhi Biryani","Delhi Biryani","Hyderabadi Biryani","Chicken Pulao","Vegetable Pulao","Mutton Pulao","Brown Rice","Afghani Pulao","Peas Pulao","Buttered Rice","Fried Rice","Tehri Pulao"]],
    ["Pakistani Selection","Desi heritage favourites",["Chicken Qorma","Mutton Qorma","Mutton Ginger","Mutton Khara Masala","Mutton Qeema","Qeema Gurday","Chicken Dahiwala","Chicken Karahi","Qeema Makhanay","Mutton Dahiwala","Mutton Karahi Palak","Mutton Karahi","Palak Maghaz","Chicken Ginger","Chicken Khara Masala"]],
    ["Chicken Specialties","Crowd-pleasers, wedding style",["Sajji Roast","Chargha Roast","Chicken Shawarma","Chicken Kiev","Crispy Broast Chicken","Steamed Chicken Roast","Chicken Chapli Kabab","Creamy Handi Chicken","Chicken Kofta Curry","Chicken Stew","Ala King Chicken","Whole Spice Chicken","Chili Chicken Toss","Chicken Mushroom Bake","Herb Chicken Curry","Foil Chicken Roast","Cheesy Chicken Fingers","Chicken Cordon Bleu","Butter Cream Chicken","Dynamite Chicken Bites","Balochi Chicken Tikka","Ottoman Turkish Kabab"]],
    ["Mutton Specialties","Slow, rich & celebratory",["Whole Stuffed Lamb","Mutton Roast","Foil Mutton Roast","Multani Kunna","Tawa Khata Khat","Whole Spice Mutton","Creamy Handi Mutton","Makhani Mutton","Achari Gosht","Do Piyaza Mutton","Palak Mutton","Mutton Paya","Mutton Joint Roast","Surf & Turf (Mutton-Prawn)"]],
    ["Beef Selections","Deep flavour, generous cuts",["Mughlai Gola Kabab","Beef Seekh Kabab","Behari Strip Kabab","Beef Chapli Kabab","Beef Shami Kabab","Beef Kofta Curry","Nargisi Kofta","Beef Shashlik","Beef Shawarma","Beef Stir-Fry","Bohri Beef Cutlets","Mughlai Beef Qorma","Tawa Beef Kabab","BBQ Beef Boti","Beef Nihari","Pasanda Beef Curry","Beef Lasagna","Beef Haleem"]],
    ["Ocean Specials","Fresh from the water",["Prawn Sizzlers","Tempura Prawns","Fish Tempura","Fish Cakes","Crumb Fried Fish","Fish Orly","Whole Pomfret","Fish Cheese Crispers","Fish Karahi","Tawa Surmai","Dynamite Prawns","BBQ Crab","Shrimp Curry"]],
    ["Barbecue","Live fire & smoke",["Chicken Tikka","Kidney / Liver","Ribs","Chicken Shashlyk","Seekh Kebab","Prawns","Chicken Boti","Bihari Kebab","Fish Tikka","Mutton Boti","Gola Kebab","Hot Dogs","Lamb Chops","T-Bone Steak"]],
    ["Vegetables","Garden-fresh & desi",["Vegetable Bhujia","Palak Paneer","Aloo Achari","Mirchay Ka Salan","Baghary Baingan","Vegetables Sautee","Khata Tamatar","Aloo Methi","Potato Bhujia with Puri","Mixed Vegetable Medley","Veggie Cutlets","Veg Spring Rolls","Palak Aloo","Vegetable Biryani","Tadka Dal","Bhindi Crisp","Aloo Matar","Masala Dosa","Malai Kofta","Mushroom Karahi","Paneer Skewers","Paneer Karahi","Sarson Saag & Makki Roti"]],
    ["Soups","To open the appetite",["Chicken Corn Soup","Cream of Chicken","Hot & Sour Soup","Thai Coconut Soup","Cream of Mushroom","Roasted Tomato Soup","Masala Lentil Soup","Chicken Consommé","Spanish Gazpacho"]],
    ["Exotic Additions","Crisp, sizzling & special",["Finger Fish","Lahori Fried Fish","Tempura","Fried Prawns","Haleem","Dahi Baray","Chicken Lollipops","Chicken Nuggets","Chicken Croquettes","Chicken Wontons","Sizzling Tawa Chicken"]],
    ["Snacks / Hi-Tea","Evening tables & tea-time",["Alfredo Pasta","Tea Sandwiches","Chicken Puff","Vol-au-Vent","Pizza Bites","Chicken Samosa","Mince Samosa","Cheese Samosa","Veg Samosa","Spring Rolls","Fish Fingers","French Fries","Dahi Phulki","Chana Chaat","Mini Sliders","Tea Cake","Marble Cake","Fruit Loaf","Cookie Medley","Pastry Assortment","Pani Puri (Live)","Chicken Wings","Zesty Drumsticks","Chicken Cheese Bites"]],
    ["Salads","Fresh & bright",["Russian Salad","Egg & Potato Salad","Macaroni Salad","Beet Root & Potato Salad","Cole Slaw","Kidney Beans Salad","Katchumar Salad","Fresh Green Salad","Beet Root Salad"]],
    ["Desserts","A sweet farewell",["Ice Cream","Jalebi","Cheese Cake","Apricot with Cream","Fruite Trifle","Gulab Jaman","Halwa Gajar","Firni","Ras Malai","Halwa Akhrot","Kheer","Shahi Tukra","Halwa Loki","Kulfi Falooda","Caramel Custard","Halwa Petha","Suji Delight","Lauki Delight","Mughlai Bread Pudding","Saffron Rice","Royal Motanjan","Lab-e-Sheeren","Doodh Dulari","Swiss Rolls","British Pudding"]],
    ["Hot Beverages","Served steaming",["Tea","Coffee","Green Tea","Kashmiri Tea"]],
    ["Cold Drinks / Refreshments","Cool & celebratory",["Iced Tea","Iced Mocha","Fruit Smoothies","Mint Cooler","Pina Colada","Fruit Mocktails","Fruit Slushes","Fresh Juices","Rose Milk","Falooda Shake"]],
    ["Newly Added Selections","Fresh from the Oasis kitchen",["Desi Potato Bhujia with Puri","Malai Kofta Curry","Chocolate Mousse","Fresh Lime Soda","Chicken Shawarma Wrap","Grilled Fish with Lemon Butter","Rasmalai Cheesecake","Virgin Mojito","Royal Mutton Kunna","Beef Seekh Rolls","Mango Delight","Mint Margarita","Vegetable Spring Rolls","Chicken Tikka Pizza","Saffron Phirni","Golap Jamun Brownie","Peshawari Chapli Kebab","Nihari (Beef / Mutton)","Gulab Jamun Brownie","Blue Lagoon Mocktail"]]
  ];

  /* shortlist (stored locally, attached to quote request) */
  const KEY="oasis_shortlist_v1";
  const getList=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
  const setList=l=>{try{localStorage.setItem(KEY,JSON.stringify(l))}catch{}};
  let shortlist=getList();
  function syncShortlistUI(){
    $$("#shortCount").forEach(el=>el.textContent=shortlist.length);
    const box=$("#shortBox"); if(!box) return;
    box.innerHTML = shortlist.length
      ? shortlist.map(x=>`<span class="pill">${x} <button data-rm="${x}" aria-label="remove" style="border:none;background:none;cursor:pointer;color:var(--maroon)">×</button></span>`).join("")
      : `<p class="form-note">Tap “+ Add” on any dish to build your enquiry list. It travels with you to the quote page.</p>`;
    $$("#shortBox [data-rm]").forEach(b=>b.addEventListener("click",()=>{shortlist=shortlist.filter(v=>v!==b.dataset.rm);setList(shortlist);syncShortlistUI();paintAdds();}));
  }
  function paintAdds(){$$("[data-add]").forEach(b=>{const on=shortlist.includes(b.dataset.add);b.classList.toggle("added",on);b.textContent=on?"✓ Added":"+ Add";});}
  function toggleAdd(name){shortlist.includes(name)?shortlist=shortlist.filter(v=>v!==name):shortlist.push(name);setList(shortlist);syncShortlistUI();paintAdds();}

  /* ---------- render full menu page ---------- */
  const menuRoot=$("#menuRoot"), catNav=$("#catNav");
  if(menuRoot){
    const q=$("#menuSearch"), sel=$("#menuFilter");
    // build category pills + select (All selected by default = full menu)
    if(catNav){const all=document.createElement("button");all.className="cat on";all.textContent="All";all.dataset.cat="";all.addEventListener("click",()=>{catNav.querySelectorAll(".cat").forEach(x=>x.classList.remove("on"));all.classList.add("on");if(sel)sel.value="";render();});catNav.appendChild(all);}
    MENU.forEach(([c])=>{
      if(catNav){const b=document.createElement("button");b.className="cat";b.textContent=c;b.dataset.cat=c;b.addEventListener("click",()=>{catNav.querySelectorAll(".cat").forEach(x=>x.classList.remove("on"));b.classList.add("on");if(sel)sel.value=c;render();menuRoot.scrollIntoView({behavior:"smooth",block:"start"});});catNav.appendChild(b);}
      if(sel){const o=document.createElement("option");o.value=c;o.textContent=c;sel.appendChild(o);}
    });
    if(sel) sel.insertAdjacentHTML("afterbegin",`<option value="">All categories</option>`);
    function render(){
      const term=(q&&q.value||"").trim().toLowerCase();
      const active=catNav?((catNav.querySelector(".cat.on")||{}).dataset||{}).cat:"";
      const only=sel&&sel.value?sel.value:active;
      let total=0;
      menuRoot.innerHTML=MENU.filter(([c])=>!only||c===only).map(([c,sub,items])=>{
        const hit=items.filter(n=>!term||n.toLowerCase().includes(term));
        if(term&&!hit.length) return "";
        total+=hit.length;
        return `<div class="menu-block" id="cat-${c.replace(/[^a-z]+/gi,"-")}">
          <div class="kicker-row"><div><span class="eyebrow">${sub}</span><h2 class="h2">${c}</h2></div>
          <span class="pill">${hit.length} items</span></div>
          <div class="menu-grid">${hit.map(n=>`<div class="menu-item"><div><b>${n}</b><small>${c}</small></div><button class="add" data-add="${n}">+ Add</button></div>`).join("")}</div>
        </div>`;
      }).join("")||`<div class="form-card"><h3 style="font-family:var(--font-display);color:var(--maroon)">No dishes match “${esc(q.value)}”.</h3><p class="form-note">Try a shorter word — e.g. “karahi”, “kebab”, “biryani” — or browse a category.</p></div>`;
      const cnt=$("#menuCount"); if(cnt) cnt.textContent=term||only?`${total} dish${total===1?"":"es"} shown`:`${MENU.reduce((a,[,,i])=>a+i.length,0)} dishes · ${MENU.length} categories`;
      $$("#menuRoot [data-add]").forEach(b=>b.addEventListener("click",()=>toggleAdd(b.dataset.add)));
      paintAdds();
    }
    if(q) q.addEventListener("input",render);
    if(sel) sel.addEventListener("change",()=>{if(catNav)catNav.querySelectorAll(".cat").forEach(x=>x.classList.toggle("on",x.dataset.cat===sel.value));render();});
    render();
  }
  syncShortlistUI(); paintAdds();
  // prefill quote "catering requirements" from shortlist
  const req=$("#f-req");
  if(req&&!req.value&&shortlist.length) req.value="Dishes we liked: "+shortlist.join(", ")+"\n\n";

  /* ---------- gallery filter + lightbox ---------- */
  const gItems=$$(".g-item");
  $$("[data-gfilter]").forEach(b=>b.addEventListener("click",()=>{
    $$("[data-gfilter]").forEach(x=>x.classList.remove("on"));b.classList.add("on");
    const f=b.dataset.gfilter;
    gItems.forEach(g=>g.style.display=(f==="all"||g.dataset.cat===f)?"":"none");
  }));
  const lb=$("#lightbox");
  if(lb&&gItems.length){
    const img=$("#lbImg"),cap=$("#lbCap");let idx=0;
    const vis=()=>gItems.filter(g=>g.style.display!=="none");
    function show(k){const v=vis();idx=(k+v.length)%v.length;const im=$("img",v[idx]);img.src=im.src;img.alt=im.alt;cap.textContent=im.alt;}
    gItems.forEach(g=>g.addEventListener("click",()=>{lb.classList.add("open");document.body.style.overflow="hidden";show(vis().indexOf(g));}));
    $("[data-lb-close]",lb).addEventListener("click",close);
    $(".lb-prev",lb).addEventListener("click",e=>{e.stopPropagation();show(idx-1);});
    $(".lb-next",lb).addEventListener("click",e=>{e.stopPropagation();show(idx+1);});
    lb.addEventListener("click",e=>{if(e.target===lb)close();});
    addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")close();if(e.key==="ArrowRight")show(idx+1);if(e.key==="ArrowLeft")show(idx-1);});
    function close(){lb.classList.remove("open");document.body.style.overflow="";}
  }

  /* ---------- FAQ ---------- */
  $$(".faq-item").forEach(it=>{
    $(".faq-q",it).addEventListener("click",()=>{
      const open=it.classList.contains("open");
      $$(".faq-item.open").forEach(o=>{o.classList.remove("open");$(".pm",o).textContent="+";});
      if(!open){it.classList.add("open");$(".pm",it).textContent="–";}
    });
  });

  function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  /* ---------- video modal ---------- */
  const vm=$("#videoModal");
  if(vm){
    const frame=$("#videoFrame"),cap=$("#videoCap");
    function filmFallback(poster){
      frame.innerHTML=`<div style="display:grid;place-items:center;text-align:center;padding:3rem 1.5rem;background:radial-gradient(100% 120% at 50% 0%,#5c0e1a,#26060c);aspect-ratio:16/9">`
        +`<div><p class="crumbs" style="color:var(--gold-2)">Coming soon to this player</p>`
        +`<h3 style="font-family:var(--font-display);color:#fff;font-size:1.5rem;margin:.5rem 0">Watch this film on Instagram</h3>`
        +`<p style="color:#e5cfa8;font-size:.92rem">Our freshest event reels post to Instagram first.</p>`
        +`<a class="btn btn-gold btn-sm" style="margin-top:1rem" href="https://instagram.com/oasiscatering.pk" target="_blank" rel="noopener">Open @oasiscatering.pk →</a></div></div>`;
    }
    $$("[data-video]").forEach(c=>c.addEventListener("click",()=>{
      const src=c.dataset.video, kind=c.dataset.kind||"mp4", title=c.dataset.title||"Oasis film";
      cap.textContent=title;
      if(kind==="youtube"){
        frame.innerHTML=`<iframe src="${src}" title="${esc(title)}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      }else{
        frame.innerHTML=`<video src="${src}" controls autoplay playsinline poster="${$("img",c)?$("img",c).src:""}"></video>`;
        const v=$("video",frame);
        if(v) v.addEventListener("error",()=>filmFallback(),{once:true});
      }
      vm.classList.add("open");document.body.style.overflow="hidden";
    }));
    $("[data-vm-close]",vm).addEventListener("click",closeV);
    vm.addEventListener("click",e=>{if(e.target===vm)closeV();});
    addEventListener("keydown",e=>{if(e.key==="Escape")closeV();});
    function closeV(){vm.classList.remove("open");frame.innerHTML="";document.body.style.overflow="";}
  }

  /* ---------- quote + contact forms (no account, no backend) ---------- */
  const WA="923295977659"; // Waqar Ahmed WhatsApp
  function collectQuote(form){
    const v=id=>((form.querySelector("#"+id)||{}).value||"").trim();
    const services=$$('input[name="services"]:checked',form).map(c=>c.value);
    return {name:v("f-name"),phone:v("f-phone"),email:v("f-email"),type:v("f-type"),date:v("f-date"),
      guests:v("f-guests"),loc:v("f-loc"),services,req:v("f-req"),details:v("f-details")};
  }
  function quoteText(d){
    return `Assalam-o-Alaikum Oasis! I would like a quotation.%0A%0A`+
    `Name: ${encodeURIComponent(d.name)}%0APhone: ${encodeURIComponent(d.phone)}%0A`+
    (d.email?`Email: ${encodeURIComponent(d.email)}%0A`:"")+
    (d.type?`Event type: ${encodeURIComponent(d.type)}%0A`:"")+
    (d.date?`Event date: ${encodeURIComponent(d.date)}%0A`:"")+
    (d.guests?`Guests: ${encodeURIComponent(d.guests)}%0A`:"")+
    (d.loc?`Venue / location: ${encodeURIComponent(d.loc)}%0A`:"")+
    (d.services.length?`Services: ${encodeURIComponent(d.services.join(", "))}%0A`:"")+
    (d.req?`Catering: ${encodeURIComponent(d.req)}%0A`:"")+
    (d.details?`Details: ${encodeURIComponent(d.details)}`:"");
  }
  const qf=$("#quoteForm");
  if(qf){
    qf.addEventListener("submit",e=>{
      e.preventDefault();
      const d=collectQuote(qf);
      if(!d.name||!d.phone){flash("Please add your name and phone number so we can call you back.");return;}
      const msg=decodeURIComponent(quoteText(d)).replace(/%0A/g,"\n");
      const box=$("#quoteDone");
      if(box){box.classList.add("show");box.innerHTML=`<b style="font-family:var(--font-display);font-size:1.2rem;color:#fff">Shukriya, ${esc(d.name.split(" ")[0])} — your enquiry is ready.</b><p style="margin:.5rem 0 1rem">Choose how to send it. No account needed.</p><div style="display:flex;gap:.6rem;flex-wrap:wrap"><a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="https://wa.me/${WA}?text=${quoteText(d)}">Send via WhatsApp</a><a class="btn btn-ghost btn-sm" href="mailto:oasiscatering.pk@gmail.com?subject=${encodeURIComponent("Quotation request — "+d.name)}&body=${encodeURIComponent(msg)}">Send via Email</a></div>`;box.scrollIntoView({behavior:"smooth"});}
      try{localStorage.removeItem(KEY);}catch{}
    });
  }
  const cf=$("#contactForm");
  if(cf){
    cf.addEventListener("submit",e=>{
      e.preventDefault();
      const g=id=>((cf.querySelector("#"+id)||{}).value||"").trim();
      const text=`Assalam-o-Alaikum Oasis!%0AName: ${encodeURIComponent(g("c-name"))}%0APhone: ${encodeURIComponent(g("c-phone"))}%0AMessage: ${encodeURIComponent(g("c-msg"))}`;
      if(!g("c-name")||!g("c-phone")){flash("Please add your name and phone number.");return;}
      open(`https://wa.me/${WA}?text=${text}`,"_blank");
      flash("Opening WhatsApp — your message is ready to send. Or email us at oasiscatering.pk@gmail.com.");
    });
  }
  function flash(msg){
    let n=$("#flash");
    if(!n){n=document.createElement("div");n.id="flash";n.style.cssText="position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#26060c;color:#f6e3c2;padding:.9rem 1.3rem;border-radius:14px;z-index:200;border:1px solid rgba(233,207,138,.4);box-shadow:0 20px 50px -12px rgba(0,0,0,.5);max-width:min(520px,92vw);text-align:center";document.body.appendChild(n);}
    n.textContent=msg;n.style.display="block";clearTimeout(n._t);n._t=setTimeout(()=>n.style.display="none",4200);
  }

  /* ---------- smooth anchor offset for sticky header ---------- */
  $$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
    let t=null; try{t=$(a.getAttribute("href"));}catch{/* invalid selector */}
    if(!t||a.id==="fabTop") return;
    e.preventDefault(); t.scrollIntoView({behavior:"smooth",block:"start"});
  }));
})();
