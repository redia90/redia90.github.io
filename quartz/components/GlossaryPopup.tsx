// @ts-ignore
import glossaryPopupScript from "./scripts/glossaryPopup.inline"
import { QuartzComponent, QuartzComponentConstructor } from "./types"

const GlossaryPopup: QuartzComponent = () => null

GlossaryPopup.afterDOMLoaded = glossaryPopupScript
GlossaryPopup.css = `
.glossary-term {
  display: inline;
  margin: 0;
  padding: 0 0.15em;
  border: 0;
  border-bottom: 1px dotted color-mix(in srgb, var(--secondary) 72%, var(--gray));
  border-radius: 4px;
  background: color-mix(in srgb, var(--secondary) 9%, transparent);
  color: var(--dark);
  font: inherit;
  font-weight: 750;
  line-height: inherit;
  cursor: help;
  text-align: inherit;
}

.glossary-term:hover,
.glossary-term:focus-visible,
.glossary-term.is-active {
  background: color-mix(in srgb, var(--secondary) 17%, transparent);
  color: var(--secondary);
  outline: none;
}

.glossary-popup {
  position: fixed;
  z-index: 1200;
  width: min(21rem, calc(100vw - 2rem));
  padding: 0.85rem 0.92rem;
  border: 1px solid color-mix(in srgb, var(--secondary) 30%, var(--lightgray));
  border-radius: 12px;
  background: var(--light);
  color: var(--darkgray);
  box-shadow: 0 18px 44px rgb(0 0 0 / 0.18);
  opacity: 0;
  transform: translateY(4px);
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.glossary-popup.is-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.glossary-popup-title {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  margin: 0 0 0.32rem;
  color: var(--dark);
  font-size: 0.98rem;
  font-weight: 850;
  line-height: 1.35;
}

.glossary-popup-title::before {
  content: "?";
  display: inline-grid;
  place-items: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 999px;
  background: var(--secondary);
  color: var(--light);
  font-size: 0.78rem;
  font-weight: 900;
}

.glossary-popup-desc {
  margin: 0;
  color: var(--darkgray);
  font-size: 0.9rem;
  line-height: 1.55;
}

.glossary-popup-link {
  display: inline-flex;
  margin-top: 0.55rem;
  color: var(--secondary);
  font-size: 0.84rem;
  font-weight: 800;
}

@media all and (max-width: 800px) {
  .glossary-popup {
    left: 1rem !important;
    right: 1rem;
    width: auto;
  }
}
`

export default (() => GlossaryPopup) satisfies QuartzComponentConstructor
