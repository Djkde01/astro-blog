import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reveals the cards matching `selector` once each, as they scroll into view.
// Cards already on screen at load stay still, so nothing visible flashes. Under
// prefers-reduced-motion nothing runs, and the matchMedia context reverts every change.
export function revealCards(selector) {
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const cards = gsap.utils
      .toArray(selector)
      .filter((card) => card.getBoundingClientRect().top >= window.innerHeight);
    if (cards.length === 0) return;

    gsap.set(cards, { autoAlpha: 0, y: 20 });
    ScrollTrigger.batch(cards, {
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          // Hand the card back to CSS, so its hover lift works.
          clearProps: "transform,opacity,visibility",
        }),
    });
  });
}
