// Hands one link_click event to Google Analytics for each hub link opened. The link opens on its
// own, in a new tab, so a missing or failing gtag never stops it. gtag is looked up at click time
// because Partytown defines it after this script runs.
document.querySelectorAll("a[data-link-id]").forEach((link) => {
  link.addEventListener("click", () => {
    try {
      // Only the link id: no personal data goes into event parameters.
      window.gtag?.("event", "link_click", { link_id: link.dataset.linkId });
    } catch {
      // Analytics is best-effort.
    }
  });
});
