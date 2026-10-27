# Accessibility baseline — Phase 0

October 27, 2026. Required technical target: WCAG 2.1 A/AA; WCAG 2.2 AA enhancements evaluated where evidence is available. **No conformance certification.** Findings use the complete records, recommendations, risk, tests and status in the [master register](site-audit.md#finding-register).

## Results and highest-value work

1. **A01/A02, High:** correct blue-card text on all 11 service/careers pages and missing interior link styles on PCIT/EMDR. Ratios range from 1.23:1 to 4.47:1 for text requiring 4.5:1. Prefer scoped color/overlay corrections in the existing palette.
2. **C01, High:** resolve the mismatch between appointment link wording and a general-inquiry destination, with Rachel's approval of the actual intake route. Maintain both secure appointment and general-question paths.
3. **A03, Medium:** make essential contact content independent of animation initialization. JavaScript-disabled testing found the contact form, secure-portal panel and location blocks all at opacity 0. This is a demonstrated robustness problem; JavaScript dependence alone is not a WCAG failure.
4. **A04/A05, Medium:** obtain evidence for hosted form error/success states, screen-reader use, actual zoom, and public PDF accessibility. These are outstanding tests rather than confirmed failures.

Source positives: all 14 pages declare English, have one H1, a main landmark and skip link; no duplicate IDs detected. Every local `img` has an alt attribute. Root form has persistent labels, required fields, email input type, autocomplete tokens, privacy warning and honeypot excluded from the tab sequence. These structural checks do not prove appropriate alt wording, logical full reading order or accessible error recovery.

## Automated testing

axe-core scans used WCAG 2 A/AA, 2.1 A/AA and 2.2 AA tags on the rendered DOM, at 390×844 and 1440×1000. All 14 local pages were scanned; production home/PCIT were scanned separately. No local request failures or JavaScript exceptions were recorded in the default-page runs. Lazy images/iframes not yet requested are not missing-resource failures.

Local default-page violations were `color-contrast` only: 11 pages at both widths. Homepage, 404 and success pages had no axe violations in those default states. First open specialization dialog also had no axe violations. Full node targets, computed colors, rule passes and incomplete checks are preserved in [browser.json](evidence/browser.json). No-violation results are not page-level WCAG passes. Automated contrast can miss gradients, imagery, inactive states, hidden content and iframe contents.

Production home and PCIT failed contrast in both configurations. Examples: white on sage `#b6cbc1` = 1.70:1 and footer gray on `#5a5959` = 3.11:1. These are from the older live design; do not copy its colors into the redesign.

html-validate's recommended preset produced 358 error-severity lint messages across the 14 files:

| Rule | Messages | Interpretation |
| --- | ---: | --- |
| `void-style` | 220 | Self-closing style preference, not demonstrated invalid HTML or WCAG failure |
| `tel-non-breaking` | 63 | Typographic advice about phone-number separators |
| `hidden-focusable` | 52 | Static warnings primarily for controls inside initially hidden Bootstrap dialogs; rendered CSS hides closed dialogs, no rendered closed controls in follow-up test; do not remove dialog ARIA based on this alone |
| `attribute-empty-style` | 7 | Attribute formatting preference |
| `attribute-boolean-style` | 7 | Attribute formatting preference |
| `no-trailing-whitespace` | 6 | Formatting |
| `doctype-style` | 2 | Casing preference; HTML doctype matching is case insensitive |
| `aria-label-misuse` | 1 | Clinical-supervision list at line 200; semantic/assistive-technology review A06, not confirmed by axe |

This was a local linter, not a completed W3C Nu validation. No duplicate-ID finding was observed. WAVE was not available as an installed extension/API; no WAVE result claimed.

## Keyboard and interaction evidence

[focused-tests.json](evidence/focused-tests.json) supersedes the fixed-delay modal batch. Each dialog gets a fresh browser page and waits for Bootstrap's actual shown/hidden events. All 20 dialogs received focus, retained the sampled 20 Tab/Shift+Tab movements inside, closed on Escape, and returned focus to their trigger. This is repeatable browser keyboard evidence, not native screen-reader testing or proof that every possible focus cycle works.

Other observed results in [browser.json](evidence/browser.json):

- First Tab reaches visible “Skip to main content” at x16/y16; Enter changes hash and focuses `main-content`.
- Mobile menu opens with Space, updates `aria-expanded`, and closes after activating a navigation link.
- Desktop dropdown opens with Enter, ArrowDown focuses “Trauma,” Escape closes it.
- Empty required form inputs report native browser validation messages. No form POST, delivery or external server validation was tested.
- 70 reflow measurements (14 pages × 320/375/768/1024/1440 CSS px): 69 matched the viewport. Homepage desktop measured 1468 at 1440; a settled-page rerun confirmed 28px actual horizontal scrolling caused by payment article extents (A07). Narrower tested widths matched their viewports.
- Homepage at 320px with line-height 1.5, letter spacing .12em, word spacing .16em, and paragraph spacing 2em did not increase document width. Visual clipping and interior-page text-spacing checks remain manual tasks.
- Reduced motion and normal-motion checks show AOS still controls the contact block visibility. Blocks reached by the animation trigger become visible; blocks below the threshold remain transparent. This is not evidence that all reduced-motion content is permanently hidden. In the no-JS context, all four blocks remain transparent.

Not fully tested: all header/footer focus colors, scroll occlusion, modal scrolling at high zoom, all trigger-to-appointment transitions, all dropdown/touch variants, initial animation failures, physical mobile gestures, external portal interaction and iframe controls. The five CSS widths approximate reflow conditions; they are **not actual 200%/400% browser zoom tests**.

## WCAG evidence matrix

“Partial evidence” means only the named test passed. It does not mean the success criterion passed throughout the website. All criteria not given a full result remain open for manual assessment.

| Criterion | Phase 0 result | Evidence / next test |
| --- | --- | --- |
| 1.1.1 Non-text Content | Partial evidence / manual review | Every img has alt; inventory below. Verify accuracy/decorative choice, SVG/background/icon purpose, PDFs and external content |
| 1.2.1–1.2.5 Time-based media | Applicability review pending | No media-player workflow identified in root HTML; confirm all embedded/provider content before marking N/A |
| 1.3.1 Info and Relationships | Partial evidence | Labels/landmarks exist; check headings, lists, semantic warning A06, screen-reader relationships and PDFs |
| 1.3.2 Meaningful Sequence | Manual review | Full reading order across responsive cards/dialogs not tested with screen reader |
| 1.3.3 Sensory Characteristics | Manual review | Content instruction review pending |
| 1.3.4 Orientation | Partial evidence | Responsive widths tested; orientation lock and physical devices not tested |
| 1.3.5 Identify Input Purpose | Partial evidence | Name/email autocomplete present; provider controls not assessed |
| 1.4.1 Use of Color | Manual review | Error, hover, focus and link differentiation review pending |
| 1.4.2 Audio Control | Applicability review pending | Confirm third-party content |
| 1.4.3 Contrast (Minimum) | **Fail, scoped confirmed** | A01/A02; 11 local pages and live sample failures |
| 1.4.4 Resize Text | Not tested | Actual 200% zoom required |
| 1.4.5 Images of Text | Manual review | Branding exceptions and informational seals/PDFs require classification |
| 1.4.10 Reflow | Partial evidence / layout review | All five widths tested; desktop homepage 28px overflow A07; no narrower-width overflow measured; full visual content loss/actual zoom pending |
| 1.4.11 Non-text Contrast | Not fully tested | Focus rings, toggle icon, fields, controls and states need 3:1 review |
| 1.4.12 Text Spacing | Partial evidence | Homepage 320px automated width check; full content review pending |
| 1.4.13 Content on Hover or Focus | Partial evidence | Dropdown keyboard close works; dismissible/hoverable/persistent conditions need manual review |
| 2.1.1 Keyboard | Partial evidence | Skip/menu/dropdown and 20 modal samples work; external/form full path pending |
| 2.1.2 No Keyboard Trap | Partial evidence | Sampled dialog cycles and Escape work; full third-party paths pending |
| 2.1.4 Character Key Shortcuts | Manual review | No custom character-shortcut behavior identified; verify dependencies |
| 2.2.1 Timing Adjustable | Manual review | Hosted form/portal timeouts unknown |
| 2.2.2 Pause, Stop, Hide | Manual review | AOS fades are short; confirm all automatic motion and embeds, no blanket failure asserted |
| 2.3.1 Three Flashes or Below Threshold | Manual review | No flash pattern observed in screenshots; no temporal certification |
| 2.4.1 Bypass Blocks | Partial evidence | All pages contain skip link; homepage keyboard focus verified |
| 2.4.2 Page Titled | Partial evidence | Local unique titles; PDFs and production metadata issues need review |
| 2.4.3 Focus Order | Partial evidence | Dialog containment/return and skip verified; full page order and CTA modal transition pending |
| 2.4.4 Link Purpose (In Context) | Review required | C01 appointment destination mismatch, repetitive links and external purposes |
| 2.4.5 Multiple Ways | Partial evidence | Primary/footer/service links present; verify all indexable pages reachable and helpful |
| 2.4.6 Headings and Labels | Partial evidence | One H1 per page and form labels; heading hierarchy/clinical wording manual review |
| 2.4.7 Focus Visible | Partial evidence | Skip ring visible; all other states and animation-hidden focus need manual testing |
| 2.5.1 Pointer Gestures | Manual review | No custom gesture dependence identified; provider/map controls unknown |
| 2.5.2 Pointer Cancellation | Manual review | Native links/buttons used; physical pointer and embeds untested |
| 2.5.3 Label in Name | Partial evidence | No axe violation; visually compare all icon/text control names |
| 2.5.4 Motion Actuation | Manual review | No motion-triggered app feature identified; third parties unknown |
| 3.1.1 Language of Page | Partial evidence | All local pages lang=en; PDFs/provider pages need review |
| 3.1.2 Language of Parts | Manual review | Content review needed |
| 3.2.1 On Focus | Partial evidence | Sampled focus did not navigate unexpectedly; full site/provider review pending |
| 3.2.2 On Input | Manual review | Hosted form and validation paths pending |
| 3.2.3 Consistent Navigation | Partial evidence | Shared nav/footer present; compare exact destinations and order |
| 3.2.4 Consistent Identification | Review required | Appointment wording/destination C01 |
| 3.3.1 Error Identification | Partial evidence | Native empty-field errors only; server errors untested |
| 3.3.2 Labels or Instructions | Partial evidence | Labels, required legend, warning present; read with assistive technology |
| 3.3.3 Error Suggestion | Not fully tested | Email format and hosted errors/recovery required |
| 3.3.4 Error Prevention | Applicability/manual review | Financial/legal/intake workflows external, not tested |
| 4.1.1 Parsing (2.1 baseline) | Partial evidence | Duplicate IDs absent; linter caveats above; complete semantic validation pending |
| 4.1.2 Name, Role, Value | Partial evidence | Menu/dialog states sampled; screen reader and A06 review pending |
| 4.1.3 Status Messages | Not tested | No actual hosted success/failure response observed |

WCAG 2.2 A/AA additions:

| Criterion | Status / next check |
| --- | --- |
| 2.4.11 Focus Not Obscured (Minimum) | Manual: sticky header, modal scroll and anchor focus at zoom |
| 2.5.7 Dragging Movements | Applicability review: no local drag UI identified, maps/providers unknown |
| 2.5.8 Target Size (Minimum) | No axe violation in tested states; manual 24×24 CSS px/spacing review for footer, close controls and mobile links |
| 3.2.6 Consistent Help (A) | Review consistent telephone/general-question/portal locations across pages |
| 3.3.7 Redundant Entry (A) | External intake workflow untested |
| 3.3.8 Accessible Authentication (Minimum) | External portal authentication untested; no certification claimed |

## Form privacy and clinical content

The general form is not approved for PHI. Keep the warning before fields and associated via `aria-describedby`; preserve name/email/general question only. Never add symptom, diagnosis, insurance, treatment narrative or appointment-detail fields. Do not infer HIPAA compliance of WebForms or the portal from code or branding. Automated tests used blank fields only; no patient data or actual submission.

Confirm with Rachel: new-client routing; test mailbox and test-provider configuration; success/error behavior and policies; currency of fees/insurance/clinical claims. Preserve Heather MSW, LICSW, Michael BA – Mental Health Intern Practitioner, and Paige's existing scope/referral limitations. No clinical content changed.

## Legal applicability — professional review needed

Primary guidance checked October 27, 2026: [HHS May 7, 2026 announcement](https://www.hhs.gov/press-room/hhs-extends-mobile-and-web-accessibility-deadline.html) and [published interim final rule](https://www.govinfo.gov/content/pkg/FR-2026-05-11/pdf/2026-09266.pdf). For covered HHS recipients, the revised specific WCAG 2.1 AA dates are May 11, 2027 for 15+ employees and May 10, 2028 for fewer than 15. This is not a statement that this practice is covered or that other existing obligations are deferred.

Need: actual HHS federal-financial-assistance recipient/subrecipient arrangements, relevant legal entity and programs, accurate employee count under the applicable rule, contracts/control over third-party services, and any other applicable obligations/exceptions. Insurance/Medicare/Medicaid mentions alone do not establish applicability. Counsel should evaluate the actual arrangements.

[DOJ web guidance](https://www.ada.gov/resources/web-guidance/) distinguishes state/local government Title II from public-facing businesses under Title III. Do not assign public-sector Title II deadlines to this private practice automatically. Qualified legal/accessibility professionals must assess applicability and final certification. WCAG is the technical audit target, not a substitute for that determination. [WAI evaluation guidance](https://www.w3.org/WAI/test-evaluate/) requires knowledgeable human evaluation alongside tools.

## Image accessibility inventory

Each local img occurrence is listed below, including repeated logos. Full `picture/source/srcset` details are in raw HTML and [inventory](evidence/inventory.json). Existing alt is recorded verbatim; recommended wording is deliberately not invented. Default action: retain provisionally and inspect full source image/context; portraits additionally require owner identity confirmation. Empty alt can be correct for decorative/redundant imagery. Background/SVG/icon inventory follows the table.

<!-- IMAGE_INVENTORY -->

| Page | Image | Purpose | Current alt | Recommended alt | Required action |
| --- | --- | --- | --- | --- | --- |
| 404.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| 404.html | 2: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| career.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| career.html | 2: womenwithipad.jpg | Photograph/seal; contextual role review | Woman holding a tablet | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| career.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| caregiver-coaching-and-consultation.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| caregiver-coaching-and-consultation.html | 2: womanandgirl.jpg | Photograph/seal; contextual role review | Caregiver spending time with a child | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| caregiver-coaching-and-consultation.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| circle-of-security-parenting.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| circle-of-security-parenting.html | 2: parentswithbaby.jpg | Photograph/seal; contextual role review | Parents spending time with their baby | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| circle-of-security-parenting.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| clinical-supervision.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| clinical-supervision.html | 2: clinicalsupervision.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| clinical-supervision.html | 3: rachel.jpg | Clinician portrait; identity unverified | Rachel Milan | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| clinical-supervision.html | 4: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| experiental-play-therapy.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| experiental-play-therapy.html | 2: boyplaying.jpg | Photograph/seal; contextual role review | Child engaged in play | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| experiental-play-therapy.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| eye-movement-densensitizaion-and-reprocessing.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| eye-movement-densensitizaion-and-reprocessing.html | 2: happy girl.jpg | Photograph/seal; contextual role review | A smiling child sitting comfortably with her mother | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| eye-movement-densensitizaion-and-reprocessing.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| form-submission-sucess.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| form-submission-sucess.html | 2: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| index.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 2: family-6475821_1920.jpg | Photograph/seal; contextual role review | Family spending time together outdoors | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 3: happyfamilylayingonthebed.jpg | Photograph/seal; contextual role review | Family relaxing together on a bed | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 4: Momhuggingchild.jpg | Photograph/seal; contextual role review | Caregiver embracing a young child | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 5: nuero_eval_children.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| index.html | 6: girlpainting.jpg | Photograph/seal; contextual role review | Child painting at a table | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 7: Familytherapy.jpg | Photograph/seal; contextual role review | Family talking together in a supportive setting | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 8: kidsonthecomputer.jpg | Photograph/seal; contextual role review | Two children using a laptop while sitting on a sofa | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 9: coupletherpay.jpg | Photograph/seal; contextual role review | Adults talking together in a counseling setting | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 10: women_sitting_on_rock.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| index.html | 11: Kidsatplay.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| index.html | 12: family.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| index.html | 13: womenwithbabies.jpg | Photograph/seal; contextual role review | alt="" | Keep empty if decorative/redundant; otherwise describe verified purpose | Manual full-image/context review; no alt rewrite applied |
| index.html | 14: COSP_logo_closed_blue.jpg | Brand/functional link; confirm parent name | Circle of Security Parenting logo | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 15: PSISeal.jpg | Photograph/seal; contextual role review | Perinatal Mental Health Certification seal | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 16: family2.jpg | Photograph/seal; contextual role review | Family spending time together at home | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 17: family3.jpg | Photograph/seal; contextual role review | Family walking together outdoors | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 18: happygirl.jpg | Photograph/seal; contextual role review | Happy girl smiling | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| index.html | 19: rachel.jpg | Clinician portrait; identity unverified | Portrait of Rachel Milan | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 20: Heather_Milovac.jpg | Clinician portrait; identity unverified | Portrait of Heather Milovac | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 21: samantha.jpg | Clinician portrait; identity unverified | Portrait of Samantha Lee | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 22: Katrina.jpg | Clinician portrait; identity unverified | Portrait of Katrina Boogerd | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 23: Paige_Jablonski.jpg | Clinician portrait; identity unverified | Portrait of Paige Jablonski | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 24: Grace_Shimek.jpg | Clinician portrait; identity unverified | Portrait of Grace Shimek | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 25: Meaghan_Puckett_Photo.jpg | Clinician portrait; identity unverified | Portrait of Meaghan Puckett | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 26: Bri.jpg | Clinician portrait; identity unverified | Portrait of Bri Dieffenbach | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 27: Madeline.jpg | Clinician portrait; identity unverified | Portrait of Madeline Dosser | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 28: SarahN.jpg | Clinician portrait; identity unverified | Portrait of Sarah Neururer | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 29: Jennifer_Olsen.jpg | Clinician portrait; identity unverified | Portrait of Jennifer Olsen | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 30: ElizabethBertini.jpg | Clinician portrait; identity unverified | Portrait of Elizabeth Bertini | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 31: VIctoria_Tinucci.jpg | Clinician portrait; identity unverified | Portrait of Victoria Tinucci | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 32: Michael_Sutton.jpg | Clinician portrait; identity unverified | Portrait of Michael Sutton | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 33: Aaran_Elliot.jpg | Clinician portrait; identity unverified | Portrait of Aaron Elliott | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 34: leof_pic.jpg | Clinician portrait; identity unverified | Portrait of Kelsie Leof | Retain current text pending identity confirmation | Manual full-image/context review; no alt rewrite applied |
| index.html | 35: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| parent-child-interaction-therapy.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| parent-child-interaction-therapy.html | 2: Kidsrunning.webp | Photograph/seal; contextual role review | Children running together | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| parent-child-interaction-therapy.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| social-emotional-skill-building.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| social-emotional-skill-building.html | 2: happyfamily.jpg | Photograph/seal; contextual role review | Family spending time together | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| social-emotional-skill-building.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| theraplay.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| theraplay.html | 2: motherplaying.jpg | Photograph/seal; contextual role review | A mother and child enjoying time playing together | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| theraplay.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| trauma-focused-cognitive-behavorial-therapy.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| trauma-focused-cognitive-behavorial-therapy.html | 2: girlslayingdown.webp | Photograph/seal; contextual role review | Two girls resting side by side | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| trauma-focused-cognitive-behavorial-therapy.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |
| trauma-informed-child-parent-psychotherapy.html | 1: Logo_dark.png | Brand/functional link; confirm parent name | Milestone Mental Health | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| trauma-informed-child-parent-psychotherapy.html | 2: girlwithbigsmile.webp | Photograph/seal; contextual role review | A young girl with a big smile | Retain provisionally; inspect full image/context | Manual full-image/context review; no alt rewrite applied |
| trauma-informed-child-parent-psychotherapy.html | 3: Light_Horizontal.png | Brand/functional link; confirm parent name | alt="" | Keep empty if parent link is named | Manual full-image/context review; no alt rewrite applied |

Additional non-img imagery: inline SVG waves/arrows/line icons and menu/close icons are present in root source; many use aria-hidden or CSS backgrounds. Aesthetic waves may be decorative, but functional controls must retain independent names. Active common CSS retains legacy background-image families for masthead, service/assessment/coordination/virtual therapy, philosophy, payment/specialization/interior/404 scenes and `.no-webp` fallbacks. Their selectors and URLs are in [CSS reference evidence](evidence/css-assets.json); rendering/meaning must be reviewed across states before removal. CSS background images have no alt mechanism; provide equivalent text only if they convey information. External map content and PDFs need separate review.

<!-- END_IMAGE_INVENTORY -->
