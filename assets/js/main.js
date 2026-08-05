const PROJECT_FILES = {
  leone: "lavori/leone.html",
  "leone-event": "lavori/evento-leone.html",
  analytics: "lavori/analytics.html",
  lilly: "lavori/lilly.html",
  "life-button": "lavori/the-life-button.html",
};

const PROJECT_ORDER = [
  { slug: "leone", title: "Leone S.p.A" },
  { slug: "analytics", title: "Local Analytics" },
  { slug: "life-button", title: "The Life Button" },
  { slug: "leone-event", title: "Evento clinico" },
  { slug: "lilly", title: "Eli Lilly — NDA" },
];

const LIFE_BUTTON_SCREENSHOT =
  "https://s.wordpress.com/mshots/v1/https%3A%2F%2Fweb.mc.lilly.com%2FThe_Life_Button.html?w=2000";

const year = new Date().getFullYear();

function header(home = false) {
  const currentPage = document.body.dataset.page;
  const isWork = currentPage === "work" || currentPage === "case";
  const isProfile = currentPage === "profile";

  return `
    <a class="skip-link" href="#main-content">Vai al contenuto</a>
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
        <a href="${home ? "#services" : "index.html#services"}">Servizi</a>
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
        <div class="hero-kicker reveal-line">
          <span>Digital Product Designer — Firenze</span>
          <span class="availability"><i></i>Disponibile per progetti selezionati</span>
        </div>

        <h1 class="hero-title" aria-label="Progetto prodotti digitali chiari, utili e concretamente realizzabili">
          <span class="title-row title-row-one">
            <span>PROGETTO</span>
            <span class="title-note">UX, UI, business<br>e fattibilità.</span>
          </span>
          <span class="title-row title-row-two">
            <span class="asterisk" aria-hidden="true">✳</span>
            <span>ESPERIENZE</span>
          </span>
          <span class="title-row title-row-three">
            <span>DIGITALI</span>
            <a class="round-link magnetic" href="lavori.html" aria-label="Apri tutti i progetti">
              <span>Lavori</span><b>↗</b>
            </a>
          </span>
        </h1>

        <div class="hero-bottom">
          <div class="hero-intro">
            <p>Lavoro tra UX, UI e front-end per progettare siti, piattaforme e strumenti digitali che tengano insieme persone, obiettivi di business e fattibilità.</p>
            <small>La tecnologia è parte del mio processo, ma il punto di partenza resta sempre il problema da risolvere.</small>
            <a href="profilo.html">Scopri il mio profilo ↗</a>
            <a href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
          </div>
          <div class="services-ticker" aria-label="Servizi principali">
            <span>Product & UX<b>↗</b></span>
            <span>UI & Design system<b>↗</b></span>
            <span>Design to front-end</span>
          </div>
        </div>

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
        <p class="eyebrow">Selezione lavori / Progetti reali</p>
        <h2>Dal problema al prodotto.<br>Con responsabilità chiare.</h2>
        <a class="project-glimpse" href="lavori/leone.html">
          <div class="glimpse-copy">
            <span>01 / Digital ecosystem</span>
            <h3>Leone<br>S.p.A</h3>
            <p>Product Design · UX/UI · Front-end</p>
          </div>
          <div class="interface-card">
            <div class="interface-top"><span>LEONE</span><span>DIGITAL ECOSYSTEM / 2026</span></div>
            <div class="interface-word">LEONE<br>DIGITAL</div>
            <div class="interface-pill">APRI IL CASE STUDY ↗</div>
          </div>
        </a>

        <div class="project-list">
          <a class="project-row" href="lavori/analytics.html" data-reveal>
            <span class="project-index">02</span>
            <div>
              <h3>Local Analytics</h3>
              <p>Product Design · Dashboard · Front-end</p>
            </div>
            <div class="project-art art-community" aria-hidden="true">
              <span>DATA</span><span>↗</span>
            </div>
            <b>Apri il case ↗</b>
          </a>
          <a class="project-row" href="lavori/the-life-button.html" data-reveal>
            <span class="project-index">03</span>
            <div>
              <h3>The Life Button</h3>
              <p>Campaign website · Front-end · Pharma</p>
            </div>
            <div class="project-art art-nda"><i>ELI LILLY ITALIA / AWARENESS</i></div>
            <b>Apri il case ↗</b>
          </a>
          <a class="project-row" href="lavori/evento-leone.html" data-reveal>
            <span class="project-index">04</span>
            <div>
              <h3>Evento clinico</h3>
              <p>Landing page · Product Design · Conversion</p>
            </div>
            <div class="project-art art-congress">
              <img src="assets/images/leone/event-landing.webp" width="730" height="2048" alt="Anteprima della landing per l’evento Lo stile italiano in implantologia">
            </div>
            <b>Apri il case ↗</b>
          </a>
        </div>
        <a class="all-work-link" href="lavori.html">Vedi l’archivio completo <span>↗</span></a>
      </section>

      <section class="numbers" aria-label="Esperienza in numeri">
        <div data-reveal><span>04</span><p>Anni di esperienza<br>nel digitale</p></div>
        <div data-reveal><span>10+</span><p>Siti progettati<br>e sviluppati</p></div>
        <div data-reveal><span>15+</span><p>Landing page<br>per brand globali</p></div>
        <div data-reveal><span>8K</span><p>Prodotti gestiti<br>in un ecosistema</p></div>
      </section>

      <section class="services" id="services">
        <div class="section-label">
          <span>02 / Cosa faccio</span>
          <span>Da sinistra a destra — e ritorno</span>
        </div>
        <div class="services-heading" data-reveal>
          <p>Non mi occupo soltanto dell’aspetto visivo.</p>
          <h2>Trasformo requisiti frammentati in prodotti coerenti e pronti per essere sviluppati.</h2>
        </div>

        <div class="service-list">
          <article data-reveal>
            <span>01</span><h3>Product & UX/UI</h3>
            <p>Definisco architetture, priorità, percorsi e interazioni a partire da persone, contenuti e obiettivi del prodotto.</p>
            <ul>
              <li>Analisi dei requisiti</li><li>Information architecture</li>
              <li>User flow & wireframe</li><li>Prototyping</li>
            </ul>
          </article>
          <article data-reveal>
            <span>02</span><h3>UI & Visual Design</h3>
            <p>Costruisco interfacce leggibili e sistemi coerenti, curando gerarchia, componenti, accessibilità e comportamento responsive.</p>
            <ul>
              <li>Interfacce & design system</li><li>Componenti & stati</li>
              <li>Tipografia & accessibilità</li><li>Microinterazioni</li>
            </ul>
          </article>
          <article data-reveal>
            <span>03</span><h3>Design to Front-end</h3>
            <p>Conosco il codice abbastanza da progettare meglio, verificare la fattibilità e ridurre la distanza tra mockup e prodotto finale.</p>
            <ul>
              <li>HTML, CSS & JavaScript</li><li>Prototipi funzionanti</li>
              <li>Collaborazione con backend</li><li>Handoff tecnico</li>
            </ul>
          </article>
        </div>
      </section>

      <section class="process">
        <div class="process-orbit" aria-hidden="true">
          <span>BRIEF</span><i>→</i><span>DESIGN</span><i>→</i><span>BUILD</span><i>→</i>
        </div>
        <div class="process-content">
          <p class="eyebrow">Un processo semplice, non semplicistico</p>
          <h2 data-reveal>Capisco.<br>Organizzo.<br>Progetto.<br>Porto a terra.</h2>
          <div class="process-steps">
            <div data-reveal><span>01</span><h3>Capisco</h3><p>Raccolgo obiettivi, contenuti, vincoli e necessità degli utenti.</p></div>
            <div data-reveal><span>02</span><h3>Organizzo</h3><p>Trasformo informazioni frammentate in strutture, priorità e percorsi comprensibili.</p></div>
            <div data-reveal><span>03</span><h3>Progetto</h3><p>Definisco UX, interfaccia, componenti e comportamento responsive.</p></div>
            <div data-reveal><span>04</span><h3>Porto a terra</h3><p>Collaboro con lo sviluppo o realizzo direttamente il front-end quando serve.</p></div>
          </div>
        </div>
      </section>

      <section class="about" id="about">
        <div class="about-sidebar">
          <p class="eyebrow">03 / Chi sono</p>
          <div class="portrait-mark" aria-hidden="true"><span>GC</span><i>Firenze<br>2000</i></div>
        </div>
        <div class="about-copy">
          <h2 data-reveal>Ho iniziato dal <em>graphic design.</em> Oggi progetto prodotti che devono avere senso anche quando vengono costruiti.</h2>
          <div class="about-columns">
            <p>Definisco architetture, flussi, gerarchie e interazioni, trasformando requisiti spesso frammentati in prodotti coerenti e pronti per essere sviluppati.</p>
            <p>Quando serve posso portarli nel front-end, mantenendo continuità tra progettazione e risultato finale. Lavoro vicino alla tecnologia, ma parto sempre dal problema, dalle persone e dagli obiettivi del prodotto.</p>
          </div>
          <a class="text-link" href="profilo.html">Profilo completo <span>↗</span></a>
        </div>
      </section>

      <section class="contact" id="contact">
        <div class="contact-top"><span>04 / Contatti</span><span>Firenze · Disponibile per nuove opportunità</span></div>
        <h2>
          <span>PARLIAMONE</span>
          <a href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer" aria-label="Contatta Gabriele su LinkedIn">↗</a>
        </h2>
        <div class="contact-bottom">
          <p>Cerchi un designer capace di collegare prodotto, interfaccia e fattibilità? Sono interessato a opportunità come Digital Product Designer, Product Designer e UX/UI Designer.</p>
          <div>
            <a href="#top">Torna su ↑</a>
            <a href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a href="cv/Gabriele_Ciuffi.svg" download>CV ↓</a>
            <!-- TODO: aggiungere l’email quando sarà disponibile. -->
          </div>
        </div>
        <footer>
          <span>© ${year} Gabriele Ciuffi</span>
          <span>Product × UX/UI × Front-end</span>
          <span>Firenze, Italia</span>
        </footer>
      </section>
    </main>
  `;
}

function profilePage() {
  const skills = [
    ["Product", "Requisiti, priorità, obiettivi, vincoli e fattibilità"],
    ["UX", "Architettura informativa, flussi, wireframe e prototipi"],
    ["UI", "Layout, tipografia, componenti, stati e accessibilità"],
    ["Front-end", "HTML, CSS, JavaScript e interfacce responsive"],
    ["Tool", "Figma, Adobe, Git, GitHub, analytics e collaborazione"],
  ];

  return `
    <main class="profile-page" id="main-content">
      ${header()}
      <section class="profile-hero">
        <p>Digital Product Designer — Firenze</p>
        <h1>CHIAREZZA.<br>STRUTTURA.<br><em>ESECUZIONE.</em></h1>
        <div>
          <span>Firenze, Italia</span>
          <p>Sono Gabriele Ciuffi, Digital Product Designer con una formazione visiva e un approccio concreto alla progettazione.</p>
        </div>
      </section>

      <section class="profile-principles">
        <article><span>01 / Percorso</span><h2>Dalla grafica al prodotto digitale.</h2><p>Il percorso tra web design, UX/UI e front-end mi ha portato a progettare sistemi, non soltanto singole schermate.</p></article>
        <article><span>02 / Approccio</span><h2>Persone, business, contenuti e fattibilità.</h2><p>Organizzo questi vincoli in flussi e gerarchie prima di definire la forma dell’interfaccia.</p></article>
        <article><span>03 / Tecnologia</span><h2>Uno strumento di progettazione.</h2><p>Conosco il front-end per capire i vincoli, prototipare e collaborare concretamente con chi sviluppa.</p></article>
      </section>

      <section class="profile-cv">
        <div class="profile-cv-intro">
          <p>CV / Esperienza</p>
          <h2>Quattro anni tra prodotto, interfaccia e fattibilità.</h2>
          <p>Lavoro su siti, landing e strumenti digitali partendo da problemi, flussi e decisioni di contenuto. Non progetto partendo dalla tecnologia: la uso per capire vincoli, prototipare rapidamente e far sì che il prodotto abbia senso anche quando viene costruito.</p>
          <a href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
        </div>
        <div class="profile-facts">
          <span>04 anni di esperienza</span>
          <span>Product, UX, UI e design system</span>
          <span>Design to front-end e collaborazione tecnica</span>
        </div>
        <div class="profile-skills">
          ${skills.map(([title, text]) => `<div><h3>${title}</h3><p>${text}</p></div>`).join("")}
        </div>
        <div class="experience-list">
          <article>
            <span>Attuale</span>
            <div>
              <h3>Leone S.p.A — Digital Product Designer</h3>
              <p>Architettura informativa, UX, UI, design system, responsive e front-end per l’ecosistema aziendale, in collaborazione con marketing, contenuti, proprietà e backend.</p>
              <a href="lavori/leone.html">Apri il case study ↗</a>
            </div>
          </article>
          <article>
            <span>Precedente / 4 mesi</span>
            <div>
              <h3>Noé Multimedia — Digital Designer</h3>
              <p>Collaborazione di quattro mesi su progetti digitali per Eli Lilly: landing, companion app e contenuti in un contesto strutturato, regolato e coperto da riservatezza.</p>
              <a href="lavori/lilly.html">Leggi l’esperienza ↗</a>
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

      <section class="profile-contact">
        <p>Digital Product Design · Product Design · UX/UI</p>
        <h2>PARLIAMO DEL<br>PROSSIMO PRODOTTO.</h2>
        <a href="https://www.linkedin.com/in/gabriele-ciuffi-9ba1b7250" target="_blank" rel="noreferrer">Parliamone su LinkedIn ↗</a>
        <a href="cv/Gabriele_Ciuffi.svg" download>Scarica il CV ↓</a>
        <!-- TODO: aggiungere l’email quando sarà disponibile. -->
      </section>
      ${footer()}
    </main>
  `;
}

function workPreview(project) {
  if (project.theme === "leone") {
    return `<span>LEONE<br>DIGITAL</span>`;
  }
  if (project.theme === "event") {
    return `<img src="assets/images/leone/event-landing.webp" width="730" height="2048" alt="">`;
  }
  if (project.theme === "analytics") {
    return `<span>DATA<br>TO DECISIONS</span>`;
  }
  if (project.theme === "nda") {
    return `<span>PRIVATE<br>BY DESIGN</span>`;
  }
  return `
    <span>THE LIFE<br>BUTTON</span>
    <img src="${LIFE_BUTTON_SCREENSHOT}" alt="" data-life-image>
  `;
}

function workPage() {
  return `
    <main class="work-index" id="main-content">
      ${header()}
      <section class="work-index-hero">
        <p>Archivio / Selected work</p>
        <h1>PROBLEMI REALI.<br>RESPONSABILITÀ CHIARE.</h1>
      </section>
      <section class="work-index-list">
        ${PROJECT_ORDER.map(({ slug }) => window.CASE_STUDIES.find((project) => project.slug === slug)).map((project) => `
          <a href="${PROJECT_FILES[project.slug]}" class="work-row work-row-${project.theme}">
            <span>${project.number}</span>
            <div class="work-row-copy">
              <h2>${project.title}</h2>
              <p>${project.year ? `${project.year} · ` : ""}${project.sector} · ${project.role}</p>
              <p class="work-row-summary">${project.summary}</p>
              <ul aria-label="Competenze del progetto">${project.tags.map((tag) => `<li>${tag}</li>`).join("")}</ul>
            </div>
            <div class="work-row-preview" aria-hidden="true">${workPreview(project)}</div>
            <b>Apri il case study ↗</b>
          </a>
        `).join("")}
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
  if (project.theme === "analytics") return analyticsVisual();

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

function caseMedia(project, sectionIndex) {
  if (project.theme === "leone" && sectionIndex === 2) {
    return `
      <figure class="case-media case-media-map" data-case-reveal>
        <figcaption><span>ARCHITETTURA INFORMATIVA / FLOW MAP</span><p>La struttura prima dell’interfaccia.</p></figcaption>
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
    <div class="case-section-block">
      <section class="case-section" data-case-reveal>
        <div class="case-section-label">
          <span>${String(index + 1).padStart(2, "0")}</span><p>${section.label}</p>
        </div>
        <div class="case-section-content">
          <h2>${section.title}</h2>
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
      ${caseMedia(project, index)}
    </div>
  `).join("");
}

function casePage(slug) {
  const project = window.CASE_STUDIES.find((item) => item.slug === slug);
  if (!project) return `<main><p>Progetto non trovato.</p></main>`;

  const projectIndex = PROJECT_ORDER.findIndex((item) => item.slug === project.slug);
  const previous = PROJECT_ORDER[(projectIndex - 1 + PROJECT_ORDER.length) % PROJECT_ORDER.length];
  const next = PROJECT_ORDER[(projectIndex + 1) % PROJECT_ORDER.length];

  return `
    <main class="case-page case-${project.theme}" id="main-content" style="--case-accent:${project.accent}">
      <div class="cursor" aria-hidden="true"></div>
      <div class="case-progress"></div>
      ${header()}

      <section class="case-hero">
        <p class="case-eyebrow">${project.eyebrow}</p>
        <h1>${project.title}</h1>
        <div class="case-hero-bottom">
          <p class="case-category">${project.category}</p>
          <p class="case-summary">${project.summary}</p>
          ${project.externalUrl ? `<a class="case-live-link" href="${project.externalUrl}" target="_blank" rel="noreferrer">Visita il sito ↗</a>` : ""}
          <span class="case-scroll">Scroll ↓</span>
        </div>
      </section>

      <section class="case-visual visual-${project.theme}" aria-label="Visuale di progetto per ${project.title}">
        ${projectVisual(project)}
      </section>

      <section class="case-meta">
        <div><span>Cliente</span><p>${project.client}</p></div>
        <div><span>Settore / Anno</span><p>${project.sector}${project.year ? `<br>${project.year}` : "<!-- TODO: contenuto da completare — anno del progetto. -->"}</p></div>
        <div><span>Ruolo</span><p>${project.role}</p></div>
        <div><span>Responsabilità dirette</span><p>${project.responsibilities}</p></div>
        <div><span>Team</span><p>${project.team}</p></div>
        <div><span>Collaborazioni</span><p>${project.collaborations}</p></div>
      </section>

      <div class="case-sections">${caseSections(project)}</div>

      <section class="case-next">
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

function initCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor || !window.matchMedia("(pointer: fine)").matches) return;
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
}

function initReveals() {
  const reveals = document.querySelectorAll("[data-reveal], [data-case-reveal]");
  if (!reveals.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    reveals.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  reveals.forEach((element) => observer.observe(element));
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
  initCursor();
  initReveals();
  initCaseProgress();
  initLifeButtonFallbacks();
  initImageModal();
}

render();
