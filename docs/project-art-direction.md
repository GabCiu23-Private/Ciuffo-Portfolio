# Project presentation

## Dark background refinement — 2026-11-16

User clarified that the supplied reference concerns the overall site background, not the project grid. Supersedes the home-only anthracite proposal: use a near-black #101010 canvas across home, work, profile and case studies, with paper text. Preserve project media, colored chapters and existing layout. Implemented in shared site-theme.css; exact reference color is a visual approximation. Browser verification remains pending because the browser access host is unavailable.

Source: https://backdoor-studio.com/progetti/galab

Selected by the user on 2026-11-05. Approved implementation (classification C): an editorial project gallery, persistent client/services/description column, central media and narrative, and a compact section index on desktop. Mobile has project information followed by the gallery in reading order. Preserve the portfolio’s Geist typography, paper/ink palette, shared navigation and existing image viewer. No copied third-party identity, branding or assets.

Leone is public at https://www.leone.it/. Its case study links to that website and can use its public project imagery. Existing interface capture remains identified as a project interface; do not claim it is a new live capture. Do not invent performance metrics or expand personal responsibility beyond UX/UI and frontend.

Leone opening preview now replaces the original capture with a full-page capture from the public home, Leaf hero selected, in a keyboard-focusable scroll region. Same width; 2:1 desktop frame, 4:3 mobile. Capture includes the public footer; remove only transient consent/access overlays for presentation.

Capture viewport corrected to 1920 × 1080: preserve the public desktop hero with readable copy to the left of the Leaf. Full capture: 1920 × 4389.

## Shared actions

User requested a consistent branded button pass on 2026-11-05. Action links share `assets/css/buttons.css`: primary actions use orange with deep ink text and invert to ink with paper text on hover; secondary actions use paper with an ink border and invert on hover. Keep utility navigation and project cards semantically distinct. Use visible keyboard outlines, at least 44px targets, short color transitions and reduced-motion support. Image-viewer labels and modal controls use the same palette. Project row hover uses lime and ink rather than unrelated per-project accent colors.

User correction: orange buttons must not switch to fluorescent lime on hover. Apply ink/paper hover to primary actions and image-viewer action labels.

## Work index hero and page rhythm

The user requested continuity with the homepage: full first-screen height including the shared header, while keeping the descriptive headline at the smaller approved size. The work hero uses a minimum height of the viewport minus the in-flow header (86px desktop, 70px mobile); longer content may expand naturally. Keep Geist uppercase typography, orange emphasis on “digitali”, the asterisk with a fine circular outline, and the orange-to-ink scroll action. On narrow screens the decorative mark stays separate from the text.

Continue the homepage palette through the work index: orange Leone, paper Essenza, ink Poggio, paper Analytics, a lime editorial transition for the event campaign, and ink Symposium. The campaign break explains the shift from product interfaces to communication, using the existing asterisk/orbit vocabulary. Project previews retain the approved short crop and remain visible on mobile. Hover preserves each chapter’s colors and signals the action through spacing and underlining; keyboard focus uses a contrasting inset outline.

Work hero motion: at the user’s request, the asterisk now turns at the homepage’s 12-second pace, with a slow 24-second orbit and a 6px vertical drift. Text remains static. A pause/resume control in the hero metadata governs all three animations. Reduced-motion preference removes the animations and hides the unnecessary pause control. Verified actual transform changes, pause/resume, reduced motion and mobile reflow.

## Profile

User requested the same visual system for the profile. Hero height matches the homepage including header; lead with Gabriele Ciuffi and Product Designer rather than abstract keywords. Use paper/ink typography with orange emphasis and the same restrained asterisk/orbit motion. Share animation styles in `assets/css/hero-motion.css` and the pause initializer across work/profile.

Narrative order: profile introduction, orange overview of background/fields/collaboration, paper career history with a lime facts strip, full-width ink skills section, then orange contact. Keep existing career facts and project responsibilities; no fabricated portrait, new achievements or metrics. Primary contact action uses ink/paper against the orange panel. Verified hero height, layout at 1440/768/390/320, pause/reduced motion, work-page motion after extraction, and internal destinations across eight pages.

## Site-wide graphic grammar

Homepage is the authoritative visual reference, as explicitly requested by the user. `assets/css/brand-graphics.css` shares its edge-cropped large circles, thin rules and orbit outlines across work/profile heroes, colored chapter transitions, profile skills/contact and case-study navigation. Decorative strokes stay behind text, clipped within intentional sections, and never overlay screenshots or the navigation map. Case-study section numbers receive circular markers and fine rules for reading order. Related-project callouts use the homepage's ink/paper treatment. These graphic backgrounds remain static; the existing hero animation retains its pause and reduced-motion behavior. Keep the approved editorial case-study grid and the established media placement.

Verified the seven inner pages at desktop, 390px and 320px, plus all internal destinations across eight pages. Inspected full-page desktop views of work/profile and case-study content/navigation screenshots.

Navigation: user requested a persistent navbar on every page. Shared header is sticky at the viewport top with a solid paper background, 86px desktop / 70px mobile. Anchor scroll padding and case-study sidebar offsets account for this height. Homepage hero now participates in the same in-flow header model, preserving the full first-screen height shared with work/profile. Verified sticky positioning on all eight pages at desktop/mobile and mobile menu anchor navigation.

User correction: remove the standalone event/campaign editorial interlude; the work index flows directly through all five projects. Reinstate background changes on hover and keyboard focus: orange Leone changes to ink/paper, and paper/ink project rows change to orange/deep ink. No orange-to-lime button transition.

Latest user clarification supersedes the brand-only project hover: restore the original distinct project colors (`hoverColor` in data) on work-index and homepage project rows: Leone blue, Essenza purple, Poggio green, Analytics ink, Symposium indigo. Use white text on these colored hover/focus states. Shared action-button colors remain unchanged.

Typography refinement requested by the user: share the homepage's selective Georgia italic as `.brand-emphasis`. Apply to “digitali” in work hero, “Designer” in profile hero, selected profile headings and one meaningful phrase per case study. Keep project names, navigation, metadata and body copy in Geist. Italics inherit the surrounding accessible text color; no additional typeface downloads. Verified all seven inner pages at desktop/390/320 and inspected work/profile heroes plus Leone architecture heading.

Acid color accents requested across the site: small hero metadata chips and orbital dots, the work list's existing category rule and project-status labels, profile overview labels/timeline markers, and case-study numbered markers/progress/navigation labels. The work hero scroll action starts acid, as on the homepage, and hovers to ink. Orange action buttons retain their orange-to-ink behavior; project rows retain their distinct project hover colors. Use dark text on acid fills and acid text only on ink surfaces. Verified seven inner pages at desktop, 390px and 320px.

Latest user refinement: reduce the acid accents and remove hero highlighter fills. Work “digitali” and profile “Designer” use colored italic text on paper, with a slightly deeper orange (#e04828) for readable large text. The rest of the heading stays ink. Remove added lime fills from metadata, status labels, overview labels and numbered section markers. Retain only small orbital dots and the work scroll action, alongside the pre-existing profile facts/skills accents. Verified inner-page reflow at desktop, 390px and 320px.

## Scroll motion

User requested scroll animation across pages. Extend the existing homepage IntersectionObserver: one-shot 600ms text rises (18px desktop / 12px mobile), quiet media/body fades, and 700ms section-rule expansion. Use brief 50ms stagger only for the profile's horizontally grouped overview/skills, disabled on mobile. Preserve hero rotation and project hover behavior; do not animate sticky navigation or the contents of the scrollable Leone home capture. CSS `translate` is independent of existing preview rotations. Pending visibility is applied only by initialized JS to offscreen content. Keyboard focus reveals affected content instantly; reduced-motion preference shows everything and disconnects observation, including preference changes during the session. No additional dependency or scroll interception.

Verified actual viewport-triggered reveals on all eight pages, reduced-motion changes, keyboard navigation and mobile layout.

Latest hero sizing instruction supersedes the compact inner-page type scale: home, work and profile now share `--hero-display-size`, including both responsive breakpoints. Work/profile titles use the full text width, with the animated graphic positioned clear of the larger text. Hero metadata, headline and supporting copy enter in a short 0/100/200ms sequence, completing at 900ms; entrance classes are removed after completion. Reduced motion bypasses entrances. Existing scroll entrances and orbital pause controls are preserved.

Work-index Leone starts orange with white text as requested in the supplied screenshot. Use a deeper orange (#d14123) for the white small text, keeping the blue project hover. Verified equal computed hero font sizes at 1440, 768, 390 and 320; no horizontal overflow; both hero entrance sequences and cleanup; white Leone text; and internal destinations across all eight pages.

Motion pacing correction: user found the entrances far too fast. Hero entry is now 1800ms with 220ms spacing; scroll entrances 1400ms, rules 1600ms and horizontal group stagger 100ms (max 300ms). Use the gentler cubic-bezier(.22,.61,.36,1). Match homepage entrances to these timings. Slow decorative star rotation to 20s, orbit to 36s and drift to 9s; homepage marquee to 28s. Keep hover and focus feedback responsive. Verified computed timings, completion cleanup and reduced-motion bypass.

User requested removal of the entire pre-title hero metadata band on every page. Remove home kicker/availability and work/profile label, numbering and toolbar rows. Preserve the main sticky navigation. Work/profile decorative asterisks now act as accessible pause/resume controls themselves, with no extra pause icon or bar; keep their button hit area stationary while the inner star/orbit rotate. Reduced-motion preference disables the control and stops motion. Hero content entrance now consists of headline and supporting content only.

Latest size refinement: reduce all active hero headlines by approximately 12%, preserving the shared scale for home/work/profile and their responsive breakpoints. Reduce case-study opening titles proportionally as well. No change to section headings, animation pace or hero heights. Verified all eight pages for desktop/mobile overflow and internal navigation.

Homepage height correction after headline reduction: make the hero a flex column; let its headline region grow and vertically center the three title rows, while supporting content and the marquee keep their natural heights at the bottom. The marquee now ends exactly at the hero's viewport boundary rather than leaving trailing blank space. Verified at 1920×1080, 1440×1000, 1440×900 and 390×844. Explicitly disable delayed title-row keyframes under reduced motion so the title is immediately visible.

User found the previous hero reduction insufficiently visible. Make a clearer further reduction: shared desktop scale clamp(44px,7.4vw,120px), tablet clamp(34px,10.2vw,68px), small mobile clamp(32px,10vw,54px). Preserve viewport-height heroes and the shared scale across home/work/profile. Bump base/responsive asset versions; verify computed font sizes in the browser rather than relying on source edits.

Home hero composition refinement: headline is exactly two text rows, “PROGETTO” and “SISTEMI DIGITALI”. Keep the animated asterisk with the first row, move the work CTA outside the heading, and group the paragraph/profile/CV actions directly below the title with a 24–28px inset. Center this title-and-introduction cluster within the available hero height; the services ticker and marquee remain at the bottom. Preserve the reduced shared headline size. Verified two rows and no horizontal overflow at 1920/1440/390/320 and inspected desktop/mobile screenshots.

Work/profile hero spacing correction: treat headline and supporting paragraph/actions as one vertically centered cluster, like home. Title row no longer expands to push the paragraph to the bottom. Use a 28px content gap, automatic outside margins to preserve full-screen hero height, and top-aligned actions. Move the small mobile orbital mark above the title cluster so it does not overlap the text. Verified a 28px paragraph gap and no horizontal overflow at 1440, 390 and 320px on both pages. Preserve the user's current headline-size token.

## Image-led project grid — 2026-11-16

User requested restructuring the work layout after supplying a gallery reference. Home selected work and work index share five image-led links: Leone spans two rows beside four smaller cards on desktop, two columns at intermediate widths and one column on mobile. Persistent titles, categories and explicit project actions sit on dark gradients; whole cards are links with visible keyboard focus. Existing project screenshots and case-study destinations are retained. Reduced motion removes image hover scaling. Verified JS syntax, five rendered cards and local image/link existence; visual desktop/mobile and interaction verification remain pending due to unavailable browser access.

User requested removing the service-title strip immediately after the home hero. Removed both the service ticker and scrolling slogan marquee from the hero markup; the project section follows directly.

Home hero refinement: user requested removing its CTAs and placing the title at the lower left. Removed profile/CV and circular work links. Kept introductory copy above the title; title uses automatic top space and bottom inset within the viewport-height hero. Source checked; browser verification pending.

## Motion refinement — 2026-11-16

Inspected existing CSS keyframes, hero controls, IntersectionObserver reveals, gallery hover and case progress code before editing. Reused native CSS/observer implementation with no dependencies. Hero entrances now take 850ms with 100ms stagger (previously 1800ms/220ms); scroll entrances use opacity/translate over 650ms desktop, 500ms mobile with 18/12px travel. Legacy reveal nodes join the same observer and are visible before initialization; only offscreen targets are gated. Gallery cards receive a one-shot fade on entering the viewport, while image hover retains its 1.025 scale with a 450ms easing and a small 180ms arrow response. Reduced motion shows static content, immediately reveals pending nodes and disconnects the observer when enabled during a session. Keyboard focus immediately reveals a card. Existing decorative rotations are retained. Case progress updates are coalesced to one animation frame and also respond to resize.

Verified JavaScript syntax and mocked observer scenarios: legacy/gallery targets, viewport entry, keyboard focus, reduced motion at load/runtime and missing IntersectionObserver. Browser connector remains unavailable; native browser inspection could not reliably reach the local site because the active browser changed during the attempt. Rendered timing, desktop/mobile visual checks and performance measurements remain unverified.

## Complete motion replacement — 2026-11-16

Explicit user correction supersedes the earlier refinement: remove existing animation and rebuild using gc-web-motion. Removed prior CSS keyframes/transitions, old reveal initialization, continuous rotating ornaments, custom pointer tracking and hero pause buttons. Retained static ornament shapes and functional menu transforms. New assets/js/motion.js owns native Web Animations sequences and IntersectionObserver triggers, without external dependencies.

| Sequence | Trigger and interval | Properties and purpose | Mobile / static fallback |
| --- | --- | --- | --- |
| Hero titles | Page load, 1050ms, 110ms between rows | Opacity .35→1 and translate 38px→0; finite editorial arrival | 650ms, 18px; reduced motion stays static |
| Supporting copy | Page load, 180ms delay / 700ms | Opacity .45→1 | Same; static under reduced motion |
| Hero ornament | Page load, 1200ms once | Rotate −70deg→0, scale .8→1; settles permanently | Static under reduced motion |
| Reading / gallery | First viewport entry, 720/900ms | Translate 24/34px→0 and opacity .5/.7→1 | 520ms, 14px; no hidden pending state |
| Project hover | Fine-pointer enter/leave, 650/380ms; arrow 220ms | Image scale 1→1.035 and arrow translate 3/−3px; interruptible | No touch hover; reduced motion cancels retained endpoints |
| Menu / controls | Interaction, 220/160ms | Menu transform, button color; no padding tween | Instant under reduced motion |

Focus cancels the containing entrance immediately. Preference changes cancel active animations and retained hover endpoints. Pagehide aborts listeners/disconnects observers/cancels scheduled progress; BFCache restores initialize cleanly. Native scrolling is instant; reading progress remains functional with one scheduled frame. Content is statically visible before motion initialization; the existing site's JS-rendered content architecture is unchanged.

Verification: syntax, CSS brace balance, script ordering and mocked motion execution passed (hero/scroll, reduced motion initial/runtime, disposal). Native Firefox rendered the home/contact after reload, but active user browser changes prevented reliable full motion inspection. Desktop/mobile timing, keyboard interaction, reduced-motion browser emulation and performance profiling remain unverified. No deployment.

Latest motion instruction: backgrounds remain stationary while text moves. Removed container/card/image/ornament animation. Entrances now target headings, paragraphs, numeric text and gallery captions only; hero words are separate from the static asterisk. Existing layout and native document scroll remain. Source syntax checked; visual verification pending.

User clarified motion must follow scrolling, not play on entry. Replaced finite entrances with paused native text timelines whose currentTime is derived from stationary section geometry on each scroll frame. Bidirectional linear text displacement: desktop hero 0→−110px, other text +64→−64px; mobile ±24px. No animated backgrounds/media. Reduced motion cancels timelines; keyboard focus stops a containing text timeline. Syntax checked; browser verification pending.

## Hero background video — 2026-11-16

Integrated Robert Grant's Abstract Black Liquid Motion Background, Pexels ID 29848606: https://www.pexels.com/video/abstract-black-liquid-motion-background-29848606/ . License checked at https://www.pexels.com/license/ (free use on websites; modification permitted). Source download: https://videos.pexels.com/video-files/29848606/12817774_3840_2160_30fps.mp4 . Local H.264 derivative: 1280px wide, 24fps, 60 seconds, no audio, faststart, 8.7MB; JPEG poster extracted locally. Hero video layer has a dark overlay and independent text scroll motion. Only assigns source when visible, motion is permitted and document visible. Pause/resume control, rejected play fallback, error poster and lifecycle cleanup included. Metadata and JS syntax checked; visual playback/mobile checks pending.

Native Firefox verification: hero video visible behind title/intro and control displays “Pausa video”, confirming playback started. Mobile, manual pause and reduced-motion browser checks remain pending.

Latest clarification: video is a fixed viewport backdrop for the entire homepage, not an hero-only layer. Moved backdrop/control outside main, made all direct home sections transparent and retained independent project imagery. Playback continues while scrolling home and pauses on document hide/reduced motion/user control. Verified in native Firefox: scrolling from hero into the project section keeps the video filling the viewport behind the heading and gallery. Mobile and pause/reduced-motion interaction remain unverified.

User explicitly requested removal of all visible video controls. Removed pause/resume markup, styling and listeners. Background playback keeps automatic reduced-motion, document visibility and error/poster handling.

User requested animations on both text and objects again. Extended scroll-driven native timelines to gallery cards, experience figures, service/process cards, portrait/asterisk ornaments and representative profile/case media. Objects translate ±32px and scale .98→1 (±12px mobile); ornaments rotate −20→70 degrees across their stationary section. Text keeps its scroll-linked movement; nested text timelines are excluded inside animated objects. Gallery image hover scales to 1.035 over 500ms with reduced-motion fallback. Video stays fixed; contact stays #333. Source syntax/whitespace checked; rendered verification pending.

Text motion correction after user found it absent: transformable inline-block hero words; separate heading/paragraph targets instead of large section-copy groups. Individual non-hero text now rises 64px (28px mobile), opacity .2→1, as its untransformed top moves from 90% to 35% viewport height, reversible with scroll. Measurements rebuild after fonts/load/resize. Object timelines remain independent. Syntax and scroll mapping verified; browser verification remains pending.

Object motion made explicit after the same user feedback: added process orbit, step/service numbers, contact arrow, work scroll action and section markers. Transformable inline-block decorative spans. Objects rise 52px/22px mobile, scale .94→1 and opacity .4→1 over viewport arrival (90%→35%), reversible. Ornaments rotate across section scroll. No video/control changes. Syntax checked; visual verification pending.

User explicitly restored infinite asterisk rotation. Asterisks are excluded from scroll timelines and rotate 360 degrees every 20 seconds continuously using CSS; reduced-motion disables rotation. Other object/text scroll behavior is unchanged.

## Home work section exploration — 2026-11-16

User reopened the home work layout. Prepared a separate three-direction interactive review at docs/work-exploration/index.html; current home is unchanged. Directions: index with selectable preview (scannability/compactness), sequential project chapters (context and image scale), alternating editorial composition (visual rhythm/featured opening). Same five real projects, screenshots and destinations. GC contribution: Geist hierarchy, thin rules, strong image/text proportions and restrained orange actions on the approved dark foundation. Review uses the video poster as a labelled design approximation, not another video instance. Palette stays fixed to the approved identity; heading font and spacing options are adjustable. Desktop/mobile mode, hover toggle, confirmation JSON and export are provided. Selection remains pending. Native Firefox opened the review and showed the editorial direction with real project text/links; exhaustive mobile/control testing remains pending.

Research: opened Hoverstates as discovery and original pages tiger.exposed (ordered project taxonomy observed in accessible page content), erinfeeproductions.com (only Info/Projects exposed), oliverdupuy.com (Overview/List exposed). These informed possible navigation alternatives only; live visual/mobile interactions of the references were not verified and no motion claims are inferred. URLs: https://www.hoverstat.es/ , https://tiger.exposed/ , https://www.erinfeeproductions.com/ , https://www.oliverdupuy.com/ . Date 2026-11-16. Existing user gallery reference and local design record remain the main identity anchors.

User selected direction 02 (sequential projects) for the homepage. Implemented five project chapters with text/contribution beside large images and a single whole-chapter link; work index preserved. Mobile stacks text then image. User immediately requested shorter photos: desktop height now clamp(220px,24vw,360px); mobile 16:9. Retained fixed full-page video and gray contact. JS syntax and diff checks passed; browser verification attempt timed out.

User requested narrower project previews to show complete page heroes. Home chapters now use equal columns, previews capped at 600px and 16:9; regular captures use contain to avoid cropping, Leone full-page capture is width-scaled with the first desktop viewport visible. Removed preview hover zoom to keep edges visible. Source checked; visual verification pending.

User refinement of direction 02: alternate desktop/tablet project rows (odd text/image, even image/text), preserving image widths and exterior alignment. Mobile retains text then image. CSS diff checked.

User reverted the alternating-row refinement. Restored all homepage project rows to text left / image right; other sizing and spacing retained.

Method text readability correction from user screenshot: full paper-color paragraphs, 16px/1.6, local .88 dark backing behind the steps, and removed opacity fading from text/object scroll timelines so motion does not reduce reading contrast. Source checked; visual verification pending.

User requested shared project-width alignment for the following sections too. Method, Leone note, about and contact now use the 1600px home container; retained full-bleed backgrounds and mobile gutters. Removed the Leone note’s 25% left indentation. Source checked; rendered verification pending.

User requested homepage grid alignment on other pages. Introduced shared --site-content-width:1600px and applied matching desktop gutters to work hero/list, profile sections, editorial case-study grid, previous/next and inner-page headers/footers; full-width backgrounds and page structures remain. Case-study mobile gutters now 18px. Fixed site-theme asset paths in case pages that already declare base href ../ so shared styling resolves correctly. Static checks passed; browser visual verification pending.

Scroll-text visibility investigation: native Firefox local probe reported reduced-motion=false and 67 active animations, so initialization runs. Existing 64px text travel with no fade was too subtle against native scrolling. Increased heading arrival to 140px desktop/48px mobile, body text 44/24px; scrub interval is 95%→30% viewport, no opacity fade. Restricted focus cancellation to real interactive controls so anchor/container focus cannot cancel every descendant timeline. Syntax and regression test checked; complete rendered before/after inspection limited by active browser changes.

User clarification supersedes the stronger text scrub proposal: wants text appearance on viewport entry. Text now uses a separate one-shot IntersectionObserver reveal (opacity 0→1 and translate 30→0px, 800ms; mobile 18px/550ms), with no pending hidden CSS and no replay on reverse scroll. Objects retain their scroll timelines. Reduced motion cancels reveals to the visible default; focus settles active text animations.

Final user clarification: restore semi-transparent text that progressively becomes full-color with scroll. Supersedes the timed-entry implementation. Non-hero text now scrubs opacity .35→1 across the existing viewport interval, without translate or timed fade. Hero stays fully legible; objects and asterisk rotation preserved.
