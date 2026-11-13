// Hands one link_click event to Google Analytics for each hub link opened. The link opens on its
// own, in a new tab, so a missing or failing gtag never stops it. gtag is looked up at click time
// because Partytown defines it after this script runs.
document.querySelectorAll("a[data-link-id]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      // SPIKE: debug_mode makes the event visible in GA DebugView. T-page removes it.
      window.gtag?.("event", "link_click", { link_id: link.dataset.linkId, debug_mode: true });
    } catch {
      // Analytics is best-effort.
    }
  });
});
