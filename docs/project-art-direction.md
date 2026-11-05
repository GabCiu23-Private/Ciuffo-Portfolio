# Project presentation

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
