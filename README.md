# Gabriele Ciuffi Portfolio — versione vanilla

Portfolio statico realizzato esclusivamente con HTML, CSS e JavaScript.

## Struttura

```text
.
├── index.html
├── lavori.html
├── profilo.html
├── lavori/
│   ├── leone.html
│   ├── evento-leone.html
│   ├── analytics.html
│   ├── lilly.html
│   └── the-life-button.html
└── assets/
    ├── css/
    │   ├── base.css
    │   ├── responsive.css
    │   └── pages/
    │       ├── home.css
    │       ├── work.css
    │       ├── profile.css
    │       └── case-study.css
    ├── fonts/
    ├── images/
    └── js/
```

Le pagine principali restano nella root. I case study sono raccolti nella
cartella `lavori/`; gli asset condivisi rimangono centralizzati in `assets/`.

I CSS sono separati per responsabilità: ogni pagina carica `base.css`, il
proprio foglio specifico e infine `responsive.css`.

## Avvio locale

Non sono necessari Node, npm o una build. È sufficiente aprire `index.html` nel browser oppure avviare un server statico:

```bash
python3 -m http.server 8000
```

Poi aprire `http://localhost:8000`.

## Pubblicazione su GitHub Pages

Caricare tutti i file nella root del repository e attivare GitHub Pages dalla branch principale.
