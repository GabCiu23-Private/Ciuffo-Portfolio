const PROJECT_FILES = {
  leone: "lavori/leone.html",
  essenza: "lavori/essenza.html",
  poggio: "lavori/poggio-alla-pieve.html",
  analytics: "lavori/analytics.html",
  symposium: "lavori/symposium.html",
};

const PROJECT_ORDER = [
  {
    "slug": "leone",
    "title": "Leone — Ecosistema digitale"
  },
  {
    "slug": "essenza",
    "title": "Essenza / 3Design"
  },
  {
    "slug": "poggio",
    "title": "Poggio alla Pieve"
  },
  {
    "slug": "analytics",
    "title": "Ciuffo Analytics"
  },
  {
    "slug": "symposium",
    "title": "Leone International Symposium"
  }
];

const RELATED_PROJECTS = {
  leone: { slug: "essenza", label: "Esplora l’area riservata Essenza / 3Design", text: "Dalla consultazione del sito pubblico alla gestione dei casi e della documentazione." },
  essenza: { slug: "leone", label: "Esplora il sito corporate Leone", text: "Il contesto pubblico di prodotti, formazione e servizi a cui si collega l’area riservata." },
};

const CORE_PROJECTS = ["leone", "essenza", "poggio", "analytics"];

const LIFE_BUTTON_SCREENSHOT =
  "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fweb.mc.lilly.com%2FThe_Life_Button.html?w=2000";

const year = new Date().getFullYear();

function header(home = false) {
  const currentPage = document.body.dataset.page;
  const isWork = currentPage === "work" || currentPage === "case";
  const isProfile = currentPage === "profile";

  return `
    <a class="skip-link" href="${document.body.dataset.page === "case" ? PROJECT_FILES[document.body.dataset.case] : ""}#main-content">Vai al contenuto</a>
    <header class="${home ? "site-header" : "site-header site-header-inner"}">
      <a class="brand" href="${home ? "#top" : "index.html"}" aria-label="${home ? "Torna all'inizio" : "Torna alla home"}">
        GC<span>®</span>
      </a>
      <div class="header-meta">
        <span>Firenze, IT</span>
        <span class="desktop-only" data-clock></span>
      </div>
      <nav class="nav" id="main-navigation" aria-label="Navigazione principale">
        <a href="lavori.html"${isWork ? ' aria-current="page"' : ""}>Lavori</a>
        <a href="${home ? "#services" : "index.html#services"}">Approccio</a>
        <a href="profilo.html"${isProfile ? ' aria-current="page"' : ""}>Profilo</a>
        <a href="${home ? "#contact" : "index.html#contact"}">Contatti</a>
        <a href="cv/Gabriele_Ciuffi.svg" download>CV</a>
      </nav>
      <button class="menu-button" type="button" aria-label="Apri menu" aria-expanded="false" aria-controls="main-navigation">
        <span>Menu</span>
      </button>
    </header>
  `;
}

function footer() {
  return `
    <footer class="case-footer">
      <span>© ${year} Gabriele Ciuffi</span>
      <a href="index.html">Torna alla home ↑</a>
      <a href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
      <span>Firenze, Italia</span>
    </footer>
  `;
}

function homePage() {
  return `
    <main id="main-content">
      <div class="cursor" aria-hidden="true"></div>
      ${header(true)}

      <section class="hero" id="top">
        <h1 class="hero-title" aria-label="Progetto esperienze digitali">
          <span class="title-row title-row-one"><span class="home-title-word">PROGETTO<span class="asterisk" aria-hidden="true">✳</span></span><span class="title-note">UX, UI, business<br>e fattibilità.</span></span>
          <span class="title-row title-row-two"><span>ESPERIENZE</span></span>
          <span class="title-row title-row-three"><span>DIGITALI</span></span>
        </h1>
        <div class="hero-bottom">
          <div class="hero-intro">
            <p>Sono Gabriele Ciuffi, Product Designer. Organizzo contenuti e percorsi, progetto interfacce e uso il front-end per trasformarle in esperienze funzionanti.</p>
            <a class="action-button action-button--secondary" href="profilo.html">Scopri il mio profilo ↗</a>
            <a class="action-button action-button--secondary" href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
          </div>
          <a class="round-link magnetic" href="lavori.html" aria-label="Apri tutti i progetti"><span>Lavori</span><b>↗</b></a>
        </div>
        <div class="services-ticker" aria-label="Servizi principali"><span>Product & UX</span><span>UI & Design system</span><span>Prototipi & Front-end</span></div>

        <div class="marquee" aria-hidden="true">
          <div>
            <span>DESIGN CHE RISOLVE</span><i>✳</i>
            <span>PRODOTTI REALIZZABILI</span><i>✳</i>
            <span>DESIGN CHE RISOLVE</span><i>✳</i>
            <span>PRODOTTI REALIZZABILI</span><i>✳</i>
          </div>
        </div>
      </section>

      <section class="intro-slice" id="work">
        <p class="eyebrow">01 / Progetti selezionati</p>
        <h2>Problemi complessi.<br>Percorsi chiari.</h2>
        <a class="project-glimpse" href="lavori/leone.html">
          <div class="glimpse-copy">
            <span>01 / Sito corporate · Online</span>
            <h3>Leone<br>S.p.A</h3>
          <p>Prodotti, formazione e servizi in un’unica architettura.</p>
          </div>
          <div class="interface-card interface-card-screen">
            <img src="assets/images/leone/homepage-full-wide.jpg" width="1920" height="4389" alt="Home dell’ecosistema digitale Leone" loading="lazy">
          </div>
        </a>

        <div class="project-list">
          ${PROJECT_ORDER.slice(1).map(({ slug }) => {
            const project = window.CASE_STUDIES.find((item) => item.slug === slug);
            return `<a class="project-row" href="${PROJECT_FILES[slug]}" style="--project-hover:${project.hoverColor}" data-reveal>
              <span class="project-index">${project.number}</span>
              <div><h3>${project.title}</h3><p>${project.status} · ${project.summary}</p></div>
              <div class="project-art project-art-screen" aria-hidden="true"><img src="${project.screenshot}" alt="" loading="lazy" width="1400" height="950"></div>
              <b>Apri il progetto ↗</b>
            </a>`;
          }).join("")}
        </div>
        <a class="all-work-link action-button action-button--primary" href="lavori.html">Esplora i cinque progetti <span>↗</span></a>
      </section>

      <section class="numbers" aria-label="Esperienza in numeri">
        <div data-reveal><span>04</span><p>Anni di esperienza<br>nel digitale</p></div>
        <div data-reveal><span>10+</span><p>Siti progettati<br>e sviluppati</p></div>
        <div data-reveal><span>15+</span><p>Landing page<br>per brand globali</p></div>
        <div data-reveal><span>8K</span><p>Prodotti gestiti<br>in un ecosistema</p></div>
      </section>

      <section class="services" id="services">
        <div class="section-label">
          <span>02 / Approccio</span>
          <span>Dai requisiti all’interfaccia</span>
        </div>
        <div class="services-heading" data-reveal>
          <p>Persone, obiettivi e vincoli prima delle schermate.</p>
          <h2>Metto a fuoco il problema, organizzo i percorsi e progetto come funzionano.</h2>
        </div>

        <div class="service-list">
          <article data-reveal>
            <span>01</span><h3>Architettura & UX</h3>
            <p>Chiarisco chi userà il prodotto, quali compiti deve svolgere e quali informazioni servono. Da qui definisco priorità, struttura e percorsi.</p>
            <ul>
              <li>Analisi dei requisiti</li><li>Information architecture</li>
              <li>User flow & wireframe</li><li>Prototyping</li>
            </ul>
          </article>
          <article data-reveal>
            <span>02</span><h3>UI & Visual Design</h3>
            <p>Traduco i percorsi in schermate leggibili. Definisco gerarchie, componenti e stati, considerando accessibilità e comportamento sui diversi schermi.</p>
            <ul>
              <li>Interfacce & design system</li><li>Componenti & stati</li>
              <li>Tipografia & accessibilità</li><li>Microinterazioni</li>
            </ul>
          </article>
          <article data-reveal>
            <span>03</span><h3>Prototipi & Front-end</h3>
            <p>Porto le interfacce nel browser per provare le interazioni e valutarne la fattibilità. Implemento il front-end o collaboro con chi segue lo sviluppo.</p>
            <ul>
              <li>HTML, CSS & JavaScript</li><li>Prototipi funzionanti</li>
              <li>Implementazione frontend</li><li>Responsive & performance</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="process" id="processo" aria-labelledby="process-title">
        <div class="process-orbit" aria-hidden="true">
          <span>BRIEF</span><i>→</i><span>DESIGN</span><i>→</i><span>BUILD</span><i>→</i>
        </div>
        <div class="process-content">
          <p class="eyebrow">Come affronto un progetto</p>
          <h2 id="process-title" data-reveal>Capisco.<br>Strutturo.<br>Progetto.<br>Realizzo.</h2>
          <div class="process-steps">
            <div data-reveal><span>01</span><h3>Capisco</h3><p>Raccolgo obiettivi, contenuti disponibili e vincoli. Distinguo ciò che sappiamo dalle domande ancora da approfondire.</p></div>
            <div data-reveal><span>02</span><h3>Strutturo</h3><p>Organizzo le informazioni e i passaggi necessari per svolgere il compito. Definisco struttura, priorità e flussi.</p></div>
            <div data-reveal><span>03</span><h3>Progetto</h3><p>Disegno schermate, componenti e stati. Uso i prototipi per verificare la sequenza delle interazioni.</p></div>
            <div data-reveal><span>04</span><h3>Realizzo</h3><p>Implemento o affianco lo sviluppo. Verifico il comportamento nel browser e uso feedback e dati disponibili per le revisioni.</p></div>
          </div>
        </div>
      </section>

      <section class="portfolio-note" aria-labelledby="portfolio-note-title">
        <div class="section-label"><span>03 / Il metodo in pratica</span><span>Leone · Sito corporate</span></div>
        <div class="portfolio-note-copy">
          <p class="eyebrow">Dai compiti delle persone alle scelte d’interfaccia</p>
          <h2 id="portfolio-note-title">Cercare un prodotto e scegliere un corso richiedono percorsi diversi.</h2>
          <p>Nel sito Leone ho distinto prodotti, formazione e servizi, mantenendo navigazione e componenti condivisi. Il progetto racconta come queste scelte hanno preso forma nell’architettura e nelle pagine.</p>
          <a class="text-link action-button action-button--primary" href="lavori/leone.html#project-section-2">Leggi le scelte di progetto per Leone <span>↗</span></a>
        </div>
      </section>

      <section class="about" id="about">
        <div class="about-sidebar">
          <p class="eyebrow">04 / Chi sono</p>
          <div class="portrait-mark" aria-hidden="true"><span>GC</span><i>Firenze<br>2000</i></div>
        </div>
        <div class="about-copy">
          <h2 data-reveal>Dal <em>graphic design</em> alla progettazione di prodotti digitali.</h2>
          <div class="about-columns">
            <p>Il mio percorso unisce formazione visiva, web design e progettazione UX/UI. Oggi lavoro su siti, servizi e strumenti digitali, dalla struttura dei contenuti alle interfacce.</p>
            <p>Nel profilo trovi le esperienze in azienda, le collaborazioni e le competenze che porto nei progetti.</p>
          </div>
          <a class="text-link action-button action-button--secondary" href="profilo.html">Percorso e competenze <span>↗</span></a>
        </div>
      </section>

      <section class="contact" id="contact">
        <div class="contact-top"><span>05 / Contatti</span><span>Firenze · Disponibile per nuove opportunità</span></div>
        <h2>
          <span>PARLIAMONE</span>
          <a href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer" aria-label="Apri il profilo LinkedIn di Gabriele Ciuffi">↗</a>
        </h2>
        <div class="contact-bottom">
          <p>Cerchi un Product Designer con competenze UX/UI e una solida capacità front-end? Sono interessato a opportunità in cui progettare percorsi e interfacce utili, lavorando a stretto contatto con prodotto e sviluppo.</p>
          <div>
            <a href="#top">Torna su ↑</a>
            <a href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer">Scrivimi su LinkedIn ↗</a>
            <a href="cv/Gabriele_Ciuffi.svg" download>CV ↓</a>
            <!-- TODO: aggiungere l’email quando sarà disponibile. -->
          </div>
        </div>
        <footer>
          <span>© ${year} Gabriele Ciuffi</span>
          <span>Product Designer</span>
          <span>Firenze, Italia</span>
        </footer>
      </section>
    </main>
  `;
}

function profilePage() {
  const skills = [
    ["Architettura & UX", "Analisi dei requisiti, architettura informativa, flussi, wireframe e prototipi."],
    ["Interfacce & sistemi", "Gerarchie visive, componenti, varianti, stati, accessibilità e interfacce responsive."],
    ["Prototipi & front-end", "HTML, CSS, JavaScript, GSAP / ScrollTrigger, Swiper, performance e implementazione nel browser."],
    ["Dati & collaborazione", "GA4 / GTM, eventi personalizzati, Git e collaborazione con backend e referenti dei contenuti."],
  ];

  return `
    <main class="profile-page" id="main-content">
      ${header()}
      <section class="profile-hero brand-scene brand-scene--hero" data-hero-motion>
        <div class="profile-hero-title-row"><h1>Gabriele Ciuffi.<br><span>Product <em class="brand-emphasis">Designer.</em></span></h1><button class="profile-hero-mark hero-motion-mark" type="button" data-motion-toggle aria-label="Metti in pausa l’animazione" aria-pressed="false" title="Metti in pausa l’animazione"><span class="hero-motion-asterisk" aria-hidden="true">✳</span></button></div>
        <div class="profile-hero-bottom"><p>Dalla formazione in graphic design al lavoro su siti, servizi e strumenti digitali. Unisco progettazione UX/UI e front-end per seguire le interfacce dalla struttura alla realizzazione.</p><a class="action-button action-button--secondary" href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a></div>
      </section>

      <section class="profile-principles brand-scene brand-scene--band">
        <article><span>01 / Percorso</span><h2>Dalla grafica al prodotto digitale.</h2><p>Il percorso tra web design, UX/UI e front-end mi ha portato a progettare sistemi, non soltanto singole schermate.</p></article>
        <article><span>02 / Ambiti</span><h2>Siti, servizi e strumenti di lavoro.</h2><p>Ho lavorato su ecosistemi aziendali B2B, aree riservate, dashboard e pagine di campagna, con compiti e contenuti differenti.</p></article>
        <article><span>03 / Collaborazione</span><h2>Un collegamento tra design e sviluppo.</h2><p>La competenza front-end mi permette di costruire prototipi, valutare la fattibilità e confrontarmi con chi segue backend e integrazioni.</p></article>
      </section>

      <section class="profile-cv" aria-labelledby="profile-experience-title">
        <div class="profile-cv-intro">
          <p>CV / Esperienza</p>
          <h2 id="profile-experience-title">Quattro anni tra <em class="brand-emphasis">design</em> e sviluppo.</h2>
          <p class="profile-cv-summary">In Leone mi occupo dell’ecosistema digitale aziendale. In precedenza ho collaborato con Noé Multimedia su progetti per Eli Lilly e seguito siti e identità visive per aziende e professionisti.</p>
          <a class="action-button action-button--secondary" href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
        </div>
        <div class="profile-facts">
          <span>04 anni di esperienza</span>
          <span>Product, UX, UI e design system</span>
          <span>Prototipazione front-end e collaborazione con lo sviluppo</span>
        </div>
        <div class="experience-list">
          <article>
            <span>Attuale</span>
            <div>
              <h3>Leone S.p.A — Digital Product Designer</h3>
              <p>Architettura informativa, UX, UI, design system, responsive e front-end per l’ecosistema aziendale, in collaborazione con marketing, contenuti, proprietà e backend.</p>
              <a class="action-button action-button--secondary" href="lavori/leone.html">Esplora il progetto ↗</a>
            </div>
          </article>
          <article>
            <span>Precedente / 4 mesi</span>
            <div>
              <h3>Noé Multimedia — Digital Designer</h3>
              <p>Collaborazione di quattro mesi su progetti digitali per Eli Lilly: landing, companion app e contenuti in un contesto strutturato, regolato e coperto da riservatezza.</p>
            </div>
          </article>
          <article>
            <span>Pregresse</span>
            <div>
              <h3>Collaborazioni indipendenti</h3>
              <p>Siti web e identità visive per aziende e professionisti, seguendo struttura, impianto visivo, pagine responsive e materiali coordinati.</p>
            </div>
          </article>
        </div>
      </section>

      <section class="profile-skills-section brand-scene brand-scene--dark" aria-labelledby="profile-skills-title">
        <div class="profile-skills-heading"><p>Competenze / Strumenti</p><h2 id="profile-skills-title">Dalla struttura<br>all’<em class="brand-emphasis">interfaccia.</em></h2><span aria-hidden="true">✳</span></div>
        <div class="profile-skills">${skills.map(([title, text]) => `<div><h3>${title}</h3><p>${text}</p></div>`).join("")}</div>
      </section>

      <section class="profile-contact brand-scene brand-scene--contact">
        <p>Product Designer — UX/UI & Front-end</p>
        <h2>PARLIAMO DEL<br>PROSSIMO <em class="brand-emphasis">prodotto.</em></h2>
        <a class="action-button action-button--primary" href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer">Parliamone su LinkedIn ↗</a>
        <a class="action-button action-button--secondary" href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
        <!-- TODO: aggiungere l’email quando sarà disponibile. -->
      </section>
      ${footer()}
    </main>
  `;
}

function workPreview(project) {
  return `<img src="${project.screenshot}" alt="" loading="lazy" width="1400" height="950">`;
}

function workPage() {
  const projects = PROJECT_ORDER
    .map(({ slug }) => window.CASE_STUDIES.find((project) => project.slug === slug))
    .filter(Boolean);
  const projectRows = (items) => items.map((project) => `
          <a href="${PROJECT_FILES[project.slug]}" class="work-row work-row-${project.theme}" style="--project-hover:${project.hoverColor}">
            <span>${project.number}</span>
            <div class="work-row-copy">
              <h2>${project.title}</h2>
              <p>${project.year ? `${project.year} · ` : ""}${project.sector} · ${project.role}</p>
              <p class="work-row-summary">${project.summary}</p>
              <p class="work-project-status">${project.status}</p>
              <ul aria-label="Competenze del progetto">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
            </div>
            <div class="work-row-preview" aria-hidden="true">${workPreview(project)}</div>
            <b>Esplora il progetto ↗</b>
          </a>
        `).join("");

  return `
    <main class="work-index" id="main-content">
      ${header()}
      <section class="work-index-hero brand-scene brand-scene--hero" data-hero-motion>
        <div class="work-hero-title-row"><h1>Siti, servizi e<br>strumenti <span><em class="brand-emphasis">digitali.</em></span></h1><button class="work-hero-mark hero-motion-mark" type="button" data-motion-toggle aria-label="Metti in pausa l’animazione" aria-pressed="false" title="Metti in pausa l’animazione"><span class="hero-motion-asterisk" aria-hidden="true">✳</span></button></div>
        <div class="work-hero-bottom"><p class="work-index-description">Cinque progetti tra siti corporate, aree riservate, dashboard e campagne. Per ciascuno, il problema di partenza, le scelte progettuali e il mio contributo.</p><a class="work-hero-scroll" href="#progetti" aria-label="Esplora i progetti selezionati"><span>Esplora <br>i lavori</span><b aria-hidden="true">↓</b></a></div>
      </section>
      <section class="work-index-list" id="progetti">
        <div class="work-group-label">Product Design / UX/UI</div>
        ${projectRows(projects.filter((project) => CORE_PROJECTS.includes(project.slug)))}
        ${projectRows(projects.filter((project) => !CORE_PROJECTS.includes(project.slug)))}
      </section>
      ${footer()}
    </main>
  `;
}

function analyticsVisual() {
  const heights = [28, 54, 42, 78, 65, 91, 74, 100, 83, 116, 98, 132];
  return `
    <div class="analytics-ui">
      <div class="analytics-bar"><b>LOCAL / ANALYTICS</b><span>LAST 30 DAYS⌄</span></div>
      <div class="analytics-grid">
        <div><span>SESSIONI</span><strong>06</strong><i>+20%</i></div>
        <div><span>CTA ENGAGEMENT</span><strong>16.7%</strong><i>↑</i></div>
        <div><span>CONVERSIONI</span><strong>00</strong><i>—</i></div>
      </div>
      <div class="analytics-chart">${heights.map((height) => `<i style="height:${height}px"></i>`).join("")}</div>
      <div class="analytics-funnel"><span>VIEW 100%</span><span>SCROLL 50 — 20%</span><span>CLICK CTA — 20%</span></div>
    </div>
  `;
}

function projectVisual(project) {
  if (project.slug === "leone") {
    return `<figure class="project-screenshot project-homepage"><div class="project-homepage-scroll" role="region" tabindex="0" aria-label="Home page completa di Leone, scorri per esplorarla" aria-describedby="leone-preview-caption"><img src="assets/images/leone/homepage-full-wide.jpg" alt="Home page completa di Leone con Leaf Expander nella hero, soluzioni cliniche, azienda, ricerca, novità e footer" width="1920" height="4389"></div><figcaption id="leone-preview-caption">Leone.it · Home page completa <span>Scorri nell’anteprima ↓</span></figcaption></figure>`;
  }
  if (project.screenshot) {
    return `<figure class="project-screenshot"><button class="showcase-preview project-screenshot-button" type="button" data-modal-src="${project.screenshot}" data-modal-alt="${project.screenshotAlt}" aria-label="Ingrandisci la schermata di ${project.title}"><img src="${project.screenshot}" alt="${project.screenshotAlt}" width="1400" height="950"><span aria-hidden="true">Ingrandisci schermata ↗</span></button><figcaption>${project.screenshotCaption}</figcaption></figure>`;
  }
  if (project.theme === "analytics") return `<div><p>Visualizzazione illustrativa · Dati dimostrativi</p>${analyticsVisual()}</div>`;

  if (["essenza", "poggio", "symposium"].includes(project.theme)) {
    return `<div class="leone-browser"><div class="browser-bar"><b>${project.title}</b><span>SCHEMA DEL PERCORSO · NON SCREENSHOT</span></div><div class="browser-copy"><small>${project.sector}</small><strong>${project.previewLabel}</strong><p>${project.journey}</p></div></div>`;
  }

  if (project.theme === "nda") {
    return `
      <div class="nda-visual">
        <div class="nda-tape">CONFIDENTIAL · CONFIDENTIAL · CONFIDENTIAL · CONFIDENTIAL</div>
        <strong>NDA</strong>
        <p>Il valore del lavoro può essere raccontato.<br>I materiali no.</p>
      </div>
    `;
  }

  if (project.theme === "lilly") {
    return `
      <a class="life-site-preview" href="${project.externalUrl}" target="_blank" rel="noreferrer" aria-label="Apri il sito pubblico The Life Button">
        <div class="site-preview-bar"><span>THE LIFE BUTTON / LIVE WEBSITE</span><span>web.mc.lilly.com ↗</span></div>
        <div class="life-site-canvas">
          <iframe src="${project.externalUrl}" title="Anteprima live del sito The Life Button" loading="lazy" referrerpolicy="no-referrer"></iframe>
          <img src="${LIFE_BUTTON_SCREENSHOT}" alt="Anteprima del sito pubblico The Life Button di Eli Lilly Italia" data-life-image>
        </div>
      </a>
    `;
  }

  if (project.theme === "event") {
    return `
      <div class="event-showcase">
        <figure class="showcase-frame showcase-landing">
          <figcaption><span>01 / Pagina finale</span><span>Apri alla massima risoluzione ↗</span></figcaption>
          <button class="showcase-preview" type="button" data-modal-src="assets/images/leone/event-landing.webp" data-modal-alt="Landing page completa per l’evento Lo stile italiano in implantologia" aria-label="Apri la landing page completa nella modale">
          <img src="assets/images/leone/event-landing.webp" width="730" height="2048" alt="Landing page completa per l’evento Lo stile italiano in implantologia">
            <span aria-hidden="true">Apri schermata completa ↗</span>
          </button>
        </figure>
      </div>
    `;
  }

  return `
    <div class="leone-browser">
      <div class="browser-bar"><b>LEONE / DIGITAL ECOSYSTEM</b><span>PRODUCT · CORPORATE · SERVICES</span></div>
      <div class="browser-copy">
        <small>ARCHITETTURA · UX/UI · FRONT-END</small>
        <strong>LEONE<br>DIGITAL</strong>
        <p>Un sistema progettato per collegare identità corporate, prodotti e servizi digitali.</p>
      </div>
      <div class="browser-orbit"><span>CASE STUDY / 2026</span></div>
    </div>
  `;
}

function caseMedia(project, sectionIndex, section) {
  if (section.media === "3design-public") {
    return `<figure class="case-media" data-case-reveal><figcaption><span>3DESIGN / PAGINA PUBBLICA</span><p>Il sito pubblico 3Design: l’intervento collegato al lavoro sull’area privata descritto sopra.</p></figcaption><button class="showcase-preview project-screenshot-button" type="button" data-modal-src="assets/images/projects/3design.jpg" data-modal-alt="Pagina pubblica del software 3Design" aria-label="Ingrandisci la pagina 3Design"><img src="assets/images/projects/3design.jpg" width="1265" height="720" alt="Pagina pubblica del software 3Design"><span aria-hidden="true">Ingrandisci schermata ↗</span></button></figure>`;
  }
  if (section.media === "leone-navigation") {
    return `
      <figure class="case-media case-media-map" data-case-reveal>
        <figcaption><span>ARCHITETTURA INFORMATIVA / FLOW MAP</span><p>Dalla home alle aree di prodotto, ai contenuti di supporto e al contatto con il referente.</p></figcaption>
        <button class="showcase-preview case-media-preview" type="button" data-modal-src="assets/images/leone/flow-map.webp" data-modal-alt="Mappa completa dei flussi di navigazione e dell’architettura informativa del sito Leone" aria-label="Apri la flow map nella modale">
          <img src="assets/images/leone/flow-map.webp" width="10703" height="4500" alt="Mappa completa dei flussi di navigazione e dell’architettura informativa del sito Leone">
          <span aria-hidden="true">Apri schermata completa ↗</span>
        </button>
      </figure>
    `;
  }

  if (project.theme === "event" && sectionIndex === 2) {
    return `
      <figure class="case-media case-media-event" data-case-reveal>
        <figcaption><span>02 / WIREFRAME INIZIALE</span><p>La struttura e la gerarchia definite prima dell’interfaccia finale.</p></figcaption>
        <button class="showcase-preview case-media-preview" type="button" data-modal-src="assets/images/leone/event-wireframe.webp" data-modal-alt="Wireframe disegnato a mano per la landing dell’evento clinico" aria-label="Apri il wireframe iniziale nella modale">
          <img src="assets/images/leone/event-wireframe.webp" width="1882" height="2000" alt="Wireframe disegnato a mano per la landing dell’evento clinico">
          <span aria-hidden="true">Apri schermata completa ↗</span>
        </button>
      </figure>
    `;
  }

  if (project.theme === "lilly" && sectionIndex === 1) {
    return `
      <figure class="case-media case-media-lilly" data-case-reveal>
        <figcaption><span>SITO PUBBLICO / THE LIFE BUTTON</span><p>La campagna vista nella sua esperienza digitale reale.</p></figcaption>
        <a class="life-site-full" href="${project.externalUrl}" target="_blank" rel="noreferrer">
          <div class="life-live-frame">
            <iframe src="${project.externalUrl}" title="Anteprima live del sito The Life Button" loading="lazy" referrerpolicy="no-referrer"></iframe>
            <img src="${LIFE_BUTTON_SCREENSHOT}" alt="Anteprima del sito pubblico The Life Button di Eli Lilly Italia" data-life-image>
          </div>
          <span>Apri il sito originale ↗</span>
        </a>
      </figure>
    `;
  }

  return "";
}

function caseSections(project) {
  return project.sections.map((section, index) => `
    <div class="case-section-block" id="project-section-${index + 1}">
      <section class="case-section" data-case-reveal>
        <div class="case-section-label">
          <span>${String(index + 1).padStart(2, "0")}</span><p>${section.label}</p>
        </div>
        <div class="case-section-content">
          <h2>${section.emphasis ? section.title.replace(section.emphasis, `<em class="brand-emphasis">${section.emphasis}</em>`) : section.title}</h2>
          <div class="case-body">${section.body.map((paragraph) => `<p>${paragraph}</p>`).join("")}</div>
          ${section.points ? `
            <div class="case-points">
              ${section.points.map((point) => `
                <article><span>${point.label}</span><h3>${point.title}</h3><p>${point.text}</p></article>
              `).join("")}
            </div>
          ` : ""}
        </div>
      </section>
      ${caseMedia(project, index, section)}
    </div>
  `).join("");
}

function casePage(slug) {
  const project = window.CASE_STUDIES.find((item) => item.slug === slug);
  if (!project) return `<main id="main-content"><h1>Progetto non disponibile</h1><p>La selezione dei lavori è stata aggiornata.</p><a href="lavori.html">Esplora i progetti selezionati</a></main>`;

  const projectIndex = PROJECT_ORDER.findIndex((item) => item.slug === project.slug);
  const previous = PROJECT_ORDER[(projectIndex - 1 + PROJECT_ORDER.length) % PROJECT_ORDER.length];
  const next = PROJECT_ORDER[(projectIndex + 1) % PROJECT_ORDER.length];

  return `
    <main class="case-page case-${project.theme}" id="main-content" style="--case-accent:${project.accent}">
      <div class="cursor" aria-hidden="true"></div>
      <div class="case-progress"></div>
      ${header()}

      <div class="project-editorial">
        <aside class="project-facts" aria-label="Informazioni sul progetto">
          <div><span class="project-label">${project.client === "Progetto personale" ? "Contesto" : "Cliente"}</span><p>${project.client}</p></div>
          <div><span class="project-label">Stato</span><p>${project.status}</p></div>
          <div><span class="project-label">Ambiti di lavoro</span><p>${project.category}</p><ul class="project-tags">${project.tags.map(tag => `<li>${tag}</li>`).join("")}</ul></div>
          <div><span class="project-label">Obiettivo</span><p>${project.summary}</p></div>
          <div class="project-role"><span class="project-label">Il mio ruolo</span><p>${project.responsibilities}</p></div>
          <div><span class="project-label">Team</span><p>${project.team}</p></div>
          ${project.year ? `<div><span class="project-label">Anno</span><p>${project.year}</p></div>` : ""}
          ${project.externalUrl ? `<a class="case-live-link action-button action-button--secondary" href="${project.externalUrl}" target="_blank" rel="noreferrer">Visita il sito online ↗</a>` : ""}
          <a class="project-back action-button action-button--primary" href="lavori.html">← Tutti i progetti</a>
        </aside>
        <div class="project-story">
          <section class="case-visual visual-${project.theme}" aria-label="Visuale di progetto per ${project.title}">${projectVisual(project)}</section>
          <header class="project-introduction brand-scene brand-scene--editorial" id="project-introduction"><p class="case-eyebrow">${project.eyebrow}</p><h1>${project.title}</h1><p>${project.summary}</p></header>
          <div class="case-sections">${caseSections(project)}</div>
          ${RELATED_PROJECTS[project.slug] ? `<section class="project-related brand-scene brand-scene--dark"><p class="project-label">Progetto collegato</p><h2><a href="${PROJECT_FILES[RELATED_PROJECTS[project.slug].slug]}">${RELATED_PROJECTS[project.slug].label} ↗</a></h2><p>${RELATED_PROJECTS[project.slug].text}</p></section>` : ""}
        </div>
        <nav class="project-index-nav" aria-label="Indice del progetto">
          <a href="${PROJECT_FILES[project.slug]}#project-introduction" aria-label="Vai all’introduzione">${project.screenshot ? `<img src="${project.screenshot}" alt="">` : ""}<span>Panoramica</span></a>
          ${project.sections.map((section, index) => `<a href="${PROJECT_FILES[project.slug]}#project-section-${index + 1}"><span class="project-index-number">${String(index + 1).padStart(2, "0")}</span><span>${section.label}</span></a>`).join("")}
        </nav>
      </div>

      <section class="case-next brand-scene brand-scene--dark">
        <div><span>Progetto precedente</span><a href="${PROJECT_FILES[previous.slug]}">← ${previous.title}</a></div>
        <div><span>Progetto successivo</span><a href="${PROJECT_FILES[next.slug]}">${next.title} →</a></div>
      </section>
      ${footer()}
      <div class="image-modal" role="dialog" aria-modal="true" aria-label="Visualizzatore immagine" hidden>
        <div class="image-modal-toolbar">
          <span>Anteprima ad alta risoluzione</span>
          <div>
            <button type="button" data-modal-zoom-out aria-label="Riduci zoom">−</button>
            <button type="button" data-modal-zoom-reset aria-label="Ripristina zoom">100%</button>
            <button type="button" data-modal-zoom-in aria-label="Aumenta zoom">+</button>
            <button type="button" data-modal-close>Chiudi ×</button>
          </div>
        </div>
        <div class="image-modal-stage">
          <img alt="">
        </div>
      </div>
    </main>
  `;
}

function initHeader() {
  const clock = document.querySelector("[data-clock]");
  const updateClock = () => {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Rome",
      timeZoneName: "short",
    }).format(new Date());
  };
  updateClock();
  window.setInterval(updateClock, 30_000);

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".nav");
  if (!menuButton || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Apri menu");
    menuButton.querySelector("span").textContent = "Menu";
  };

  menuButton.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
    menuButton.querySelector("span").textContent = open ? "Chiudi" : "Menu";
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
}

function initHeroMotion() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!reduced.matches) {
    document.querySelectorAll(".work-hero-title-row h1, .profile-hero-title-row h1, .work-hero-bottom, .profile-hero-bottom").forEach((element, index) => {
      element.classList.add("hero-enter");
      element.style.setProperty("--hero-enter-delay", `${index * 220}ms`);
      element.addEventListener("animationend", () => element.classList.remove("hero-enter"), { once: true });
    });
    reduced.addEventListener("change", (event) => {
      if (event.matches) document.querySelectorAll(".hero-enter").forEach((element) => element.classList.remove("hero-enter"));
    });
  }
  document.querySelectorAll("[data-hero-motion]").forEach((hero) => {
    const toggle = hero.querySelector("[data-motion-toggle]");
    if (!toggle) return;
    const syncPreference = () => { toggle.disabled = reduced.matches; };
    syncPreference();
    reduced.addEventListener("change", syncPreference);
    toggle.addEventListener("click", () => {
      const paused = hero.classList.toggle("is-motion-paused");
      toggle.setAttribute("aria-pressed", String(paused));
      toggle.setAttribute("aria-label", paused ? "Riprendi l’animazione" : "Metti in pausa l’animazione");
      toggle.title = paused ? "Riprendi l’animazione" : "Metti in pausa l’animazione";
    });
  });
}

function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
}

function initReveals() {
  const legacy = [...document.querySelectorAll("[data-reveal], [data-case-reveal]")];
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reveal = (element, immediate = false) => {
    if (immediate) element.classList.add("is-scroll-instant");
    element.classList.remove("is-scroll-pending");
    element.classList.add("is-visible");
  };
  if (!("IntersectionObserver" in window) || preference.matches) {
    legacy.forEach((element) => reveal(element));
    return;
  }

  const targets = new Set(legacy);
  const register = (selector, effect) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (element.hasAttribute("data-reveal")) return;
      element.dataset.scrollReveal = effect;
      if (element.getBoundingClientRect().top >= window.innerHeight * .92) {
        element.classList.add("is-scroll-pending");
      }
      targets.add(element);
    });
  };
  register(".intro-slice > h2, .portfolio-note-copy > h2, .work-row-copy, .profile-principles article, .profile-cv-intro h2, .profile-skills-heading h2, .profile-skills > div, .experience-list article > div, .project-introduction h1, .case-section-content h2, .project-related", "rise");
  register(".project-glimpse, .work-row-preview, .profile-cv-summary, .profile-facts, .profile-contact h2, .case-body, .case-media, .case-next > div", "fade");
  register(".case-section-label", "line");
  document.querySelectorAll(".profile-principles, .profile-skills").forEach((group) => {
    [...group.children].forEach((element, index) => {
      element.style.setProperty("--scroll-delay", `${Math.min(index * 100, 300)}ms`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
  targets.forEach((element) => observer.observe(element));

  // Keyboard navigation never lands on an invisible action or preview.
  document.addEventListener("focusin", (event) => {
    const parent = event.target.closest("[data-scroll-reveal]");
    if (parent) { reveal(parent, true); observer.unobserve(parent); }
    event.target.querySelectorAll("[data-scroll-reveal]").forEach((element) => {
      reveal(element, true);
      observer.unobserve(element);
    });
  });
  preference.addEventListener("change", (event) => {
    if (!event.matches) return;
    targets.forEach((element) => reveal(element));
    observer.disconnect();
  });
}

function initCaseProgress() {
  const progress = document.querySelector(".case-progress");
  if (!progress) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${value})`;
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initLifeButtonFallbacks() {
  document.querySelectorAll("[data-life-image]").forEach((image) => {
    image.addEventListener("error", () => {
      image.style.display = "none";
    });
  });
}

function initImageModal() {
  const modal = document.querySelector(".image-modal");
  if (!modal) return;

  const image = modal.querySelector(".image-modal-stage img");
  const stage = modal.querySelector(".image-modal-stage");
  const resetButton = modal.querySelector("[data-modal-zoom-reset]");
  const focusableSelector = "button, [href], [tabindex]:not([tabindex='-1'])";
  let zoom = 1;
  let lastTrigger = null;

  const closeModal = () => {
    modal.hidden = true;
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
    image.removeAttribute("src");
    lastTrigger?.focus();
  };

  const openModal = () => {
    document.body.classList.add("modal-open");
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.querySelector("[data-modal-close]").focus();
  };

  const setZoom = (value) => {
    zoom = Math.min(3, Math.max(.5, value));
    image.style.width = `${zoom * 100}%`;
    resetButton.textContent = `${Math.round(zoom * 100)}%`;
  };

  document.querySelectorAll("[data-modal-src]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lastTrigger = trigger;
      image.src = trigger.dataset.modalSrc;
      image.alt = trigger.dataset.modalAlt || "";
      setZoom(1);
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
      openModal();
    });
  });

  modal.querySelector("[data-modal-close]").addEventListener("click", closeModal);
  modal.querySelector("[data-modal-zoom-in]").addEventListener("click", () => setZoom(zoom + .25));
  modal.querySelector("[data-modal-zoom-out]").addEventListener("click", () => setZoom(zoom - .25));
  resetButton.addEventListener("click", () => setZoom(1));
  stage.addEventListener("click", (event) => {
    if (event.target === stage) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
    if (event.key === "Tab" && modal.classList.contains("is-open")) {
      const focusable = [...modal.querySelectorAll(focusableSelector)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

function render() {
  const app = document.querySelector("#app");
  const page = document.body.dataset.page;
  if (!app) return;

  if (page === "home") app.innerHTML = homePage();
  else if (page === "profile") app.innerHTML = profilePage();
  else if (page === "work") app.innerHTML = workPage();
  else app.innerHTML = casePage(document.body.dataset.case);

  document.querySelectorAll("img").forEach((image, index) => {
    image.decoding = "async";
    if (index > 0 && !image.hasAttribute("loading")) image.loading = "lazy";
  });

  initHeader();
  initHeroMotion();
  initCursor();
  initReveals();
  initCaseProgress();
  initLifeButtonFallbacks();
  initImageModal();
}

render();
