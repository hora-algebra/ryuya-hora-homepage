(function () {
  const updatedDate = "24 April 2026";
  const page = document.body?.dataset.page || "";

  function setFooterDate() {
    const footer = document.querySelector(".site-footer p");
    if (!footer) return;
    footer.textContent = footer.textContent.replace(/22 April 2026/g, updatedDate);
  }

  function updateHomeLead() {
    const lead = document.querySelector(".hero-copy .lead");
    if (lead) lead.textContent = "Category theory, topos theory, combinatorics, computation.";
  }

  function ensureMiscArticle() {
    if (!globalThis.siteData?.papers?.misc) return;
    const misc = siteData.papers.misc;
    const wythoff = misc.find((paper) => paper.title === "準完全情報ニムとして見たWythoffのゲーム");
    if (wythoff) wythoff.venue = "情報処理学会研究報告アルゴリズム（AL）";
    if (!misc.some((paper) => paper.title === "圏論に登場する矢印の意味は—特集 圏論の質問箱")) {
      misc.push({
        title: "圏論に登場する矢印の意味は—特集 圏論の質問箱",
        authors: ["Ryuya Hora"],
        venue: "数学セミナー 2025年11月号",
        year: "2025",
        link: "https://www.nippyo.co.jp/shop/magazine/9611.html"
      });
    }
  }

  function updatePaperTitle() {
    const published = globalThis.siteData?.papers?.published || [];
    const target = published.find(
      (paper) => paper.title === "Grothendieck topos with a left adjoint to a left adjoint to a left adjoint to the global sections functor"
    );
    if (target) {
      target.title = "Grothendieck topoi with a left adjoint to a left adjoint to a left adjoint to the global sections functor";
    }
  }

  function updatePlans() {
    const plans = globalThis.siteData?.activities?.find((section) => section.title === "Plans");
    if (!plans) return;
    plans.items = [
      {
        date: "2026-07-06 - 2026-07-10",
        text: "Planning to attend ACT 2026 in Tallinn.",
        href: "https://actconf2026.github.io/"
      },
      {
        date: "2026-09-29",
        text: "Scheduled to give an online talk at ItaCa Fest 2026.",
        href: "https://progetto-itaca.github.io/fests/fest26.html"
      }
    ];
  }

  function updateLinks() {
    const groups = globalThis.siteData?.links || [];
    const books = groups.find((group) => group.title === "Books and Events");
    if (!books) return;
    books.items = books.items.map(([label, href]) =>
      label === "数学セミナー2025年11月号 圏論の質問箱"
        ? [label, "https://www.nippyo.co.jp/shop/magazine/9611.html"]
        : [label, href]
    );
  }

  function rerender() {
    if (page === "home") {
      updateHomeLead();
      if (typeof renderPlans === "function") renderPlans();
      if (typeof renderHomeTimeline === "function") renderHomeTimeline();
      if (typeof renderHomePapers === "function") renderHomePapers();
    }
    if (page === "papers" || page === "documents") {
      if (globalThis.state) state.paperView = "diagram";
      if (typeof renderPapers === "function") renderPapers();
      if (typeof renderPreparationPapers === "function") renderPreparationPapers();
      if (page === "papers" && typeof renderMiscPapers === "function") renderMiscPapers();
    }
    if (page === "activities" && typeof renderActivities === "function") renderActivities();
    if (page === "links" && typeof renderLinks === "function") renderLinks();
    if (page === "search" && typeof renderSiteSearch === "function") renderSiteSearch();
    if (typeof applyLanguage === "function") applyLanguage();
  }

  updatePaperTitle();
  ensureMiscArticle();
  updatePlans();
  updateLinks();
  setFooterDate();
  rerender();
})();
