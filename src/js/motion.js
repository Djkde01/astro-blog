import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Reveals the cards matching `selector` once each, as they scroll into view.
// Cards already on screen at load stay still, so nothing visible flashes. Under
// prefers-reduced-motion nothing runs, and the matchMedia context reverts every change.
// Waiting cards are only transparent, not visibility: hidden (autoAlpha), so screen
// readers, find-in-page and the keyboard still reach them; focusing one scrolls it in.
export function revealCards(selector) {
  gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
    const cards = gsap.utils
      .toArray(selector)
      .filter((card) => card.getBoundingClientRect().top >= window.innerHeight);
    if (cards.length === 0) return;

    // The hover lift's CSS transition would trail every frame of the tween.
    gsap.set(cards, { opacity: 0, y: 20, transition: "none" });
    ScrollTrigger.batch(cards, {
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          // Hand the card back to CSS, so its hover lift works.
          clearProps: "transform,opacity,transition",
        }),
    });
  });
}

// Fades in the cards a filter has just shown. Under prefers-reduced-motion they appear at once.
export function showCards(cards) {
  if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
  gsap.fromTo(
    cards,
    // The hover lift's CSS transition would trail every frame of the tween.
    { opacity: 0, y: 12, transition: "none" },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: "power2.out",
      // A quick second click restarts the fade instead of stacking a second one.
      overwrite: true,
      clearProps: "transform,opacity,transition",
    },
  );
}
