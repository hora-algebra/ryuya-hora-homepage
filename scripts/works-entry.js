function bootWorksPage() {
  if (typeof setupLanguage !== "function" || typeof renderWorksPageInitial !== "function") return;
  setupLanguage();
  renderWorksPageInitial();
  if (typeof setupInteractions === "function") setupInteractions();
  if (typeof applyLanguage === "function") applyLanguage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootWorksPage, { once: true });
} else {
  bootWorksPage();
}
