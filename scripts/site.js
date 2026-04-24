function driveAsset(id, thumbnail = `https://lh3.google.com/u/0/d/${id}=s2048`) {
  return {
    href: `https://drive.google.com/open?id=${id}`,
    thumbnail,
    download: `https://drive.google.com/uc?id=${id}&export=download`
  };
}

function notePdfAsset(id, slug, thumbnail) {
  return {
    ...driveAsset(id, thumbnail),
    localThumbnail: `assets/notes/${slug}.png`
  };
}

const problemListUpdated = "30 March 2026";

const problemRefs = {
  tac: ["Local state classifier paper", "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"],
  lawvereFirst: ["Lawvere's first problem", "https://ncatlab.org/nlab/show/William+Lawvere#FirstProblemInToposTheory"],
  lawvereOpen: ["Lawvere-style open problems", "https://ncatlab.org/nlab/show/William+Lawvere#OpenProblemsInToposTheory"],
  kockMoerdijk: ["Kock-Moerdijk", "https://eudml.org/doc/91476"],
  normalizer: ["Normalizer preprint", "https://arxiv.org/abs/2511.05012"],
  menni: ["Menni: Non-singular maps", "https://arxiv.org/abs/2505.07131"],
  weakTopologies: ["Khanjanzadeh-Madanshekaf", "https://link.springer.com/article/10.1007/s41980-020-00393-7"],
  copower: ["Copower objects", "http://www.tac.mta.ca/tac/volumes/16/32/16-32.pdf"],
  isotropy: ["Isotropy group of a topos", "http://www.tac.mta.ca/tac/volumes/26/24/26-24abs.html"],
  automata: ["Topoi of automata", "https://arxiv.org/abs/2411.06358"],
  kamioFinite: ["Yuhi Kamio, finite alphabet case", "https://www.sciencedirect.com/science/article/abs/pii/S0022404924000549"],
  kamioInfinite: ["Yuhi Kamio, infinite alphabet case", "https://arxiv.org/abs/2407.17105"],
  connected: ["Completely connected topoi", "https://arxiv.org/abs/2503.04317"],
  colocal: ["Colocal geometric morphisms", "https://link.springer.com/article/10.1007/s10485-020-09620-y"],
  localTopos: ["Local topos", "https://ncatlab.org/nlab/show/local+geometric+morphism#LocalTopos"],
  lawvereDistribution: ["Lawvere distribution", "https://ncatlab.org/nlab/show/Lawvere+distribution"],
  presentableTensor: ["Tensor product of presentable categories", "https://ncatlab.org/nlab/show/Pr%28infinity%2C1%29Cat#tensor_product"],
  games: ["Games as recursive coalgebras", "https://arxiv.org/abs/2510.22886"],
  joyalGames: ["Joyal's games and strategies", "https://people.cs.uchicago.edu/~brady/CSPP50102/notes/Joyal-games.pdf"],
  quantumGames: ["Classical vs quantum computation", "https://golem.ph.utexas.edu/category/2006/10/classical_vs_quantum_computati_3.html"],
  higgsPrime: ["Higgs prime", "https://en.wikipedia.org/wiki/Higgs_prime"],
  elephant: ["Sketches of an Elephant", "http://www.tac.mta.ca/tac/reprints/articles/27/tr27abs.html"],
  profiniteGroups: ["Profinite Groups", "https://link.springer.com/book/10.1007/978-3-642-01642-4"]
};

function problemEntry({ id, formal = false, theme, title, statement, description, tags = [], links = [], trail, updated = problemListUpdated }) {
  const entryLinks = links.filter(Boolean);
  return {
    id,
    status: formal ? "open" : "question",
    theme,
    title,
    statement,
    description,
    tags: [formal ? "formal question" : "informal question", ...tags],
    updated,
    links: entryLinks,
    trail:
      trail ||
      entryLinks.map(([label, href]) => ({
        label,
        href,
        note: "Reference for this problem entry."
      }))
  };
}

const siteData = {
  pages: [
    {
      title: "Documents",
      href: "documents/index.html",
      description: "Papers, preprints, notes, and slides.",
      icon: "paper",
      thumbnail: "assets/papers/topoi-automata.jpg"
    },
    {
      title: "Activities",
      href: "activities/index.html",
      description: "Activities, visits, talks, and plans.",
      icon: "activity"
    },
    {
      title: "Others",
      href: "others/index.html",
      description: "Web apps, problems, favorite topoi, and links.",
      icon: "webapp",
      thumbnail: "assets/web-apps/genericalgoid.png"
    },
    {
      title: "Search",
      href: "search/index.html",
      description: "Search this site.",
      icon: "search"
    }
  ],
  profileLinks: [
    ["nLab", "https://ncatlab.org/nlab/show/Ryuya+Hora"],
    ["ORCiD", "https://orcid.org/0009-0008-6975-8908"],
    [
      "arXiv",
      "https://arxiv.org/search/math?query=Hora%2C+Ryuya&searchtype=author&abstracts=show&order=-announced_date_first&size=50"
    ],
    ["CV", "https://drive.google.com/file/d/1TZns0gdMrcp7zOVVQ1YZVYdBn-a09G_p/view?usp=sharing"],
    ["researchmap", "https://researchmap.jp/ryuyahora"]
  ],
  currentPositions: [
    { text: "Assistant professor at ZEN University since April 2026.", href: "https://zen.ac.jp", icon: "building" },
    { text: "Researcher at the Humai Center since April 2026.", href: "https://zen.ac.jp/humai", icon: "flask" },
    { text: "Supported by Grant-in-Aid for JSPS Fellows since April 2024.", href: "https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-24KJ0837/", icon: "flask" },
    { text: "Founder and one of the organizers of Categories in Tokyo since 2024.", href: "https://sites.google.com/view/categoriesintokyo/%E3%83%9B%E3%83%BC%E3%83%A0", icon: "kan-extension" },
    { text: "Advisor to 角川ドワンゴ学園 研究部 since June 2025.", href: "https://nnn.ed.jp/attractiveness/extracurricular/club/kenkyubu/", icon: "hexagon" },
    { text: "Tutor at Math Space Topos since July 2020.", href: "https://sites.google.com/view/mspacetopos/home", icon: "pullback" }
  ],
  pastPositions: [
    { text: "Research Associate at Centre for Topos Theory and its Applications, Paris, April to July 2025.", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
    { text: "Ph.D. student at Graduate School of Mathematical Sciences, The University of Tokyo, April 2024 to March 2026.", href: "https://www.ms.u-tokyo.ac.jp/" },
    { text: "Graduate student supported by FoPM, October 2022 to March 2024.", href: "https://www.s.u-tokyo.ac.jp/en/FoPM/" },
    { text: "Research Assistant at National Institute of Informatics, November 2020 to March 2021.", href: "https://www.nii.ac.jp/en/" }
  ],
  topics: [
    ["Category theory", "https://ncatlab.org/nlab/show/category+theory"],
    ["Topos theory", "https://ncatlab.org/nlab/show/topos"],
    ["Coalgebras", "https://ncatlab.org/nlab/show/coalgebra"],
    ["Profinite combinatorics", "https://ncatlab.org/nlab/show/profinite+set"],
    ["Combinatorial game theory", "https://en.wikipedia.org/wiki/Combinatorial_game_theory"],
    ["Semiring theory", "https://ncatlab.org/nlab/show/semiring"],
    ["Algebraic language theory", "https://en.wikipedia.org/wiki/Algebraic_language_theory"]
  ],
  webApps: [
    {
      title: "GenericAlgoid",
      href: "https://genericalgoid-ryuyahora.vercel.app",
      thumbnail: "assets/web-apps/genericalgoid.png",
      tag: "simulation",
      description: "A toroidal evolution sandbox with organisms, resources, terrain, mutation, and visible lineages.",
      descriptionJa: "organisms, resources, terrain, mutation, visible lineages を持つ toroidal evolution sandbox。",
      links: [
        ["Open app", "https://genericalgoid-ryuyahora.vercel.app"],
        ["Guide", "https://genericalgoid-ryuyahora.vercel.app/guide.html"],
        ["Dev", "https://genericalgoid-ryuyahora.vercel.app/dev.html"]
      ],
      keywords: ["evolution", "simulation", "lineage", "sandbox"]
    },
    {
      title: "Moser's Worm Lab",
      href: "https://results-fawn.vercel.app",
      thumbnail: "assets/web-apps/moser-worm.png",
      tag: "experiment",
      description: "Interactive pages for finite-worm experiments, search heuristics, growth, and theory notes.",
      descriptionJa: "finite-worm experiments, search heuristics, growth, theory notes の interactive pages。",
      links: [
        ["Open app", "https://results-fawn.vercel.app"],
        ["Search", "https://results-fawn.vercel.app/search/"],
        ["Growth", "https://results-fawn.vercel.app/growth/"],
        ["Theory", "https://results-fawn.vercel.app/theory/"]
      ],
      keywords: ["Moser's worm problem", "geometry", "heuristics", "search"]
    },
    {
      title: "Adjunction Reboot",
      href: "https://adjunction-reboot-v2-ryuyahora.vercel.app/workbench",
      thumbnail: "assets/web-apps/adjunction-reboot.png",
      tag: "workbench",
      description: "A diagram-first adjunction workbench for unit, counit, and snake moves.",
      descriptionJa: "unit, counit, snake moves を扱う diagram-first adjunction workbench。",
      links: [
        ["Workbench", "https://adjunction-reboot-v2-ryuyahora.vercel.app/workbench"],
        ["Guide", "https://adjunction-reboot-v2-ryuyahora.vercel.app/guide"],
        ["Monad", "https://adjunction-reboot-v2-ryuyahora.vercel.app/monad"]
      ],
      keywords: ["adjunction", "string diagram", "snake identity", "category theory"]
    },
    {
      title: "2-Category String Diagram App",
      href: "https://adjoint-string-diagram-app-ryuyahor.vercel.app/workbench",
      thumbnail: "assets/web-apps/string-diagram.png",
      tag: "editor",
      description: "A typed 2-category editor for signature-based string diagram rewrites.",
      descriptionJa: "signature-based string diagram rewrites のための typed 2-category editor。",
      links: [
        ["Workbench", "https://adjoint-string-diagram-app-ryuyahor.vercel.app/workbench"],
        ["Tutorial", "https://adjoint-string-diagram-app-ryuyahor.vercel.app/workbench?tutorial=snake"],
        ["Guide", "https://adjoint-string-diagram-app-ryuyahor.vercel.app/guide"]
      ],
      keywords: ["2-category", "string diagram", "typed rewrite", "adjunction"]
    },
    {
      title: "Automaton Acceptance Game",
      href: "https://automaton-acceptance-game-ryuyahora.vercel.app",
      thumbnail: "assets/web-apps/automaton-acceptance-game.png",
      tag: "game",
      description: "A browser game for reading automaton acceptance as an interactive process.",
      descriptionJa: "automaton acceptance を interactive process として読む browser game。",
      links: [["Open app", "https://automaton-acceptance-game-ryuyahora.vercel.app"]],
      keywords: ["automata", "acceptance", "game", "language theory"]
    },
    {
      title: "Automaton Acceptance Game: CFG Monoid",
      href: "https://automaton-acceptance-game-cfg-monoi.vercel.app",
      thumbnail: "assets/web-apps/cfg-monoid-game.png",
      tag: "game",
      description: "A CFG-monoid variant of the automaton acceptance game.",
      descriptionJa: "automaton acceptance game の CFG-monoid variant。",
      links: [["Open app", "https://automaton-acceptance-game-cfg-monoi.vercel.app"]],
      keywords: ["automata", "CFG monoid", "acceptance game", "algebraic language theory"]
    }
  ],
  problemComments: {
    provider: "giscus",
    enabled: false,
    repo: "hora-algebra/ryuya-hora-homepage-comments",
    repoId: "",
    category: "Problem discussions",
    categoryId: "",
    strict: "1",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "bottom",
    theme: "preferred_color_scheme",
    lang: "en"
  },
  favoriteTopoi: [
    {
      id: "discrete-dynamical-systems",
      title: "Topos of discrete dynamical systems",
      formula: "\\(\\mathbf{Set}^{\\mathbb{N}}\\)",
      subtitle: "time as an endomorphism",
      subtitleJa: "time を endomorphism として持つ世界",
      summary:
        "Objects are sets equipped with a chosen evolution. The topos turns iteration, orbits, and eventual periodicity into geometric structure.",
      summaryJa:
        "objects は chosen evolution を備えた sets です。iteration, orbits, eventual periodicity が geometric structure として見えてきます。",
      why: "It is one of the cleanest places where dynamics becomes topos theory without first becoming smooth, measurable, or metric.",
      whyJa:
        "dynamics が smooth, measurable, metric になる前に、そのまま topos theory になる感じがかなり良いです。",
      diagram: "dynamics",
      details: [
        {
          label: "Object",
          value: "A set with one-step time evolution.",
          valueJa: "one-step time evolution を持つ set。"
        },
        {
          label: "Picture",
          value: "A point carries its whole future orbit.",
          valueJa: "point が自分の future orbit を背負っている。"
        },
        {
          label: "Good for",
          value: "Quotient topoi, closure conditions, height-period invariants.",
          valueJa: "quotient topoi, closure conditions, height-period invariants。"
        }
      ],
      links: [
        ["Quotient toposes paper", "papers/index.html"],
        ["nLab: action", "https://ncatlab.org/nlab/show/action"]
      ]
    },
    {
      id: "sierpinski",
      title: "Sierpinski topos",
      formula: "\\(\\mathbf{Set}^{\\Delta[1]} \\simeq \\mathbf{Sh}(\\mathbb{S})\\)",
      subtitle: "the topos of a single visible inclusion",
      subtitleJa: "single visible inclusion の topos",
      summary:
        "The arrow category of sets, equivalently sheaves on the Sierpinski space. It is tiny, but it already remembers how an open part sits inside a whole.",
      summaryJa:
        "sets の arrow category、同じこととして Sierpinski space 上の sheaves です。小さいのに、open part が whole にどう入るかを覚えています。",
      why: "It is the best pocket model for gluing, open subspaces, and geometric logic with only one nontrivial direction.",
      whyJa:
        "gluing, open subspaces, geometric logic の pocket model として優秀です。nontrivial direction が一つしかないのが良い。",
      diagram: "sierpinski",
      details: [
        {
          label: "Object",
          value: "A function of sets.",
          valueJa: "sets の function。"
        },
        {
          label: "Picture",
          value: "A local part restricts from, or maps into, the ambient part.",
          valueJa: "local part と ambient part の間に restriction / inclusion がある。"
        },
        {
          label: "Good for",
          value: "Open truth values, gluing, first examples of sheaf semantics.",
          valueJa: "open truth values, gluing, sheaf semantics の最初の例。"
        }
      ],
      links: [
        ["nLab: Sierpinski topos", "https://ncatlab.org/nlab/show/Sierpinski+topos"],
        ["nLab: Sierpinski space", "https://ncatlab.org/nlab/show/Sierpinski+space"]
      ]
    },
    {
      id: "presheaf",
      title: "Presheaf topoi",
      formula: "\\(\\widehat{\\mathcal{C}}=[\\mathcal{C}^{op},\\mathbf{Set}]\\)",
      subtitle: "all probes at once",
      subtitleJa: "すべての probes を一度に見る",
      summary:
        "A presheaf topos stores what every object of a small category sees. It is the default laboratory where syntax, geometry, and combinatorics can be compared objectwise.",
      summaryJa:
        "presheaf topos は small category の各 object から何が見えるかを保存します。syntax, geometry, combinatorics を objectwise に比べるための標準実験室です。",
      why: "It is flexible enough to hold diagrams, automata, games, and spaces before imposing sheaf conditions.",
      whyJa:
        "sheaf condition を課す前に、diagrams, automata, games, spaces を置ける柔らかさが良いです。",
      diagram: "presheaf",
      details: [
        {
          label: "Object",
          value: "A contravariant set-valued functor.",
          valueJa: "contravariant set-valued functor。"
        },
        {
          label: "Picture",
          value: "Each probe has its own set of observations, compatibly restricted.",
          valueJa: "各 probe が observations の set を持ち、それらが compatible に restrict される。"
        },
        {
          label: "Good for",
          value: "Yoneda, models, automata-shaped worlds, finite combinatorics.",
          valueJa: "Yoneda, models, automata-shaped worlds, finite combinatorics。"
        }
      ],
      links: [["nLab: category of presheaves", "https://ncatlab.org/nlab/show/category+of+presheaves"]]
    },
    {
      id: "automata",
      title: "Topoi of automata",
      formula: "\\((\\Sigma\\text{-}\\mathbf{Set}, R)\\)",
      subtitle: "regular languages as geometry",
      subtitleJa: "regular languages を geometry として見る",
      summary:
        "Automata become objects with word actions, while languages appear through additional algebraic structure. The point is not only to recognize words, but to organize recognition geometrically.",
      summaryJa:
        "automata は word actions を持つ objects になり、languages は additional algebraic structure として現れます。words を認識するだけでなく、recognition を geometry として整理する視点です。",
      why: "It keeps finite-state computation close to geometric morphisms, syntactic monoids, and local classifiers.",
      whyJa:
        "finite-state computation が geometric morphisms, syntactic monoids, local classifiers の近くにいるのが気持ち良いです。",
      diagram: "automata",
      details: [
        {
          label: "Object",
          value: "A set with actions by words.",
          valueJa: "words の actions を持つ set。"
        },
        {
          label: "Picture",
          value: "Transitions draw a language-shaped region inside state space.",
          valueJa: "transitions が state space の中に language-shaped region を描く。"
        },
        {
          label: "Good for",
          value: "Regular languages, syntactic monoids, hyperconnected morphisms.",
          valueJa: "regular languages, syntactic monoids, hyperconnected morphisms。"
        }
      ],
      links: [
        ["Topoi of automata I", "https://arxiv.org/abs/2411.06358"],
        ["Papers", "papers/index.html"]
      ]
    },
    {
      id: "effective",
      title: "Effective topos",
      formula: "\\(\\mathbf{Eff}\\)",
      subtitle: "a universe where computability is internal",
      subtitleJa: "computability が internal になる universe",
      summary:
        "A realizability topos where constructive and recursive phenomena are built into the ambient logic. It feels like a place where algorithms become truth conditions.",
      summaryJa:
        "constructive / recursive phenomena が ambient logic に組み込まれた realizability topos です。algorithms が truth conditions になる場所という感じがします。",
      why: "It is a reminder that changing the topos can change what a function, proof, or existence statement means.",
      whyJa:
        "topos を変えると function, proof, existence statement の意味が変わる、ということを思い出させてくれます。",
      diagram: "effective",
      details: [
        {
          label: "Object",
          value: "A realizability-flavored object with computational evidence.",
          valueJa: "computational evidence を伴う realizability-flavored object。"
        },
        {
          label: "Picture",
          value: "A proof carries a program-like witness.",
          valueJa: "proof が program-like witness を運ぶ。"
        },
        {
          label: "Good for",
          value: "Constructive logic, realizability, recursion-theoretic intuition.",
          valueJa: "constructive logic, realizability, recursion-theoretic intuition。"
        }
      ],
      links: [["nLab: effective topos", "https://ncatlab.org/nlab/show/effective+topos"]]
    }
  ],
  papers: {
    published: [
      {
        title: "Internal Parameterizations of Hyperconnected Quotients",
        venue: "Theory and Applications of Categories 42(11), 263-313",
        year: "2024",
        preprintDate: "2023-02",
        publicationDate: "2024-08-23",
        link: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html",
        figure: "internal-parameterizations",
        tags: ["topos theory", "local state classifier", "hyperconnected quotient"],
        links: [
          ["TAC", "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"],
          ["arXiv", "https://arxiv.org/abs/2302.06851"],
          ["Lawvere's open problems", "http://www.acsu.buffalo.edu/~wlawvere/Openproblemstopos.htm"]
        ],
        summary:
          "Introduces local state classifiers and uses them to establish an internal parameterization of hyperconnected quotients."
      },
      {
        title: "Quotient toposes of discrete dynamical systems",
        authors: "with Yuhi Kamio",
        venue: "Journal of Pure and Applied Algebra 228(8), 107657",
        year: "2024",
        preprintDate: "2023-10",
        publicationDate: "2024-08",
        link: "https://doi.org/10.1016/j.jpaa.2024.107657",
        figure: "quotient-toposes",
        tags: ["discrete dynamical systems", "quotient toposes", "Lawvere problems"],
        links: [
          ["DOI", "https://doi.org/10.1016/j.jpaa.2024.107657"],
          ["arXiv", "https://arxiv.org/abs/2310.02647"],
          ["JPAA issue", "https://www.sciencedirect.com/journal/journal-of-pure-and-applied-algebra/vol/228/issue/8"],
          ["Lawvere's open problems", "http://www.acsu.buffalo.edu/~wlawvere/Openproblemstopos.htm"]
        ],
        summary:
          "Classifies classes of discrete dynamical systems closed under finite limits and small colimits."
      },
      {
        title: "Grothendieck topos with a left adjoint to a left adjoint to a left adjoint to the global sections functor",
        venue: "Proceedings of the American Mathematical Society 154, 567-584",
        year: "2026",
        preprintDate: "2025-03",
        publicationDate: "2026-02",
        link: "https://doi.org/10.1090/proc/17479",
        figure: "completely-connected",
        tags: ["completely connected topoi", "Grothendieck topoi"],
        links: [
          ["DOI", "https://doi.org/10.1090/proc/17479"],
          ["arXiv", "https://arxiv.org/abs/2503.04317"]
        ],
        summary:
          "Studies completely connected topoi and gives a site characterization with examples."
      },
      {
        title: "Solution to Lawvere's first problem: a Grothendieck topos that has proper class many quotient topoi",
        authors: "with Yuhi Kamio",
        venue: "Advances in Mathematics 487, 110751",
        year: "2026",
        preprintDate: "2024-07",
        publicationDate: "2026-03",
        link: "https://doi.org/10.1016/j.aim.2025.110751",
        figure: "lawvere-first",
        tags: ["Lawvere problems", "quotient topoi", "Grothendieck topoi"],
        links: [
          ["DOI", "https://doi.org/10.1016/j.aim.2025.110751"],
          ["arXiv", "https://arxiv.org/abs/2407.17105"],
          ["Advances in Mathematics", "https://www.sciencedirect.com/journal/advances-in-mathematics/vol/487/suppl/C"],
          ["Lawvere's open problems", "http://www.acsu.buffalo.edu/~wlawvere/Openproblemstopos.htm"]
        ],
        summary: "Gives a solution to Lawvere's first open problem."
      }
    ],
    preprints: [
      {
        title: "Lawvere's fourth open problem: Levels in the topos of symmetric simplicial sets",
        authors: "with Yuki Maehara and Yuhi Kamio",
        venue: "arXiv:2503.03439",
        year: "2025",
        link: "https://arxiv.org/abs/2503.03439",
        figure: "lawvere-fourth",
        tags: ["Lawvere problems", "symmetric simplicial sets", "species"],
        links: [["arXiv", "https://arxiv.org/abs/2503.03439"]],
        summary:
          "Solves one of Lawvere's seven open problems through levels in the topos of symmetric simplicial sets."
      },
      {
        title: "Topoi of automata I: Four topoi of automata and regular languages",
        venue: "arXiv:2411.06358",
        year: "2024",
        link: "https://arxiv.org/abs/2411.06358",
        figure: "topoi-automata",
        tags: ["automata", "regular languages", "topos theory"],
        links: [["arXiv", "https://arxiv.org/abs/2411.06358"]],
        summary: "Introduces a topos-theoretic point of view on formal language theory."
      },
      {
        title: "Games as recursive coalgebras: A categorical view on the Nim-sum",
        venue: "arXiv:2510.22886",
        year: "2025",
        link: "https://arxiv.org/abs/2510.22886",
        figure: "games-coalgebras",
        tags: ["coalgebras", "combinatorial games", "Nim"],
        links: [["arXiv", "https://arxiv.org/abs/2510.22886"]],
        summary:
          "Reinterprets impartial combinatorial games and the Nim-sum using recursive coalgebras."
      },
      {
        title: "Normalization of a subgroup, in a topos, and of a word-congruence",
        venue: "arXiv:2511.05012",
        year: "2025",
        link: "https://arxiv.org/abs/2511.05012",
        figure: "normalization",
        tags: ["normalization", "local state classifier", "algebraic language theory"],
        links: [["arXiv", "https://arxiv.org/abs/2511.05012"]],
        summary:
          "Defines a generalized normalization operator motivated by topos theory and algebraic language theory."
      }
    ],
    preparation: [
      "Topoi of automata II: Hyperconnected geometric morphisms, syntactic monoids, and language classes",
      "Subtopoi of free monoid actions (with Morgan Rogers)",
      "Demystifying local state classifiers: local state classifier in a total category with a factorization system (with Yuto Ikeda)",
      "Notes on Rieg theory: semiring with exponentials in logic, profinite arithmetic, enumerative combinatorics, and category theory",
      "Differential calculus of impartial combinatorial games (with Ryo Suzuki)",
      "Topoi with enough projectives",
      "Topoi of automata III: Geometry of \\(\\Sigma\\)-sets",
      "Dynamical systems on pretopological spaces",
      "An enriched-categorical origin of \\(\\varepsilon\\)-transition",
      "Category Theoretic Ordinal Invariants",
      "Totally disconnected topoi",
      "A topos-theoretic view on Gabriel's theorem",
      "The lattice of hyperconnected quotients is a module of the semiring of productive weak topologies",
      "On limits in \\(\\mathbf{FinSet}\\)",
      "Twisted Regular Tetrahedra and Eisenstein Integers",
      "When do finite presheaves form a topos? (with Jeremie Marques)",
      "Local state classifier, permutation model, and the internal axiom of choice"
    ],
    misc: [
      {
        title: "準完全情報ニムとして見たWythoffのゲーム",
        authors: ["安福智明", "洞龍弥", "稲津大貴", "木谷裕紀", "末續鴻輝", "吉渡叶"],
        venue: "researchmap misc",
        year: "2026",
        link: "https://researchmap.jp/ryuyahora/misc/52084435"
      }
    ]
  },
  talks: [
    {
      year: "2026",
      items: [
        { title: "Connectedness and full subcategories of topoi", venue: "Ph.D. thesis presentation, Room 126, Graduate School of Mathematical Sciences, The University of Tokyo, 23 January", href: "https://www.ms.u-tokyo.ac.jp/seminar/thesispres/past.html" },
        { title: "Turning lights out with the Snake Lemma", presenters: ["Kyosuke Higashida"], venue: "20th CGP project, The University of Electro-Communications, Chofu, 22 February", href: "http://www.alg.cei.uec.ac.jp/itohiro/Games/" },
        { title: "Measure-theoretic closure operators on formal languages", presenters: ["Ryuya Hora", "Ryoma Sin'ya"], venue: "PPL 2026, Rexxam Hall, Takamatsu, 11 March", href: "https://jssst-ppl.org/workshop/2026/" },
        { title: "A space-time for Conway's game of life", venue: "CSCAT 2026, AOSSA Room 601A, Fukui, 17 March", href: "https://www.kurims.kyoto-u.ac.jp/~tsanada/event/cscat2026.html" },
        { title: "A Rota-Baxter equation for winning games", venue: "Room 420, RIMS, Kyoto University, 6 April", href: "https://sites.google.com/view/differential-kyoto-2026/home" }
      ]
    },
    {
      year: "2025",
      items: [
        { title: "Topoi of automata", venue: "CMUP SAL seminar, Zoom, 28 February", href: "https://www.cmup.pt/index.php/events/topoi-automata" },
        { title: "Topoi of automata", venue: "CSCAT 2025, Room F203, Sojo University, Kumamoto, 12 March", href: "https://hisashi-aratake.gitlab.io/event/cscat2025.html" },
        { title: "Topoi of automata", venue: "Groupe de travail topossique, Centre Lagrange, Paris, 30 April", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { title: "Topoi of automata", venue: "Categories for Automata and Language Theory, IRIF, Paris, 6 May", href: "https://autcat.github.io/" },
        { title: "Local state classifier for algebraic language theory", venue: "Groupe de travail topossique, Centre Lagrange, Paris, 16 May", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { title: "Local state classifier for automata theory", venue: "Semantique seminar, Salle 3071, IRIF, Paris, 27 May", href: "https://www.irif.fr/seminaires/semantique/index" },
        { title: "A topos for regular language theory", venue: "Theoretical Cosynus Seminar, LIX, Ecole polytechnique, Palaiseau, 11 June", href: "https://www.lix.polytechnique.fr/proofs-algorithms/tcs/" },
        { title: "Topoi of automata", venue: "CT 2025, Building B2, Faculty of Arts, Masaryk University, Brno, 17 July", href: "https://conference.math.muni.cz/ct2025/" },
        { title: "Topoi of automata", venue: "SLACS 2025, Shared Room 321, Akita University, 31 October", href: "https://sites.google.com/view/slacs2025akita/home" },
        { title: "Connectedness and full subcategories of topoi", venue: "UTokyo Logic seminar, Graduate School of Mathematical Sciences, The University of Tokyo, 28 November", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic_e/index_e.html" },
        { title: "The axiom of choice and local state classifier", venue: "UTokyo Logic seminar, Graduate School of Mathematical Sciences, The University of Tokyo, 5 December", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic/" }
      ]
    },
    {
      year: "2024",
      items: [
        { title: "Combinatorial games as recursive coalgebras", venue: "CSCAT 2024, Multimedia Room 1, Science Building 4, Chiba University, 15 March", href: "https://sites.google.com/faculty.gs.chiba-u.jp/cscat2024/home" },
        { title: "Introduction to topos theory", venue: "代数トポロジー若手の会, Nagoya University, 16 March" },
        { title: "圏論の利用と濫用", venue: "18th AFSA Colloquium, NII Kanda Lab, Tokyo, 25 April", href: "https://afsa.jp/g-en/" },
        { title: "Quotient toposes of discrete dynamical systems", venue: "CT 2024, Facultade de Matemáticas, Universidade de Santiago de Compostela, 28 June", href: "https://www.usc.gal/regaca/ct2024/" },
        { title: "Topos theory as a tool of automata theory", venue: "Young Automata Theorists Gathering in Japan, Room 305, Akita University, 29 August", href: "https://sites.google.com/view/ciaa-preworkshop/home" },
        { title: "The colimit of all monomorphisms classifies hyperconnected geometric morphisms", venue: "Toposes in Mondovi, Circolo di Lettura, Palazzo del Governatore, 10 September", href: "https://ctta.igrothendieck.org/" },
        { title: "Quotient topoi and geometry of computation", venue: "AFSA area meeting, TKP Kanda Business Center, Tokyo, 30 November", href: "https://afsa.jp/afsa-2024_generalmeetingautumn/" }
      ]
    },
    {
      year: "2023",
      items: [
        { title: "Internal parameterization of hyperconnected quotients", venue: "CSCAT 2023, Room 478, Research Building 2, Kyoto University, 9 March", href: "https://sites.google.com/view/cscat2023" },
        { title: "Internal parameterization of hyperconnected quotients", venue: "Australia Category Seminar, online, 19 April", href: "http://web.science.mq.edu.au/groups/coact/seminar/" },
        { title: "Grundy Numbers and Categories", venue: "Japan Combinatorial Game Theory Mini-Workshops, NII, Tokyo, 12 May", href: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A#h.avbqzhxax0hj" },
        { title: "Internal parameterization of hyperconnected quotients", venue: "Category Theory 2023, Auditoires des Sciences, UCLouvain, 6 July", href: "https://sites.uclouvain.be/ct2023/" },
        { title: "Category Theory and Combinatorial Game Theory", venue: "7th Japan Combinatorial Game Theory Conference, NII, Tokyo, 21 August", href: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A#h.57ljjdhlpx53" },
        { title: "Constructive mathematics and representation theory", venue: "数学基礎論若手の会2023, Chiba, 10 December", href: "https://sites.google.com/view/mlwakatenokai2023" }
      ]
    }
  ],
  notes: [
    {
      title: "Counting with Exponential of Groups",
      description: "An introduction to rieg theory",
      language: "English",
      file: "counting-with-exponential-of-groups.pdf",
      ...notePdfAsset("1fYwhDbfaeWG107Rf68yocjyJpEvOu8Q8", "counting-with-exponential-of-groups"),
      href: "assets/notes/counting-with-exponential-of-groups.pdf",
      download: "assets/notes/counting-with-exponential-of-groups.pdf"
    },
    { title: "Combinatorial games as recursive coalgebras", description: "Slides at CSCAT 2024", date: "2024-03-15", language: "English", file: "Hora_CSCAT2024.pdf", ...notePdfAsset("12qTwg-9KFTLe-g4UGFtupJUas58U3Ib7", "combinatorial-games-recursive-coalgebras") },
    { title: "Cloud: Topos theoretic approach to representation theory", language: "English", file: "A_topos_theoretic_view_of_Gabriel_s_theorem-12.pdf", ...notePdfAsset("1M-Rxp0KuFykfrJgCLTUo-DrM2XmrJkj4", "topos-representation-theory") },
    { title: "Cloud: What is the geometry behind Conway's game of life?", description: "A first step with a relative topos", date: "2024-12-10", language: "English", file: "Adv20241210_Dynamical_system_on_a_pretopological_space.pdf", ...notePdfAsset("1BYlYRACRzHTIlktPAfAfZ19qSOQWpNwl", "conway-game-of-life-geometry", "https://drive.google.com/thumbnail?id=1BYlYRACRzHTIlktPAfAfZ19qSOQWpNwl&sz=w339-h191-p-k-nu") },
    { title: "Topoi of automata", description: "CSCAT 2025", date: "2025-03-12", language: "English", file: "CSCAT_2025-3.pdf", ...notePdfAsset("1WyOxS3qTZC5jar-nyg_yL7V1lZzJrNHI", "topoi-of-automata-cscat2025") },
    { title: "Topoi of automata", description: "Groupe de travail topossique, April 30, 2025", date: "2025-04-30", language: "English", file: "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf", ...notePdfAsset("1CZPU91ghZsBg5-ce8dEv8CKeZJVA4bbD", "topoi-of-automata-ctta") },
    { title: "Local state classifier for algebraic language theory", description: "Centre Lagrange, 16 May", date: "2025-05-16", language: "English", file: "Local state classifier for algebraic language theory.pdf", ...notePdfAsset("1jwA88f7axVA_VmGsUasrudicI1OXMIPE", "local-state-classifier-algebraic-language") },
    { title: "Topoi of automata (IRIF)", description: "IRIF, 6 May", date: "2025-05-06", language: "English", file: "IRIFtoday.pdf", ...notePdfAsset("1WKRH2BAqodNHpgc09ZKkoJUInY9yasSU", "topoi-of-automata-irif") },
    { title: "Local state classifier for automata theory", description: "IRIF 26 May / LIPN 5 June", date: "2025-05-26", language: "English", file: "IRIF20250527_ver1.pdf", ...notePdfAsset("1KpPPS74AUnuh9BAUe8zcDXlBsvHPZesF", "local-state-classifier-automata") },
    { title: "Pen: A note on language measurability", description: "March 8, 2026", date: "2026-03-08", language: "English", file: "An_ongoing_note_on_language_measurability_under_construction20260308.pdf", ...notePdfAsset("1TaEK9RHHkAm0L4NwJ3d067D5aej3UedC", "language-measurability", "https://drive.google.com/thumbnail?id=1TaEK9RHHkAm0L4NwJ3d067D5aej3UedC&sz=w339-h282-p-k-nu") },
    { title: "Cloud: A Rota-Baxter equation for winning games", description: "April 5, 2026", date: "2026-04-05", language: "English", file: "RYUYA,HORA.pdf", ...notePdfAsset("1dciU6YVwO0eBhCdAxF5ZLdyF4GX6BJiU", "rota-baxter-winning-games", "https://lh3.google.com/u/0/d/1dciU6YVwO0eBhCdAxF5ZLdyF4GX6BJiU=s2048?auditContext=thumbnail") },
    { title: "順序集合で遊ぶKan拡張入門", language: "Japanese", file: "Introduction_to_Kan_extensions_with_posets_3__Copy_.pdf", ...notePdfAsset("1nERWYzL7eS9sUC9I04zWvHBy1vL-RETt", "kan-extensions-posets-intro") },
    { title: "圏論のToy Exampleとしての集合演算", language: "Japanese", file: "圏論のToy_Exampleとしての集合演算__Ver2_.pdf", ...notePdfAsset("1GaGM9qARQH0jLo6CclkONt1nOj3-OSeP", "toy-example-set-operations") },
    { title: "Cloud: 構成的数学と表現論", description: "数学基礎論若手の会 2023", date: "2023-12-10", language: "Japanese", file: "若手の会2023-8.pdf", ...notePdfAsset("1xQtd6gEZIAHvMcdUHylzN3dp5zaT4KD-", "constructive-math-representation") },
    { title: "Turning lights out with the Snake Lemma", description: "CGP project, written with Kyosuke Higashida", date: "2026-02-22", language: "Japanese", file: "ライツアウトの代数的研究.pdf", ...notePdfAsset("1lzERCLPHh6Je6ObpugLAJ42MXaDUAdvp", "lights-out-snake-lemma", "https://lh3.google.com/u/0/d/1lzERCLPHh6Je6ObpugLAJ42MXaDUAdvp=s2048?auditContext=thumbnail") },
    { title: "ゼータ関数とメビウス反転", description: "数理空間トポス 2021年新歓", date: "2021", language: "Japanese", file: "2021topos_zeta_2-3.pdf", ...notePdfAsset("1VmtxtEwZPZJb_rFBvGnV1MuEd3lBm-U4", "zeta-mobius", "https://drive.google.com/thumbnail?id=1VmtxtEwZPZJb_rFBvGnV1MuEd3lBm-U4&sz=w339-h287-p-k-nu") },
    { title: "順序集合で遊ぶKan拡張", description: "数理空間トポス 2022年新歓", date: "2022", language: "Japanese", file: "2022topos_Kan_ext.pdf", ...notePdfAsset("11z191GZKbDVgskXKCBSVF7JXdFMMH81Q", "kan-extensions-posets") },
    { title: "母関数の種", description: "数理空間トポス 2023年新歓", date: "2023", language: "Japanese", file: "2023topos_species-8.pdf", ...notePdfAsset("1FNnMrlx0oZNZqZGjAsKt272xQMuHx9az", "species-generating-functions") },
    { title: "アイゼンシュタイン整数と組合せ論", description: "数理空間トポス 2024年新歓", date: "2024-05", language: "Japanese", file: "2024Topos新歓202405-6.pdf", ...notePdfAsset("1jusP3e40IgxFYzwHf7z3oHhjszOdjPC9", "eisenstein-integers-combinatorics") },
    { title: "Cloud: Space-Time for Conway's Game of Life", description: "CSCAT 2026", date: "2026-03-17", language: "Japanese", file: "Space⋊Time for Conway's Game of Life.pdf", ...notePdfAsset("1p1uPTBQx8ntw1Jf6-MvNrO4lv4xeilje", "spacetime-game-of-life", "https://lh3.google.com/u/0/d/1p1uPTBQx8ntw1Jf6-MvNrO4lv4xeilje=s2048?auditContext=thumbnail") },
    { title: "Older notes", description: "Older documents are collected on Notion.", language: "Japanese", file: "Notion archive", href: "https://hora-algebra.notion.site/b6804a9f65af454a897db8351bc9da1b" }
  ],
  speculativeNotes: [
    {
      slug: "about-this-stream",
      date: "2026-04-22",
      updated: "2026-04-22",
      title: "思弁的なノートの置き場",
      status: "cloud",
      tags: ["meta", "draft", "research log"],
      abstract:
        "☁︎ notes and ideas that are still conjectural, half-shaped, or waiting for a better formulation.",
      paragraphs: [
        "This page is a small working stream for notes that are useful to keep alive, but too speculative to present as papers or polished lecture notes.",
        "The intended unit is a short mathematical fragment: a question, a dictionary, a diagrammatic intuition, or a tentative slogan that may later become a note, talk, problem entry, or preprint.",
        "A typical entry may contain TeX such as \\(\\Sigma\\)-sets, \\(\\Psi\\), \\(N_G(H)\\), or \\(\\mathbf{Set}\\), and can link back to the more stable notes page."
      ],
      questions: [
        "Which fragments are worth turning into Problems entries?",
        "Which fragments should remain deliberately cloud-like?"
      ],
      links: [["Notes", "notes/index.html"]]
    },
    {
      slug: "winning-games-rota-baxter",
      date: "2026-04-05",
      updated: "2026-04-22",
      title: "A Rota-Baxter equation for winning games",
      status: "speculative",
      tags: ["games", "Rota-Baxter", "coalgebras"],
      noteFile: "RYUYA,HORA.pdf",
      abstract:
        "A working fragment around winning positions, coalgebraic recursion, and Rota-Baxter-like operations.",
      paragraphs: [
        "The guiding question is whether a useful operation on impartial games can behave like a Rota-Baxter operator while remembering the separation between winning and losing positions.",
        "A good version should not merely encode Sprague-Grundy values; it should explain why the winning predicate interacts well with recursive structure.",
        "One possible slogan is that the algebra of games wants an operator whose fixed points, kernels, or normal forms see the same geometry as the usual \\(\\mathcal{P}\\)-positions."
      ],
      questions: [
        "Is there a natural Rota-Baxter identity attached to disjoint sum, option formation, or a derivative of games?",
        "Can the construction be stated inside recursive coalgebras rather than on a chosen concrete class of games?"
      ],
      links: [
        ["Games as recursive coalgebras", "https://arxiv.org/abs/2510.22886"],
        ["Problem 5.0.3", "problems/index.html#problem-5.0.3"]
      ]
    },
    {
      slug: "space-time-game-of-life",
      date: "2026-03-17",
      updated: "2026-04-22",
      title: "Space-Time for Conway's Game of Life",
      status: "speculative",
      tags: ["topos", "dynamics", "Game of Life"],
      noteFile: "Space⋊Time for Conway's Game of Life.pdf",
      abstract:
        "A tentative geometric vocabulary for treating a cellular automaton as a space-time object.",
      paragraphs: [
        "For Conway's Game of Life, the configuration space and the time evolution are usually kept conceptually separate. The speculative direction is to package them into a single space-time object.",
        "The attractive part is that local rules, observables, and quotient behavior may become geometric rather than purely operational.",
        "The present question is how much of this can be expressed through a relative topos or a pretopological space without losing the computational content."
      ],
      questions: [
        "What is the correct notion of open set or observable for a space-time of Life?",
        "Can gliders, still lifes, and finite support conditions be seen as geometric subobjects?"
      ],
      links: [["Favorite Topoi: discrete dynamical systems", "favorite-topoi/index.html#discrete-dynamical-systems"]]
    }
  ],
  activities: [
    {
      title: "Plans",
      items: [
        { date: "2026-07", text: "July 2026: planning to attend ACT 2026.", href: "https://progetto-itaca.github.io/fests/fest26.html" },
        { date: "2026-09-29", text: "September 29, 2026: give a talk at ItaCa Fest 2026.", href: "https://progetto-itaca.github.io/fests/fest26.html" }
      ]
    },
    {
      title: "2026",
      items: [
        { date: "2026-01", text: "Submitted Ph.D. thesis.", href: "https://www.ms.u-tokyo.ac.jp/seminar/2026/sem26-042.html" },
        { date: "2026-02-07 - 2026-02-08", text: "Organized and attended Categories in Tokyo 2.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC2%E5%9B%9E%E9%9B%86%E4%BC%9A" },
        { date: "2026-02-22 - 2026-02-23", text: "Attended 20th CGP project.", href: "http://www.alg.cei.uec.ac.jp/itohiro/Games/" },
        { date: "2026-03-11", text: "Presented a poster with Ryoma Sin'ya at PPL 2026.", href: "https://jssst-ppl.org/workshop/2026/" },
        { date: "2026-03-16 - 2026-03-17", text: "Gave a talk at CSCAT 2026.", href: "https://www.kurims.kyoto-u.ac.jp/~tsanada/event/cscat2026.html" },
        { date: "2026-03-24", text: "Received Ph.D. as department representative at the graduation ceremony.", href: "https://www.u-tokyo.ac.jp/ja/students/events/h15_04.html" },
        { date: "2026-03-27", text: "Attended Workshop on Modal Logic.", href: "https://sites.google.com/view/ookayamamodallogic/%E3%83%9B%E3%83%BC%E3%83%A0" },
        { date: "2026-03-27", text: "Attended PCT seminar.", href: "https://pctseminar.github.io" },
        { date: "2026-04-05", text: "Joined a public talk at Genron Cafe.", href: "https://genron-cafe.jp/event/20260405/" },
        { date: "2026-04-06 - 2026-04-08", text: "Attended and spoke at Differentiation in category theory and program semantics, Kyoto University.", href: "https://sites.google.com/view/differential-kyoto-2026/home" }
      ]
    },
    {
      title: "2025",
      items: [
        { date: "2025-01 - 2025-02", text: "Lab Rotation on condensed mathematics.", href: "https://www.s.u-tokyo.ac.jp/en/FoPM/about/features.html" },
        { date: "2025-02-12", text: "Visited Kyoto Category Theory Meeting.", href: "https://sites.google.com/view/kyoto-category-theory-meeting/program" },
        { date: "2025-02-28", text: "Gave a talk at CMUP SAL seminar.", href: "https://www.cmup.pt/index.php/events/topoi-automata" },
        { date: "2025-03-05", text: "Uploaded Lawvere's fourth open problem preprint.", href: "https://arxiv.org/abs/2503.03439" },
        { date: "2025-04-11 - 2025-06-26", text: "Visited Paris as a research associate at CTTA and visitor in Paris-Saclay University.", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { date: "2025-05-27 - 2025-06-05", text: "Gave talks at IRIF and LIPN.", href: "https://www.irif.fr/seminaires/semantique/index" },
        { date: "2025-07-17", text: "Gave a talk at CT 2025.", href: "https://conference.math.muni.cz/ct2025/" },
        { date: "2025-10-10", text: "Wrote in 数学セミナー2025年11月号.", href: "https://www.nippyo.co.jp/shop/magazine/9611.html" },
        { date: "2025-10-18 - 2025-10-19", text: "Attended Takagi Lecture 2025.", href: "https://www.kurims.kyoto-u.ac.jp/~toshi/jjm/JJMJ/JJM_JHP/contents/takagi_jp/25th/index.htm" },
        { date: "2025-10-27", text: "Uploaded preprint on games as recursive coalgebras.", href: "https://arxiv.org/abs/2510.22886" },
        { date: "2025-10-31", text: "Gave a talk at SLACS 2025.", href: "https://sites.google.com/view/slacs2025akita/home" },
        { date: "2025-11-07", text: "Uploaded preprint on normalization of a subgroup.", href: "https://arxiv.org/abs/2511.05012" },
        { date: "2025-11-28 - 2025-12-05", text: "Gave talks at UTokyo Logic seminar.", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic/" }
      ]
    },
    {
      title: "2024",
      items: [
        { date: "2024-04-25", text: "Spoke at AFSA.", href: "https://afsa.jp/g-en/" },
        { date: "2024-05-18", text: "Organized Categories in Tokyo 0.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC0%E5%9B%9E%E9%9B%86%E4%BC%9A" },
        { date: "2024-06-28", text: "Gave a talk at CT 2024 in Santiago de Compostela.", href: "https://www.usc.gal/regaca/ct2024/" },
        { date: "2024-07-01 - 2024-07-05", text: "Attended TACL 2024.", href: "https://iiia.csic.es/tacl2024/" },
        { date: "2024-08", text: "Paper on quotient toposes of discrete dynamical systems appeared in JPAA.", href: "https://doi.org/10.1016/j.jpaa.2024.107657" },
        { date: "2024-11-10", text: "Uploaded Topoi of automata I.", href: "https://arxiv.org/abs/2411.06358" },
        { date: "2024-11-23", text: "Organized Categories in Tokyo 1.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC1%E5%9B%9E%E9%9B%86%E4%BC%9A" },
        { date: "2024-12-10", text: "Wrote for Advent Calendar 2024.", href: "https://adventar.org/calendars/10265" }
      ]
    },
    {
      title: "2023",
      items: [
        { date: "2023-02-14", text: "Uploaded first paper on arXiv.", href: "https://arxiv.org/abs/2302.06851" },
        { date: "2023-06", text: "Attended EM-cats.", href: "https://topos.institute/events/em-cats/" },
        { date: "2023-09-11", text: "A friend's preprint, which I was a little involved in, was uploaded.", href: "https://arxiv.org/abs/2309.05304" },
        { date: "2023-09", text: "Talked about Joyal's species on a Japanese YouTube channel.", href: "https://www.youtube.com/live/gInu95RiCUo" },
        { date: "2023-10-10", text: "A combinatorial game theory preprint acknowledging me was uploaded.", href: "https://arxiv.org/abs/2310.06610" },
        { date: "2023-12-10", text: "Spoke at 数学基礎論若手の会2023.", href: "https://sites.google.com/view/mlwakatenokai2023" }
      ]
    },
    {
      title: "Other",
      items: [
        { text: "Review experience: 1." },
        { text: "Hobbies: bouldering, programming, and simulations." }
      ]
    }
  ],
  awards: [
    { text: "Dean's award, Graduate School of Mathematical Sciences, The University of Tokyo, doctoral course, March 2026.", href: "https://www.ms.u-tokyo.ac.jp/kyoumu/katyoushou.html" },
    { text: "Graduation Representative, Graduate School of Mathematical Sciences, The University of Tokyo, doctoral course, March 2026.", href: "https://www.u-tokyo.ac.jp/ja/students/events/h15_04.html" },
    { text: "SLACS 2025 presentation award, October 2025.", href: "https://sites.google.com/view/slacs2025akita/home" },
    { text: "Dean's award, Graduate School of Mathematical Sciences, The University of Tokyo, master's course, March 2024.", href: "https://www.ms.u-tokyo.ac.jp/kyoumu/katyoushou.html" },
    { text: "Graduation Representative, Graduate School of Mathematical Sciences, The University of Tokyo, master's course, March 2024.", href: "https://www.u-tokyo.ac.jp/ja/students/events/h15_04.html" },
    { text: "Faculty of Science encouragement award, The University of Tokyo, March 2022.", href: "https://warp.ndl.go.jp/info:ndljp/pid/12972979/www.s.u-tokyo.ac.jp/ja/awards/encouragement/R3.html" }
  ],
  education: [
    { text: "Worked as a tutor at SEG for several years around 2019.", href: "https://www.seg.co.jp/" },
    { text: "Private tutor for gifted elementary and junior high school students from February 2020 to September 2022." },
    { text: "Teaching modern mathematics at Math Space Topos since July 2020.", href: "https://sites.google.com/view/mspacetopos/home" },
    { text: "Advisor to 角川ドワンゴ学園 研究部 since June 2025.", href: "https://nnn.ed.jp/attractiveness/extracurricular/club/kenkyubu/" }
  ],
  problems: [
    problemEntry({
      id: "1.1.1",
      formal: true,
      theme: "Local state classifier",
      title: "Etendue via the bottom element of \\(\\Xi\\)",
      statement:
        "Is a Grothendieck topos \\(\\mathcal{E}\\) an etendue if and only if its local state classifier \\(\\Xi\\), viewed as an internal semilattice, has a global bottom element \\(\\bot:1\\to\\Xi\\)?",
      description:
        "For comparison, a Grothendieck topos is localic if and only if its local state classifier is terminal. The assertion is known for all presheaf topoi, and this question was also posed by Matias Menni.",
      tags: ["etendue", "local state classifier", "bottom element"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.1.2",
      formal: true,
      theme: "Local state classifier",
      title: "Local monomorphisms and commutation with \\(\\xi\\)",
      statement:
        "The local state classifier of a Grothendieck topos \\(\\mathcal{E}\\) is the colimit of all local monomorphisms in the sense of Kock-Moerdijk. Is a morphism \\(f:A\\to B\\) local mono if and only if it commutes with \\(\\xi\\), namely \\(\\xi_B f=\\xi_A\\)?",
      description: "Pointed out by Ryo Suzuki; the older note marked this entry as updated on 25 March 2025.",
      tags: ["local monomorphism", "Kock-Moerdijk", "xi"],
      links: [problemRefs.tac, problemRefs.kockMoerdijk],
      updated: "25 March 2025 / reviewed 30 March 2026"
    }),
    problemEntry({
      id: "1.1.3",
      theme: "Local state classifier",
      title: "Relative local state classifiers",
      statement:
        "If the local-monomorphism characterization above is true, one can define a relative local state classifier for any geometric morphism. Does it classify all relative hyperconnected geometric morphisms, just as in the absolute case?",
      description: "A relative version of the local-state-classifier classification of hyperconnected quotients.",
      tags: ["relative topos", "hyperconnected", "geometric morphism"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.1.4",
      formal: true,
      theme: "Local state classifier",
      title: "Bounded elementary topoi with local state classifiers",
      statement:
        "Does an elementary topos have a local state classifier whenever it is bounded over a topos with a local state classifier?",
      description: "Every Grothendieck topos has a local state classifier; the question asks for a bounded elementary extension of that phenomenon.",
      tags: ["elementary topos", "bounded topos", "local state classifier"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.2.1",
      theme: "Normalizer operator",
      title: "Normalizer operators in other topoi",
      statement:
        "In the topos of \\(G\\)-actions, \\(\\Xi\\) is the \\(G\\)-set of subgroups of \\(G\\), and the canonical morphism \\(\\xi:\\Xi\\to\\Xi\\) is the normalizer operator. How does this operator look in other topoi?",
      description: "The canonical map \\(\\xi:\\Xi\\to\\Xi\\) is typically not the identity, and the group-action case gives the motivating example.",
      tags: ["normalizer", "group actions", "subgroups"],
      links: [problemRefs.normalizer]
    }),
    problemEntry({
      id: "1.2.2",
      theme: "Normalizer operator",
      title: "Normal subgroups inside an arbitrary topos",
      statement:
        "Using the normalizer operator, one can define the object consisting of all normal subgroups inside an arbitrary topos. What does this object classify?",
      description:
        "In the group-action topos, normal subgroups correspond bijectively to essential and connected geometric morphisms from \\(G\\)-\\(\\mathbf{Set}\\).",
      tags: ["normal subgroup", "essential morphism", "connected morphism"],
      links: [problemRefs.normalizer]
    }),
    problemEntry({
      id: "1.2.3",
      theme: "Normalizer operator",
      title: "Dedekind presheaf topoi for monoids",
      statement:
        "Define a Dedekind topos to be a topos \\(\\mathcal{E}\\) whose normalizer operator coincides with the top element \\(T\\). A group \\(G\\) is Dedekind if and only if \\(\\mathbf{PSh}(G)\\) is Dedekind. When is \\(\\mathbf{PSh}(M)\\) Dedekind for a monoid \\(M\\)?",
      description: "This is the monoid analogue of the group-theoretic condition that every subgroup is normal.",
      tags: ["Dedekind group", "monoid", "presheaf topos"],
      links: [problemRefs.normalizer]
    }),
    problemEntry({
      id: "1.3.1",
      formal: true,
      theme: "Local state classifier",
      title: "Local state classifier of a slice topos",
      statement:
        "Is the local state classifier of the slice topos \\(\\mathcal{E}/X\\) given by pulling back the order projection \\(\\preceq\\to\\Xi\\times\\Xi\\to\\Xi\\) along the canonical morphism \\(\\xi:X\\to\\Xi\\)?",
      description: "Informally: is it the object of all local states that are more unfolded than \\(X\\)?",
      tags: ["slice topos", "order projection", "unfolding"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.4.1",
      theme: "Local state classifier",
      title: "Local state classifiers of sheaf topoi",
      statement:
        "Is there a simple description of \\(\\Xi\\) when the defining site \\((\\mathcal{C},J)\\) has a special form?",
      description:
        "For instance, what does \\(\\Xi\\) look like for sheaf topoi over regular, coherent, atomic, local, locally connected, or extensive sites?",
      tags: ["sheaf topos", "site", "regular site", "coherent site"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.5.1",
      theme: "Local state classifier",
      title: "LSC classification and Gabriel's theorem",
      statement:
        "Is there a common generalization of the classification by local state classifiers and Gabriel's classification theorem for localizing subcategories of module categories?",
      description: "One possible route is a generalization to enriched topos theory.",
      tags: ["Gabriel theorem", "localizing subcategory", "enriched topos"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.0.1",
      theme: "Local state classifier",
      title: "Local state classifiers of topoi of spaces",
      statement:
        "How does the local state classifier of a topos of spaces look? For example, what is the local state classifier of the topos of simplicial sets?",
      description:
        "A related formulation asks for a characterization of local, hyperconnected, or cohesive topoi in terms of a local state classifier. This is partially answered by Menni's work on non-singular maps.",
      tags: ["spaces", "simplicial sets", "cohesive topos"],
      links: [problemRefs.menni, problemRefs.tac]
    }),
    problemEntry({
      id: "1.0.2",
      theme: "Local state classifier",
      title: "Galois correspondences from internal filters",
      statement:
        "For some Galois group action ringed topoi, internal filters of \\(\\Xi\\) and hyperquotients produce a Galois-theoretic correspondence. How can this phenomenon be generalized?",
      description: "The older note records this as an active working direction.",
      tags: ["Galois theory", "ringed topos", "internal filter", "hyperquotient"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.0.3",
      theme: "Local state classifier",
      title: "What does \\(\\Xi\\) contravariantly represent?",
      statement: "What does the local state classifier \\(\\Xi\\) contravariantly represent?",
      description:
        "In every presheaf topos \\(\\mathbf{PSh}(\\mathcal{C})\\), morphisms \\(y(c)\\to\\Xi\\) are in bijection with quotient objects of \\(y(c)\\).",
      tags: ["representability", "Yoneda", "quotient object"],
      links: [problemRefs.tac]
    }),
    problemEntry({
      id: "1.0.4",
      theme: "Local state classifier",
      title: "Subtopoi and hyperconnected quotients as an \\(R\\)-module",
      statement:
        "The meet-semilattice endomorphisms of the subobject classifier \\(\\Omega\\) form a noncommutative semiring \\(R\\), whose idempotents correspond to subtopoi. By the local-state-classifier theory, hyperconnected quotients of \\(\\mathcal{E}\\) form an \\(R\\)-module. How are subtopoi and hyperconnected quotients related?",
      description:
        "The guiding image is that a Lawvere-Tierney topology behaves like a clopen in \\(\\operatorname{Spec} R\\), while the module of hyperquotients behaves like a quasi-coherent sheaf on it.",
      tags: ["Lawvere-Tierney topology", "subtopos", "hyperconnected quotient", "semiring"],
      links: [problemRefs.weakTopologies, problemRefs.tac, problemRefs.lawvereOpen]
    }),
    problemEntry({
      id: "1.0.5",
      theme: "Local state classifier",
      title: "Direct connection with copower objects",
      statement: "Is there a direct connection between local state classifiers and copower objects?",
      description: "This question was independently asked by Richard Garner and Peter Johnstone.",
      tags: ["copower object", "local state classifier"],
      links: [problemRefs.copower, problemRefs.tac]
    }),
    problemEntry({
      id: "1.0.6",
      theme: "Local state classifier",
      title: "Direct connection with isotropy groups",
      statement: "Is there a direct connection between local state classifiers and the isotropy group of a topos?",
      description: "A short problem linking local states to topos-theoretic isotropy.",
      tags: ["isotropy", "topos"],
      links: [problemRefs.isotropy, problemRefs.tac]
    }),
    problemEntry({
      id: "2.0.1",
      theme: "Topoi of automata",
      title: "Constructing the regular-language topos from syntax",
      statement:
        "Is there a syntactic way to construct the Boolean ringed topos of regular languages from the syntax of regular expressions?",
      description: "A syntax-first version of the topos of regular languages.",
      tags: ["regular language", "regular expression", "Boolean ringed topos"],
      links: [problemRefs.automata]
    }),
    problemEntry({
      id: "2.0.2",
      formal: true,
      theme: "Topoi of automata",
      title: "How many quotient topoi does \\(\\mathbf{PSh}(\\Sigma^*)\\) have?",
      statement: "What is the number of quotient topoi of \\(\\mathbf{PSh}(\\Sigma^*)\\)? Is it small?",
      description:
        "If \\(|\\Sigma|=1\\), it is small. If \\(|\\Sigma|\\) is infinite, it has proper-class size. What happens when \\(|\\Sigma|=2\\)? The finite and infinite cases are joint work with Yuhi Kamio.",
      tags: ["quotient topos", "free monoid", "alphabet size"],
      links: [problemRefs.automata, problemRefs.kamioFinite, problemRefs.kamioInfinite, problemRefs.lawvereFirst]
    }),
    problemEntry({
      id: "2.0.3",
      formal: true,
      theme: "Topoi of automata",
      title: "Cohomology of regular-language topoi",
      statement:
        "What is the topos cohomology of the topos of regular languages, or of the topos of star-free languages?",
      description: "A cohomological problem about language-theoretic topoi.",
      tags: ["topos cohomology", "regular language", "star-free language"],
      links: [problemRefs.automata]
    }),
    problemEntry({
      id: "2.0.4",
      formal: true,
      theme: "Topoi of automata",
      title: "Points of the topos of regular languages",
      statement: "Can we describe all points of the topos of regular languages?",
      description:
        "The points of the topos of \\(\\Sigma\\)-sets can be fully described: there is one canonical point, and noncanonical points correspond to infinite words up to finite edit distance. A more conceptual version asks what theory this topos classifies.",
      tags: ["points", "regular language", "Sigma-sets", "classified theory"],
      links: [problemRefs.automata]
    }),
    problemEntry({
      id: "2.0.5",
      theme: "Topoi of automata",
      title: "Exponential objects in the regular-language topos",
      statement:
        "What are exponential objects in the topos of regular languages in automata-theoretic terms?",
      description: "This is possibly related to the syntactic construction problem in 2.0.1.",
      tags: ["exponential object", "automata theory", "regular language"],
      links: [problemRefs.automata]
    }),
    problemEntry({
      id: "2.0.6",
      formal: true,
      theme: "Topoi of automata",
      title: "Automorphisms of the finite-orbit \\(\\Sigma\\)-set topos",
      statement:
        "The automorphism group of the topos \\(\\Sigma\\)-\\(\\mathbf{Set}\\) is the symmetric group \\(\\mathfrak{S}(\\Sigma)\\). What is \\(\\operatorname{Aut}(\\Sigma\\text{-}\\mathbf{Set}_{\\mathrm{o.f.}})\\), and what do its symmetries imply about regular languages?",
      description: "A symmetry problem for the finite-orbit side of the automata-topos story.",
      tags: ["automorphism group", "finite orbit", "regular language"],
      links: [problemRefs.automata]
    }),
    problemEntry({
      id: "3.0.1",
      formal: true,
      theme: "Quotient topoi",
      title: "Totally disconnected locales and topoi",
      statement:
        "Call a Grothendieck topos \\(\\mathcal{E}\\) totally disconnected if every connected geometric morphism from \\(\\mathcal{E}\\) is an equivalence. If \\(\\mathcal{E}\\) is totally disconnected, then it is a sheaf topos over a totally disconnected locale. Does the converse hold?",
      description:
        "There is a totally disconnected topos that is neither zero-dimensional nor totally separable: consider \\(\\mathbb{Q}+\\mathbb{Q}\\) quotiented by \\(\\mathbb{Q}^{*}\\).",
      tags: ["totally disconnected", "locale", "connected morphism"],
      links: [problemRefs.lawvereOpen]
    }),
    problemEntry({
      id: "4.0.1",
      theme: "Completely connected topoi",
      title: "Right definition of completely connected morphisms",
      statement: "What is the right definition of completely connected geometric morphisms?",
      description: "Colocal geometric morphisms may provide the answer.",
      tags: ["completely connected", "colocal", "geometric morphism"],
      links: [problemRefs.connected, problemRefs.colocal]
    }),
    problemEntry({
      id: "4.0.2",
      theme: "Completely connected topoi",
      title: "Elementary definition of container objects",
      statement:
        "Is there an elementary definition of container object that makes sense in an arbitrary elementary topos?",
      description: "This is motivated by the fact that the definition of a local topos can be rephrased in an elementary way.",
      tags: ["container object", "elementary topos", "local topos"],
      links: [problemRefs.connected, problemRefs.localTopos]
    }),
    problemEntry({
      id: "4.0.3",
      theme: "Completely connected topoi",
      title: "Duality between completely connected and local topoi",
      statement:
        "A presheaf topos \\(\\mathbf{PSh}(\\mathcal{C})\\) is completely connected if and only if \\(\\mathbf{PSh}(\\mathcal{C}^{\\mathrm{op}})\\) is local. Is there a broader duality between completely connected topoi and local topoi?",
      description:
        "For example, is the category of Lawvere distributions on a local topos completely connected as in the presheaf case? If not, is the obstruction described by the monoidal closed structure of presentable categories?",
      tags: ["local topos", "Lawvere distribution", "presentable category"],
      links: [problemRefs.connected, problemRefs.lawvereDistribution, problemRefs.presentableTensor]
    }),
    problemEntry({
      id: "4.0.4",
      formal: true,
      theme: "Completely connected topoi",
      title: "When is \\(\\operatorname{Fam}(\\mathcal{C})\\) a Grothendieck topos?",
      statement: "For a category \\(\\mathcal{C}\\), when is its family construction \\(\\operatorname{Fam}(\\mathcal{C})\\) a Grothendieck topos?",
      description:
        "Typical examples include all Grothendieck topoi, pointed sets \\(\\mathbf{Set}_*\\), and the orbit category \\(\\mathcal{O}_G\\) of a fixed group \\(G\\). Equivalently, what categories arise as the full subcategory of connected objects of a locally connected topos?",
      tags: ["family construction", "connected object", "locally connected topos"],
      links: [problemRefs.connected, problemRefs.games]
    }),
    problemEntry({
      id: "5.0.1",
      formal: true,
      theme: "Combinatorial games",
      title: "Monoidal closed structures on games",
      statement:
        "Classify all monoidal closed structures on the locally finitely presentable category of combinatorial games.",
      description: "This corresponds to Questions 5.5 and 5.6 of the games-as-recursive-coalgebras paper.",
      tags: ["monoidal closed", "locally finitely presentable", "combinatorial game"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "5.0.2",
      theme: "Combinatorial games",
      title: "A double category of games",
      statement:
        "Is there a double category \\(\\mathbf{Games}\\) whose vertical part is the category of games as recursive coalgebras and whose horizontal part is, in some sense, Joyal's compact closed category of games and strategies?",
      description: "A bridge between the recursive-coalgebraic and strategy-categorical views of games.",
      tags: ["double category", "recursive coalgebra", "Joyal games"],
      links: [problemRefs.games, problemRefs.joyalGames]
    }),
    problemEntry({
      id: "5.0.3",
      theme: "Combinatorial games",
      title: "Differential structures in the recursive-coalgebraic formulation",
      statement:
        "How do the differential structures of the games paper appear in the recursive-coalgebraic formulation, especially for the Bouton monoids \\(B_{\\vee,+}\\) with respect to Conway addition?",
      description: "This corresponds to Question 5.1 of the games-as-recursive-coalgebras paper.",
      tags: ["differential structure", "Bouton monoid", "Conway addition"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "5.0.4",
      theme: "Combinatorial games",
      title: "Partisan games via \\(\\mathcal{P}_{\\mathrm{fin}}\\times\\mathcal{P}_{\\mathrm{fin}}\\)",
      statement:
        "To what extent is the theory of partisan games comprehended by replacing \\(\\mathcal{P}_{\\mathrm{fin}}\\) with \\(\\mathcal{P}_{\\mathrm{fin}}\\times\\mathcal{P}_{\\mathrm{fin}}\\)?",
      description: "This corresponds to Question 5.3 of the games-as-recursive-coalgebras paper.",
      tags: ["partisan game", "finite powerset", "recursive coalgebra"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "5.0.5",
      theme: "Combinatorial games",
      title: "Internal hom for Conway addition",
      statement: "What is the internal hom with respect to Conway addition?",
      description: "This corresponds to Question 5.7 of the games-as-recursive-coalgebras paper.",
      tags: ["internal hom", "Conway addition", "closed structure"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "5.0.6",
      theme: "Combinatorial games",
      title: "The Bouton monoid \\(B_{\\vee,\\mathrm{Grundy}}\\)",
      statement:
        "What is the Bouton monoid \\(B_{\\vee,\\mathrm{Grundy}}\\)? Is it just the miniature monoid \\((H,\\vee_H)\\)?",
      description: "This corresponds to Question 5.8 of the games-as-recursive-coalgebras paper.",
      tags: ["Bouton monoid", "Grundy value", "join"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "5.0.7",
      theme: "Combinatorial games",
      title: "Categorical generalization of the games framework",
      statement:
        "To what extent is the framework categorically generalized? In particular, can it be done for any locally presentable category \\(\\mathcal{C}\\) and any accessible endofunctor \\(T:\\mathcal{C}\\to\\mathcal{C}\\)?",
      description: "This corresponds to Question 5.9 of the games-as-recursive-coalgebras paper.",
      tags: ["locally presentable category", "accessible endofunctor", "coalgebra"],
      links: [problemRefs.games]
    }),
    problemEntry({
      id: "6.0.1",
      formal: true,
      theme: "Elementary topoi",
      title: "Finite presheaf categories as elementary topoi",
      statement:
        "For a small category \\(\\mathcal{C}\\), when is its finite presheaf category \\(\\mathbf{fPSh}(\\mathcal{C})=[\\mathcal{C}^{\\mathrm{op}},\\mathbf{Set}]\\) an elementary topos, or a locally cartesian closed category?",
      description:
        "If \\(\\mathcal{C}\\) is finite or a group, \\(\\mathbf{fPSh}(\\mathcal{C})\\) is known to be a topos. More generally, if every slice \\(\\mathcal{C}/c\\) is essentially finite, then \\(\\mathbf{fPSh}(\\mathcal{C})\\) is a topos. This question has been discussed with Jeremie Marques and is motivated by enumerative combinatorics and Burnside riegs.",
      tags: ["finite presheaf", "locally cartesian closed", "Burnside rieg"],
      links: []
    }),
    problemEntry({
      id: "7.0.1",
      theme: "Riegs",
      title: "Elements of the free rieg as games",
      statement:
        "Let \\(F_1\\) be the free rieg generated by one element \\(x\\). Can elements of \\(F_1\\) be interpreted as a kind of combinatorial game?",
      description:
        "If so, can the morphism \\(F_1\\to\\mathbb{N}\\) sending \\(x\\) to \\(0\\) be interpreted in terms of games?",
      tags: ["free rieg", "combinatorial game", "natural numbers"],
      links: [problemRefs.quantumGames]
    }),
    problemEntry({
      id: "7.0.2",
      formal: true,
      theme: "Riegs",
      title: "Functions \\(\\mathbb{N}\\to\\mathbb{N}\\) from \\(F_1\\)",
      statement: "When can a function \\(\\mathbb{N}\\to\\mathbb{N}\\) be described by an element of the free algebra \\(F_1\\)?",
      description: "A representability question for unary functions by terms in the free rieg.",
      tags: ["free algebra", "natural numbers", "rieg"],
      links: []
    }),
    problemEntry({
      id: "7.0.3",
      formal: true,
      theme: "Riegs",
      title: "The subrieg generated by nonnegative rationals",
      statement:
        "What is the subrieg of \\([0,\\infty)\\) generated by the nonnegative rational numbers?",
      description:
        "Are there nontrivial equations? Is it isomorphic to the free rieg generated by the rig \\(\\mathbb{Q}_{\\ge 0}\\)?",
      tags: ["nonnegative rationals", "free rieg", "equations"],
      links: []
    }),
    problemEntry({
      id: "7.0.4",
      formal: true,
      theme: "Riegs",
      title: "Higgs Prime conjecture",
      statement: "Higgs Prime conjecture.",
      description: "The older list records this as a rieg-related formal problem.",
      tags: ["Higgs prime", "number theory", "rieg"],
      links: [problemRefs.higgsPrime]
    }),
    problemEntry({
      id: "7.0.5",
      formal: true,
      theme: "Riegs",
      title: "Connected compact Hausdorff riegs",
      statement: "Is there a nontrivial connected compact Hausdorff rieg?",
      description:
        "Lawvere's weak infinite-dimensional sphere is a contractible Hausdorff Boolean algebra, hence a Hausdorff rieg. Every compact Hausdorff ring, in particular every compact Hausdorff Boolean ring, is profinite. Every path-connected rig is contractible, via a homotopy from \\(0\\times -\\) to \\(1\\times -\\).",
      tags: ["compact Hausdorff", "connected", "Boolean algebra", "profinite"],
      links: [problemRefs.elephant, problemRefs.profiniteGroups],
      trail: [
        {
          label: "Sketches of an Elephant",
          href: problemRefs.elephant[1],
          note: "Reference for the weak infinite-dimensional sphere as a Hausdorff Boolean algebra."
        },
        {
          label: "Profinite Groups",
          href: problemRefs.profiniteGroups[1],
          note: "Reference for compact Hausdorff rings being profinite."
        }
      ]
    })
  ],
  links: [
    {
      title: "Profiles",
      items: [
        ["ORCiD", "https://orcid.org/0009-0008-6975-8908"],
        [
          "arXiv author search",
          "https://arxiv.org/search/math?query=Hora%2C+Ryuya&searchtype=author&abstracts=show&order=-announced_date_first&size=50"
        ],
        ["researchmap", "https://researchmap.jp/ryuyahora"],
        ["nLab", "https://ncatlab.org/nlab/show/Ryuya+Hora"]
      ]
    },
    {
      title: "Friends' Pages",
      items: [
        ["Koki Sakamoto", "https://sites.google.com/view/ksakamoto/home"],
        ["Mao Hoshino", "https://mao-hoshino.github.io/"],
        ["数理物理チャンネル", "https://physics.math.jp/"],
        ["Yuto Kawase", "https://ykawase5048.github.io/yutokawase/"],
        ["Keisuke Hoshino", "https://sites.google.com/view/keisuke-hoshino/"],
        ["Hayato Nasu", "https://hayatonasu.github.io/hayatonasu/"],
        ["Yuki Maehara", "https://yukimaehara.github.io"],
        ["Shuho Kanda", "https://shuhokanda.com/"],
        ["Junnosuke Koizumi", "http://jkoizumi144.com/index.html"],
        ["Yugo Takanashi", "https://tk-pair.github.io/index.html"]
      ]
    },
    {
      title: "Friends' Papers",
      items: [
        ["Filtered colimit elimination from Birkhoff's variety theorem", "https://arxiv.org/abs/2309.05304"],
        ["On iterated circumcenter sequences", "https://arxiv.org/abs/2407.19767"],
        ["Quadratic residues and domino tilings", "https://arxiv.org/abs/2311.13597"],
        ["On variations of Yama Nim and Triangular Nim", "https://arxiv.org/abs/2310.06610"],
        ["On the theories classified by an etendue", "https://arxiv.org/abs/2507.04526"]
      ]
    },
    {
      title: "Books and Events",
      items: [
        ["組み合わせゲーム理論の世界", "https://www.kyoritsu-pub.co.jp/book/b10044851.html"],
        ["数学ガールの秘密ノート 場合の数", "https://note7.hyuki.net"],
        ["Algorithmic Foundations for Social Advancement", "https://link.springer.com/book/10.1007/978-981-96-0668-9"],
        ["数学セミナー2025年11月号 圏論の質問箱", "https://www.nippyo.co.jp/shop/magazines/latest/4.html"],
        ["大学への数学 2025年11月号 数理空間トポス", "https://www.tokyo-s.jp/assets/uploads/ds2511mokuji_d_ol.pdf"],
        ["数理物理ラジオ 母関数の種", "https://www.youtube.com/live/gInu95RiCUo"],
        ["数理空間トポス 5周年記念公開イベント", "https://www.shosen.co.jp/event/9341/#:~:text=%E5%8A%A0%E8%97%A4%E6%96%87%E5%85%83"]
      ]
    }
  ]
};

const state = {
  paperQuery: "",
  paperView: "list",
  talkQuery: "",
  talkTimelineKey: "",
  talkMapLocationId: "",
  talkMapZoom: {
    europe: 1,
    japan: 1
  },
  talkMapPan: {
    europe: null,
    japan: null
  },
  researchTheme: "",
  problemQuery: "",
  problemStatus: "all",
  selectedProblemId: "",
  favoriteToposId: "",
  siteSearchQuery: new URLSearchParams(globalThis.location?.search || "").get("q") || "",
  noteQuery: "",
  noteLanguage: "all",
  noteYear: "all",
  noteTheme: "all",
  speculativeQuery: ""
};

const researchmapData = globalThis.researchmapData || null;
const overleafData = globalThis.overleafData || { artifacts: [] };
const talkMapData = globalThis.talkMapData || null;
const categoriesMapData = globalThis.categoriesMapData || null;

const i18nText = {
  ja: {
    "Profile": "プロフィール",
    "Documents": "資料",
    "Others": "その他",
    "Overview": "概要",
    "Visits": "訪問",
    "Papers": "論文",
    "Talks": "発表",
    "Notes": "ノート",
    "Activities": "活動",
    "CV/Awards": "CV/受賞",
    "Problems": "Problems",
    "Favorite Topoi": "好きなトポス",
    "Search": "検索",
    "Links": "リンク",
    "Ryuya Hora.": "Ryuya Hora.",
    "Papers by Ryuya Hora.": "Ryuya Hora の論文。",
    "Documents by Ryuya Hora.": "Ryuya Hora の資料。",
    "Other projects and links by Ryuya Hora.": "Ryuya Hora のその他のプロジェクトとリンク。",
    "Talks by Ryuya Hora.": "Ryuya Hora の発表。",
    "Notes by Ryuya Hora.": "Ryuya Hora のノート。",
    "Activities by Ryuya Hora.": "Ryuya Hora の活動。",
    "CV by Ryuya Hora.": "Ryuya Hora の CV。",
    "Problems by Ryuya Hora.": "Ryuya Hora の Problems。",
    "Links.": "リンク。",
    "Favorite topoi.": "好きな topoi。",
    "Search.": "検索。",
    "Speculative notes.": "思弁的なノート。",
    "Topos Cabinet": "Topos Cabinet",
    "A small cabinet of favorite topoi by Ryuya Hora.": "Ryuya Hora の好きな topoi を集めた小さなページです。",
    "A small, growing page for topoi that are mathematically useful, visually memorable, or just too charming not to keep nearby.":
      "数学的に役立つ、見た目にも記憶に残る、あるいは単に近くに置いておきたい topoi を集めていくページです。",
    "Collection": "コレクション",
    "Topoi to Keep Around": "手元に置きたい Topoi",
    "Map": "見取り図",
    "Quick Comparison": "Quick Comparison",
    "Favorite topoi. Last updated: 22 April 2026.": "Favorite topoi. 最終更新: 2026年4月22日",
    "Site Search": "サイト内検索",
    "Search this site.": "サイト内検索。",
    "Search public pages, papers, talks, notes, activities, problems, favorite topoi, and links.":
      "公開ページ、論文、発表、ノート、活動、Problems、好きなトポス、リンクを検索します。",
    "Search the site": "サイト内を検索",
    "topos, automata, Categories in Tokyo...": "topos, automata, Categories in Tokyo...",
    "Type to search the site.": "検索語を入力してください。",
    "No public site results match this search.": "この検索に合う公開ページはありません。",
    "No linked items yet.": "関連項目はまだありません。",
    "Site search. Last updated: 22 April 2026.": "サイト内検索。最終更新: 2026年4月22日",
    "Search notes": "ノート内検索",
    "Note filters": "ノートの絞り込み",
    "Language": "言語",
    "Year": "年",
    "Theme": "テーマ",
    "All languages": "すべての言語",
    "All years": "すべての年",
    "Undated": "日付なし",
    "English": "English",
    "Japanese": "日本語",
    "Automata": "Automata",
    "Games": "Games",
    "Number theory": "数論",
    "General": "一般",
    "topos, games, language...": "topos, games, language...",
    "No speculative notes match this search.": "この検索に合う思弁的なノートはありません。",
    "Page": "ページ",
    "Paper": "論文",
    "Talk": "発表",
    "Note": "ノート",
    "Activity": "活動",
    "Problem": "Problem",
    "Topos": "Topos",
    "Link": "リンク",
    "Award": "受賞",
    "Education": "教育歴",
    "Focus": "Focus",
    "Why it is good": "好きな理由",
    "Basic dictionary": "Basic dictionary",
    "Assistant Professor · ZEN University": "ZEN University Assistant Professor",
    "Ryuya Hora": "Ryuya Hora",
    "Category theory, topos theory, computation.": "Category theory, topos theory, computation.",
    "Ryuya Hora studies category theory, topos theory, and the geometry of computation.":
      "Ryuya Hora は category theory, topos theory, and the geometry of computation を研究しています。",
    "I am an assistant professor at ZEN University and a researcher at the Humai Center. My recent work explores how topos theory transfers ideas among algebra, geometry, logic, computation, and combinatorics.":
      "ZEN University の助教、Humai Center の researcher です。最近は、topos theory が algebra, geometry, logic, computation, combinatorics の間でどのようにアイデアを運ぶかを研究しています。",
    "Research": "研究",
    "Papers, preprints, notes, and slides.": "論文、preprint、ノート、スライド。",
    "Web apps, problems, favorite topoi, and links.": "Web apps、Problems、好きな topoi、リンク。",
    "Research Interests": "研究関心",
    "All themes": "すべてのテーマ",
    "Current Positions": "現在の所属",
    "Interests": "関心",
    "Topics": "トピック",
    "Contact": "連絡先",
    "Email": "メール",
    "Site Map": "サイトマップ",
    "Explore": "一覧",
    "Plans": "予定",
    "Upcoming": "今後の予定",
    "All activities": "すべての活動",
    "Recent Papers": "最近の論文",
    "All papers": "すべての論文",
    "Recent Talks": "最近の発表",
    "All talks": "すべての発表",
    "Community": "コミュニティ",
    "A category theory workshop in Tokyo that I founded and organize.": "私が発案し、運営している圏論集会です。",
    "A category theory workshop series and local research community around Tokyo. I am a founder and one of the organizers.":
      "東京周辺の category theory workshop series / local research community です。私は founder かつ organizer の一人です。",
    "Open Categories in Tokyo": "Categories in Tokyo を開く",
    "Related activities": "関連する活動",
    "Last updated: 22 April 2026.": "最終更新: 2026年4月22日",
    "Back to top": "上に戻る",
    "Home": "ホーム",
    "Open navigation": "ナビゲーションを開く",
    "Primary navigation": "主要ナビゲーション",
    "Profile links": "プロフィールリンク",
    "A schematic of the research area": "研究領域の模式図",
    "Timeline controls": "タイムライン操作",
    "Previous talk": "前の発表",
    "Next talk": "次の発表",
    "Problem status filters": "問題ステータスのフィルタ",
    "topos, automata, games...": "topos, automata, games...",
    "year, venue, topic...": "year, venue, topic...",
    "Topos, 2.0.2, rieg...": "Topos, 2.0.2, rieg...",
    "Published papers, preprints, manuscripts in preparation, and related references.":
      "published papers, preprints, manuscripts in preparation と関連資料をまとめています。",
    "Papers and preprints.": "Papers and preprints.",
    "Bibliography": "文献",
    "Research Papers": "研究論文",
    "Filter papers": "論文を絞り込む",
    "Paper view": "論文表示",
    "List": "一覧",
    "Diagrams": "図",
    "Published": "Published",
    "Preprints": "Preprints",
    "Preprint": "Preprint",
    "In preparation": "In preparation",
    "Manuscripts": "Manuscripts",
    "Synced Paper Metadata": "同期された論文メタデータ",
    "Powered by researchmap": "researchmap に基づく",
    "Misc": "その他",
    "Other Writing": "その他の文章",
    "Research papers, preprints, and related writing. Last updated: 22 April 2026.":
      "Research papers, preprints, related writing. 最終更新: 2026年4月22日",
    "Conference talks, seminars, workshop presentations, and available slides.":
      "Conference talks, seminars, workshop presentations とスライドをまとめています。",
    "Talks and slides.": "Talks and slides.",
    "Timeline": "タイムライン",
    "Research Timeline": "研究タイムライン",
    "Paper Timeline": "論文タイムライン",
    "Talk Timeline": "発表タイムライン",
    "Places": "場所",
    "Visits": "訪問",
    "Visit Map": "訪問地図",
    "Visits by place.": "訪問地。",
    "Talk locations by city. Click a marker to focus the list.": "訪問地図です。marker をクリックすると、その場所の訪問一覧に絞れます。",
    "Europe": "Europe",
    "Japan": "日本",
    "Mapped Visits": "地図上の訪問",
    "No mapped visits yet.": "地図表示可能な訪問はまだありません。",
    "Talk": "発表",
    "Paper": "論文",
    "Activity": "活動",
    "Topos theory": "Topos theory",
    "Automata / languages": "Automata / languages",
    "Games": "Games",
    "Category / algebra / logic": "Category / algebra / logic",
    "Other": "その他",
    "Latest": "最近",
    "No timeline entries yet.": "タイムライン項目はまだありません。",
    "Archive": "アーカイブ",
    "Talk List": "発表一覧",
    "Filter talks": "発表を絞り込む",
    "Talks, seminars, and presentation material. Last updated: 22 April 2026.":
      "Talks, seminars, presentation material. 最終更新: 2026年4月22日",
    "Notes and Slides": "ノートとスライド",
    "Lecture notes, slides, speculative notes, and teaching material. ☁︎ marked notes are speculative; 🖊️ marked notes are under construction.":
      "Lecture notes, slides, speculative notes, teaching material をまとめています。☁︎ は speculative、🖊️ は under construction を表します。",
    "Notes and slides.": "Notes and slides.",
    "Notes, slides, and teaching material. Last updated: 22 April 2026.":
      "Notes, slides, teaching material. 最終更新: 2026年4月22日",
    "Academic Activity": "研究活動",
    "Research visits, organizing work, seminars, public writing, and academic events.":
      "Research visits, organizing work, seminars, public writing, academic events をまとめています。",
    "Activities and plans.": "活動と予定。",
    "Academic activities, visits, and organizing work. Last updated: 22 April 2026.":
      "Academic activities, visits, organizing work. 最終更新: 2026年4月22日",
    "Profile Details": "プロフィール詳細",
    "CV": "CV",
    "CV and awards.": "CV と受賞。",
    "Awards, education and outreach, teaching, current positions, and past positions.":
      "受賞、教育・アウトリーチ、現在と過去の所属をまとめています。",
    "Current": "現在",
    "Past": "過去",
    "Past Positions": "過去の所属",
    "Awards": "受賞",
    "Teaching": "教育",
    "Education and Outreach": "教育とアウトリーチ",
    "Synced Awards": "同期された受賞",
    "Synced Education": "同期された教育歴",
    "Source": "出典",
    "Credit": "謝辞",
    "CV, awards, positions, and education. Last updated: 22 April 2026.":
      "CV, awards, positions, education. 最終更新: 2026年4月22日",
    "Open Problems and Questions": "Open Problems and Questions",
    "Open problems and trails.": "Open problems and trails.",
    "Web Apps": "Web Apps",
    "Deployed Tools": "公開中のツール",
    "Small deployed tools and experiments.": "公開中の小さな tools と experiments。",
    "Small Vercel-hosted tools and experiments.": "Vercel で公開している小さな tools と experiments。",
    "Open app": "アプリを開く",
    "Guide": "Guide",
    "Dev": "Dev",
    "Workbench": "Workbench",
    "Tutorial": "Tutorial",
    "Growth": "Growth",
    "Theory": "Theory",
    "simulation": "simulation",
    "experiment": "experiment",
    "workbench": "workbench",
    "editor": "editor",
    "game": "game",
    "Personal open problems on local state classifiers, automata, quotient topoi, connectedness, games, elementary topoi, and riegs.":
      "local state classifiers, automata, quotient topoi, connectedness, games, elementary topoi, riegs に関する個人的な open problems です。",
    "Problem Database": "Problem Database",
    "Problems and Trails": "Problems and Trails",
    "Comments": "コメント",
    "Configure comments": "コメント設定",
    "Direct comment backend required": "直接コメント用バックエンドが必要です",
    "Random problem": "ランダム問題",
    "Random formal": "定式化された問題をランダム表示",
    "Filter problems": "問題を絞り込む",
    "Index": "索引",
    "All Entries": "全項目",
    "Open problems, questions, and reference trails. Last updated: 22 April 2026.":
      "Open problems, questions, reference trails. 最終更新: 2026年4月22日",
    "People, Friends' Papers, Books, Events": "人物・友人の論文・本・イベント",
    "Profiles and references.": "プロフィールと資料。",
    "External references, profile pages, friends' papers, books, and events.":
      "外部資料、プロフィールページ、友人の論文、本、イベントへのリンクです。",
    "External links and reference pages. Last updated: 22 April 2026.":
      "External links and reference pages. 最終更新: 2026年4月22日",
    "☁︎ Log": "☁︎ Log",
    "思弁的なノート": "思弁的なノート",
    "Short draft fragments, questions, and half-formed mathematical pictures before they become papers, talks, or polished notes.":
      "papers, talks, polished notes になる前の短い草稿、問い、まだ形になりきっていない数学的イメージです。",
    "Draft fragments.": "草稿断片。",
    "Entries": "項目",
    "Speculative notes. Last updated: 22 April 2026.": "Speculative notes. 最終更新: 2026年4月22日",
    "Published papers, preprints, manuscripts in preparation, and related references.":
      "published papers, preprints, manuscripts in preparation と関連資料をまとめています。",
    "Conference talks, seminars, workshop presentations, and selected recordings.":
      "Conference talks, seminars, workshop presentations と selected recordings をまとめています。",
    "Lecture notes, slides, speculative notes, and teaching material.":
      "Lecture notes, slides, speculative notes, teaching material をまとめています。",
    "Research visits, organizing work, seminars, and academic activity by year.":
      "Research visits, organizing work, seminars, academic activity を年ごとにまとめています。",
    "Awards, education and outreach, teaching, and profile links.":
      "受賞、教育・アウトリーチ、プロフィールリンクをまとめています。",
    "Open questions and reference trails around topoi, automata, and games.":
      "topoi, automata, games に関する open questions と reference trails です。",
    "A small cabinet of topoi that are useful, memorable, or just pleasant to revisit.":
      "役立つ、記憶に残る、あるいは単に何度も戻りたくなる topoi の小さな棚です。",
    "Friends' pages, friends' papers, books, events, and external profile pages.":
      "友人のページ、友人の論文、本、イベント、外部プロフィールへのリンクです。",
    "Introduces local state classifiers and uses them to establish an internal parameterization of hyperconnected quotients.":
      "local state classifier を導入し、それを用いて hyperconnected quotient の internal parameterization を与えます。",
    "Classifies classes of discrete dynamical systems closed under finite limits and small colimits.":
      "finite limits と small colimits で閉じた discrete dynamical systems のクラスを分類します。",
    "Studies completely connected topoi and gives a site characterization with examples.":
      "completely connected topoi を研究し、例とともに site characterization を与えます。",
    "Gives a solution to Lawvere's first open problem.":
      "Lawvere's first open problem の解決を与えます。",
    "Solves one of Lawvere's seven open problems through levels in the topos of symmetric simplicial sets.":
      "symmetric simplicial sets の topos における levels を用いて、Lawvere の 7 つの open problems の一つを解決します。",
    "Introduces a topos-theoretic point of view on formal language theory.":
      "formal language theory に対する topos-theoretic な見方を導入します。",
    "Reinterprets impartial combinatorial games and the Nim-sum using recursive coalgebras.":
      "impartial combinatorial games と Nim-sum を recursive coalgebras によって捉え直します。",
    "Defines a generalized normalization operator motivated by topos theory and algebraic language theory.":
      "topos theory と algebraic language theory に動機づけられた generalized normalization operator を定義します。",
    "No papers match this filter.": "この条件に合う論文はありません。",
    "No notes match this filter.": "この条件に合うノートはありません。",
    "No generated researchmap paper data is available yet.": "researchmap から生成された論文データはまだありません。",
    "No talks match this filter.": "この条件に合う発表はありません。",
    "No generated researchmap award data is available yet.": "researchmap から生成された受賞データはまだありません。",
    "No generated researchmap education data is available yet.": "researchmap から生成された教育歴データはまだありません。",
    "No current plans listed.": "現在表示する予定はありません。",
    "No problem matches the current filter.": "この条件に合う問題はありません。",
    "No problems match this filter.": "この条件に合う問題はありません。",
    "No speculative notes yet.": "思弁的なノートはまだありません。",
    "All themes": "すべてのテーマ",
    "papers": "論文",
    "notes": "ノート",
    "talks": "発表",
    "shown": "表示中",
    "open": "未解決",
    "questions": "問い",
    "trails": "trails",
    "solved notes": "解決済みノート",
    "Reference Trail": "Reference Trail",
    "Solved Note": "解決済みノート",
    "Question": "問い",
    "All": "すべて",
    "Permalink": "固定リンク",
    "Open paper": "論文を開く",
    "Related note": "関連ノート",
    "Diagram Mode": "Diagram Mode",
    "Paper Diagram": "Paper Diagram",
    "Diagram Notes": "Diagram Notes",
    "Concepts": "Concepts",
    "Result": "Result",
    "Close": "閉じる",
    "Speculative": "Speculative",
    "Draft": "Draft",
    "Note": "Note",
    "Questions": "Questions",
    "Open": "Open",
    "Download": "Download"
  }
};

const i18nContextText = {
  ja: {
    action: {
      Open: "開く",
      Download: "ダウンロード",
      Slides: "スライド",
      PDF: "PDF",
      "Open paper": "論文を開く",
      "Related note": "関連ノート",
      Permalink: "固定リンク"
    },
    problemStatus: {
      All: "すべて",
      "Formal Question": "定式化された問い",
      "Other Question": "その他の問い",
      "Reference Trail": "Reference Trail",
      "Solved Note": "解決済みノート"
    }
  }
};

let activeLanguage = "en";
let isApplyingLanguage = false;
let languageObserver = null;

const problemStatuses = {
  all: "All",
  open: "Formal Question",
  question: "Other Question",
  trail: "Reference Trail",
  solved: "Solved Note"
};

const problemStatusOrder = ["all", "open", "question", "trail", "solved"];

const researchThemes = [
  {
    id: "topos",
    label: "Topos",
    x: 320,
    y: 84,
    r: 54,
    keywords: ["topos", "topoi", "grothendieck", "lawvere", "quotient", "hyperconnected", "local state", "geometric morphism"]
  },
  {
    id: "automata",
    label: "Automata",
    x: 512,
    y: 178,
    r: 56,
    keywords: ["automata", "regular language", "language", "word", "congruence", "syntactic", "sigma-set", "classifier", "measurability"]
  },
  {
    id: "games",
    label: "Games",
    x: 500,
    y: 338,
    r: 54,
    keywords: ["game", "games", "nim", "rota-baxter", "conway", "lights out", "grundy", "ライツアウト"]
  },
  {
    id: "coalgebras",
    label: "Coalgebras",
    x: 320,
    y: 386,
    r: 58,
    keywords: ["coalgebra", "coalgebras", "recursive", "differential calculus", "conway"]
  },
  {
    id: "algebra",
    label: "Algebra",
    x: 132,
    y: 326,
    r: 54,
    keywords: ["algebra", "semiring", "rieg", "normalization", "gabriel", "representation", "kan", "表現論", "圏論"]
  },
  {
    id: "logic",
    label: "Logic",
    x: 126,
    y: 178,
    r: 52,
    keywords: ["logic", "choice", "constructive", "axiom", "lawvere", "measurability", "構成的", "数学基礎論"]
  },
  {
    id: "geometry",
    label: "Geometry",
    x: 320,
    y: 236,
    r: 62,
    keywords: ["geometry", "dynamical", "pretopological", "species", "space-time", "space time", "quotient", "discrete dynamical"]
  }
];

const researchThemeEdges = [
  ["topos", "logic"],
  ["topos", "automata"],
  ["topos", "geometry"],
  ["geometry", "algebra"],
  ["geometry", "games"],
  ["games", "coalgebras"],
  ["automata", "coalgebras"],
  ["logic", "algebra"],
  ["algebra", "coalgebras"]
];

function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function link(label, href, className) {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.textContent = label;
  if (className) anchor.className = className;
  if (/^https?:/.test(href)) anchor.rel = "noreferrer";
  return anchor;
}

function localizedText(tag, className, text, jaText = "") {
  const node = el(tag, className, text);
  if (jaText) node.dataset.i18nJa = jaText;
  return node;
}

function normalized(value) {
  return String(value || "").toLowerCase();
}

function matchesQuery(value, query) {
  return !query || normalized(value).includes(normalized(query));
}

function compactText(values) {
  return values.filter((value) => value !== undefined && value !== null && String(value).trim() !== "");
}

function peopleArray(value) {
  if (Array.isArray(value)) return compactText(value).map((item) => String(item).trim());
  const text = String(value || "")
    .replace(/^with\s+/i, "")
    .trim();
  if (!text) return [];
  return text
    .split(/\s*,\s*|\s+and\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function peopleText(value) {
  const people = peopleArray(value);
  return people.length ? people.join(", ") : "";
}

function peopleLabel(single, plural, value) {
  const people = peopleArray(value);
  if (!people.length) return "";
  return `${people.length === 1 ? single : plural}: ${people.join(", ")}`;
}

function paperPeopleText(paper, fallbackRecord = null) {
  if (paper?.coauthors || /^with\s+/i.test(String(paper?.authors || ""))) {
    return peopleLabel("Coauthor", "Coauthors", paper.coauthors || paper.authors);
  }
  if (paper?.authors) return `Authors: ${peopleText(paper.authors)}`;
  if (fallbackRecord?.authors && peopleArray(fallbackRecord.authors).length > 1) {
    return `Authors: ${peopleText(fallbackRecord.authors)}`;
  }
  return "";
}

function presentationPeopleText(record) {
  return peopleLabel("Presenter", "Presenters", record?.presenters || []);
}

function slugify(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizedUiText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function readStoredLanguage() {
  try {
    return globalThis.localStorage?.getItem("site-language") || "";
  } catch {
    return "";
  }
}

function writeStoredLanguage(language) {
  try {
    globalThis.localStorage?.setItem("site-language", language);
  } catch {
    // File previews may not allow localStorage.
  }
}

function initialLanguage() {
  const params = new URLSearchParams(globalThis.location?.search || "");
  const fromUrl = params.get("lang");
  if (fromUrl === "ja" || fromUrl === "en") return fromUrl;
  const stored = readStoredLanguage();
  if (stored === "ja" || stored === "en") return stored;
  return "en";
}

function translatedPhrase(text, element = null) {
  const original = normalizedUiText(text);
  if (activeLanguage === "en" || !original) return original;
  if (element?.dataset?.i18nJa) return element.dataset.i18nJa;
  const context = i18nContextText[activeLanguage] || {};
  if (element?.matches?.(".action-link")) return context.action?.[original] || i18nText[activeLanguage]?.[original] || original;
  if (element?.dataset?.problemStatus || element?.matches?.(".problem-badge")) {
    return context.problemStatus?.[original] || i18nText[activeLanguage]?.[original] || original;
  }

  const direct = i18nText[activeLanguage]?.[original];
  if (direct) return direct;

  const lastReviewed = original.match(/^Last reviewed: (.+)$/);
  if (lastReviewed) return `最終確認: ${lastReviewed[1]}`;
  const updated = original.match(/^updated (.+)$/);
  if (updated) return `更新 ${updated[1]}`;
  const themeCount = original.match(/^(\d+) papers \/ (\d+) notes \/ (\d+) talks$/);
  if (themeCount) return `${themeCount[1]} 論文 / ${themeCount[2]} ノート / ${themeCount[3]} 発表`;
  const themeCountWithPreparation = original.match(
    /^(\d+) papers \/ (\d+) in preparation \/ (\d+) notes \/ (\d+) talks$/
  );
  if (themeCountWithPreparation) {
    return `${themeCountWithPreparation[1]} 論文 / ${themeCountWithPreparation[2]} in preparation / ${themeCountWithPreparation[3]} ノート / ${themeCountWithPreparation[4]} 発表`;
  }
  const diagramMode = original.match(/^Open diagram mode for (.+)$/);
  if (diagramMode) return `Diagram mode を開く: ${diagramMode[1]}`;
  const resultCount = original.match(/^(\d+) results?$/);
  if (resultCount) return `${resultCount[1]}件`;
  const noteFilterCount = original.match(/^Showing (\d+) \/ (\d+) notes$/);
  if (noteFilterCount) return `${noteFilterCount[1]} / ${noteFilterCount[2]} 件のノート`;
  const talkMapCount = original.match(/^(\d+) (talks?|visits?) \/ (.+)$/);
  if (talkMapCount) return `${talkMapCount[1]}件 / ${i18nText[activeLanguage]?.[talkMapCount[3]] || talkMapCount[3]}`;
  const openRecord = original.match(/^Open (.+)$/);
  if (openRecord) return `開く: ${openRecord[1]}`;
  return original;
}

const translatableTextSelector = [
  ".site-nav a:not(.nav-search)",
  ".nav-group-label",
  ".nav-search .sr-only",
  ".eyebrow",
  ".section-kicker",
  "h1",
  "h2",
  "h3",
  "h4",
  ".lead",
  ".categories-tokyo-lead",
  ".section-link",
  ".site-footer p",
  ".site-footer a",
  ".search-label span",
  ".note-filter-label span",
  ".note-filter-label option",
  ".note-filter-count",
  ".tab-button",
  ".explore-title",
  ".explore-card p",
  ".text-link",
  ".action-link",
  ".publication-summary",
  ".empty-state",
  ".theme-status-label",
  ".theme-status-count",
  ".theme-result-column h3",
  ".note-thumb-kind",
  ".note-kind-badge",
  ".problem-badge",
  ".problem-stat span",
  ".problem-updated",
  ".problem-comments-title",
  ".problem-comments-note",
  ".problem-comment-state",
  ".problem-comment-setup h4",
  ".problem-comment-setup p",
  ".problem-comment-setup li",
  ".problem-comment-admin",
  ".problem-comment-admin-label",
  ".talk-timeline-theme",
  ".talk-timeline-meta",
  ".talk-timeline-count",
  ".talk-map-label",
  ".talk-map-caption",
  ".talk-map-count",
  ".home-timeline-legend-item",
  ".home-timeline-theme-item",
  ".home-timeline-lane-label",
  ".paper-timeline-status",
  ".site-search-count",
  ".site-search-type",
  ".site-search-summary",
  ".site-search-meta",
  ".web-app-tag",
  ".web-app-summary",
  ".web-app-link",
  ".web-app-missing",
  ".speculative-status",
  ".speculative-abstract",
  ".speculative-questions h3",
  ".topos-card-kicker",
  ".topos-card-summary",
  ".topos-card-reason",
  ".topos-focus-subtitle",
  ".topos-focus-summary",
  ".topos-detail dt",
  ".topos-detail dd",
  ".topos-comparison-heading",
  ".topos-comparison-cell",
  ".topos-mini-title"
].join(",");

function translatableElements(root = document.body) {
  const elements = [];
  if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(translatableTextSelector)) elements.push(root);
  if (root.querySelectorAll) elements.push(...root.querySelectorAll(translatableTextSelector));
  return elements;
}

function translateElementText(element) {
  if (!element.dataset.i18nOriginalText) {
    const original = normalizedUiText(element.textContent);
    if (!original) return;
    element.dataset.i18nOriginalText = original;
  }
  const translated = translatedPhrase(element.dataset.i18nOriginalText, element);
  if (normalizedUiText(element.textContent) !== translated) element.textContent = translated;
}

function translateAttribute(element, attribute) {
  const value = element.getAttribute(attribute);
  if (!value) return;
  const dataName = `i18nOriginal${attribute.replace(/(^|-)([a-z])/g, (_, _dash, letter) => letter.toUpperCase())}`;
  if (!element.dataset[dataName]) element.dataset[dataName] = normalizedUiText(value);
  const translated = translatedPhrase(element.dataset[dataName], element);
  if (translated) element.setAttribute(attribute, translated);
}

function translateAttributes(root = document.body) {
  const elements = [];
  if (root.nodeType === Node.ELEMENT_NODE) elements.push(root);
  if (root.querySelectorAll) elements.push(...root.querySelectorAll("[aria-label], [placeholder], meta[name='description']"));
  elements.forEach((element) => {
    if (element.hasAttribute?.("aria-label")) translateAttribute(element, "aria-label");
    if (element.hasAttribute?.("placeholder")) translateAttribute(element, "placeholder");
    if (element.matches?.("meta[name='description']")) translateAttribute(element, "content");
  });
}

function hrefWithLanguage(originalHref) {
  if (!originalHref || /^(https?:|mailto:|#|javascript:)/.test(originalHref)) return originalHref;
  const hashIndex = originalHref.indexOf("#");
  const hash = hashIndex >= 0 ? originalHref.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? originalHref.slice(0, hashIndex) : originalHref;
  const queryIndex = withoutHash.indexOf("?");
  const path = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(query);
  if (activeLanguage === "ja") params.set("lang", "ja");
  else params.delete("lang");
  const nextQuery = params.toString();
  return `${path}${nextQuery ? `?${nextQuery}` : ""}${hash}`;
}

function syncLanguageLinks(root = document.body) {
  const anchors = [];
  if (root.nodeType === Node.ELEMENT_NODE && root.matches?.("a[href]")) anchors.push(root);
  if (root.querySelectorAll) anchors.push(...root.querySelectorAll("a[href]"));
  anchors.forEach((anchor) => {
    if (!anchor.dataset.langOriginalHref) anchor.dataset.langOriginalHref = anchor.getAttribute("href");
    anchor.setAttribute("href", hrefWithLanguage(anchor.dataset.langOriginalHref));
  });
}

function syncLanguageUrl() {
  if (!globalThis.history?.replaceState || !globalThis.location) return;
  try {
    const url = new URL(globalThis.location.href);
    if (activeLanguage === "ja") url.searchParams.set("lang", "ja");
    else url.searchParams.delete("lang");
    globalThis.history.replaceState(null, "", url.href);
  } catch {
    // Some file previews restrict history updates.
  }
}

function updateLanguageToggle() {
  const button = document.querySelector("[data-language-toggle]");
  if (!button) return;
  button.textContent = activeLanguage === "ja" ? "EN" : "日本語";
  button.setAttribute("aria-label", activeLanguage === "ja" ? "Switch to English" : "日本語に切り替え");
}

function ensureSearchNavLink() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;
  const decorateSearchLink = (searchLink) => {
    searchLink.dataset.siteSearchLink = "";
    searchLink.classList.add("nav-search");
    searchLink.classList.toggle("is-active", document.body.dataset.page === "search");
    searchLink.setAttribute("aria-label", "Search");
    if (!searchLink.querySelector(".search-icon")) {
      searchLink.replaceChildren(
        el("span", "search-icon"),
        el("span", "sr-only", "Search")
      );
      searchLink.querySelector(".search-icon")?.setAttribute("aria-hidden", "true");
    }
  };
  const existingSearchLink = nav.querySelector("[data-site-search-link]");
  if (existingSearchLink) {
    decorateSearchLink(existingSearchLink);
    return;
  }
  const searchLink = link("", localHref("search/index.html"));
  searchLink.dataset.siteSearchLink = "";
  decorateSearchLink(searchLink);
  const languageToggle = nav.querySelector("[data-language-toggle]");
  if (languageToggle) nav.insertBefore(searchLink, languageToggle);
  else nav.append(searchLink);
}

function applyLanguage(root = document.body) {
  if (!root) return;
  isApplyingLanguage = true;
  try {
    document.documentElement.lang = activeLanguage === "ja" ? "ja" : "en";
    translatableElements(root).forEach(translateElementText);
    translateAttributes(root);
    syncLanguageLinks(root);
    updateLanguageToggle();
    decorateUiIcons(root);
  } finally {
    isApplyingLanguage = false;
  }
}

function setLanguage(language) {
  activeLanguage = language === "ja" ? "ja" : "en";
  writeStoredLanguage(activeLanguage);
  syncLanguageUrl();
  applyLanguage();
}

function setupLanguage() {
  activeLanguage = initialLanguage();
  const nav = document.querySelector(".site-nav");
  ensureSearchNavLink();
  if (nav && !nav.querySelector("[data-language-toggle]")) {
    const button = el("button", "language-toggle");
    button.type = "button";
    button.dataset.languageToggle = "";
    button.addEventListener("click", () => setLanguage(activeLanguage === "ja" ? "en" : "ja"));
    nav.append(button);
  }
  applyLanguage();
  if (!languageObserver && globalThis.MutationObserver && document.body) {
    languageObserver = new MutationObserver((mutations) => {
      if (isApplyingLanguage) return;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) applyLanguage(node);
        });
      });
    });
    languageObserver.observe(document.body, { childList: true, subtree: true });
  }
}

const mathAnnotationRules = [
  {
    test: (tex) => /\\Psi/.test(tex),
    title: "Local state classifier",
    body: "The symbol packages locally determined states and compares their values across inclusions.",
    linkLabel: "Internal parameterizations",
    href: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"
  },
  {
    test: (tex) => /^U$/.test(tex),
    title: "Local part",
    body: "Here U is a local subobject or local piece whose state is compared with the ambient object.",
    linkLabel: "Local state classifier",
    href: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"
  },
  {
    test: (tex) => /^X$/.test(tex),
    title: "Ambient object",
    body: "X is the ambient object whose local states are being compared through the classifier.",
    linkLabel: "Local state classifier",
    href: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"
  },
  {
    test: (tex) => /^i$/.test(tex),
    title: "Inclusion",
    body: "The map i records the inclusion of a local part into the ambient object.",
    linkLabel: "Internal parameterizations",
    href: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"
  },
  {
    test: (tex) => /h\s*,\s*p|\\infty/.test(tex),
    title: "Height and period",
    body: "These numerical invariants classify the visible behavior of discrete dynamical systems in the quotient-topos story.",
    linkLabel: "Quotient toposes",
    href: "https://doi.org/10.1016/j.jpaa.2024.107657"
  },
  {
    test: (tex) => /\\Sigma|\\mathbf\{Set\}/.test(tex),
    title: "Sigma-sets",
    body: "Sigma-sets are sets with actions by words; they give a topos-theoretic language for automata.",
    linkLabel: "Topoi of automata I",
    href: "https://arxiv.org/abs/2411.06358"
  },
  {
    test: (tex) => /\\varepsilon/.test(tex),
    title: "Epsilon transition",
    body: "An epsilon transition is a silent move in automata theory; here it appears as part of a categorical origin story.",
    linkLabel: "Automata thread",
    href: "https://arxiv.org/abs/2411.06358"
  },
  {
    test: (tex) => /\\mathbf\{FinSet\}/.test(tex),
    title: "Finite sets",
    body: "FinSet is the category of finite sets, a basic test case for finite categorical constructions.",
    linkLabel: "nLab: finite set",
    href: "https://ncatlab.org/nlab/show/finite+set"
  },
  {
    test: (tex) => /D_4|N_\{D_4\}|\\langle|\\tau|\\sigma/.test(tex),
    title: "Subgroups of the dihedral group",
    body: "This diagram shows how the normalizer operation moves among subgroups of the fourth dihedral group.",
    linkLabel: "Normalization preprint",
    href: "https://arxiv.org/abs/2511.05012"
  },
  {
    test: (tex) => /\\alpha|x=y\\alpha/.test(tex),
    title: "Action parameter",
    body: "The parameter alpha marks the symmetry or action that transports one combinatorial shape to another.",
    linkLabel: "Completely connected topoi",
    href: "https://doi.org/10.1090/proc/17479"
  }
];

let mathTooltipHideTimer = null;
let timelineTooltipHideTimer = null;

function typesetMath(root = document.body) {
  if (globalThis.renderMathInElement) {
    globalThis.renderMathInElement(root, {
      delimiters: [
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true }
      ],
      throwOnError: false,
      strict: "ignore"
    });
  }
  annotateMath(root);
}

function normalizeTeX(value) {
  return String(value || "")
    .trim()
    .replace(/^\\\(|\\\)$/g, "")
    .replace(/^\\\[|\\\]$/g, "")
    .trim();
}

function texForKatex(node) {
  const annotation = node.querySelector('annotation[encoding="application/x-tex"]');
  return normalizeTeX(annotation?.textContent || node.textContent);
}

function mathAnnotationFor(tex) {
  return mathAnnotationRules.find((rule) => rule.test(tex));
}

function ensureMathTooltip() {
  let tooltip = document.querySelector("#math-tooltip");
  if (tooltip) return tooltip;

  tooltip = el("aside", "math-tooltip");
  tooltip.id = "math-tooltip";
  tooltip.setAttribute("role", "tooltip");
  tooltip.addEventListener("mouseenter", () => clearTimeout(mathTooltipHideTimer));
  tooltip.addEventListener("mouseleave", hideMathTooltipSoon);
  tooltip.addEventListener("focusin", () => clearTimeout(mathTooltipHideTimer));
  tooltip.addEventListener("focusout", hideMathTooltipSoon);
  document.body.append(tooltip);
  return tooltip;
}

function positionMathTooltip(tooltip, target) {
  const rect = target.getBoundingClientRect();
  tooltip.style.left = "0px";
  tooltip.style.top = "0px";
  tooltip.classList.add("is-visible");
  requestAnimationFrame(() => {
    const tip = tooltip.getBoundingClientRect();
    const margin = 12;
    let left = rect.left + rect.width / 2 - tip.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tip.width - margin));
    let top = rect.top - tip.height - margin;
    if (top < margin) top = rect.bottom + margin;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  });
}

function showMathTooltip(target) {
  clearTimeout(mathTooltipHideTimer);
  const tooltip = ensureMathTooltip();
  tooltip.replaceChildren();
  tooltip.append(
    el("div", "math-tooltip-title", target.dataset.mathTitle),
    el("p", null, target.dataset.mathBody)
  );
  if (target.dataset.mathHref) {
    tooltip.append(link(target.dataset.mathLinkLabel || "Related link", target.dataset.mathHref, "math-tooltip-link"));
  }
  positionMathTooltip(tooltip, target);
}

function hideMathTooltipSoon() {
  clearTimeout(mathTooltipHideTimer);
  mathTooltipHideTimer = setTimeout(() => {
    document.querySelector("#math-tooltip")?.classList.remove("is-visible");
  }, 140);
}

function ensureTimelineTooltip() {
  let tooltip = document.querySelector("#timeline-tooltip");
  if (tooltip) return tooltip;

  tooltip = el("aside", "timeline-tooltip");
  tooltip.id = "timeline-tooltip";
  tooltip.setAttribute("role", "tooltip");
  document.body.append(tooltip);
  return tooltip;
}

function positionTimelineTooltip(tooltip, target, event = null) {
  const rect = target.getBoundingClientRect();
  tooltip.style.left = "0px";
  tooltip.style.top = "0px";
  tooltip.classList.add("is-visible");
  requestAnimationFrame(() => {
    const tip = tooltip.getBoundingClientRect();
    const margin = 12;
    const anchorX = Number.isFinite(event?.clientX) ? event.clientX : rect.left + rect.width / 2;
    const anchorY = Number.isFinite(event?.clientY) ? event.clientY : rect.top + rect.height / 2;
    let left = anchorX - tip.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tip.width - margin));
    let top = anchorY - tip.height - margin;
    if (top < margin) top = anchorY + margin;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  });
}

function showTimelineTooltip(target, event = null) {
  clearTimeout(timelineTooltipHideTimer);
  const tooltip = ensureTimelineTooltip();
  const title = target.dataset.timelineTitle || target.getAttribute("aria-label") || "";
  const kicker = target.dataset.timelineKicker || "Timeline";
  const meta = target.dataset.timelineMeta || "";
  tooltip.replaceChildren(el("div", "timeline-tooltip-kicker", kicker), el("div", "timeline-tooltip-title", title));
  if (meta) tooltip.append(el("p", "timeline-tooltip-meta", meta));
  positionTimelineTooltip(tooltip, target, event);
}

function hideTimelineTooltipSoon() {
  clearTimeout(timelineTooltipHideTimer);
  timelineTooltipHideTimer = setTimeout(() => {
    document.querySelector("#timeline-tooltip")?.classList.remove("is-visible");
  }, 140);
}

function attachTimelineTooltip(node, record) {
  const kindLabel = homeTimelineKindLabel(record.kind);
  const themeLabel = record.theme ? homeTimelineThemeLabel(record.theme) : "";
  node.dataset.timelineKicker = compactText([kindLabel, themeLabel, record.dateLabel]).join(" / ");
  node.dataset.timelineTitle = record.title;
  node.dataset.timelineMeta = record.meta || "";
  node.addEventListener("mouseenter", (event) => showTimelineTooltip(node, event));
  node.addEventListener("mousemove", (event) => {
    const tooltip = document.querySelector("#timeline-tooltip");
    if (tooltip?.classList.contains("is-visible")) positionTimelineTooltip(tooltip, node, event);
  });
  node.addEventListener("focus", () => showTimelineTooltip(node));
  node.addEventListener("mouseleave", hideTimelineTooltipSoon);
  node.addEventListener("blur", hideTimelineTooltipSoon);
}

function annotateMath(root = document.body) {
  root.querySelectorAll(".katex").forEach((node) => {
    if (node.dataset.mathAnnotated) return;
    const tex = texForKatex(node);
    const annotation = mathAnnotationFor(tex);
    if (!annotation) return;

    node.dataset.mathAnnotated = "true";
    node.dataset.mathTitle = annotation.title;
    node.dataset.mathBody = annotation.body;
    node.dataset.mathHref = annotation.href || "";
    node.dataset.mathLinkLabel = annotation.linkLabel || "";
    node.classList.add("math-hint");
    node.setAttribute("aria-label", `${tex}: ${annotation.title}. ${annotation.body}`);
    if (!node.closest("button, [role='button']")) node.tabIndex = 0;
    node.addEventListener("mouseenter", () => showMathTooltip(node));
    node.addEventListener("focus", () => showMathTooltip(node));
    node.addEventListener("mouseleave", hideMathTooltipSoon);
    node.addEventListener("blur", hideMathTooltipSoon);
  });
}

function getPathPrefix() {
  return document.body.dataset.depth === "child" ? "../" : "";
}

function localHref(href) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  return `${getPathPrefix()}${href}`;
}

function overleafArtifacts(kinds = []) {
  const wanted = new Set(kinds);
  return (overleafData.artifacts || []).filter((artifact) => {
    if (!artifact?.href || artifact.publish === false) return false;
    return !wanted.size || wanted.has(artifact.kind);
  });
}

function overleafRecordText(record) {
  return simplified(
    compactText([
      record.title,
      record.authors,
      record.venue,
      record.event,
      record.description,
      record.file,
      record.year
    ]).join(" ")
  );
}

function overleafMatchesRecord(artifact, record) {
  const text = overleafRecordText(record);
  const matchers = compactText([artifact.title, artifact.id, ...(artifact.match || [])]).map(simplified);
  return matchers.some((matcher) => matcher && (text.includes(matcher) || matcher.includes(text)));
}

function overleafActionLinks(record, kinds = []) {
  return overleafArtifacts(kinds)
    .filter((artifact) => overleafMatchesRecord(artifact, record))
    .map((artifact) => [artifact.label || (artifact.kind === "paper" ? "PDF" : "Slides"), localHref(artifact.href)]);
}

function overleafNoteRecords() {
  return overleafArtifacts(["slide", "note"]).map((artifact) => ({
    title: artifact.title,
    description: artifact.description || "Synced from an Overleaf-backed GitHub repository.",
    date: artifact.date || artifact.updated || "",
    language: artifact.language || "Document",
    theme: artifact.theme || "",
    file: artifact.outputName || artifact.href.split("/").pop() || `${artifact.id}.pdf`,
    href: localHref(artifact.href),
    download: localHref(artifact.href),
    source: "overleaf"
  }));
}

function noteAnchor(note) {
  return `note-${slugify(note.file || note.title)}`;
}

function noteHrefByFile(file) {
  const note = siteData.notes.find((record) => record.file === file);
  if (!note) return "";
  return localHref(`notes/index.html#${noteAnchor(note)}`);
}

function scrollToHashTarget() {
  if (!globalThis.location?.hash) return;
  const id = decodeURIComponent(globalThis.location.hash.slice(1));
  const target = document.getElementById(id);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

const talkSlideMatches = [
  { title: "A Rota-Baxter equation for winning games", file: "RYUYA,HORA.pdf" },
  { title: "A space⋊︎time for Conway's game of life", file: "Space⋊Time for Conway's Game of Life.pdf" },
  { title: "Turning lights out with the Snake Lemma", file: "ライツアウトの代数的研究.pdf" },
  { title: "Combinatorial games as recursive coalgebras", file: "Hora_CSCAT2024.pdf" },
  { title: "Local state classifier for algebraic language theory", file: "Local state classifier for algebraic language theory.pdf" },
  { title: "Local state classifier for automata theory", file: "IRIF20250527_ver1.pdf" },
  { title: "Topoi of automata", event: "CSCAT2025", file: "CSCAT_2025-3.pdf" },
  { title: "Topoi of automata", event: "CTTA Groupe", file: "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf" },
  { title: "Topoi of automata", event: "Categories for Automata", file: "IRIFtoday.pdf" }
];

const talkLocationByResearchmapId = {
  "53286857": {
    id: "rims-room-420",
    name: "RIMS, Kyoto University",
    venue: "Room 420, Research Institute for Mathematical Sciences, Kyoto University",
    city: "Kyoto",
    country: "Japan",
    region: "Kansai",
    lat: 35.0268,
    lon: 135.7807,
    source: "https://sites.google.com/view/differential-kyoto-2026/home"
  },
  "53075156": {
    id: "aossa-fukui",
    name: "AOSSA Room 601A",
    venue: "AOSSA Room 601A",
    city: "Fukui",
    country: "Japan",
    region: "Hokuriku",
    lat: 36.0615,
    lon: 136.2241,
    source: "https://www.kurims.kyoto-u.ac.jp/~tsanada/event/cscat2026.html"
  },
  "53075079": {
    id: "rexxam-hall",
    name: "Rexxam Hall",
    venue: "Rexxam Hall, Small Hall Building",
    city: "Takamatsu",
    country: "Japan",
    region: "Shikoku",
    lat: 34.3512,
    lon: 134.0503,
    source: "https://jssst-ppl.org/workshop/2026/"
  },
  "53075058": {
    id: "uec-chofu",
    name: "The University of Electro-Communications",
    venue: "The University of Electro-Communications",
    city: "Chofu",
    country: "Japan",
    region: "Tokyo",
    lat: 35.6578,
    lon: 139.5437,
    markerDx: -14,
    markerDy: 7,
    source: "http://www.alg.cei.uec.ac.jp/itohiro/Games/"
  },
  "52954313": {
    id: "utokyo-komaba-room-126",
    name: "UTokyo Komaba",
    venue: "Room 126, Graduate School of Mathematical Sciences, The University of Tokyo",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6607,
    lon: 139.6848,
    markerDx: -8,
    markerDy: -6,
    source: "https://www.ms.u-tokyo.ac.jp/seminar/2026/sem26-042.html"
  },
  "51817824": {
    id: "utokyo-komaba-logic",
    name: "UTokyo Komaba",
    venue: "Graduate School of Mathematical Sciences, The University of Tokyo",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6607,
    lon: 139.6848,
    markerDx: 7,
    markerDy: -8,
    source: "https://www.ms.u-tokyo.ac.jp/seminar/logic/"
  },
  "51758582": {
    id: "utokyo-komaba-logic",
    name: "UTokyo Komaba",
    venue: "Graduate School of Mathematical Sciences, The University of Tokyo",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6607,
    lon: 139.6848,
    markerDx: 7,
    markerDy: -8,
    source: "https://www.ms.u-tokyo.ac.jp/seminar/logic/"
  },
  "51735028": {
    id: "akita-university-room-321",
    name: "Akita University",
    venue: "Shared Room 321, Faculty of Engineering Science, Tegata Campus, Akita University",
    city: "Akita",
    country: "Japan",
    region: "Tohoku",
    lat: 39.729237,
    lon: 140.133308,
    source: "https://sites.google.com/view/slacs2025akita/home"
  },
  "51735025": {
    id: "masaryk-arts-b2",
    name: "Masaryk University",
    venue: "Building B2, Faculty of Arts, Masaryk University",
    city: "Brno",
    country: "Czech Republic",
    lat: 49.1992,
    lon: 16.5997,
    source: "https://conference.math.muni.cz/ct2025/index.php?id=programme-and-venue"
  },
  "51735022": {
    id: "lix-ecole-polytechnique",
    name: "LIX, École polytechnique",
    venue: "Henri Poincaré room, Laboratoire d'informatique de l'École polytechnique",
    city: "Palaiseau",
    country: "France",
    lat: 48.7131,
    lon: 2.2118,
    markerDx: 24,
    markerDy: 15,
    source: "https://www.lix.polytechnique.fr/proofs-algorithms/tcs/"
  },
  "51735020": {
    id: "lipn-villetaneuse",
    name: "LIPN",
    venue: "Salle B107, bâtiment B, Université de Villetaneuse",
    city: "Villetaneuse",
    country: "France",
    lat: 48.9565,
    lon: 2.3411,
    markerDx: 16,
    markerDy: -8,
    source: "https://lipn.univ-paris13.fr/local-state-classifier-for-automata-theory/"
  },
  "51735017": {
    id: "irif-room-3071",
    name: "IRIF",
    venue: "Salle 3071, IRIF, bâtiment Sophie Germain",
    city: "Paris",
    country: "France",
    lat: 48.8276,
    lon: 2.3814,
    markerDx: -2,
    markerDy: 11,
    source: "https://www.irif.fr/en/seminaires/semantique/index"
  },
  "51735010": {
    id: "centre-lagrange-paris",
    name: "Centre Lagrange",
    venue: "Centre Lagrange, 103 Rue de Grenelle",
    city: "Paris",
    country: "France",
    lat: 48.8569,
    lon: 2.3162,
    markerDx: -17,
    markerDy: -8,
    source: "https://sites.google.com/view/ryuya-hora/talks"
  },
  "51735007": {
    id: "irif-room-3071",
    name: "IRIF",
    venue: "Salle 3071, IRIF, bâtiment Sophie Germain",
    city: "Paris",
    country: "France",
    lat: 48.8276,
    lon: 2.3814,
    markerDx: -2,
    markerDy: 11,
    source: "https://autcat.github.io/"
  },
  "51735006": {
    id: "centre-lagrange-paris",
    name: "Centre Lagrange",
    venue: "Centre Lagrange, 103 Rue de Grenelle",
    city: "Paris",
    country: "France",
    lat: 48.8569,
    lon: 2.3162,
    markerDx: -17,
    markerDy: -8,
    source: "https://sites.google.com/view/ryuya-hora/talks"
  },
  "51735003": {
    id: "sojo-university-f203",
    name: "Sojo University",
    venue: "Room F203, Department of Computer and Information Sciences Building, Sojo University",
    city: "Kumamoto",
    country: "Japan",
    region: "Kyushu",
    lat: 32.8192,
    lon: 130.7068,
    source: "https://hisashi-aratake.gitlab.io/event/cscat2025.html"
  },
  "51735000": {
    id: "cmup-zoom",
    name: "Online",
    venue: "CMUP SAL seminar, Zoom",
    country: "Online",
    online: true,
    source: "https://www.cmup.pt/events/topoi-automata"
  },
  "51734994": {
    id: "tkp-kanda",
    name: "TKP Kanda Business Center",
    venue: "Hall 401, TKP Kanda Business Center",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6929,
    lon: 139.7636,
    markerDx: 14,
    markerDy: 10,
    source: "https://afsa.jp/meeting/"
  },
  "51734992": {
    id: "circolo-mondovi",
    name: "Circolo di Lettura",
    venue: "Circolo di Lettura, Palazzo del Governatore",
    city: "Mondovì",
    country: "Italy",
    lat: 44.394,
    lon: 7.817,
    source: "https://igrothendieck.org/en/great-success-for-the-international-conference-toposes-in-mondovi/"
  },
  "51734990": {
    id: "akita-university-room-305",
    name: "Akita University",
    venue: "Room 305, Faculty of Engineering Science Building 7, Tegata Campus, Akita University",
    city: "Akita",
    country: "Japan",
    region: "Tohoku",
    lat: 39.729237,
    lon: 140.133308,
    source: "https://sites.google.com/view/ciaa-preworkshop/home"
  },
  "51734986": {
    id: "usc-mathematics",
    name: "Faculty of Mathematics, USC",
    venue: "Facultade de Matemáticas, Universidade de Santiago de Compostela",
    city: "Santiago de Compostela",
    country: "Spain",
    lat: 42.878,
    lon: -8.5456,
    source: "https://www.usc.gal/gl/xornal/eventos/conferencia-internacional-teoria-categorias-ct2024"
  },
  "51734985": {
    id: "nii-kanda-lab",
    name: "NII Kanda Lab",
    venue: "NII Kanda Lab",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6924,
    lon: 139.7659,
    markerDx: 18,
    markerDy: -10,
    source: "https://afsa.jp/en/meeting/"
  },
  "51734982": {
    id: "nagoya-university",
    name: "Nagoya University",
    venue: "Nagoya University",
    city: "Nagoya",
    country: "Japan",
    region: "Chubu",
    lat: 35.1544,
    lon: 136.9665,
    source: "https://sites.google.com/view/ryuya-hora/talks"
  },
  "51734980": {
    id: "chiba-university-room-multimedia-1",
    name: "Chiba University",
    venue: "Multimedia Room 1, Science Building 4, Nishi-Chiba Campus, Chiba University",
    city: "Chiba",
    country: "Japan",
    region: "Kanto",
    lat: 35.6261,
    lon: 140.1033,
    source: "https://sites.google.com/faculty.gs.chiba-u.jp/cscat2024/home"
  },
  "51734978": {
    id: "nii-hitotsubashi",
    name: "National Institute of Informatics",
    venue: "National Institute of Informatics",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6917,
    lon: 139.7574,
    markerDx: 4,
    markerDy: 14,
    source: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A"
  },
  "51734954": {
    id: "uclouvain-auditoires",
    name: "Auditoires des Sciences, UCLouvain",
    venue: "Auditoires des Sciences, Place des Sciences 2, UCLouvain",
    city: "Louvain-la-Neuve",
    country: "Belgium",
    lat: 50.6687,
    lon: 4.6203,
    source: "https://sites.uclouvain.be/ct2023/"
  },
  "51734936": {
    id: "nii-hitotsubashi",
    name: "National Institute of Informatics",
    venue: "National Institute of Informatics",
    city: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.6917,
    lon: 139.7574,
    markerDx: 4,
    markerDy: 14,
    source: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A"
  },
  "51734931": {
    id: "australia-category-seminar-online",
    name: "Online",
    venue: "Australia Category Seminar, online",
    country: "Online",
    online: true,
    source: "http://web.science.mq.edu.au/groups/coact/seminar/"
  },
  "51734925": {
    id: "kyoto-university-research-bldg-2",
    name: "Kyoto University",
    venue: "Room 478, Research Building 2, Yoshida Campus, Kyoto University",
    city: "Kyoto",
    country: "Japan",
    region: "Kansai",
    lat: 35.0268,
    lon: 135.7807,
    source: "https://sites.google.com/view/cscat2023/home"
  }
};

const talkLocationCatalog = [
  {
    id: "fukui",
    name: "Fukui",
    country: "Japan",
    region: "Hokuriku",
    lat: 36.06,
    lon: 136.22,
    japanX: 190,
    japanY: 268,
    aliases: ["Fukui", "CSCAT2026", "CSCAT 2026", "space⋊︎time"]
  },
  {
    id: "kagawa",
    name: "Kagawa",
    country: "Japan",
    region: "Shikoku",
    lat: 34.34,
    lon: 134.04,
    japanX: 162,
    japanY: 348,
    aliases: ["Kagawa", "PPL 2026", "第28回プログラミング", "プログラミングおよびプログラミング言語"]
  },
  {
    id: "kumamoto",
    name: "Kumamoto",
    country: "Japan",
    region: "Kyushu",
    lat: 32.8,
    lon: 130.71,
    japanX: 104,
    japanY: 408,
    aliases: ["Kumamoto", "Sojo", "CSCAT2025", "CSCAT 2025"]
  },
  {
    id: "akita",
    name: "Akita",
    country: "Japan",
    region: "Tohoku",
    lat: 39.72,
    lon: 140.1,
    japanX: 228,
    japanY: 190,
    aliases: ["Akita", "SLACS", "Young Automata Theorists"]
  },
  {
    id: "chiba",
    name: "Chiba",
    country: "Japan",
    region: "Kanto",
    lat: 35.61,
    lon: 140.11,
    japanX: 248,
    japanY: 318,
    aliases: ["Chiba", "CSCAT2024", "CSCAT 2024"]
  },
  {
    id: "nagoya",
    name: "Nagoya",
    country: "Japan",
    region: "Chubu",
    lat: 35.18,
    lon: 136.91,
    japanX: 202,
    japanY: 302,
    aliases: ["Nagoya", "代数トポロジー若手"]
  },
  {
    id: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Kansai",
    lat: 35.01,
    lon: 135.77,
    japanX: 180,
    japanY: 306,
    aliases: ["Kyoto", "CSCAT2023", "CSCAT 2023", "Differentiation in category theory", "program semantics"]
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Kanto",
    lat: 35.68,
    lon: 139.76,
    japanX: 238,
    japanY: 312,
    aliases: [
      "Tokyo",
      "UTokyo",
      "University of Tokyo",
      "NII",
      "Kanda",
      "Electro-Communications",
      "CGP",
      "博士論文",
      "AFSA",
      "Japan Combinatorial Game Theory",
      "Local state classifier, The axiom of choice"
    ]
  },
  {
    id: "saitama",
    name: "Saitama",
    country: "Japan",
    region: "Kanto",
    lat: 35.78,
    lon: 139.61,
    markerDx: -12,
    markerDy: 8,
    aliases: ["Saitama", "RIKEN", "Logic Winter School"]
  },
  {
    id: "okayama",
    name: "Okayama",
    country: "Japan",
    region: "Chugoku",
    lat: 34.66,
    lon: 133.92,
    markerDx: -8,
    markerDy: -10,
    aliases: ["Okayama", "数物セミナーadv"]
  },
  {
    id: "karuizawa",
    name: "Karuizawa",
    country: "Japan",
    region: "Chubu",
    lat: 36.35,
    lon: 138.64,
    markerDx: 14,
    markerDy: -10,
    aliases: ["Karuizawa", "Game theory seminar"]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    lat: 51.52,
    lon: -0.1,
    markerDx: -8,
    markerDy: -8,
    aliases: ["London", "Queen Mary", "QMUL"]
  },
  {
    id: "oxford",
    name: "Oxford",
    country: "United Kingdom",
    lat: 51.75,
    lon: -1.26,
    markerDx: 10,
    markerDy: 8,
    aliases: ["Oxford", "OxTop", "Oxford University"]
  },
  {
    id: "brno",
    name: "Brno",
    country: "Czech Republic",
    lat: 49.2,
    lon: 16.61,
    aliases: ["Brno", "Category Theory 2025", "CT2025"]
  },
  {
    id: "paris",
    name: "Paris area",
    country: "France",
    lat: 48.86,
    lon: 2.35,
    aliases: [
      "Paris",
      "IRIF",
      "LIPN",
      "CTTA",
      "Centre Lagrange",
      "Groupe de travail topossique",
      "Categories for Automata",
      "Ecole polytechnique",
      "Polytechnique",
      "Cosynus"
    ]
  },
  {
    id: "porto",
    name: "Porto",
    country: "Portugal",
    lat: 41.15,
    lon: -8.61,
    aliases: ["Porto"]
  },
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    lat: 41.39,
    lon: 2.17,
    aliases: ["Barcelona", "TACL2024", "TACL 2024"]
  },
  {
    id: "mondovi",
    name: "Mondovi",
    country: "Italy",
    lat: 44.39,
    lon: 7.82,
    aliases: ["Mondovi", "Toposes in Mondovi"]
  },
  {
    id: "santiago",
    name: "Santiago de Compostela",
    country: "Spain",
    lat: 42.88,
    lon: -8.54,
    aliases: ["Santiago de Compostela", "Category Theory 2024", "CT2024"]
  },
  {
    id: "belgium",
    name: "Louvain-la-Neuve",
    country: "Belgium",
    lat: 50.67,
    lon: 4.61,
    aliases: ["Belgium", "Category Theory 2023", "CT2023"]
  },
  {
    id: "online",
    name: "Online",
    country: "Online",
    online: true,
    aliases: ["online", "Australia Category Seminar"]
  }
];

const oldActivitiesSource = "https://sites.google.com/view/ryuya-hora/activities";

const activityVisitRecords = [
  { date: "2026-02-07", title: "Organized and attended Categories in Tokyo 2", locationId: "tokyo", kind: "organized", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC2%E5%9B%9E%E9%9B%86%E4%BC%9A" },
  { date: "2026-02-22", title: "Attended the 20th Combinatorial Games and Puzzle Project", locationId: "tokyo", kind: "attended", href: "http://www.alg.cei.uec.ac.jp/itohiro/Games/" },
  { date: "2026-03-27", title: "Attended Workshop on Modal Logic", locationId: "tokyo", kind: "attended", href: "https://sites.google.com/view/ookayamamodallogic/%E3%83%9B%E3%83%BC%E3%83%A0" },
  { date: "2026-03-27", title: "Attended PCT seminar", locationId: "tokyo", kind: "attended", href: "https://pctseminar.github.io" },
  { date: "2026-04-05", title: "Attended Humai project final screening", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2025-02-12", title: "Visited Kyoto Category Theory Meeting", locationId: "kyoto", kind: "visit", href: "https://sites.google.com/view/kyoto-category-theory-meeting/program" },
  { date: "2025-02", title: "Attended Logic Winter School at RIKEN", locationId: "saitama", kind: "attended", href: oldActivitiesSource },
  { date: "2025-04", title: "Visited Paris as CTTA research associate and Paris-Saclay visitor", locationId: "paris", kind: "visit", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
  { date: "2025-04", title: "Visited LIPN for discussion with Morgan Rogers", locationId: "paris", kind: "visit", href: oldActivitiesSource },
  { date: "2025-04", title: "Attended a two-day seminar by Joshua Wrigley at Université Paris Cité", locationId: "paris", kind: "attended", href: oldActivitiesSource },
  { date: "2025-05", title: "Attended the first OxTop seminar at Oxford University", locationId: "oxford", kind: "attended", href: oldActivitiesSource },
  { date: "2025-06-26", title: "Finished CTTA Paris visit, 11 April to 26 June 2025", locationId: "paris", kind: "visit", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
  { date: "2025-10-18", title: "Attended Takagi Lecture 2025", locationId: "kyoto", kind: "attended", href: "https://www.kurims.kyoto-u.ac.jp/~toshi/jjm/JJMJ/JJM_JHP/contents/takagi_jp/25th/index.htm" },
  { date: "2025-10-27", title: "Visited Akita University for SLACS 2025", locationId: "akita", kind: "visit", href: "https://sites.google.com/view/slacs2025akita/home" },
  { date: "2025-11-16", title: "Attended the Game theory seminar at Karuizawa seminar house", locationId: "karuizawa", kind: "attended", href: oldActivitiesSource },
  { date: "2025-11", title: "Attended a seminar by Ryoma Sin'ya at Hongo campus, The University of Tokyo", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2025-12", title: "Attended PCT seminar", locationId: "tokyo", kind: "attended", href: "https://pctseminar.github.io" },
  { date: "2025-12", title: "Attended TMU geometry seminar", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2024-05-18", title: "Organized Categories in Tokyo 0", locationId: "tokyo", kind: "organized", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC0%E5%9B%9E%E9%9B%86%E4%BC%9A" },
  { date: "2024-06", title: "Visited Queen Mary University of London", locationId: "london", kind: "visit", href: oldActivitiesSource },
  { date: "2024-07-01", title: "Attended TACL 2024 at Barcelona", locationId: "barcelona", kind: "attended", href: "https://iiia.csic.es/tacl2024/" },
  { date: "2024-08", title: "Visited Kyoto RIMS", locationId: "kyoto", kind: "visit", href: oldActivitiesSource },
  { date: "2024-11-23", title: "Organized Categories in Tokyo 1", locationId: "tokyo", kind: "organized", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC1%E5%9B%9E%E9%9B%86%E4%BC%9A" },
  { date: "2024-11-30", title: "Gave a poster session talk at AFSA area meeting", locationId: "tokyo", kind: "poster", href: oldActivitiesSource },
  { date: "2024-12", title: "Attended courses on Automata and Class field theory by Prof. Uramoto at RIMS", locationId: "kyoto", kind: "attended", href: oldActivitiesSource },
  { date: "2023-02", title: "Attended FoPM symposium", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2023-03", title: "Talked about Applied Category Theory at FoPM seminar", locationId: "tokyo", kind: "talk", href: oldActivitiesSource },
  { date: "2023-05", title: "Attended JCGTW", locationId: "tokyo", kind: "attended", href: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A" },
  { date: "2023-05", title: "Talked about Applied Category Theory at a bookstore talk event", locationId: "tokyo", kind: "talk", href: oldActivitiesSource },
  { date: "2023-08", title: "Staff and participant at ICIAM", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2023-09", title: "Attended 数物セミナーadv at Okayama", locationId: "okayama", kind: "attended", href: oldActivitiesSource },
  { date: "2023-09", title: "Discussion with Prof. Ivan Tomasic at Kyoto", locationId: "kyoto", kind: "visit", href: oldActivitiesSource },
  { date: "2023-09", title: "Discussion with Prof. Ivan Tomasic at Tokyo", locationId: "tokyo", kind: "visit", href: oldActivitiesSource },
  { date: "2023-09", title: "Attended the last seminar on abduction at NII", locationId: "tokyo", kind: "attended", href: oldActivitiesSource },
  { date: "2023-10", title: "Visit in Kyoto, RIMS and AFSA colloquium", locationId: "kyoto", kind: "visit", href: oldActivitiesSource },
  { date: "2023-12", title: "Talked at 数学基礎論若手の会2023", locationId: "chiba", kind: "talk", href: "https://sites.google.com/view/mlwakatenokai2023" }
];

function simplified(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function slideLinksForTalk(record) {
  const title = simplified(record.title);
  const event = simplified(record.event);
  return talkSlideMatches
    .filter((match) => {
      const titleMatches = title.includes(simplified(match.title));
      const eventMatches = !match.event || event.includes(simplified(match.event));
      return titleMatches && eventMatches;
    })
    .map((match) => noteHrefByFile(match.file))
    .filter(Boolean)
    .map((href) => ["Slides", href])
    .concat(overleafActionLinks(record, ["slide", "note"]));
}

function presentationSearchText(record) {
  const location = talkLocationForRecord(record);
  const staticTalk = findStaticTalkForPresentation(record);
  return compactText([
    record.year,
    record.title,
    record.presenters?.join(" "),
    record.event,
    staticTalk?.venue,
    location?.name,
    location?.venue,
    location?.city,
    location?.country,
    location?.region,
    record.type,
    record.date,
    record.dateRange
  ]).join(" ");
}

function visiblePresentationRecords() {
  return (researchmapData?.presentations || []).filter((record) => matchesQuery(presentationSearchText(record), state.talkQuery));
}

function tokenOverlapScore(left, right) {
  const rightTokens = new Set(simplified(right).split(" ").filter((token) => token.length > 2));
  return simplified(left)
    .split(" ")
    .filter((token) => token.length > 2 && rightTokens.has(token)).length;
}

function staticTalkRecords() {
  return siteData.talks.flatMap((group) => group.items.map((talk) => ({ ...talk, year: group.year })));
}

function findStaticTalkForPresentation(record) {
  const title = simplified(record?.title);
  if (!title) return null;
  const candidates = staticTalkRecords().filter((talk) => {
    const talkTitle = simplified(talk.title);
    const sameYear = !record.year || String(talk.year) === String(record.year);
    const closeTitle = talkTitle === title || talkTitle.includes(title) || title.includes(talkTitle);
    return sameYear && closeTitle;
  });
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const context = compactText([record.event, record.date, record.dateRange]).join(" ");
  return [...candidates].sort((a, b) => {
    const scoreA = tokenOverlapScore(context, compactText([a.venue, a.href]).join(" "));
    const scoreB = tokenOverlapScore(context, compactText([b.venue, b.href]).join(" "));
    return scoreB - scoreA;
  })[0];
}

function talkLocationContext(record) {
  const staticTalk = findStaticTalkForPresentation(record);
  return compactText([
    record?.title,
    record?.event,
    record?.date,
    record?.dateRange,
    record?.type,
    staticTalk?.venue,
    staticTalk?.href
  ]).join(" ");
}

function researchmapPresentationId(record) {
  return String(record?.id || "") || String(record?.link || "").match(/presentations\/(\d+)/)?.[1] || "";
}

function verifiedTalkLocation(record) {
  const id = researchmapPresentationId(record);
  return id ? talkLocationByResearchmapId[id] || null : null;
}

function talkLocationMatches(location, context) {
  const text = simplified(context);
  return (location.aliases || []).some((alias) => {
    const needle = simplified(alias);
    return needle && text.includes(needle);
  });
}

function talkLocationForRecord(record) {
  const verified = verifiedTalkLocation(record);
  if (verified) return verified;
  const context = talkLocationContext(record);
  return talkLocationCatalog.find((location) => talkLocationMatches(location, context)) || null;
}

function talkLocationLabel(location) {
  if (!location) return "";
  if (location.online) return location.venue || location.name || "Online";
  return compactText([location.venue || location.name, location.city, location.country]).join(", ");
}

function findResearchmapPresentationForTalk(talk) {
  const title = simplified(talk?.title);
  if (!title) return null;
  const candidates = (researchmapData?.presentations || []).filter((record) => {
    const recordTitle = simplified(record.title);
    return recordTitle === title || recordTitle.includes(title) || title.includes(recordTitle);
  });
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  const context = compactText([talk.venue, talk.href]).join(" ");
  return [...candidates].sort((a, b) => {
    const scoreA = tokenOverlapScore(context, compactText([a.event, a.date, a.dateRange, a.link]).join(" "));
    const scoreB = tokenOverlapScore(context, compactText([b.event, b.date, b.dateRange, b.link]).join(" "));
    return scoreB - scoreA;
  })[0];
}

function presentationMeta(record) {
  const location = talkLocationForRecord(record);
  return compactText([
    presentationPeopleText(record),
    record.event,
    talkLocationLabel(location),
    record.dateRange || record.date,
    record.type,
    record.invited ? "invited" : ""
  ]).join(" / ");
}

function presentationTime(record) {
  const value = record.date || record.dateRange || record.year;
  if (!value) return Number.NaN;
  const normalizedDate = /^\d{4}$/.test(value)
    ? `${value}-01-01`
    : /^\d{4}-\d{2}$/.test(value)
      ? `${value}-01`
      : value.slice(0, 10);
  return Date.parse(`${normalizedDate}T00:00:00Z`);
}

function sortedPresentations(records) {
  return [...records].sort((a, b) => {
    const dateA = presentationTime(a);
    const dateB = presentationTime(b);
    if (Number.isNaN(dateA) && Number.isNaN(dateB)) return String(a.title).localeCompare(String(b.title));
    if (Number.isNaN(dateA)) return 1;
    if (Number.isNaN(dateB)) return -1;
    return dateA - dateB;
  });
}

function talkRecordKey(record) {
  return slugify(compactText([record.date, record.title, record.event, record.link]).join(" "));
}

function talkRecordAnchor(record) {
  return `talk-${talkRecordKey(record)}`;
}

function paperAnchor(paper) {
  return `paper-${slugify(paper.title)}`;
}

function webAppAnchor(app) {
  return `app-${slugify(app.title)}`;
}

function siteSearchTokens(query) {
  return simplified(query).split(" ").filter(Boolean);
}

function siteSearchRecordText(record) {
  return compactText([
    record.type,
    record.title,
    record.summary,
    record.meta,
    ...(record.keywords || [])
  ]).join(" ");
}

function siteSearchRecordScore(record, tokens) {
  const title = simplified(record.title);
  const meta = simplified(record.meta);
  const summary = simplified(record.summary);
  const text = simplified(siteSearchRecordText(record));
  if (!tokens.every((token) => text.includes(token))) return 0;
  return tokens.reduce((score, token) => {
    return score + (title.includes(token) ? 8 : 0) + (meta.includes(token) ? 4 : 0) + (summary.includes(token) ? 2 : 0) + 1;
  }, record.type === "Page" ? 2 : 0);
}

function pushSiteSearchRecord(records, record) {
  const title = normalizedUiText(record.title);
  if (!title) return;
  records.push({
    type: record.type || "Page",
    title,
    href: record.href || "",
    summary: normalizedUiText(record.summary || ""),
    meta: normalizedUiText(record.meta || ""),
    keywords: compactText(record.keywords || []).map((value) => String(value))
  });
}

function dedupeSiteSearchRecords(records) {
  const seen = new Set();
  return records.filter((record) => {
    const key = `${record.type}:${simplified(record.title)}:${record.href}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function siteSearchRecords() {
  const records = [];

  pushSiteSearchRecord(records, {
    type: "Profile",
    title: "Ryuya Hora",
    href: localHref("index.html"),
    summary: "Profile.",
    keywords: ["profile", "contact", "ZEN University", "Humai Center", "Categories in Tokyo"],
    icon: "profile"
  });

  siteData.pages.forEach((page) => {
    pushSiteSearchRecord(records, {
      type: "Page",
      title: page.title,
      href: localHref(page.href),
      summary: page.description,
      icon: pageIconKey(page),
      thumbnail: page.thumbnail || ""
    });
  });

  siteData.currentPositions.forEach((record) => {
    pushSiteSearchRecord(records, {
      type: "Profile",
      title: record.text,
      href: record.href || localHref("index.html#profile"),
      summary: "Current position",
      icon: record.icon || "profile"
    });
  });

  siteData.pastPositions.forEach((record) => {
    pushSiteSearchRecord(records, {
      type: "Profile",
      title: record.text,
      href: record.href || localHref("cv/index.html"),
      summary: "Past position",
      icon: "building"
    });
  });

  siteData.awards.forEach((record) => {
    pushSiteSearchRecord(records, {
      type: "Award",
      title: record.text,
      href: record.href || localHref("cv/index.html"),
      summary: "Award",
      icon: "award"
    });
  });

  siteData.education.forEach((record) => {
    pushSiteSearchRecord(records, {
      type: "Education",
      title: record.text,
      href: record.href || localHref("cv/index.html"),
      summary: "Education and outreach",
      icon: "education"
    });
  });

  siteData.topics.forEach(([title, href]) => {
    pushSiteSearchRecord(records, {
      type: "Profile",
      title,
      href,
      summary: "Research interest",
      icon: "topos"
    });
  });

  [...siteData.papers.published, ...siteData.papers.preprints].forEach((paper) => {
    const researchmapPaper = findResearchmapPaper(paper);
    pushSiteSearchRecord(records, {
      type: "Paper",
      title: paper.title,
      href: localHref(`papers/index.html#${paperAnchor(paper)}`),
      summary: paper.summary,
      meta: compactText([paperPeopleText(paper, researchmapPaper), paper.year, paper.venue]).join(" / "),
      keywords: paper.tags || [],
      icon: "paper",
      thumbnail: paperThumbnailSrc(paper)
    });
  });

  siteData.papers.misc.forEach((paper) => {
    pushSiteSearchRecord(records, {
      type: "Paper",
      title: paper.title,
      href: paper.link,
      summary: paper.venue,
      meta: compactText([paperPeopleText(paper), paper.year]).join(" / "),
      icon: "paper",
      thumbnail: paperThumbnailSrc(paper)
    });
  });

  siteData.papers.preparation.forEach((title) => {
    pushSiteSearchRecord(records, {
      type: "In preparation",
      title,
      href: localHref("papers/index.html"),
      summary: "Manuscript in preparation",
      icon: "paper"
    });
  });

  (researchmapData?.papers || []).forEach((record) => {
    pushSiteSearchRecord(records, {
      type: "Paper",
      title: record.title,
      href: record.link || localHref(`papers/index.html#${paperAnchor(record)}`),
      summary: record.venue || record.type || "Synced paper metadata",
      meta: compactText([paperPeopleText(record), record.year, record.publicationDate]).join(" / "),
      keywords: compactText([record.type, record.openAccess ? "open access" : "researchmap"]),
      icon: "paper"
    });
  });

  const researchmapTalks = researchmapData?.presentations || [];
  if (researchmapTalks.length) {
    researchmapTalks.forEach((record) => {
      pushSiteSearchRecord(records, {
        type: "Talk",
        title: record.title,
        href: localHref(`talks/index.html#${talkRecordAnchor(record)}`),
        summary: record.event || record.type || "Talk",
        meta: compactText([presentationPeopleText(record), formatTalkDate(record), record.invited ? "invited" : ""]).join(" / "),
        keywords: compactText([record.type, record.event]),
        icon: "talk",
        thumbnail: talkThumbnail(record)?.src || ""
      });
    });
  } else {
    siteData.talks.forEach((group) => {
      group.items.forEach((talk) => {
        const presentationRecord = findResearchmapPresentationForTalk(talk);
        pushSiteSearchRecord(records, {
          type: "Talk",
          title: talk.title,
          href: talk.href || localHref("talks/index.html"),
          summary: talk.venue,
          meta: compactText([presentationPeopleText(presentationRecord || talk), group.year]).join(" / "),
          icon: "talk",
          thumbnail: talkThumbnail(presentationRecord || talk)?.src || ""
        });
      });
    });
  }

  [...overleafNoteRecords(), ...siteData.notes].forEach((note) => {
    const [kind, kindLabel] = noteKind(note);
    pushSiteSearchRecord(records, {
      type: "Note",
      title: shortNoteTitle(note),
      href: note.href || localHref(`notes/index.html#${noteAnchor(note)}`),
      summary: note.description || note.file,
      meta: compactText([kindLabel, note.language, note.source === "overleaf" ? "Overleaf" : ""]).join(" / "),
      keywords: compactText([kind, note.file]),
      icon: "note",
      thumbnail: noteThumbnailSrc(note)
    });
  });

  siteData.activities.forEach((group) => {
    group.items.forEach((record, index) => {
    pushSiteSearchRecord(records, {
      type: "Activity",
      title: cleanActivityTitle(record.text),
      href: record.href || localHref(`activities/index.html#${activityAnchor(group, record, index)}`),
      summary: group.title,
      icon: "activity"
    });
  });
  });

  siteData.problems.forEach((problem) => {
    pushSiteSearchRecord(records, {
      type: "Problem",
      title: `${problem.id}: ${problem.title}`,
      href: localHref(`problems/index.html#${problemAnchor(problem)}`),
      summary: problem.statement,
      meta: compactText([problemStatusLabel(problem.status), problem.theme]).join(" / "),
      keywords: problem.tags || [],
      icon: "problem"
    });
  });

  siteData.favoriteTopoi.forEach((topos) => {
    pushSiteSearchRecord(records, {
      type: "Topos",
      title: topos.title,
      href: localHref(`favorite-topoi/index.html#${topos.id}`),
      summary: topos.summary,
      meta: compactText([topos.subtitle, topos.formula]).join(" / "),
      keywords: compactText([topos.id, ...(topos.details || []).map((detail) => `${detail.label} ${detail.value}`)]),
      icon: "topos",
      thumbnail: "assets/profile/green-fractal-cloud.png"
    });
  });

  siteData.webApps.forEach((app) => {
    pushSiteSearchRecord(records, {
      type: "Web App",
      title: app.title,
      href: localHref(`web-apps/index.html#${webAppAnchor(app)}`),
      summary: app.description,
      meta: compactText([app.tag, "Vercel"]).join(" / "),
      keywords: compactText([...(app.keywords || []), ...(app.links || []).map(([label]) => label)]),
      icon: "webapp",
      thumbnail: app.thumbnail
    });
  });

  siteData.links.forEach((group) => {
    group.items.forEach(([title, href]) => {
      pushSiteSearchRecord(records, {
        type: "Link",
        title,
        href,
        summary: group.title,
        icon: iconKeyForLink(title, href, group.title)
      });
    });
  });

  return dedupeSiteSearchRecords(records);
}

function renderSiteSearchResult(record) {
  const article = el("article", "site-search-result");
  const type = el("span", "site-search-type");
  type.append(uiIcon(record.icon || iconKeyForSearchType(record.type), "site-search-type-icon"), el("span", null, record.type));

  const body = el("div", "site-search-result-body");
  body.append(type);
  const heading = el("h3");
  if (record.href) heading.append(link(record.title, record.href));
  else heading.textContent = record.title;
  body.append(heading);
  if (record.summary) body.append(el("p", "site-search-summary", record.summary));
  const meta = compactText([record.meta, ...(record.keywords || []).slice(0, 5)]).join(" / ");
  if (meta) body.append(el("p", "site-search-meta", meta));

  if (record.thumbnail) {
    const media = record.href ? link("", record.href, "site-search-media") : el("div", "site-search-media");
    const image = el("img");
    image.src = resolveAssetHref(record.thumbnail);
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      media.remove();
      article.classList.remove("has-thumbnail");
    });
    media.append(image);
    article.classList.add("has-thumbnail");
    article.append(media, body);
    return article;
  }

  article.append(body);
  return article;
}

function syncSiteSearchUrl() {
  if (!document.querySelector("#site-search-input") || !globalThis.history?.replaceState || !globalThis.location) return;
  try {
    const url = new URL(globalThis.location.href);
    if (state.siteSearchQuery.trim()) url.searchParams.set("q", state.siteSearchQuery.trim());
    else url.searchParams.delete("q");
    globalThis.history.replaceState(null, "", url.href);
  } catch {
    // Some file previews restrict history updates.
  }
}

function renderSiteSearch() {
  const root = document.querySelector("#site-search-results");
  if (!root) return;
  const input = document.querySelector("#site-search-input");
  const count = document.querySelector("#site-search-count");
  if (input && input.value !== state.siteSearchQuery) input.value = state.siteSearchQuery;

  root.replaceChildren();
  const query = state.siteSearchQuery.trim();
  const records = siteSearchRecords();

  if (!query) {
    if (count) count.textContent = "Type to search the site.";
    siteData.pages.forEach((page) => {
      root.append(
        renderSiteSearchResult({
          type: "Page",
          title: page.title,
          href: localHref(page.href),
          summary: page.description,
          meta: ""
        })
      );
    });
    applyLanguage(root);
    if (count) applyLanguage(count);
    return;
  }

  const tokens = siteSearchTokens(query);
  const matches = records
    .map((record) => ({ record, score: siteSearchRecordScore(record, tokens) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .map((item) => item.record);

  if (count) count.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"}`;
  if (!matches.length) {
    root.append(el("p", "empty-state", "No public site results match this search."));
    applyLanguage(root);
    if (count) applyLanguage(count);
    return;
  }

  matches.forEach((record) => root.append(renderSiteSearchResult(record)));
  typesetMath(root);
  applyLanguage(root);
  if (count) applyLanguage(count);
}

function contentTheme(text) {
  const value = simplified(text);
  if (/game|nim|snake|life|lights out|winning|grundy|ライツアウト/.test(value)) return "games";
  if (/automata|regular language|formal language|language|measurability|dfa|myhill|monoid|word/.test(value)) return "automata";
  if (/topos|topoi|quotient|lawvere|connected|choice|classifier|simplicial|species|subtopos|grothendieck/.test(value)) return "topos";
  if (/category|categorical|kan|coalgebra|semantics|logic|algebra|rieg|semiring|normaliz|subgroup|圏論/.test(value)) return "category";
  return "other";
}

function talkTheme(record) {
  return contentTheme(`${record.title} ${record.event} ${record.type}`);
}

function formatTalkDate(record) {
  return record.dateRange || record.date || record.year || "Undated";
}

function talkTimelinePosition(record, firstTime, lastTime, index, count) {
  const time = presentationTime(record);
  if (Number.isNaN(time)) return count <= 1 ? 50 : (index / (count - 1)) * 100;
  if (firstTime === lastTime) return 50;
  return ((time - firstTime) / (lastTime - firstTime)) * 100;
}

function stepTalkTimeline(delta = 1) {
  const records = sortedPresentations(visiblePresentationRecords());
  if (!records.length) return;
  const currentIndex = Math.max(
    0,
    records.findIndex((record) => talkRecordKey(record) === state.talkTimelineKey)
  );
  const nextIndex = (currentIndex + delta + records.length) % records.length;
  selectTalkTimelineRecord(talkRecordKey(records[nextIndex]));
}

function selectTalkTimelineRecord(key, shouldScroll = false) {
  state.talkTimelineKey = key;
  renderTalkTimeline();
  renderResearchmapPresentations();
  const record = visiblePresentationRecords().find((item) => talkRecordKey(item) === key);
  if (shouldScroll && record) document.getElementById(talkRecordAnchor(record))?.scrollIntoView({ block: "center" });
}

function timelineScrollFrame(track, position = 100) {
  const frame = el("div", "timeline-scroll-frame");
  frame.tabIndex = 0;
  frame.append(track);
  requestAnimationFrame(() => {
    const maxScroll = frame.scrollWidth - frame.clientWidth;
    if (maxScroll <= 4) return;
    const clampedPosition = Math.max(0, Math.min(100, position));
    frame.scrollLeft = (maxScroll * clampedPosition) / 100;
  });
  return frame;
}

function renderTalkTimeline() {
  const root = document.querySelector("#talk-timeline");
  if (!root) return;
  root.replaceChildren();

  const records = sortedPresentations(visiblePresentationRecords());
  if (!records.length) {
    root.append(el("p", "empty-state", "No talks match this filter."));
    return;
  }

  if (!records.some((record) => talkRecordKey(record) === state.talkTimelineKey)) {
    state.talkTimelineKey = talkRecordKey(records[0]);
  }

  const selectedIndex = Math.max(
    0,
    records.findIndex((record) => talkRecordKey(record) === state.talkTimelineKey)
  );
  const selected = records[selectedIndex] || records[0];
  const times = records.map(presentationTime).filter((time) => !Number.isNaN(time));
  const firstTime = times.length ? Math.min(...times) : 0;
  const lastTime = times.length ? Math.max(...times) : 0;
  const selectedPosition = talkTimelinePosition(selected, firstTime, lastTime, selectedIndex, records.length);

  const track = el("div", "talk-timeline-track");
  track.style.setProperty("--talk-progress", selectedPosition);
  track.append(el("div", "talk-timeline-rail"), el("div", "talk-timeline-progress"), el("div", "talk-timeline-cursor"));

  const yearMarks = new Map();
  records.forEach((record, index) => {
    const time = presentationTime(record);
    const year = record.year || (Number.isNaN(time) ? "Undated" : String(new Date(time).getUTCFullYear()));
    if (yearMarks.has(year)) return;
    const position = talkTimelinePosition(record, firstTime, lastTime, index, records.length);
    yearMarks.set(year, position);
  });

  [...yearMarks.entries()].forEach(([year, position]) => {
    const tick = el("span", "talk-year-tick", year);
    tick.style.setProperty("--x", position);
    track.append(tick);
  });

  records.forEach((record, index) => {
    const key = talkRecordKey(record);
    const position = talkTimelinePosition(record, firstTime, lastTime, index, records.length);
    const node = el("button", `talk-timeline-node theme-${talkTheme(record)}`);
    node.type = "button";
    node.style.setProperty("--x", position);
    node.style.setProperty("--lane", index % 3);
    node.dataset.talkTimelineKey = key;
    node.classList.toggle("is-active", key === state.talkTimelineKey);
    node.setAttribute("aria-label", `${formatTalkDate(record)}: ${record.title}`);
    node.setAttribute("aria-pressed", String(key === state.talkTimelineKey));
    attachTimelineTooltip(node, {
      kind: "talk",
      title: record.title,
      dateLabel: formatTalkDate(record),
      meta: presentationMeta(record)
    });
    node.addEventListener("click", () => selectTalkTimelineRecord(key, true));
    track.append(node);
  });

  const card = el("aside", "talk-timeline-card");
  const title = el("h3");
  title.append(link(selected.title, selected.link));
  card.append(
    el("span", `talk-timeline-theme theme-${talkTheme(selected)}`, talkTheme(selected)),
    el("p", "talk-timeline-date", formatTalkDate(selected)),
    title,
    el("p", "talk-timeline-meta", presentationMeta(selected)),
    el("p", "talk-timeline-count", `${selectedIndex + 1} / ${records.length}`)
  );
  appendActionLinks(card, slideLinksForTalk(selected));

  root.append(timelineScrollFrame(track, selectedPosition), card);
}

function talkMapRecordHref(record) {
  const hash = `#${talkRecordAnchor(record)}`;
  return document.body.dataset.page === "talks" ? hash : localHref(`talks/index.html${hash}`);
}

function visitLocationById(id) {
  return talkLocationCatalog.find((location) => location.id === id) || null;
}

function canonicalVisitLocation(location) {
  if (!location || location.online) return null;
  const text = simplified(compactText([location.id, location.name, location.venue, location.city, location.country]).join(" "));
  const rules = [
    ["paris", /france|paris|palaiseau|villetaneuse|irif|lipn|lagrange|polytechnique|paris saclay/],
    ["london", /london|queen mary|qmul/],
    ["oxford", /oxford|oxtop/],
    ["barcelona", /barcelona|tacl2024|tacl 2024/],
    ["brno", /brno|masaryk|ct2025|category theory 2025/],
    ["mondovi", /mondovi|mondovì/],
    ["santiago", /santiago de compostela|usc|ct2024|category theory 2024/],
    ["belgium", /belgium|louvain/],
    ["fukui", /fukui|aossa/],
    ["kagawa", /kagawa|takamatsu|rexxam/],
    ["kumamoto", /kumamoto|sojo/],
    ["akita", /akita/],
    ["chiba", /chiba|数学基礎論若手/],
    ["nagoya", /nagoya|aichi|代数トポロジー若手/],
    ["kyoto", /kyoto|rims|yoshida/],
    ["saitama", /saitama|riken|wako/],
    ["okayama", /okayama|数物セミナーadv/],
    ["karuizawa", /karuizawa/],
    ["tokyo", /tokyo|chofu|komaba|hongo|kanda|nii|national institute of informatics|electro communications|utokyo|university of tokyo|tmu|pct|genron/]
  ];
  const match = rules.find(([, pattern]) => pattern.test(text));
  return match ? visitLocationById(match[0]) || location : location;
}

function presentationVisitRecords() {
  return sortedPresentations(researchmapData?.presentations || [])
    .map((record) => {
      const originalLocation = talkLocationForRecord(record);
      const location = canonicalVisitLocation(originalLocation);
      if (!location) return null;
      return {
        type: "talk",
        kind: "talk",
        title: record.title,
        href: talkMapRecordHref(record),
        date: formatTalkDate(record),
        meta: compactText([presentationPeopleText(record), record.event, talkLocationLabel(originalLocation)]).join(" / "),
        location,
        rawRecord: record
      };
    })
    .filter(Boolean);
}

function activityVisitEntries() {
  return activityVisitRecords
    .map((record) => {
      const location = visitLocationById(record.locationId);
      return location ? { ...record, type: "activity", location } : null;
    })
    .filter(Boolean);
}

function visitMapRecords() {
  return [...presentationVisitRecords(), ...activityVisitEntries()].sort((a, b) => visitRecordTime(b) - visitRecordTime(a));
}

function groupTalkMapRecords(entries, scope) {
  const groups = new Map();
  entries.forEach((entry) => {
    const location = entry.location;
    if (!locationInMapScope(location, scope)) return;
    if (!groups.has(location.id)) groups.set(location.id, { location, records: [] });
    groups.get(location.id).records.push(entry);
  });

  return [...groups.values()]
    .map((group) => ({
      ...group,
      records: [...group.records].sort((a, b) => visitRecordTime(b) - visitRecordTime(a))
    }))
    .sort((a, b) => b.records.length - a.records.length || talkMapGroupLatest(b) - talkMapGroupLatest(a));
}

function talkMapGroupLatest(group) {
  const times = group.records.map(visitRecordTime).filter((time) => Number.isFinite(time));
  return times.length ? Math.max(...times) : 0;
}

function visitRecordTime(record) {
  const value = record.date || record.dateRange || record.year;
  if (!value) return 0;
  const normalizedDate = /^\d{4}$/.test(value)
    ? `${value}-01-01`
    : /^\d{4}-\d{2}$/.test(value)
      ? `${value}-01`
      : String(value).slice(0, 10);
  const time = Date.parse(`${normalizedDate}T00:00:00Z`);
  return Number.isFinite(time) ? time : 0;
}

function talkMapViewBox(scope) {
  return talkMapData?.[scope]?.viewBox || (scope === "europe" ? "0 0 560 440" : "0 0 360 520");
}

function talkMapViewBoxParts(scope) {
  const [x = 0, y = 0, width = 720, height = 360] = talkMapViewBox(scope).split(/\s+/).map(Number);
  return { x, y, width, height };
}

function talkMapViewBoxSize(scope) {
  const parts = talkMapViewBoxParts(scope);
  return { width: parts.width || 720, height: parts.height || 360 };
}

function talkMapPoint(location, scope) {
  const offsetX = Number(location.markerDx) || 0;
  const offsetY = Number(location.markerDy) || 0;
  const projection = talkMapData?.[scope]?.projection;
  if (projection) {
    return {
      x: projection.offsetX + (location.lon - projection.minLon) * projection.scale + offsetX,
      y: projection.offsetY + (projection.maxLat - location.lat) * projection.scale + offsetY
    };
  }
  if (scope === "japan") {
    return { x: location.japanX + offsetX, y: location.japanY + offsetY };
  }
  const size = talkMapViewBoxSize(scope);
  return {
    x: ((location.lon + 180) / 360) * size.width + offsetX,
    y: ((90 - location.lat) / 180) * size.height + offsetY
  };
}

function locationInProjection(location, projection) {
  return (
    Number.isFinite(location.lat) &&
    Number.isFinite(location.lon) &&
    location.lon >= projection.minLon &&
    location.lon <= projection.maxLon &&
    location.lat >= projection.minLat &&
    location.lat <= projection.maxLat
  );
}

function locationInMapScope(location, scope) {
  if (scope === "japan") return location.country === "Japan";
  if (scope === "europe") {
    if (location.country === "Japan" || location.online) return false;
    const projection = talkMapData?.europe?.projection;
    return projection ? locationInProjection(location, projection) : location.country !== "Japan";
  }
  return !location.online;
}

function selectTalkMapLocation(id) {
  state.talkMapLocationId = id;
  renderTalkMap();
}

const talkMapZoom = {
  min: 1,
  max: 2.75,
  step: 0.25
};

function currentTalkMapZoom(scope) {
  return Number(state.talkMapZoom?.[scope]) || 1;
}

function clampTalkMapZoom(value) {
  return Math.min(talkMapZoom.max, Math.max(talkMapZoom.min, Number(value) || 1));
}

function clampScroll(value, max) {
  return Math.min(Math.max(Number(value) || 0, 0), Math.max(max, 0));
}

function rememberTalkMapPan(scope, canvas) {
  state.talkMapPan[scope] = {
    left: clampScroll(canvas.scrollLeft, canvas.scrollWidth - canvas.clientWidth),
    top: clampScroll(canvas.scrollTop, canvas.scrollHeight - canvas.clientHeight)
  };
}

function storeTalkMapPanPositions(root) {
  root.querySelectorAll("[data-talk-map-canvas]").forEach((canvas) => {
    const scope = canvas.dataset.talkMapScope;
    if (scope) rememberTalkMapPan(scope, canvas);
  });
}

function talkMapMarkerBounds(groups, scope) {
  const points = groups.map((group) => talkMapPoint(group.location, scope));
  if (!points.length) return null;
  const viewBox = talkMapViewBoxParts(scope);
  const padding = scope === "japan" ? 42 : 36;
  const minX = Math.max(viewBox.x, Math.min(...points.map((point) => point.x)) - padding);
  const maxX = Math.min(viewBox.x + viewBox.width, Math.max(...points.map((point) => point.x)) + padding);
  const minY = Math.max(viewBox.y, Math.min(...points.map((point) => point.y)) - padding);
  const maxY = Math.min(viewBox.y + viewBox.height, Math.max(...points.map((point) => point.y)) + padding);
  return { minX, maxX, minY, maxY };
}

function talkMapScrollForBounds(canvas, svg, scope, bounds) {
  const viewBox = talkMapViewBoxParts(scope);
  const svgRect = svg.getBoundingClientRect();
  const scaleX = svgRect.width / viewBox.width;
  const scaleY = svgRect.height / viewBox.height;
  const centerX = ((bounds.minX + bounds.maxX) / 2 - viewBox.x) * scaleX;
  const centerY = ((bounds.minY + bounds.maxY) / 2 - viewBox.y) * scaleY;
  return {
    left: clampScroll(centerX - canvas.clientWidth / 2, canvas.scrollWidth - canvas.clientWidth),
    top: clampScroll(centerY - canvas.clientHeight / 2, canvas.scrollHeight - canvas.clientHeight)
  };
}

function applyTalkMapPan(canvas, scope, pan, shouldRemember = false) {
  canvas.scrollLeft = clampScroll(pan.left, canvas.scrollWidth - canvas.clientWidth);
  canvas.scrollTop = clampScroll(pan.top, canvas.scrollHeight - canvas.clientHeight);
  if (shouldRemember) rememberTalkMapPan(scope, canvas);
}

function fitTalkMapToMarkers(figure, scope, groups, shouldRemember = false) {
  const canvas = figure.querySelector(".talk-map-canvas");
  const svg = figure.querySelector("svg");
  const bounds = talkMapMarkerBounds(groups, scope);
  if (!canvas || !svg || !bounds) return;
  applyTalkMapPan(canvas, scope, talkMapScrollForBounds(canvas, svg, scope, bounds), shouldRemember);
}

function initializeTalkMapViewport(figure, scope, groups) {
  window.requestAnimationFrame(() => {
    const canvas = figure.querySelector(".talk-map-canvas");
    if (!canvas) return;
    const saved = state.talkMapPan?.[scope];
    if (saved) applyTalkMapPan(canvas, scope, saved);
    else fitTalkMapToMarkers(figure, scope, groups);
  });
}

function enableTalkMapDragPan(canvas, scope) {
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;

  const finishDrag = () => {
    if (!dragging) return;
    dragging = false;
    canvas.classList.remove("is-dragging");
    rememberTalkMapPan(scope, canvas);
  };

  canvas.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target?.closest?.(".talk-map-marker")) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    startLeft = canvas.scrollLeft;
    startTop = canvas.scrollTop;
    canvas.classList.add("is-dragging");
    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    canvas.scrollLeft = startLeft - (event.clientX - startX);
    canvas.scrollTop = startTop - (event.clientY - startY);
  });

  canvas.addEventListener("pointerup", finishDrag);
  canvas.addEventListener("pointercancel", finishDrag);
  canvas.addEventListener("lostpointercapture", finishDrag);
}

function updateTalkMapZoomUi(figure, scope) {
  const zoom = currentTalkMapZoom(scope);
  figure.style.setProperty("--visit-map-zoom", String(zoom));
  const readout = figure.querySelector("[data-talk-map-zoom-readout]");
  if (readout) readout.textContent = `${Math.round(zoom * 100)}%`;
  figure.querySelectorAll("[data-talk-map-zoom]").forEach((button) => {
    const action = button.dataset.talkMapZoom;
    button.disabled =
      (action === "out" && zoom <= talkMapZoom.min) ||
      (action === "in" && zoom >= talkMapZoom.max) ||
      (action === "reset" && zoom === 1 && !state.talkMapPan?.[scope]);
  });
}

function setTalkMapZoom(scope, action, figure, groups = []) {
  const current = currentTalkMapZoom(scope);
  const canvas = figure.querySelector(".talk-map-canvas");
  const currentCenter = canvas
    ? {
        x: canvas.scrollLeft + canvas.clientWidth / 2,
        y: canvas.scrollTop + canvas.clientHeight / 2
      }
    : null;
  const next =
    action === "in"
      ? current + talkMapZoom.step
      : action === "out"
        ? current - talkMapZoom.step
        : 1;
  state.talkMapZoom[scope] = clampTalkMapZoom(next);
  updateTalkMapZoomUi(figure, scope);

  window.requestAnimationFrame(() => {
    if (!canvas) return;
    if (action === "reset") {
      state.talkMapPan[scope] = null;
      fitTalkMapToMarkers(figure, scope, groups);
      updateTalkMapZoomUi(figure, scope);
      return;
    }
    if (currentCenter) {
      const ratio = currentTalkMapZoom(scope) / current;
      applyTalkMapPan(
        canvas,
        scope,
        {
          left: currentCenter.x * ratio - canvas.clientWidth / 2,
          top: currentCenter.y * ratio - canvas.clientHeight / 2
        },
        true
      );
    }
  });
}

function renderTalkMapZoomControls(scope, figure, groups) {
  const controls = el("div", "talk-map-controls");
  [
    ["out", "−", `Zoom out ${scope} map`],
    ["reset", "1:1", `Reset ${scope} map zoom`],
    ["in", "+", `Zoom in ${scope} map`]
  ].forEach(([action, label, ariaLabel]) => {
    const button = el("button", "talk-map-control", label);
    button.type = "button";
    button.dataset.talkMapZoom = action;
    button.setAttribute("aria-label", ariaLabel);
    button.title = ariaLabel;
    button.addEventListener("click", () => setTalkMapZoom(scope, action, figure, groups));
    controls.append(button);
  });
  controls.append(el("span", "talk-map-zoom-readout", "100%"));
  return controls;
}

function visitMapTheme(record) {
  if (record.type === "talk" && record.rawRecord) return talkTheme(record.rawRecord);
  if (record.kind === "organized") return "topos";
  if (record.kind === "poster" || record.kind === "talk") return "category";
  return "visit";
}

function talkMapMarker(group, scope) {
  const point = talkMapPoint(group.location, scope);
  const theme = visitMapTheme(group.records[0]);
  const selected = state.talkMapLocationId === group.location.id;
  const marker = svgEl("g", {
    class: `talk-map-marker theme-${theme}${selected ? " is-selected" : ""}`,
    transform: `translate(${point.x} ${point.y})`,
    role: "button",
    tabindex: "0",
    "aria-label": `${group.location.name}: ${group.records.length} visits`
  });
  marker.dataset.talkMapLocation = group.location.id;
  marker.append(
    svgEl("title", {}, `${group.location.name}: ${group.records.length} visits`),
    svgEl("circle", { r: selected ? 13 : 10 }),
    svgEl("text", { y: 4 }, String(group.records.length))
  );
  marker.addEventListener("click", () => selectTalkMapLocation(group.location.id));
  marker.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    selectTalkMapLocation(group.location.id);
  });
  return marker;
}

function appendTalkMapDataPaths(svg, scope) {
  const paths = talkMapData?.[scope]?.paths || [];
  const clipId = `talk-map-clip-${scope}`;
  const size = talkMapViewBoxSize(scope);
  const defs = svgEl("defs");
  const clipPath = svgEl("clipPath", { id: clipId, clipPathUnits: "userSpaceOnUse" });
  clipPath.append(svgEl("rect", { x: 0, y: 0, width: size.width, height: size.height, rx: 16 }));
  defs.append(clipPath);
  svg.append(defs);
  paths.forEach((feature) => {
    const path = svgEl("path", {
      class: `talk-map-land talk-map-data-land ${scope === "japan" ? "japan-island main" : ""}`,
      d: feature.d,
      "clip-path": `url(#${clipId})`,
      "data-map-id": feature.id || "",
      "data-continent": feature.continent || ""
    });
    path.append(svgEl("title", {}, feature.name || feature.id || ""));
    svg.append(path);
  });
  if (!paths.length) {
    const size = talkMapViewBoxSize(scope);
    svg.append(svgEl("text", { class: "talk-map-caption", x: 24, y: size.height - 24 }, "Map data unavailable"));
  }
}

function appendEuropeMapBase(svg) {
  const size = talkMapViewBoxSize("europe");
  svg.append(
    svgEl("rect", { class: "talk-map-water", x: 0, y: 0, width: size.width, height: size.height, rx: 16 })
  );
  appendTalkMapDataPaths(svg, "europe");
  svg.append(svgEl("text", { class: "talk-map-caption", x: 24, y: size.height - 24 }, "Europe"));
}

function appendJapanMapBase(svg) {
  const size = talkMapViewBoxSize("japan");
  svg.append(
    svgEl("rect", { class: "talk-map-water", x: 0, y: 0, width: size.width, height: size.height, rx: 16 })
  );
  appendTalkMapDataPaths(svg, "japan");
  svg.append(svgEl("text", { class: "talk-map-caption", x: 24, y: size.height - 24 }, "Japan"));
}

function renderTalkMapFigure(title, scope, groups) {
  const figure = el("figure", `talk-map-figure talk-${scope}-map`);
  const caption = el("figcaption", "talk-map-label", title);
  const toolbar = el("div", "talk-map-toolbar");
  const svg = svgEl("svg", {
    viewBox: talkMapViewBox(scope),
    role: "img",
    "aria-label": `${title} talk map`
  });
  if (scope === "europe") appendEuropeMapBase(svg);
  else appendJapanMapBase(svg);
  groups.forEach((group) => svg.append(talkMapMarker(group, scope)));
  const canvas = el("div", "talk-map-canvas");
  canvas.dataset.talkMapCanvas = "";
  canvas.dataset.talkMapScope = scope;
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", `${title} map viewport. Drag to pan after zooming.`);
  canvas.addEventListener("dblclick", () => setTalkMapZoom(scope, "in", figure, groups));
  enableTalkMapDragPan(canvas, scope);
  canvas.append(svg);
  toolbar.append(caption, renderTalkMapZoomControls(scope, figure, groups));
  figure.append(toolbar, canvas);
  updateTalkMapZoomUi(figure, scope);
  return figure;
}

function renderTalkMapDetail(groups) {
  const detail = el("aside", "talk-map-detail");
  const selected = groups.find((group) => group.location.id === state.talkMapLocationId) || groups[0];
  if (!selected) {
    detail.append(el("p", "empty-state", "No mapped visits yet."));
    return detail;
  }

  const placeTitle = selected.location.source
    ? link(selected.location.name, selected.location.source)
    : document.createTextNode(selected.location.name);
  const heading = el("h3");
  heading.append(placeTitle);
  const place = talkLocationLabel(selected.location);

  detail.append(
    el("p", "section-kicker", "Mapped Visits"),
    heading,
    place ? el("p", "talk-map-place", place) : "",
    el(
      "p",
      "talk-map-count",
      compactText([`${selected.records.length} visit${selected.records.length === 1 ? "" : "s"}`, selected.location.country]).join(" / ")
    )
  );

  const list = el("ol", "talk-map-records");
  selected.records.forEach((record) => {
    const item = el("li");
    const title = record.href ? link(record.title, record.href) : document.createTextNode(record.title);
    item.append(
      title,
      el("span", null, compactText([record.date, record.kind, record.meta]).join(" / "))
    );
    list.append(item);
  });
  detail.append(list);
  return detail;
}

function renderTalkMap() {
  const root = document.querySelector("#talk-map");
  if (!root) return;
  storeTalkMapPanPositions(root);
  root.replaceChildren();

  const entries = visitMapRecords();
  if (!entries.length) {
    root.append(el("p", "empty-state", "No mapped visits yet."));
    applyLanguage(root);
    return;
  }

  const europeGroups = groupTalkMapRecords(entries, "europe");
  const japanGroups = groupTalkMapRecords(entries, "japan");
  const allGroups = [...japanGroups, ...europeGroups];
  if (!allGroups.some((group) => group.location.id === state.talkMapLocationId)) {
    state.talkMapLocationId = japanGroups[0]?.location.id || europeGroups[0]?.location.id || "";
  }

  const maps = el("div", "talk-map-grid");
  const figures = [];
  if (europeGroups.length) {
    const figure = renderTalkMapFigure("Europe", "europe", europeGroups);
    figures.push([figure, "europe", europeGroups]);
    maps.append(figure);
  }
  if (japanGroups.length) {
    const figure = renderTalkMapFigure("Japan", "japan", japanGroups);
    figures.push([figure, "japan", japanGroups]);
    maps.append(figure);
  }
  root.append(maps, renderTalkMapDetail(allGroups));
  figures.forEach(([figure, scope, groups]) => initializeTalkMapViewport(figure, scope, groups));
  applyLanguage(root);
}

function appendCategoriesPrefectures(svg, features) {
  features.filter((feature) => feature.d).forEach((feature) => {
    const path = svgEl("path", {
      class: `categories-map-prefecture${feature.isTokyo ? " is-tokyo" : ""}`,
      d: feature.d
    });
    path.append(svgEl("title", {}, compactText([feature.name, feature.nameJa]).join(" / ")));
    svg.append(path);
  });
}

const categoriesTokyoVenues = [
  {
    id: "komaba",
    label: "第0回 UTokyo",
    name: "第0回 UTokyo",
    lon: 139.6847,
    lat: 35.6606,
    dx: -4.5,
    dy: 10.8,
    meetings: [
      {
        label: "0",
        title: "Categories in Tokyo 0",
        href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC0%E5%9B%9E%E9%9B%86%E4%BC%9A"
      }
    ]
  },
  {
    id: "nii",
    label: "第1回 NII",
    name: "第1回 NII",
    lon: 139.7585,
    lat: 35.6933,
    dx: 3.5,
    dy: -8.8,
    meetings: [
      {
        label: "1",
        title: "Categories in Tokyo 1",
        href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC1%E5%9B%9E%E9%9B%86%E4%BC%9A"
      }
    ]
  },
  {
    id: "nii",
    label: "第2回 NII",
    name: "第2回 NII",
    lon: 139.7585,
    lat: 35.6933,
    dx: 9.8,
    dy: -2.8,
    showPoint: false,
    meetings: [
      {
        label: "2",
        title: "Categories in Tokyo 2",
        href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC2%E5%9B%9E%E9%9B%86%E4%BC%9A"
      }
    ]
  },
  {
    id: "kabukiza",
    label: "第3回 ZEN University",
    name: "第3回 ZEN University",
    lon: 139.7671,
    lat: 35.6695,
    dx: 3.5,
    dy: 8,
    meetings: [
      {
        label: "3",
        title: "Categories in Tokyo 3",
        href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC3%E5%9B%9E%E9%9B%86%E4%BC%9A"
      }
    ]
  }
];

function projectCategoriesPoint(projection, lon, lat) {
  if (!projection || !Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  const x = projection.offsetX + (lon - projection.minLon) * projection.scale;
  const y = projection.offsetY + (projection.maxLat - lat) * projection.scale;
  return [Number(x.toFixed(1)), Number(y.toFixed(1))];
}

function appendCategoriesMeetingButtons(item, venue, labelX, labelY) {
  const meetings = venue.meetings || [];
  if (!meetings.length) return;
  const buttonWidth = 4.9;
  const buttonHeight = 3.8;
  const gap = 0.7;
  const buttonsY = Number((labelY + 3.1).toFixed(1));
  const totalWidth = meetings.length * buttonWidth + Math.max(0, meetings.length - 1) * gap;
  const startX = venue.dx < 0 ? Number((labelX - totalWidth).toFixed(1)) : labelX;
  const group = svgEl("g", { class: "categories-map-meeting-buttons" });

  meetings.forEach((meeting, index) => {
    const x = Number((startX + index * (buttonWidth + gap)).toFixed(1));
    const linkNode = svgEl("a", {
      class: "categories-map-meeting-link",
      href: meeting.href,
      "aria-label": `${meeting.title} page`
    });
    linkNode.append(
      svgEl("title", {}, meeting.title),
      svgEl("rect", {
        class: "categories-map-meeting-button",
        x,
        y: buttonsY,
        width: buttonWidth,
        height: buttonHeight,
        rx: 1
      }),
      svgEl("text", {
        class: "categories-map-meeting-label",
        x: x + buttonWidth / 2,
        y: buttonsY + buttonHeight / 2 + 0.12,
        "text-anchor": "middle",
        "dominant-baseline": "middle"
      }, meeting.label)
    );
    group.append(linkNode);
  });

  item.append(group);
}

function appendCategoriesVenueDots(svg, projection, options = {}) {
  const dotRadius = options.dotRadius ?? 6.4;
  const haloRadius = options.haloRadius ?? 11;
  const group = svgEl("g", { class: "categories-map-venues" });
  categoriesTokyoVenues.forEach((venue) => {
    const point = projectCategoriesPoint(projection, venue.lon, venue.lat);
    if (!point) return;
    const [x, y] = point;
    const labelX = Number((x + venue.dx).toFixed(1));
    const labelY = Number((y + venue.dy).toFixed(1));
    const item = svgEl("g", { class: `categories-map-venue venue-${venue.id}` });
    const labelMeeting = venue.meetings?.[0] || null;
    const labelText = svgEl("text", {
      class: "categories-map-venue-label",
      x: labelX,
      y: labelY,
      "text-anchor": venue.dx < 0 ? "end" : "start",
      "dominant-baseline": "middle"
    }, venue.label);
    const labelNode = labelMeeting ? svgEl("a", {
      class: "categories-map-venue-label-link",
      href: labelMeeting.href,
      "aria-label": `${labelMeeting.title} page`
    }) : labelText;
    if (labelMeeting) {
      labelNode.append(
        svgEl("title", {}, labelMeeting.title),
        labelText
      );
    }
    const markerNodes = [
      svgEl("title", {}, venue.name),
      svgEl("path", { class: "categories-map-venue-leader", d: `M${x} ${y}L${labelX} ${labelY}` })
    ];
    if (venue.showPoint !== false) {
      markerNodes.push(
        svgEl("circle", { class: "categories-map-venue-halo", cx: x, cy: y, r: haloRadius }),
        svgEl("circle", { class: "categories-map-venue-dot", cx: x, cy: y, r: dotRadius })
      );
    }
    markerNodes.push(labelNode);
    item.append(...markerNodes);
    appendCategoriesMeetingButtons(item, venue, labelX, labelY);
    group.append(item);
  });
  svg.append(group);
}

function renderCategoriesTokyoMap() {
  const root = document.querySelector("[data-categories-tokyo-map]");
  if (!root) return;
  root.replaceChildren();

  const kanto = categoriesMapData?.kanto;
  if (!kanto?.prefectures?.length) {
    root.append(el("p", "empty-state", "Map data unavailable."));
    return;
  }

  const tokyoCoreViewBox = [95, 110, 82, 40];

  const svg = svgEl("svg", {
    class: "categories-map-svg",
    viewBox: "0 0 760 440",
    role: "img",
    "aria-labelledby": "categories-map-title categories-map-desc"
  });
  const defs = svgEl("defs");
  const gradient = svgEl("linearGradient", { id: "tokyo-map-paper", x1: "0", x2: "1", y1: "0", y2: "1" });
  gradient.append(
    svgEl("stop", { offset: "0", "stop-color": "#fffdf8" }),
    svgEl("stop", { offset: "1", "stop-color": "#e8f0ea" })
  );
  defs.append(gradient);

  const kantoMap = svgEl("svg", {
    class: "categories-map-kanto is-tokyo-focus",
    x: 28,
    y: 54,
    width: 704,
    height: 344,
    viewBox: tokyoCoreViewBox.join(" "),
    "aria-hidden": "true"
  });
  kantoMap.append(svgEl("rect", { class: "categories-map-water", x: 0, y: 0, width: 260, height: 220, rx: 8 }));
  appendCategoriesPrefectures(kantoMap, kanto.prefectures);
  appendCategoriesVenueDots(kantoMap, kanto.projection, { dotRadius: 1.3, haloRadius: 3.2 });

  svg.append(
    svgEl("title", { id: "categories-map-title" }, "Categories in Tokyo map"),
    svgEl("desc", { id: "categories-map-desc" }, "A Tokyo-area Natural Earth map with Categories in Tokyo venues and meeting links."),
    defs,
    svgEl("rect", { class: "categories-map-bg", x: 0, y: 0, width: 760, height: 440, rx: 8 }),
    svgEl("text", { class: "categories-map-label", x: 32, y: 34 }, "Tokyo venues"),
    kantoMap,
    svgEl("text", { class: "categories-map-credit", x: 736, y: 418, "text-anchor": "end" }, categoriesMapData.source?.note || "Natural Earth public domain data")
  );
  root.append(svg);
}

const monthNumbers = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11
};

function timelineUtc(year, month = 6, day = 15) {
  return Date.UTC(Number(year), Number(month), Number(day));
}

function timelineTimeFromValue(value, fallbackYear = "", month = 5, day = 15) {
  const text = String(value || "");
  const iso = text.match(/\b(\d{4})-(\d{2})(?:-(\d{2}))?\b/);
  if (iso) return timelineUtc(iso[1], Number(iso[2]) - 1, iso[3] || 15);
  const year = text.match(/\b(19\d{2}|20\d{2})\b/)?.[1] || String(fallbackYear || "").match(/\b(19\d{2}|20\d{2})\b/)?.[1];
  if (year) return timelineUtc(year, month, day);
  return Number.NaN;
}

function explicitTimelineTime(value) {
  const text = String(value || "");
  const iso = text.match(/\b(\d{4})-(\d{2})(?:-(\d{2}))?\b/);
  if (iso) return timelineUtc(iso[1], Number(iso[2]) - 1, iso[3] || 15);
  const monthDayYear = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(19\d{2}|20\d{2})\b/i
  );
  if (monthDayYear) return timelineUtc(monthDayYear[3], monthNumbers[monthDayYear[1].toLowerCase()], monthDayYear[2]);
  const monthYear = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(19\d{2}|20\d{2})\b/i
  );
  if (monthYear) return timelineUtc(monthYear[2], monthNumbers[monthYear[1].toLowerCase()], 15);
  return Number.NaN;
}

function explicitTimelineLabel(value) {
  const text = String(value || "");
  const iso = text.match(/\b(\d{4}-\d{2}(?:-\d{2})?)\b/);
  if (iso) return iso[1];
  const monthDayYear = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+(?:19\d{2}|20\d{2})\b/i
  );
  if (monthDayYear) return monthDayYear[0];
  const monthYear = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:19\d{2}|20\d{2})\b/i
  );
  if (monthYear) return monthYear[0];
  return "";
}

function activityRecordTime(record, group, index, total) {
  const explicit = [
    explicitTimelineTime(record.date),
    timelineTimeFromValue(record.date),
    explicitTimelineTime(record.text)
  ].find(Number.isFinite);
  if (Number.isFinite(explicit)) return explicit;

  const year = String(group.title).match(/^(19\d{2}|20\d{2})$/)?.[1];
  if (year) {
    const base = Date.UTC(Number(year), 0, 1);
    const yearSpan = Date.UTC(Number(year) + 1, 0, 1) - base;
    return base + (yearSpan * (index + 0.5)) / total;
  }

  return timelineTimeFromValue(record.text);
}

function activityRecordDateLabel(record, groupTitle) {
  return record.date || explicitTimelineLabel(record.text) || groupTitle;
}

function timelinePosition(time, firstTime, lastTime, index, count) {
  if (!Number.isFinite(time)) return count <= 1 ? 50 : (index / (count - 1)) * 100;
  if (firstTime === lastTime) return 50;
  return ((time - firstTime) / (lastTime - firstTime)) * 100;
}

function timelineYear(time) {
  return Number.isFinite(time) ? String(new Date(time).getUTCFullYear()) : "Undated";
}

function timelineToday() {
  const today = new Date();
  return timelineUtc(today.getFullYear(), today.getMonth(), today.getDate());
}

function findResearchmapPaper(paper) {
  const records = researchmapData?.papers || [];
  const title = simplified(paper.title);
  return records.find((record) => {
    const candidate = simplified(record.title);
    if (candidate === title) return true;
    const titleStem = title.slice(0, 48);
    const candidateStem = candidate.slice(0, 48);
    return Boolean(titleStem && candidate.includes(titleStem)) || Boolean(candidateStem && title.includes(candidateStem));
  });
}

function arxivDateFromId(id) {
  const match = String(id || "").match(/^(\d{2})(\d{2})\./);
  if (!match) return Number.NaN;
  return timelineUtc(`20${match[1]}`, Number(match[2]) - 1, 15);
}

function paperPreprintTime(paper, researchmapPaper) {
  return [
    timelineTimeFromValue(paper.preprintDate),
    timelineTimeFromValue(researchmapPaper?.preprintDate),
    arxivDateFromId(researchmapPaper?.arxivId),
    arxivDateFromId(String(paper.link || "").match(/arxiv\.org\/abs\/([^/?#]+)/i)?.[1]),
    timelineTimeFromValue(paper.venue, paper.year)
  ].find(Number.isFinite) || timelineTimeFromValue(paper.year);
}

function paperPublicationTime(paper, researchmapPaper, fallbackTime) {
  return [
    timelineTimeFromValue(paper.publicationDate),
    timelineTimeFromValue(researchmapPaper?.publicationDate),
    timelineTimeFromValue(paper.year)
  ].find(Number.isFinite) || fallbackTime;
}

function timelineDateLabel(time) {
  if (!Number.isFinite(time)) return "Undated";
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return day === "15" ? `${year}-${month}` : `${year}-${month}-${day}`;
}

function homeTimelinePaperRecords() {
  const today = timelineToday();
  return [
    ...siteData.papers.published.map((paper) => ({ paper, status: "published" })),
    ...siteData.papers.preprints.map((paper) => ({ paper, status: "preprint" }))
  ].map(({ paper, status }) => {
    const researchmapPaper = findResearchmapPaper(paper);
    const startTime = paperPreprintTime(paper, researchmapPaper);
    const endTime = status === "published" ? paperPublicationTime(paper, researchmapPaper, startTime) : today;
    const people = paperPeopleText(paper, researchmapPaper);
    const startLabel = timelineDateLabel(startTime);
    const endLabel = status === "published" ? timelineDateLabel(endTime) : "present";
    const anchor = paperAnchor(paper);
    return {
      kind: "paper",
      theme: contentTheme(compactText([paper.title, paper.venue, paper.tags?.join(" "), paper.summary]).join(" ")),
      title: paper.title,
      dateLabel: `${startLabel} -> ${endLabel}`,
      meta: compactText([people, status === "published" ? "published" : "preprint", paper.venue]).join(" / "),
      href: document.body.dataset.page === "papers" ? `#${anchor}` : localHref(`papers/index.html#${anchor}`),
      time: startTime,
      startTime,
      endTime,
      paperStatus: status
    };
  });
}

function homeTimelineTalkRecords() {
  const records = sortedPresentations(visiblePresentationRecords());
  if (records.length) {
    return records.map((record) => ({
      kind: "talk",
      theme: talkTheme(record),
      title: record.title,
      dateLabel: formatTalkDate(record),
      meta: compactText([presentationPeopleText(record), record.event, record.type, record.invited ? "invited" : ""]).join(" / "),
      href: localHref(`talks/index.html#${talkRecordAnchor(record)}`),
      time: presentationTime(record)
    }));
  }

  return siteData.talks.flatMap((group) =>
    group.items.map((talk, index) => {
      const presentationRecord = findResearchmapPresentationForTalk(talk);
      const year = String(group.year).match(/\b(19\d{2}|20\d{2})\b/)?.[1];
      const total = Math.max(1, group.items.length);
      const base = year ? Date.UTC(Number(year), 0, 1) : Number.NaN;
      const yearSpan = year ? Date.UTC(Number(year) + 1, 0, 1) - base : 0;
      return {
        kind: "talk",
        theme: contentTheme(`${talk.title} ${talk.venue}`),
        title: talk.title,
        dateLabel: group.year,
        meta: compactText([presentationPeopleText(presentationRecord || talk), talk.venue]).join(" / "),
        href: localHref("talks/index.html"),
        time: Number.isFinite(base) ? base + (yearSpan * (index + 0.5)) / total : Number.NaN
      };
    })
  );
}

function cleanActivityTitle(text) {
  return String(text || "")
    .replace(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}:\s*/i, "")
    .replace(/^(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}:\s*/i, "")
    .trim();
}

function homeTimelineActivityRecords() {
  return siteData.activities.flatMap((group) => {
    if (group.title === "Other") return [];
    const total = Math.max(1, group.items.length);
    return group.items
      .map((record, index) => {
        const time = activityRecordTime(record, group, index, total);
        if (!Number.isFinite(time)) return null;
        return {
          kind: "activity",
          theme: contentTheme(record.text),
          title: cleanActivityTitle(record.text),
          dateLabel: activityRecordDateLabel(record, group.title),
          meta: group.title === "Plans" ? "Plan" : "Activity",
          href: localHref(`activities/index.html#${activityAnchor(group, record, index)}`),
          time
        };
      })
      .filter(Boolean);
  });
}

function homeTimelineRecords() {
  return [...homeTimelineTalkRecords(), ...homeTimelinePaperRecords(), ...homeTimelineActivityRecords()]
    .filter((record) => Number.isFinite(record.time) || Number.isFinite(record.startTime))
    .sort((a, b) => a.time - b.time || a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
}

function homeTimelineKindLabel(kind) {
  if (kind === "paper") return "Paper";
  if (kind === "activity") return "Activity";
  return "Talk";
}

const homeTimelineThemeLabels = {
  topos: "Topos theory",
  automata: "Automata / languages",
  games: "Games",
  category: "Category / algebra / logic",
  other: "Other"
};

const homeTimelineThemeOrder = ["topos", "automata", "games", "category", "other"];

function homeTimelineThemeLabel(theme) {
  return homeTimelineThemeLabels[theme] || homeTimelineThemeLabels.other;
}

function homeTimelineNodeLayout(records, firstTime, lastTime) {
  const layout = new Map();
  const offsets = [-12, -6, 0, 6, 12];
  ["activity", "talk"].forEach((kind) => {
    const buckets = new Map();
    records
      .filter((record) => record.kind === kind)
      .sort((a, b) => a.time - b.time || a.title.localeCompare(b.title))
      .forEach((record) => {
        const x = timelinePosition(record.time, firstTime, lastTime, 0, 1);
        const bucket = Math.round(x / 2.75);
        const stack = buckets.get(bucket) || 0;
        buckets.set(bucket, stack + 1);
        layout.set(record, { x, offset: offsets[stack % offsets.length] });
      });
  });
  return layout;
}

function homeTimelinePaperSpanLayout(records, firstTime, lastTime) {
  const layout = new Map();
  const slots = [];
  const items = [];
  records
    .filter((record) => record.kind === "paper")
    .sort((a, b) => a.startTime - b.startTime || a.endTime - b.endTime || a.title.localeCompare(b.title))
    .forEach((record) => {
      const start = Math.max(0, Math.min(100, timelinePosition(record.startTime, firstTime, lastTime, 0, 1)));
      const end = Math.min(100, Math.max(start + 1.2, timelinePosition(record.endTime, firstTime, lastTime, 0, 1)));
      const slot = slots.findIndex((slotEnd) => start > slotEnd + 1.2);
      const index = slot >= 0 ? slot : slots.length;
      slots[index] = end;
      items.push({ record, start, end, slot: index });
    });
  const maxSlot = items.reduce((max, item) => Math.max(max, item.slot), 0);
  const center = maxSlot / 2;
  const slotGap = 9;
  items.forEach((item) => {
    layout.set(item.record, {
      start: item.start,
      end: item.end,
      offset: Number(((item.slot - center) * slotGap).toFixed(1))
    });
  });
  return layout;
}

function renderHomeTimelinePaperSpan(record, position) {
  const span = link("", record.href, `home-timeline-paper-span theme-${record.theme} is-${record.paperStatus}`);
  const label = compactText([
    `Paper / ${homeTimelineThemeLabel(record.theme)} / ${record.dateLabel}: ${record.title}`,
    record.meta
  ]).join(" / ");
  span.style.setProperty("--x-start", position.start);
  span.style.setProperty("--x-end", position.end);
  span.style.setProperty("--offset", position.offset);
  span.setAttribute("aria-label", label);
  span.setAttribute("title", label);
  attachTimelineTooltip(span, record);
  return span;
}

function renderHomeTimelineNode(record, position) {
  const node = link("", record.href, `home-timeline-node kind-${record.kind} theme-${record.theme}`);
  const label = compactText([
    `${homeTimelineKindLabel(record.kind)} / ${homeTimelineThemeLabel(record.theme)} / ${record.dateLabel}: ${record.title}`,
    record.meta
  ]).join(" / ");
  node.style.setProperty("--x", position.x);
  node.style.setProperty("--offset", position.offset);
  node.style.setProperty("--lane", ["paper", "activity", "talk"].indexOf(record.kind));
  node.dataset.label = label;
  node.setAttribute("aria-label", label);
  node.setAttribute("title", label);
  attachTimelineTooltip(node, record);
  return node;
}

function renderHomeTimeline() {
  const root = document.querySelector("#home-timeline");
  if (!root) return;
  root.replaceChildren();

  const records = homeTimelineRecords();
  if (!records.length) {
    root.append(el("p", "empty-state", "No timeline entries yet."));
    return;
  }

  const times = records.flatMap((record) =>
    record.kind === "paper" ? [record.startTime, record.endTime] : [record.time]
  );
  const firstTime = Math.min(...times);
  const lastTime = Math.max(...times);
  const pointLayout = homeTimelineNodeLayout(records, firstTime, lastTime);
  const paperLayout = homeTimelinePaperSpanLayout(records, firstTime, lastTime);

  const track = el("div", "home-timeline-track");

  const yearRow = el("div", "home-timeline-year-row");
  const firstYear = new Date(firstTime).getUTCFullYear();
  const lastYear = new Date(lastTime).getUTCFullYear();
  for (let year = firstYear; year <= lastYear; year += 1) {
    const position = timelinePosition(timelineUtc(year, 0, 1), firstTime, lastTime, 0, 1);
    const tick = el("span", "home-year-tick", year);
    tick.style.setProperty("--x", Math.max(0, Math.min(100, position)));
    yearRow.append(tick);
  }
  track.append(yearRow);

  const today = timelineToday();
  if (today >= firstTime && today <= lastTime) {
    const now = el("span", "home-timeline-now");
    now.style.setProperty("--x", timelinePosition(today, firstTime, lastTime, 0, 1));
    now.setAttribute("aria-label", "Now");
    now.setAttribute("title", "Now");
    track.append(now);
  }

  ["paper", "activity", "talk"].forEach((kind, index) => {
    const lane = el("div", `home-timeline-lane kind-${kind}`);
    lane.style.setProperty("--lane", index);
    lane.append(
      el("div", `home-timeline-lane-label kind-${kind}`, homeTimelineKindLabel(kind)),
      el("div", "home-timeline-lane-rail")
    );
    track.append(lane);
  });

  records
    .filter((record) => record.kind === "paper")
    .forEach((record) => {
      track.append(renderHomeTimelinePaperSpan(record, paperLayout.get(record)));
    });

  records
    .filter((record) => record.kind !== "paper")
    .forEach((record) => {
      track.append(renderHomeTimelineNode(record, pointLayout.get(record)));
  });

  root.append(timelineScrollFrame(track));
}

function renderPaperTimeline() {
  const root = document.querySelector("#paper-timeline");
  if (!root) return;
  root.replaceChildren();

  const records = homeTimelinePaperRecords()
    .filter((record) => Number.isFinite(record.startTime) && Number.isFinite(record.endTime))
    .sort((a, b) => a.startTime - b.startTime || a.title.localeCompare(b.title));
  if (!records.length) {
    root.append(el("p", "empty-state", "No timeline entries yet."));
    return;
  }

  const times = records.flatMap((record) => [record.startTime, record.endTime]);
  const firstTime = Math.min(...times);
  const lastTime = Math.max(...times);
  const paperLayout = homeTimelinePaperSpanLayout(records, firstTime, lastTime);

  const legend = el("div", "home-timeline-legend paper-timeline-legend");
  legend.append(
    el("span", "paper-timeline-status status-published", "Published"),
    el("span", "paper-timeline-status status-preprint", "Preprint")
  );

  const track = el("div", "home-timeline-track paper-timeline-track");
  const yearRow = el("div", "home-timeline-year-row");
  const firstYear = new Date(firstTime).getUTCFullYear();
  const lastYear = new Date(lastTime).getUTCFullYear();
  for (let year = firstYear; year <= lastYear; year += 1) {
    const position = timelinePosition(timelineUtc(year, 0, 1), firstTime, lastTime, 0, 1);
    const tick = el("span", "home-year-tick", year);
    tick.style.setProperty("--x", Math.max(0, Math.min(100, position)));
    yearRow.append(tick);
  }
  track.append(yearRow);

  const today = timelineToday();
  if (today >= firstTime && today <= lastTime) {
    const now = el("span", "home-timeline-now");
    now.style.setProperty("--x", timelinePosition(today, firstTime, lastTime, 0, 1));
    now.setAttribute("aria-label", "Now");
    now.setAttribute("title", "Now");
    track.append(now);
  }

  const lane = el("div", "home-timeline-lane kind-paper");
  lane.style.setProperty("--lane", 0);
  lane.append(
    el("div", "home-timeline-lane-label kind-paper", "Paper"),
    el("div", "home-timeline-lane-rail")
  );
  track.append(lane);

  records.forEach((record) => {
    track.append(renderHomeTimelinePaperSpan(record, paperLayout.get(record)));
  });

  root.append(legend, timelineScrollFrame(track));
  applyLanguage(root);
}

function noteKind(note) {
  const title = note.title.toLowerCase();
  const text = `${note.title} ${note.description || ""} ${note.file}`.toLowerCase();
  if (title.startsWith("cloud:")) return ["cloud", "Speculative", "☁︎"];
  if (title.startsWith("pen:")) return ["pen", "Pen", "🖊️"];
  if (note.file === "Notion archive") return ["archive", "Archive"];
  if (text.includes("slides") || text.includes("talk") || text.includes("cscat") || text.includes("seminar")) {
    return ["slides", "Slides"];
  }
  return ["note", "Note"];
}

function noteTheme(note) {
  if (note.theme) return note.theme;
  const text = simplified(`${note.title} ${note.description || ""} ${note.file}`);
  if (/game|nim|coalgebra|ライツアウト|母関数/.test(text)) return "games";
  if (/automata|language|regular|nerode|measurability/.test(text)) return "automata";
  if (/topos|topoi|quotient|classifier|kan|圏論/.test(text)) return "topos";
  if (/zeta|mobius|eisenstein|整数|メビウス/.test(text)) return "number";
  return "general";
}

const noteThemeLabels = {
  topos: "Topos",
  automata: "Automata",
  games: "Games",
  number: "Number theory",
  general: "General"
};

const noteThemeOrder = ["topos", "automata", "games", "number", "general"];

function noteThemeLabel(theme) {
  return noteThemeLabels[theme] || theme || "General";
}

function noteLanguageKey(note) {
  const language = String(note.language || "").trim();
  const normalizedLanguage = simplified(language);
  if (normalizedLanguage.includes("japanese") || normalizedLanguage.includes("日本語")) return "Japanese";
  if (normalizedLanguage.includes("english")) return "English";
  return language || "Other";
}

function noteDateText(note) {
  return compactText([note.date, note.updated, note.description, note.file, note.title]).join(" ");
}

function noteTime(note) {
  const text = noteDateText(note);
  const explicit = explicitTimelineTime(text);
  if (Number.isFinite(explicit)) return explicit;
  const compactDate = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])([0-3]\d)\b/);
  if (compactDate) return timelineUtc(compactDate[1], Number(compactDate[2]) - 1, compactDate[3]);
  const japaneseDate = text.match(/\b(19\d{2}|20\d{2})年\s*(\d{1,2})月(?:\s*(\d{1,2})日)?/);
  if (japaneseDate) return timelineUtc(japaneseDate[1], Number(japaneseDate[2]) - 1, japaneseDate[3] || 15);
  const slashYearMonth = text.match(/\b(19\d{2}|20\d{2})\/(\d{1,2})\b/);
  if (slashYearMonth) return timelineUtc(slashYearMonth[1], Number(slashYearMonth[2]) - 1, 15);
  const compactYearMonth = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])\b/);
  if (compactYearMonth) return timelineUtc(compactYearMonth[1], Number(compactYearMonth[2]) - 1, 15);
  const year = text.match(/(19\d{2}|20\d{2})/)?.[1];
  if (year) return timelineUtc(year);
  return Number.NaN;
}

function noteDateLabel(note) {
  if (note.date) return String(note.date);
  const text = noteDateText(note);
  const explicit = explicitTimelineLabel(text);
  if (explicit) return explicit;
  const compactDate = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])([0-3]\d)\b/);
  if (compactDate) return `${compactDate[1]}-${compactDate[2]}-${compactDate[3]}`;
  const japaneseDate = text.match(/\b(19\d{2}|20\d{2})年\s*(\d{1,2})月(?:\s*(\d{1,2})日)?/);
  if (japaneseDate) {
    const month = String(japaneseDate[2]).padStart(2, "0");
    const day = japaneseDate[3] ? `-${String(japaneseDate[3]).padStart(2, "0")}` : "";
    return `${japaneseDate[1]}-${month}${day}`;
  }
  const compactYearMonth = text.match(/\b(19\d{2}|20\d{2})(0[1-9]|1[0-2])\b/);
  if (compactYearMonth) return `${compactYearMonth[1]}-${compactYearMonth[2]}`;
  return text.match(/(19\d{2}|20\d{2})/)?.[1] || "";
}

function noteYearKey(note) {
  const time = noteTime(note);
  return Number.isFinite(time) ? String(new Date(time).getUTCFullYear()) : "undated";
}

function noteSearchText(note) {
  const theme = noteTheme(note);
  return compactText([
    note.title,
    shortNoteTitle(note),
    note.description,
    note.language,
    note.file,
    noteDateLabel(note),
    noteYearKey(note),
    theme,
    noteThemeLabel(theme)
  ]).join(" ");
}

function noteMatchesQuery(note, query) {
  const needle = String(query || "").trim();
  if (!needle) return true;
  const text = noteSearchText(note);
  return matchesQuery(text, needle) || simplified(text).includes(simplified(needle));
}

function noteMatchesFilters(note) {
  if (!noteMatchesQuery(note, state.noteQuery)) return false;
  if (state.noteLanguage !== "all" && noteLanguageKey(note) !== state.noteLanguage) return false;
  if (state.noteYear !== "all" && noteYearKey(note) !== state.noteYear) return false;
  if (state.noteTheme !== "all" && noteTheme(note) !== state.noteTheme) return false;
  return true;
}

function sortedNoteRecords(records) {
  return records
    .map((note, index) => ({ note, index, time: noteTime(note) }))
    .sort((a, b) => {
      const aTime = Number.isFinite(a.time) ? a.time : Number.NEGATIVE_INFINITY;
      const bTime = Number.isFinite(b.time) ? b.time : Number.NEGATIVE_INFINITY;
      return bTime - aTime || a.index - b.index;
    })
    .map((item) => item.note);
}

function shortNoteTitle(note) {
  return note.title.replace(/^(Cloud|Pen):\s*/, "").trim();
}

function noteThumbnailArt() {
  const art = el("div", "note-thumb-art");
  art.append(
    el("span", "note-dot a"),
    el("span", "note-dot b"),
    el("span", "note-dot c"),
    el("span", "note-line one"),
    el("span", "note-line two")
  );
  return art;
}

function noteThumbnailSrc(note) {
  return note.localThumbnail ? localHref(note.localThumbnail) : note.thumbnail || "";
}

function noteThumbnail(note) {
  const [kind, kindLabel, kindIcon] = noteKind(note);
  const thumbnailSrc = noteThumbnailSrc(note);
  const thumb = link("", note.href, `note-thumbnail ${kind} ${noteTheme(note)}${thumbnailSrc ? " has-image" : ""}`);
  thumb.setAttribute("aria-label", `Open ${note.title}`);

  const body = el("div", "note-thumb-body");
  const kindBadge = el("span", "note-thumb-kind", kindLabel);
  if (kindIcon) kindBadge.dataset.icon = kindIcon;
  body.append(kindBadge, el("span", "note-thumb-title", shortNoteTitle(note)), el("span", "note-thumb-meta", note.language));

  if (thumbnailSrc) {
    const image = el("img");
    let triedDriveFallback = false;
    image.src = thumbnailSrc;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      if (!triedDriveFallback && note.localThumbnail && note.thumbnail) {
        triedDriveFallback = true;
        image.src = note.thumbnail;
        return;
      }
      thumb.classList.remove("has-image");
      image.remove();
      if (!thumb.querySelector(".note-thumb-art")) thumb.prepend(noteThumbnailArt());
    });
    thumb.append(image, body);
    return thumb;
  }

  thumb.append(noteThumbnailArt(), body);
  return thumb;
}

function svgEl(tag, attrs = {}, text) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  if (text) node.textContent = text;
  return node;
}

function resolveAssetHref(path) {
  if (!path) return "";
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return localHref(path);
}

function uiIconSvg(key) {
  const svg = svgEl("svg", {
    viewBox: "0 0 24 24",
    "aria-hidden": "true",
    focusable: "false"
  });
  svg.classList.add("ui-icon-svg");
  const line = (attrs) => svgEl("path", { ...attrs, fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "1.9" });
  const shape = (tag, attrs, text) => svgEl(tag, attrs, text);
  const normalizedKey = ({
    document: "paper",
    slides: "talk",
    activities: "activity",
    webapps: "webapp",
    papers: "paper",
    notes: "note",
    talks: "talk",
    links: "link",
    awards: "award",
    education: "education"
  })[key] || key;

  if (normalizedKey === "profile") {
    svg.append(
      shape("circle", { cx: "12", cy: "8.2", r: "3.1", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M6.3 19.1C7.7 15.9 9.5 14.5 12 14.5C14.5 14.5 16.3 15.9 17.7 19.1" })
    );
    return svg;
  }

  if (normalizedKey === "cv" || normalizedKey === "paper") {
    svg.append(
      shape("path", { d: "M7 4.5h7l4 4v11A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5v-13A2 2 0 0 1 8 4.5Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
      line({ d: "M13.9 4.9V9h4.1" }),
      line({ d: "M9 12.1H15.6" }),
      line({ d: "M9 15.2H15.6" })
    );
    return svg;
  }

  if (normalizedKey === "note") {
    svg.append(
      shape("path", { d: "M7 4.8h10A1.8 1.8 0 0 1 18.8 6.6v10.8A1.8 1.8 0 0 1 17 19.2H9.8L5.2 14.6V6.6A1.8 1.8 0 0 1 7 4.8Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
      line({ d: "M9 9.4H15.4" }),
      line({ d: "M9 12.5H15.4" }),
      line({ d: "M9 15.6H13.2" })
    );
    return svg;
  }

  if (normalizedKey === "talk") {
    svg.append(
      shape("rect", { x: "4.4", y: "5.8", width: "15.2", height: "9.2", rx: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M8.5 18.7H15.5" }),
      line({ d: "M12 15.1V18.7" }),
      shape("path", { d: "M10 8.5l4.3 2.1L10 12.8Z", fill: "currentColor" })
    );
    return svg;
  }

  if (normalizedKey === "network") {
    svg.append(
      line({ d: "M7.2 15.6L12 8.5L16.8 15.6Z" }),
      shape("circle", { cx: "7.2", cy: "15.6", r: "1.8", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "12", cy: "8.5", r: "1.8", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "16.8", cy: "15.6", r: "1.8", fill: "none", stroke: "currentColor", "stroke-width": "1.7" })
    );
    return svg;
  }

  if (normalizedKey === "kan-extension") {
    svg.append(
      line({ d: "M8.3 8.1L15.8 11.3" }),
      line({ d: "M6.8 9.4V14.6" }),
      line({ d: "M8.3 15.9L15.8 12.7", "stroke-dasharray": "2 2" }),
      shape("circle", { cx: "6.8", cy: "7.5", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "6.8", cy: "16.5", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "17.2", cy: "12", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" })
    );
    return svg;
  }

  if (normalizedKey === "pullback") {
    svg.append(
      line({ d: "M8.8 7.2H15.2" }),
      line({ d: "M7.2 8.8V15.2" }),
      line({ d: "M16.8 8.8V15.2" }),
      line({ d: "M8.8 16.8H15.2" }),
      shape("path", {
        d: "M10 10H12.2V12.2",
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.3"
      }),
      shape("circle", { cx: "7.2", cy: "7.2", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "16.8", cy: "7.2", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "7.2", cy: "16.8", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "16.8", cy: "16.8", r: "1.7", fill: "none", stroke: "currentColor", "stroke-width": "1.7" })
    );
    return svg;
  }

  if (normalizedKey === "activity") {
    svg.append(
      shape("rect", { x: "4.5", y: "6.2", width: "15", height: "13.3", rx: "2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M8 4.8V8" }),
      line({ d: "M16 4.8V8" }),
      line({ d: "M4.8 10H19.2" }),
      shape("circle", { cx: "9", cy: "13.7", r: "1.1", fill: "currentColor" }),
      shape("circle", { cx: "12", cy: "13.7", r: "1.1", fill: "currentColor" }),
      shape("circle", { cx: "15", cy: "13.7", r: "1.1", fill: "currentColor" })
    );
    return svg;
  }

  if (normalizedKey === "webapp") {
    svg.append(
      shape("rect", { x: "3.8", y: "5.1", width: "16.4", height: "13.8", rx: "2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M3.8 8.6H20.2" }),
      shape("circle", { cx: "7", cy: "6.9", r: "0.8", fill: "currentColor" }),
      shape("circle", { cx: "9.8", cy: "6.9", r: "0.8", fill: "currentColor" }),
      line({ d: "M8 13.8H16" }),
      line({ d: "M8 16.4H13" })
    );
    return svg;
  }

  if (normalizedKey === "link" || normalizedKey === "external") {
    svg.append(
      line({ d: "M10.2 13.8L13.8 10.2" }),
      shape("path", { d: "M8.3 15.7l-1.2 1.2a3.1 3.1 0 0 1-4.4-4.4l3-3a3.1 3.1 0 0 1 4.4 0l1.2 1.2", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linecap": "round", "stroke-linejoin": "round" }),
      shape("path", { d: "M15.7 8.3l1.2-1.2a3.1 3.1 0 0 1 4.4 4.4l-3 3a3.1 3.1 0 0 1-4.4 0l-1.2-1.2", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linecap": "round", "stroke-linejoin": "round" })
    );
    return svg;
  }

  if (normalizedKey === "problem") {
    svg.append(
      shape("circle", { cx: "12", cy: "12", r: "8.2", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M9.6 9.3A2.7 2.7 0 0 1 12 7.8C13.8 7.8 15.1 8.9 15.1 10.4C15.1 11.7 14.2 12.4 12.9 13.2C12.2 13.6 11.9 14 11.9 14.8" }),
      shape("circle", { cx: "12", cy: "17.5", r: "0.9", fill: "currentColor" })
    );
    return svg;
  }

  if (normalizedKey === "search") {
    svg.append(
      shape("circle", { cx: "10.2", cy: "10.2", r: "4.9", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M13.8 13.8L18.9 18.9" })
    );
    return svg;
  }

  if (normalizedKey === "topos") {
    svg.append(
      shape("circle", { cx: "12", cy: "12", r: "7.8", fill: "none", stroke: "currentColor", "stroke-width": "1.7", "stroke-opacity": "0.34" }),
      line({ d: "M7.8 8H16.8" }),
      line({ d: "M12 8V18" }),
      line({ d: "M9.4 8C9.4 10.4 10.1 11.8 11.5 12.9" })
    );
    return svg;
  }

  if (normalizedKey === "award") {
    svg.append(
      shape("circle", { cx: "12", cy: "9.6", r: "3.5", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      line({ d: "M10.3 13.1L8.8 18.7L12 16.9L15.2 18.7L13.7 13.1" }),
      line({ d: "M10.7 9.8L11.7 10.8L13.8 8.7" })
    );
    return svg;
  }

  if (normalizedKey === "education" || normalizedKey === "book") {
    svg.append(
      shape("path", { d: "M5.5 6.6c0-1 .8-1.8 1.8-1.8h4.7c1.2 0 2.3.5 3 1.4c.7-.9 1.8-1.4 3-1.4h.7v13.7h-.7c-1.2 0-2.3.5-3 1.4c-.7-.9-1.8-1.4-3-1.4H7.3c-1 0-1.8-.8-1.8-1.8Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
      line({ d: "M15 6.2V19.3" })
    );
    return svg;
  }

  if (normalizedKey === "orcid") {
    svg.append(
      shape("circle", { cx: "12", cy: "12", r: "8", fill: "none", stroke: "currentColor", "stroke-width": "1.9" }),
      shape("circle", { cx: "9.1", cy: "8.2", r: "0.9", fill: "currentColor" }),
      line({ d: "M9.1 10.4V15.7" }),
      shape("circle", { cx: "14.9", cy: "12", r: "2.8", fill: "none", stroke: "currentColor", "stroke-width": "1.9" })
    );
    return svg;
  }

  if (normalizedKey === "arxiv") {
    svg.append(
      line({ d: "M6 18.2L11.3 5.8L18 18.2" }),
      line({ d: "M8 13.5H16" }),
      line({ d: "M14.3 10.2L18 18.2" })
    );
    return svg;
  }

  if (normalizedKey === "nlab") {
    svg.append(
      line({ d: "M7 15.8L12 8.4L17 15.8" }),
      shape("circle", { cx: "7", cy: "15.8", r: "1.9", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "12", cy: "8.4", r: "1.9", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "17", cy: "15.8", r: "1.9", fill: "none", stroke: "currentColor", "stroke-width": "1.7" })
    );
    return svg;
  }

  if (normalizedKey === "researchmap") {
    svg.append(
      shape("path", { d: "M12 20s5-5.4 5-9a5 5 0 0 0-10 0c0 3.6 5 9 5 9Z", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
      shape("circle", { cx: "12", cy: "11", r: "1.7", fill: "currentColor" })
    );
    return svg;
  }

  if (normalizedKey === "download") {
    svg.append(
      line({ d: "M12 5.7V14.9" }),
      line({ d: "M8.6 11.7L12 15.1L15.4 11.7" }),
      line({ d: "M6.2 18.2H17.8" })
    );
    return svg;
  }

  if (normalizedKey === "open") {
    svg.append(
      shape("path", { d: "M8 8.6H6.6A1.6 1.6 0 0 0 5 10.2v7.2A1.6 1.6 0 0 0 6.6 19h7.2A1.6 1.6 0 0 0 15.4 17.4V16", fill: "none", stroke: "currentColor", "stroke-width": "1.9", "stroke-linejoin": "round" }),
      line({ d: "M11 13L19 5" }),
      line({ d: "M13.5 5H19v5.5" })
    );
    return svg;
  }

  if (normalizedKey === "friend") {
    svg.append(
      shape("circle", { cx: "9", cy: "9", r: "2.5", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      shape("circle", { cx: "15.5", cy: "10.4", r: "2.2", fill: "none", stroke: "currentColor", "stroke-width": "1.7" }),
      line({ d: "M5.9 18.2C7 15.7 8.6 14.6 10.7 14.6C12.3 14.6 13.7 15.3 14.8 16.7" }),
      line({ d: "M13.3 18.2C14 16.5 15.2 15.6 16.9 15.6C18 15.6 19 16 19.7 16.9" })
    );
    return svg;
  }

  if (normalizedKey === "building") {
    svg.append(
      line({ d: "M4.8 19.1H19.2" }),
      line({ d: "M7 19.1V10.1" }),
      line({ d: "M12 19.1V10.1" }),
      line({ d: "M17 19.1V10.1" }),
      line({ d: "M4.8 10.1H19.2" }),
      line({ d: "M4.8 10.1L12 5L19.2 10.1" })
    );
    return svg;
  }

  svg.append(
    line({ d: "M6.4 12H17.6" }),
    line({ d: "M12 6.4V17.6" })
  );
  return svg;
}

function uiIcon(key, className = "ui-icon") {
  const span = el("span", className);
  span.dataset.iconKey = key;
  span.setAttribute("aria-hidden", "true");
  span.append(uiIconSvg(key));
  return span;
}

function pageIconKey(page) {
  return page?.icon || "page";
}

function pageThumbnailSrc(page) {
  return resolveAssetHref(page?.thumbnail || "");
}

function paperThumbnailSrc(paper) {
  return paper?.figure ? localHref(`assets/papers/${paper.figure}.jpg`) : "";
}

function iconKeyForLink(label = "", href = "", context = "") {
  const text = simplified(`${context} ${label}`);
  const url = String(href || "").toLowerCase();
  if (url.includes("orcid.org") || text.includes("orcid")) return "orcid";
  if (url.includes("arxiv.org") || text.includes("arxiv")) return "arxiv";
  if (url.includes("researchmap.jp") || text.includes("researchmap")) return "researchmap";
  if (url.includes("ncatlab.org") || text.includes("nlab")) return "nlab";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "talk";
  if (url.includes("springer.com") || url.includes("kyoritsu-pub.co.jp") || text.includes("book")) return "book";
  if (url.includes("drive.google.com") || text === "cv") return "cv";
  if (url.includes("github.com") || url.includes("github.io")) return "webapp";
  if (text.includes("friend") || text.includes("friends")) return "friend";
  if (text.includes("profile")) return "profile";
  if (text.includes("paper")) return "paper";
  if (text.includes("slide")) return "talk";
  return "link";
}

function iconKeyForAction(label = "", href = "") {
  const text = simplified(label);
  if (text.includes("download")) return "download";
  if (text.includes("slide")) return "talk";
  if (text.includes("arxiv")) return "arxiv";
  if (text.includes("paper") || text.includes("pdf") || text.includes("preprint")) return "paper";
  if (text.includes("guide") || text.includes("tutorial") || text.includes("open") || text.includes("workbench") || text.includes("dev")) return "open";
  return iconKeyForLink(label, href, "action");
}

function iconKeyForSearchType(type = "") {
  const text = simplified(type);
  if (text.includes("profile")) return "profile";
  if (text.includes("page")) return "cv";
  if (text.includes("paper")) return "paper";
  if (text.includes("talk")) return "talk";
  if (text.includes("note")) return "note";
  if (text.includes("activity")) return "activity";
  if (text.includes("problem")) return "problem";
  if (text.includes("topos")) return "topos";
  if (text.includes("award")) return "award";
  if (text.includes("education")) return "education";
  if (text.includes("web app")) return "webapp";
  if (text.includes("link")) return "link";
  return "cv";
}

function navIconKey(label = "", href = "") {
  const text = simplified(label);
  const url = String(href || "").toLowerCase();
  if (text.includes("profile") || text.includes("プロフィール")) return "profile";
  if (text.includes("documents") || text.includes("資料")) return "paper";
  if (text.includes("papers") || url.includes("/papers/")) return "paper";
  if (text.includes("notes") || url.includes("/notes/")) return "note";
  if (text.includes("activities") || text.includes("活動") || url.includes("/activities/")) return "activity";
  if (text.includes("talks") || url.includes("/talks/")) return "talk";
  if (text.includes("others") || text.includes("その他")) return "link";
  if (text.includes("web apps") || url.includes("/web-apps/")) return "webapp";
  if (text.includes("links") || url.includes("/links/")) return "link";
  if (text.includes("problems") || url.includes("/problems/")) return "problem";
  if (text.includes("search") || url.includes("/search/")) return "search";
  if (text.includes("cv") || url.includes("/cv/")) return "cv";
  if (text.includes("awards")) return "award";
  return "";
}

function linkedListIconKey(selector = "", record = {}) {
  const key = String(selector);
  if (key.includes("past-position")) return "building";
  if (key.includes("award")) return "award";
  if (key.includes("education")) return "education";
  return iconKeyForLink(record.text || "", record.href || "", key);
}

function activityIconKey(group = {}, record = {}) {
  const text = simplified(`${group.title} ${record.text}`);
  if (text.includes("organ")) return "network";
  if (text.includes("talk") || text.includes("present") || text.includes("spoke") || text.includes("poster")) return "talk";
  if (text.includes("upload") || text.includes("submit") || text.includes("preprint") || text.includes("wrote")) return "paper";
  if (text.includes("received") || text.includes("grant") || text.includes("ph d")) return "award";
  return "activity";
}

function noteRecordByFile(file) {
  if (!file) return null;
  return [...siteData.notes, ...overleafNoteRecords()].find((record) => record.file === file) || null;
}

function talkThumbnailRecord(record) {
  const title = simplified(record?.title || "");
  const event = simplified(record?.event || record?.venue || "");
  const match = talkSlideMatches.find((candidate) => {
    const titleMatches = title.includes(simplified(candidate.title));
    const eventMatches = !candidate.event || event.includes(simplified(candidate.event));
    return titleMatches && eventMatches;
  });
  return match ? noteRecordByFile(match.file) : null;
}

function talkThumbnail(record) {
  const note = talkThumbnailRecord(record);
  const src = note ? noteThumbnailSrc(note) : "";
  if (!note || !src) return null;
  return {
    src,
    href: note.href || localHref(`notes/index.html#${noteAnchor(note)}`),
    title: note.title
  };
}

function decorateUiIcons(root = document.body) {
  if (!root) return;
  const collect = (selector) => {
    const nodes = [];
    if (root.nodeType === Node.ELEMENT_NODE && root.matches?.(selector)) nodes.push(root);
    if (root.querySelectorAll) nodes.push(...root.querySelectorAll(selector));
    return nodes;
  };

  collect(".nav-group-label, .nav-submenu a").forEach((node) => {
    if (node.classList.contains("nav-search")) return;
    const key = navIconKey(node.textContent, node.getAttribute("href"));
    if (!key || node.querySelector(".nav-item-icon")) return;
    node.prepend(uiIcon(key, "nav-item-icon"));
    node.classList.add("has-icon");
  });

  collect(".action-link").forEach((node) => {
    const key = iconKeyForAction(node.textContent, node.getAttribute("href"));
    if (!key || node.querySelector(".action-link-icon")) return;
    node.prepend(uiIcon(key, "action-link-icon"));
    node.classList.add("has-icon");
  });
}

function themeById(themeId) {
  return researchThemes.find((theme) => theme.id === themeId);
}

function themeScore(text, theme) {
  const haystack = simplified(text);
  return theme.keywords.reduce((score, keyword) => {
    const needle = simplified(keyword);
    return needle && haystack.includes(needle) ? score + Math.max(1, needle.split(" ").length) : score;
  }, 0);
}

function scoreThemeRecord(text) {
  const scores = Object.fromEntries(researchThemes.map((theme) => [theme.id, themeScore(text, theme)]));
  const themes = researchThemes.filter((theme) => scores[theme.id] > 0).map((theme) => theme.id);
  return { scores, themes, bestScore: Math.max(0, ...Object.values(scores)) };
}

function dedupeThemeRecords(records) {
  const seen = new Set();
  return records.filter((record) => {
    const key = `${record.type}:${simplified(record.title)}:${simplified(record.meta)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function dedupeThemeRecordsByTitle(records) {
  const seen = new Set();
  return records.filter((record) => {
    const key = `${record.type}:${simplified(record.title)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function themedPaperRecords() {
  const records = [
    ...[...siteData.papers.published, ...siteData.papers.preprints].map((paper) => {
      const text = compactText([
        paper.title,
        paper.authors,
        paper.venue,
        paper.year,
        paper.tags?.join(" "),
        paper.summary
      ]).join(" ");
      return {
        type: "paper",
        title: paper.title,
        href: localHref(`papers/index.html#${paperAnchor(paper)}`),
        meta: compactText([paperPeopleText(paper, findResearchmapPaper(paper)), paper.year, paper.venue]).join(" / "),
        ...scoreThemeRecord(text)
      };
    }),
    ...siteData.papers.misc.map((paper) => {
      const text = compactText([paper.title, paper.authors, paper.venue, paper.year]).join(" ");
      return {
        type: "paper",
        title: paper.title,
        href: paper.link,
        meta: compactText([paperPeopleText(paper), paper.year, paper.venue]).join(" / "),
        ...scoreThemeRecord(text)
      };
    }),
    ...(researchmapData?.papers || []).map((paper) => {
      const text = compactText([
        paper.title,
        paper.authors,
        paper.venue,
        paper.type,
        paper.year,
        paper.publicationDate
      ]).join(" ");
      return {
        type: "paper",
        title: paper.title,
        href: paper.link || localHref(`papers/index.html#${paperAnchor(paper)}`),
        meta: compactText([paperPeopleText(paper), paper.year, paper.venue || paper.type]).join(" / "),
        ...scoreThemeRecord(text)
      };
    })
  ];

  return dedupeThemeRecordsByTitle(records).filter((record) => record.themes.length);
}

function themedPreparationRecords() {
  return siteData.papers.preparation
    .map((title) => ({
      type: "preparation",
      title,
      href: localHref("papers/index.html"),
      meta: "In preparation",
      ...scoreThemeRecord(title)
    }))
    .filter((record) => record.themes.length);
}

function themedNoteRecords() {
  return dedupeThemeRecords([...overleafNoteRecords(), ...siteData.notes]
    .filter((note) => note.file !== "Notion archive")
    .map((note) => {
      const text = compactText([note.title, note.description, note.language, note.file]).join(" ");
      return {
        type: "note",
        title: note.title,
        href: note.href,
        meta: compactText([note.language, note.description || note.file]).join(" / "),
        ...scoreThemeRecord(text)
      };
    })).filter((record) => record.themes.length);
}

function themedTalkRecords() {
  const synced = researchmapData?.presentations || [];
  if (synced.length) {
    return synced
      .map((record) => {
        const location = talkLocationForRecord(record);
        const text = compactText([
          record.year,
          record.title,
          record.presenters?.join(" "),
          record.event,
          record.type,
          location?.name,
          location?.country
        ]).join(" ");
        return {
          type: "talk",
          title: record.title,
          href: localHref(`talks/index.html#${talkRecordAnchor(record)}`),
          meta: presentationMeta(record),
          ...scoreThemeRecord(text)
        };
      })
      .filter((record) => record.themes.length);
  }

  return siteData.talks
    .flatMap((group) =>
      group.items.map((talk) => {
        const presentationRecord = findResearchmapPresentationForTalk(talk);
        const presenters = presentationPeopleText(presentationRecord || talk);
        const text = compactText([group.year, talk.title, talk.venue, presenters]).join(" ");
        return {
          type: "talk",
          title: talk.title,
          href: talk.href || localHref("talks/index.html"),
          meta: compactText([presenters, group.year, talk.venue]).join(" / "),
          ...scoreThemeRecord(text)
        };
      })
    )
    .filter((record) => record.themes.length);
}

function themedRecords(kind) {
  if (kind === "papers") return themedPaperRecords();
  if (kind === "preparation") return themedPreparationRecords();
  if (kind === "notes") return themedNoteRecords();
  return themedTalkRecords();
}

function normalizeThemeSelection(selection = "") {
  if (Array.isArray(selection)) return selection.filter(Boolean);
  return String(selection)
    .split(/\s+/)
    .map((themeId) => themeId.trim())
    .filter(Boolean);
}

function themeSelectionLabel(themeIds) {
  if (!themeIds.length) return "All themes";
  return themeIds.map((themeId) => themeById(themeId)?.label || themeId).join(" + ");
}

function themeSelectionScore(record, themeIds) {
  if (!themeIds.length) return record.bestScore;
  return themeIds.reduce((score, themeId) => score + (record.scores[themeId] || 0), 0);
}

function topThemeRecords(kind, selection = "") {
  const themeIds = normalizeThemeSelection(selection);
  return themedRecords(kind)
    .filter((record) => !themeIds.length || themeIds.every((themeId) => record.themes.includes(themeId)))
    .sort((a, b) => {
      const scoreA = themeSelectionScore(a, themeIds);
      const scoreB = themeSelectionScore(b, themeIds);
      return scoreB - scoreA || a.title.localeCompare(b.title);
    });
}

function renderThemeResult(record, selection = "") {
  const themeIds = normalizeThemeSelection(selection);
  const item = el("article", `theme-result${themeIds.length ? " is-active" : ""}`);
  item.dataset.themes = record.themes.join(" ");
  const heading = el("h4");
  heading.append(link(record.title, record.href));
  item.append(heading);
  if (record.meta) item.append(el("p", "theme-result-meta", record.meta));
  return item;
}

function renderResearchMapResults(selection = "") {
  const root = document.querySelector("#research-map");
  if (!root) return;
  const themeIds = normalizeThemeSelection(selection);
  const status = root.querySelector("[data-theme-status]");
  const groups = researchThemeGroups();

  const counts = groups.map(([kind]) => topThemeRecords(kind, themeIds).length);
  if (status) {
    status.replaceChildren(
      el("span", "theme-status-label", themeSelectionLabel(themeIds)),
      el(
        "span",
        "theme-status-count",
        `${counts[0]} papers / ${counts[1]} in preparation / ${counts[2]} notes / ${counts[3]} talks`
      )
    );
  }

  groups.forEach(([kind]) => {
    const list = root.querySelector(`[data-theme-results="${kind}"]`);
    if (!list) return;
    list.replaceChildren();
    const records = topThemeRecords(kind, themeIds);
    if (!records.length) {
      list.append(el("p", "empty-state", "No linked items yet."));
      return;
    }
    records.forEach((record) => list.append(renderThemeResult(record, themeIds)));
  });
}

function researchThemeGroups() {
  return [
    ["papers", "Papers"],
    ["preparation", "In preparation"],
    ["notes", "Notes"],
    ["talks", "Talks"]
  ];
}

function setResearchThemeSelection(selection = "") {
  const themeIds = normalizeThemeSelection(selection);
  state.researchTheme = themeIds.join(" ");
  const root = document.querySelector("#research-map");
  if (!root) return;
  root.classList.toggle("has-active-theme", Boolean(themeIds.length));
  root.querySelectorAll("[data-theme-node]").forEach((node) => {
    node.classList.toggle("is-active", themeIds.includes(node.dataset.themeNode));
  });
  root.querySelectorAll("[data-theme-edge]").forEach((edge) => {
    const themes = edge.dataset.themeEdge.split(" ");
    const touchesSingleTheme = themeIds.length === 1 && themes.includes(themeIds[0]);
    const isSelectedEdge = themeIds.length === 2 && themeIds.every((themeId) => themes.includes(themeId));
    edge.classList.toggle("is-active", touchesSingleTheme || isSelectedEdge);
    edge.classList.toggle("is-selected", isSelectedEdge);
    edge.setAttribute("aria-pressed", isSelectedEdge ? "true" : "false");
  });
  const reset = document.querySelector("[data-theme-reset]");
  if (reset) reset.classList.toggle("is-active", !themeIds.length);
  renderResearchMapResults(themeIds);
}

function setResearchTheme(themeId = "") {
  setResearchThemeSelection(themeId);
}

function renderResearchMap() {
  const root = document.querySelector("#research-map");
  if (!root) return;
  root.replaceChildren();

  const layout = el("div", "research-map-layout");
  const graph = el("figure", "theme-graph");
  const svg = svgEl("svg", {
    viewBox: "0 0 640 470",
    role: "img",
    "aria-labelledby": "theme-map-svg-title theme-map-svg-desc"
  });
  svg.append(
    svgEl("title", { id: "theme-map-svg-title" }, "Research theme map"),
    svgEl(
      "desc",
      { id: "theme-map-svg-desc" },
      "A network of research themes connected to papers, manuscripts in preparation, notes, and talks."
    ),
    svgEl("rect", { class: "theme-map-bg", x: 0, y: 0, width: 640, height: 470, rx: 0 })
  );

  researchThemeEdges.forEach(([sourceId, targetId]) => {
    const source = themeById(sourceId);
    const target = themeById(targetId);
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;
    const bend = sourceId === "logic" || targetId === "games" ? -28 : 28;
    const edgePath = `M${source.x} ${source.y} Q${midX} ${midY + bend} ${target.x} ${target.y}`;
    const edge = svgEl("g", {
      class: "theme-edge-group",
      tabindex: "0",
      role: "button",
      "aria-label": `${source.label} + ${target.label}`,
      "aria-pressed": "false",
      "data-theme-edge": `${sourceId} ${targetId}`
    });
    edge.append(
      svgEl("path", {
        class: "theme-edge-hit",
        d: edgePath
      }),
      svgEl("path", {
        class: "theme-edge",
        d: edgePath
      })
    );
    edge.addEventListener("click", () => setResearchThemeSelection([sourceId, targetId]));
    edge.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setResearchThemeSelection([sourceId, targetId]);
      }
    });
    svg.append(edge);
  });

  researchThemes.forEach((theme) => {
    const node = svgEl("g", {
      class: "theme-node",
      tabindex: "0",
      role: "button",
      "aria-label": theme.label,
      "data-theme-node": theme.id
    });
    node.append(
      svgEl("circle", { cx: theme.x, cy: theme.y, r: theme.r }),
      svgEl("text", { x: theme.x, y: theme.y + 6 }, theme.label)
    );
    node.addEventListener("mouseenter", () => setResearchTheme(theme.id));
    node.addEventListener("focus", () => setResearchTheme(theme.id));
    node.addEventListener("click", () => setResearchTheme(theme.id));
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setResearchTheme(theme.id);
      }
    });
    svg.append(node);
  });
  graph.append(svg);

  const panel = el("div", "theme-panel");
  panel.append(el("div", "theme-status", null));
  panel.firstElementChild.dataset.themeStatus = "";
  const columns = el("div", "theme-result-grid");
  researchThemeGroups().forEach(([kind, label]) => {
    const column = el("section", "theme-result-column");
    column.append(el("h3", null, label), el("div", "theme-result-list"));
    column.lastElementChild.dataset.themeResults = kind;
    columns.append(column);
  });
  panel.append(columns);
  layout.append(graph, panel);
  root.append(layout);
  setResearchTheme("");
}

const grundyGameNodes = [
  { id: "V1", tex: "V_1", x: 126, y: 92, stage: 5, value: 0, options: ["W1", "W2", "W3"] },
  { id: "V2", tex: "V_2", x: 250, y: 92, stage: 5, value: 3, options: ["W2", "X2", "X3"] },
  { id: "W1", tex: "W_1", x: 82, y: 168, stage: 4, value: 1, options: ["X1", "X2"] },
  { id: "W3", tex: "W_3", x: 188, y: 168, stage: 3, value: 2, options: ["Y1", "Z3"] },
  { id: "W2", tex: "W_2", x: 294, y: 168, stage: 4, value: 1, options: ["X2", "X3"] },
  { id: "X1", tex: "X_1", x: 82, y: 244, stage: 3, value: 0, options: ["Y1", "Y2"] },
  { id: "X2", tex: "X_2", x: 188, y: 244, stage: 3, value: 2, options: ["Y2", "Z1"] },
  { id: "X3", tex: "X_3", x: 294, y: 244, stage: 3, value: 0, options: ["Y3"] },
  { id: "Y1", tex: "Y_1", x: 82, y: 320, stage: 2, value: 1, options: ["Z1"] },
  { id: "Y2", tex: "Y_2", x: 188, y: 320, stage: 2, value: 1, options: ["Z2", "Z3"] },
  { id: "Y3", tex: "Y_3", x: 294, y: 320, stage: 2, value: 1, options: ["Z3"] },
  { id: "Z1", tex: "Z_1", x: 82, y: 396, stage: 1, value: 0, options: [] },
  { id: "Z2", tex: "Z_2", x: 188, y: 396, stage: 1, value: 0, options: [] },
  { id: "Z3", tex: "Z_3", x: 294, y: 396, stage: 1, value: 0, options: [] }
];

const grundyGameNodeMap = new Map(grundyGameNodes.map((node) => [node.id, node]));

const grundyAlgebraOrder = [
  "Z1",
  "Z2",
  "Z3",
  "Y1",
  "Y2",
  "Y3",
  "X1",
  "X2",
  "X3",
  "W3",
  "W1",
  "W2",
  "V1",
  "V2"
];

const grundyNodeStepMap = new Map(grundyAlgebraOrder.map((nodeId, index) => [nodeId, index + 1]));
const grundyFinalStep = grundyAlgebraOrder.length + 1;
const grundyNumberLineValues = [0, 1, 2, 3, 4];

const grundyStepCopy = {
  0: {
    focus: "game graph",
    options: "moves point downward; values are computed upward",
    mex: "choose a state or press Play",
    status: "This is the recursive calculation from the paper, not the heap chain."
  },
  1: {
    focus: "terminal layer",
    options: "terminal states have no options",
    mex: "mex(empty set) = 0",
    status: "Every terminal receives Grundy number 0."
  },
  2: {
    focus: "next layer",
    options: "each sees only Grundy value 0",
    mex: "mex({0}) = 1",
    status: "The Y layer is computed from the terminal layer."
  },
  3: {
    focus: "middle layer",
    options: "some nodes see both 0 and 1",
    mex: "mex({1}) = 0; mex({0,1}) = 2",
    status: "Nonlinear branches already force two different Grundy values."
  },
  4: {
    focus: "upper layer",
    options: "both see values 0 and 2",
    mex: "mex({0,2}) = 1",
    status: "The W layer now uses the X layer computed in the previous step."
  },
  5: {
    focus: "top layer",
    options: "top nodes see values from the layers below",
    mex: "mex({1,2}) = 0; mex({0,1,2}) = 3",
    status: "P-states are exactly the states with Grundy number 0; sums use Nim-sum."
  }
};

const grundyFinalCopy = {
  focus: "all states",
  options: "each Grundy number is now known",
  mex: "P-states have Grundy number 0; N-states have positive Grundy number",
  status: "The recursive pass is complete; sums use Nim-sum."
};

function grundyOptionValues(node) {
  return [...new Set(node.options.map((id) => grundyGameNodeMap.get(id)?.value).filter((value) => value !== undefined))].sort((a, b) => a - b);
}

function grundyNodeStep(nodeId) {
  return grundyNodeStepMap.get(nodeId) || Number.POSITIVE_INFINITY;
}

function grundyNodeForStep(step) {
  return grundyGameNodeMap.get(grundyAlgebraOrder[step - 1] || "");
}

function grundyNodeIsKnown(node, step) {
  return grundyNodeStep(node.id) <= Math.min(step, grundyAlgebraOrder.length);
}

function grundyMex(values) {
  let mex = 0;
  while (values.includes(mex)) mex += 1;
  return mex;
}

function grundyEdgePath(from, to) {
  const startY = from.y + 18;
  const endY = to.y - 18;
  const midY = (startY + endY) / 2;
  const bend = Math.min(34, Math.abs(from.x - to.x) * 0.22 + 12);
  return `M${from.x} ${startY} C${from.x} ${midY + bend} ${to.x} ${midY - bend} ${to.x} ${endY}`;
}

function grundyFigureTemplate() {
  const edges = grundyGameNodes
    .flatMap((from) =>
      from.options.map((targetId) => {
        const to = grundyGameNodeMap.get(targetId);
        return `<path class="figure-arrow grundy-edge" data-grundy-edge="${from.id}-${to.id}" d="${grundyEdgePath(from, to)}"></path>`;
      })
    )
    .join("");
  const nodes = grundyGameNodes
    .map(
      ({ id, x, y }) => `
        <g class="grundy-node" data-grundy-node="${id}" transform="translate(${x} ${y})" tabindex="0" role="button" aria-label="Show mex computation for ${id}">
          <circle class="grundy-node-shell" r="18"></circle>
          <text class="grundy-value-label" y="6" data-grundy-value="${id}"></text>
        </g>`
    )
    .join("");
  const naturalNumbers = grundyNumberLineValues
    .map((value) => `<span class="grundy-natural-number" data-grundy-natural="${value}">${value}</span>`)
    .join("");
  return `
    <div class="grundy-figure" data-grundy-figure data-grundy-max="${grundyFinalStep}">
      <svg viewBox="0 0 760 456" role="img" aria-labelledby="fig-games-title fig-games-desc">
        <title id="fig-games-title">Recursive calculation of Grundy numbers</title>
        <desc id="fig-games-desc">A finite impartial game is drawn on the left, and the corresponding mex algebra is shown on the right.</desc>
        <defs>
          <marker id="arrow-grundy" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
        </defs>
        <text class="grundy-title" x="34" y="37">game graph</text>
        <text class="grundy-formula" x="34" y="62">moves go down; recursion goes up</text>
        <text class="grundy-title" x="420" y="37">mex algebra</text>
        <text class="grundy-formula" x="420" y="62">one state per step</text>
        <rect class="grundy-game-frame" x="28" y="76" width="330" height="340" rx="12"></rect>
        <path class="grundy-divider" d="M386 78 V418"></path>
        <text class="grundy-level-label" x="44" y="93">top</text>
        <text class="grundy-level-label" x="44" y="401">terminal</text>
        <g class="grundy-edges">${edges}</g>
        <g class="grundy-nodes">${nodes}</g>
      </svg>
      <div class="grundy-algebra-panel" data-grundy-algebra-panel>
        <div class="grundy-natural-line" aria-label="Natural numbers for mex">
          ${naturalNumbers}
        </div>
        <div class="grundy-mex-card">
          <span class="grundy-algebra-label">reachable values</span>
          <strong data-grundy-reachable-values>press Play</strong>
          <span data-grundy-mex-reason>mex is the first natural number not crossed out.</span>
          <strong class="grundy-mex-result" data-grundy-mex-result>mex</strong>
        </div>
      </div>
      <div class="grundy-panel" aria-live="polite">
        <span class="grundy-panel-label">Grundy recursion</span>
        <strong data-grundy-focus>game graph</strong>
        <span data-grundy-options>moves point downward; values are computed upward</span>
        <span data-grundy-mex>choose a state or press Play</span>
        <span data-grundy-status>This is the recursive calculation from the paper.</span>
      </div>
    </div>`;
}

function lawvereFourthFigureTemplate() {
  return `
    <div class="lawvere-pullback-figure" data-lawvere-pullback>
      <svg viewBox="0 70 760 320" role="img" aria-labelledby="fig-lawvere-fourth-title fig-lawvere-fourth-desc">
        <title id="fig-lawvere-fourth-title">EZ-decomposition as a pullback</title>
        <desc id="fig-lawvere-fourth-desc">The graph x on A is the pullback of the graph y on B along alpha. Edges of y generate the corresponding complete bipartite edges in x.</desc>
        <defs>
          <marker id="arrow-lawvere-fourth" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
        </defs>

        <g class="lawvere-x-graph" transform="translate(0 0)">
          <circle class="lawvere-graph-frame" cx="177" cy="228" r="118"></circle>
          <g class="lawvere-x-edges">
            <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M177 120 L96 158"></path>
            <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M177 120 L78 248"></path>
            <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M96 158 L278 248"></path>
            <path class="lawvere-x-edge rb" data-pullback-edge="rb" d="M78 248 L278 248"></path>

            <path class="lawvere-x-edge ro" data-pullback-edge="ro" d="M177 120 L224 318"></path>
            <path class="lawvere-x-edge ro" data-pullback-edge="ro" d="M224 318 L278 248"></path>

            <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M177 120 L132 318"></path>
            <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M177 120 L258 158"></path>
            <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M132 318 L278 248"></path>
            <path class="lawvere-x-edge rg" data-pullback-edge="rg" d="M278 248 L258 158"></path>

            <path class="lawvere-x-edge og" data-pullback-edge="og" d="M224 318 L132 318"></path>
            <path class="lawvere-x-edge og" data-pullback-edge="og" d="M224 318 L258 158"></path>
          </g>
          <g class="lawvere-x-vertices">
            <circle class="c-red" cx="177" cy="120" r="10"></circle>
            <circle class="c-blue" cx="96" cy="158" r="10"></circle>
            <circle class="c-blue" cx="78" cy="248" r="10"></circle>
            <circle class="c-green" cx="132" cy="318" r="10"></circle>
            <circle class="c-orange" cx="224" cy="318" r="10"></circle>
            <circle class="c-red" cx="278" cy="248" r="10"></circle>
            <circle class="c-green" cx="258" cy="158" r="10"></circle>
          </g>
        </g>

        <path class="figure-arrow lawvere-alpha-arrow" d="M320 226 H470"></path>

        <g class="lawvere-y-graph">
          <circle class="lawvere-graph-frame small" cx="585" cy="228" r="92"></circle>
          <g class="lawvere-y-edges">
            <path class="lawvere-y-edge rb" data-pullback-source="rb" d="M535 178 V280"></path>
            <path class="lawvere-y-edge ro" data-pullback-source="ro" d="M535 178 L635 280"></path>
            <path class="lawvere-y-edge rg" data-pullback-source="rg" d="M535 178 H635"></path>
            <path class="lawvere-y-edge og" data-pullback-source="og" d="M635 280 V178"></path>
          </g>
          <g class="lawvere-y-vertices">
            <circle class="c-red" cx="535" cy="178" r="11"></circle>
            <circle class="c-blue" cx="535" cy="280" r="11"></circle>
            <circle class="c-orange" cx="635" cy="280" r="11"></circle>
            <circle class="c-green" cx="635" cy="178" r="11"></circle>
          </g>
        </g>
      </svg>
    </div>`;
}

function completelyConnectedFigureTemplate() {
  return `
    <div class="connected-figure" data-connected-correspondence>
      <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-connected-title fig-connected-desc">
        <title id="fig-connected-title">Rooted trees and rooted forests</title>
        <desc id="fig-connected-desc">A rooted tree is paired with its corresponding rooted forest.</desc>
        <defs>
          <marker id="arrow-connected" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z"></path>
          </marker>
        </defs>
        <g transform="translate(62 48)">
          <path class="figure-line connected-top-edge" d="M130 0 L60 54 M130 0 L130 54 M130 0 L214 54"></path>
          <circle class="figure-node pale connected-top-root" cx="130" cy="0" r="11"></circle>
          <g class="connected-match" data-connected-left="a">
            <path class="figure-line" d="M60 54 L28 108 M60 54 L92 108 M28 108 L8 162 M28 108 L48 162 M92 108 L72 162 M92 108 L112 162"></path>
            <circle class="figure-node soft" cx="60" cy="54" r="11"></circle>
            <circle class="figure-node" cx="28" cy="108" r="11"></circle><circle class="figure-node" cx="92" cy="108" r="11"></circle>
            <circle class="figure-node" cx="8" cy="162" r="11"></circle><circle class="figure-node" cx="48" cy="162" r="11"></circle><circle class="figure-node" cx="72" cy="162" r="11"></circle><circle class="figure-node" cx="112" cy="162" r="11"></circle>
          </g>
          <g class="connected-match" data-connected-left="b">
            <path class="figure-line" d="M130 54 L130 108"></path>
            <circle class="figure-node soft" cx="130" cy="54" r="11"></circle>
            <circle class="figure-node" cx="130" cy="108" r="11"></circle>
          </g>
          <g class="connected-match" data-connected-left="c">
            <path class="figure-line" d="M214 54 L214 108 M214 108 L194 162 M214 108 L234 162"></path>
            <circle class="figure-node soft" cx="214" cy="54" r="11"></circle>
            <circle class="figure-node" cx="214" cy="108" r="11"></circle>
            <circle class="figure-node" cx="194" cy="162" r="11"></circle><circle class="figure-node" cx="234" cy="162" r="11"></circle>
          </g>
          <text class="figure-label" x="130" y="250">rooted tree</text>
        </g>
        <path class="figure-line dashed connected-divider" d="M380 38 V330"></path>
        <g class="connected-correspondence-arrows">
          <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="a" d="M234 150 C314 88, 404 78, 486 102"></path>
          <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="b" d="M214 164 C332 214, 466 204, 578 140"></path>
          <path class="figure-arrow connected-correspondence-arrow" data-connected-arrow="c" d="M306 158 C404 242, 564 232, 666 164"></path>
        </g>
        <g transform="translate(446 102)">
          <g class="connected-match" data-connected-right="a">
            <path class="figure-line" d="M58 0 L26 54 M58 0 L90 54 M26 54 L6 108 M26 54 L46 108 M90 54 L70 108 M90 54 L110 108"></path>
            <circle class="figure-node soft" cx="58" cy="0" r="11"></circle>
            <circle class="figure-node" cx="26" cy="54" r="11"></circle><circle class="figure-node" cx="90" cy="54" r="11"></circle>
            <circle class="figure-node" cx="6" cy="108" r="11"></circle><circle class="figure-node" cx="46" cy="108" r="11"></circle><circle class="figure-node" cx="70" cy="108" r="11"></circle><circle class="figure-node" cx="110" cy="108" r="11"></circle>
          </g>
          <g class="connected-match" data-connected-right="b">
            <path class="figure-line" d="M148 0 L148 54"></path>
            <circle class="figure-node soft" cx="148" cy="0" r="11"></circle>
            <circle class="figure-node" cx="148" cy="54" r="11"></circle>
          </g>
          <g class="connected-match" data-connected-right="c">
            <path class="figure-line" d="M230 0 L230 54 M230 54 L210 108 M230 54 L250 108"></path>
            <circle class="figure-node soft" cx="230" cy="0" r="11"></circle>
            <circle class="figure-node" cx="230" cy="54" r="11"></circle>
            <circle class="figure-node" cx="210" cy="108" r="11"></circle><circle class="figure-node" cx="250" cy="108" r="11"></circle>
          </g>
          <text class="figure-label" x="148" y="196">rooted forest</text>
        </g>
      </svg>
    </div>`;
}

const paperFigureTemplates = {
  "internal-parameterizations": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-internal-title fig-internal-desc">
      <title id="fig-internal-title">Locally determined cocones</title>
      <desc id="fig-internal-desc">A local subobject U maps into X, and both determine a value in the local state classifier Psi.</desc>
      <defs><marker id="arrow-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <circle class="figure-node" cx="132" cy="125" r="36"></circle>
      <circle class="figure-dot" cx="132" cy="125" r="4"></circle>
      <ellipse class="figure-node" cx="470" cy="125" rx="150" ry="72"></ellipse>
      <circle class="figure-dot ghost" cx="438" cy="126" r="21"></circle>
      <circle class="figure-dot" cx="438" cy="126" r="4"></circle>
      <rect class="figure-node" x="284" y="283" width="230" height="56" rx="4"></rect>
      <path class="figure-arrow" d="M168 125 H318"></path>
      <path class="figure-arrow" d="M138 162 L318 278"></path>
      <path class="figure-arrow" d="M438 197 L425 278"></path>
    </svg>
    <span class="figure-math large" style="left: 17.4%; top: 18%;">\\(U\\)</span>
    <span class="figure-math small" style="left: 17.4%; top: 39%;">\\(x\\)</span>
    <span class="figure-math large" style="left: 61.8%; top: 14%;">\\(X\\)</span>
    <span class="figure-math small" style="left: 57.6%; top: 39%;">\\(x\\)</span>
    <span class="figure-math large" style="left: 52.5%; top: 81%;">\\(\\Psi_U(x)=\\Psi_X(x)\\)</span>
    <span class="figure-math small" style="left: 31.3%; top: 28.5%;">\\(i\\)</span>
    <span class="figure-math small" style="left: 26%; top: 58.5%;">\\(\\Psi_U\\)</span>
    <span class="figure-math small" style="left: 59.7%; top: 60%;">\\(\\Psi_X\\)</span>`,
  "quotient-toposes": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-quotient-title fig-quotient-desc">
      <title id="fig-quotient-title">Period, height, and core</title>
      <desc id="fig-quotient-desc">Three discrete dynamical systems showing finite height with period, a core of fixed points, and an infinite tail.</desc>
      <defs><marker id="arrow-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <g transform="translate(74 34)">
        <path class="figure-arrow" d="M0 68 H55 H110"></path>
        <circle class="figure-dot" cx="0" cy="68" r="5"></circle><circle class="figure-dot" cx="55" cy="68" r="5"></circle>
        <circle class="figure-dot" cx="110" cy="68" r="5"></circle>
        <circle class="figure-cycle" cx="170" cy="68" r="38"></circle>
        <path class="figure-arrow" d="M110 68 H132"></path>
        <circle class="figure-dot" cx="170" cy="30" r="5"></circle><circle class="figure-dot" cx="208" cy="68" r="5"></circle><circle class="figure-dot" cx="170" cy="106" r="5"></circle><circle class="figure-dot" cx="132" cy="68" r="5"></circle>
        <text class="figure-small" x="101" y="130">height and period</text>
      </g>
      <g transform="translate(365 48)">
        <path class="figure-line" d="M0 116 H270"></path>
        <g class="figure-stem"><path d="M30 20 V116"></path><path d="M90 45 V116"></path><path d="M150 20 V116"></path><path d="M210 45 V116"></path></g>
        <g><circle class="figure-dot" cx="30" cy="20" r="5"></circle><circle class="figure-dot" cx="30" cy="68" r="5"></circle><circle class="figure-dot" cx="90" cy="45" r="5"></circle><circle class="figure-dot" cx="150" cy="20" r="5"></circle><circle class="figure-dot" cx="150" cy="68" r="5"></circle><circle class="figure-dot" cx="210" cy="45" r="5"></circle></g>
        <text class="figure-small" x="58" y="152">height and period</text>
      </g>
      <g transform="translate(110 265)">
        <path class="figure-line dashed" d="M0 0 H540"></path>
        <path class="figure-line" d="M115 0 H255 L312 45 H455"></path>
        <g><circle class="figure-dot ghost-fill" cx="115" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="185" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="255" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="312" cy="45" r="5"></circle><circle class="figure-dot ghost-fill" cx="385" cy="45" r="5"></circle><circle class="figure-dot ghost-fill" cx="455" cy="45" r="5"></circle></g>
        <text class="figure-small" x="220" y="88">height and period</text>
      </g>
    </svg>
    <span class="figure-math small" style="left: 23%; top: 39.5%;">\\((h,p)=(3,4)\\)</span>
    <span class="figure-math small" style="left: 54.6%; top: 45.5%;">\\((h,p)=(3,0)\\)</span>
    <span class="figure-math small" style="left: 43.5%; top: 91%;">\\((h,p)=(\\infty,0)\\)</span>`,
  "completely-connected": completelyConnectedFigureTemplate(),
  "lawvere-first": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-lawvere-first-title fig-lawvere-first-desc">
      <title id="fig-lawvere-first-title">Length thermometer for minimal expressions</title>
      <desc id="fig-lawvere-first-desc">A long expression is reduced to a minimal expression, measured by a length thermometer that keeps the construction controlled.</desc>
      <defs><marker id="arrow-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <text class="figure-small lawvere-caption" x="380" y="34">length thermometer for minimal expressions</text>

      <g transform="translate(54 92)">
        <rect class="lawvere-thermo-card" x="0" y="0" width="202" height="182" rx="12"></rect>
        <text class="figure-label" x="101" y="42">expression</text>
        <text class="figure-small" x="101" y="70">possibly too long</text>
        <path class="lawvere-expression-thread" d="M44 112 C64 78, 95 142, 120 104 S166 94, 170 132"></path>
        <circle class="lawvere-bead green" cx="44" cy="112" r="12"></circle>
        <circle class="lawvere-bead blue" cx="75" cy="93" r="12"></circle>
        <circle class="lawvere-bead warm" cx="103" cy="125" r="12"></circle>
        <circle class="lawvere-bead pale" cx="132" cy="103" r="12"></circle>
        <circle class="lawvere-bead green" cx="158" cy="111" r="12"></circle>
        <circle class="lawvere-bead blue" cx="170" cy="132" r="12"></circle>
        <text class="figure-small" x="101" y="160">six pieces</text>
      </g>

      <path class="figure-arrow lawvere-thermo-arrow" d="M268 184 C304 184, 310 184, 340 184"></path>
      <text class="figure-small" x="304" y="162">minimize</text>

      <g transform="translate(340 68)">
        <rect class="lawvere-thermo-panel" x="0" y="0" width="112" height="246" rx="14"></rect>
        <text class="figure-small" x="56" y="28">length</text>
        <g transform="translate(56 52)">
          <rect class="lawvere-thermo-tube" x="-14" y="0" width="28" height="148" rx="14"></rect>
          <rect class="lawvere-thermo-fill" x="-10" y="66" width="20" height="82" rx="10"></rect>
          <circle class="lawvere-thermo-bulb" cx="0" cy="164" r="27"></circle>
          <path class="lawvere-thermo-mercury" d="M-10 133 V164 A10 10 0 0 0 10 164 V133 Z"></path>
          <g class="lawvere-thermo-ticks">
            <path d="M18 2 H42"></path><text x="50" y="7">m</text>
            <path d="M18 36 H36"></path><text x="50" y="41">4</text>
            <path d="M18 72 H42"></path><text x="50" y="77">3</text>
            <path d="M18 108 H36"></path><text x="50" y="113">2</text>
            <path d="M18 144 H42"></path><text x="50" y="149">1</text>
          </g>
        </g>
        <text class="figure-small" x="56" y="228">minimal length</text>
      </g>

      <path class="figure-arrow lawvere-thermo-arrow" d="M464 184 C496 184, 504 184, 536 184"></path>
      <text class="figure-small" x="500" y="162">bounded</text>

      <g transform="translate(548 92)">
        <rect class="lawvere-thermo-card warm" x="0" y="0" width="158" height="182" rx="12"></rect>
        <text class="figure-label" x="79" y="42">minimal</text>
        <text class="figure-small" x="79" y="70">core</text>
        <path class="lawvere-expression-thread compact" d="M39 116 C60 96, 79 136, 119 108"></path>
        <circle class="lawvere-bead green" cx="39" cy="116" r="13"></circle>
        <circle class="lawvere-bead warm" cx="79" cy="128" r="13"></circle>
        <circle class="lawvere-bead blue" cx="119" cy="108" r="13"></circle>
        <g class="lawvere-lock" transform="translate(79 154)">
          <rect x="-18" y="-8" width="36" height="28" rx="5"></rect>
          <path d="M-11 -8 V-18 C-11 -30, 11 -30, 11 -18 V-8"></path>
        </g>
      </g>

      <path class="figure-line dashed" d="M110 324 H650"></path>
      <text class="figure-small" x="380" y="350">bounded length is the control knob in the construction</text>
    </svg>
    <span class="figure-math small" style="left: 15.8%; top: 73%;">\\(f\\otimes\\sigma\\)</span>
    <span class="figure-math small" style="left: 52.2%; top: 56%;">\\(\\operatorname{Le}(t)\\le m\\)</span>
    <span class="figure-math small" style="left: 82.5%; top: 73%;">\\(t_{\\min}\\)</span>`,
  "lawvere-fourth": lawvereFourthFigureTemplate(),
  "topoi-automata": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-automata-title fig-automata-desc">
      <title id="fig-automata-title">Four characterizations of regular languages</title>
      <desc id="fig-automata-desc">DFA, finite monoids, Myhill-Nerode, and profinite words surround a ringed topos.</desc>
      <g transform="translate(48 40)">
        <circle class="figure-node" cx="128" cy="84" r="52"></circle><text class="figure-label" x="128" y="90">DFA</text>
        <circle class="figure-node" cx="600" cy="84" r="62"></circle><text class="figure-label" x="600" y="90">finite monoids</text>
        <circle class="figure-node" cx="128" cy="270" r="62"></circle><text class="figure-label" x="128" y="264">Myhill-</text><text class="figure-label" x="128" y="291">Nerode</text>
        <circle class="figure-node" cx="600" cy="270" r="62"></circle><text class="figure-label" x="600" y="264">profinite</text><text class="figure-label" x="600" y="291">words</text>
        <ellipse class="figure-node soft-2" cx="364" cy="178" rx="122" ry="82"></ellipse>
        <text class="figure-label" x="364" y="169">ringed topos</text>
        <text class="figure-small" x="364" y="198">regular languages</text>
        <path class="figure-line" d="M170 116 L257 154 M554 116 L471 154 M170 238 L257 202 M554 238 L471 202"></path>
      </g>
    </svg>
    <span class="figure-math small" style="left: 48%; top: 51%;">\\((\\Sigma\\text{-}\\mathbf{Set},R)\\)</span>`,
  "games-coalgebras": grundyFigureTemplate(),
  "normalization": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-normalization-title fig-normalization-desc">
      <title id="fig-normalization-title">Subgroup lattice of the fourth dihedral group</title>
      <desc id="fig-normalization-desc">The subgroup lattice of D4 with normalizer arrows from reflection subgroups to Klein four subgroups and then to D4.</desc>
      <defs><marker id="arrow-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <path class="figure-line" d="M380 70 L190 124 M380 70 L380 124 M380 70 L570 124"></path>
      <path class="figure-line" d="M190 156 L105 226 M190 156 L240 226 M190 156 L380 226"></path>
      <path class="figure-line" d="M380 156 L380 226"></path>
      <path class="figure-line" d="M570 156 L380 226 M570 156 L520 226 M570 156 L655 226"></path>
      <path class="figure-line" d="M380 314 L105 274 M380 314 L240 274 M380 314 L380 274 M380 314 L520 274 M380 314 L655 274"></path>
      <path class="figure-arrow dashed" d="M105 226 C92 174, 132 140, 168 140"></path>
      <path class="figure-arrow dashed" d="M240 226 C246 176, 228 150, 206 144"></path>
      <path class="figure-arrow dashed" d="M520 226 C514 176, 532 150, 554 144"></path>
      <path class="figure-arrow dashed" d="M655 226 C668 174, 628 140, 592 140"></path>
      <path class="figure-arrow dashed" d="M380 226 V78"></path>
      <path class="figure-arrow dashed" d="M190 124 C220 76, 298 55, 352 55"></path>
      <path class="figure-arrow dashed" d="M570 124 C540 76, 462 55, 408 55"></path>
      <path class="figure-arrow dashed" d="M380 314 C450 270, 500 158, 405 75"></path>
      <rect class="figure-node soft" x="340" y="31" width="80" height="42" rx="7"></rect>
      <rect class="figure-node pale" x="132" y="116" width="116" height="48" rx="7"></rect>
      <rect class="figure-node pale" x="334" y="116" width="92" height="48" rx="7"></rect>
      <rect class="figure-node pale" x="512" y="116" width="116" height="48" rx="7"></rect>
      <rect class="figure-node" x="62" y="226" width="86" height="48" rx="7"></rect>
      <rect class="figure-node" x="194" y="226" width="92" height="48" rx="7"></rect>
      <rect class="figure-node warm" x="336" y="226" width="88" height="48" rx="7"></rect>
      <rect class="figure-node" x="474" y="226" width="92" height="48" rx="7"></rect>
      <rect class="figure-node" x="612" y="226" width="86" height="48" rx="7"></rect>
      <rect class="figure-node soft" x="338" y="314" width="84" height="42" rx="7"></rect>
      <text class="figure-small" x="380" y="18">normalizer map on subgroups</text>
    </svg>
    <span class="figure-math large" style="left: 50%; top: 13.5%;">\\(D_4\\)</span>
    <span class="figure-math tiny" style="left: 25%; top: 36%;">\\(\\langle\\tau,\\sigma^2\\rangle\\)</span>
    <span class="figure-math small" style="left: 50%; top: 36%;">\\(\\langle\\sigma\\rangle\\)</span>
    <span class="figure-math tiny" style="left: 75%; top: 36%;">\\(\\langle\\sigma\\tau,\\sigma^2\\rangle\\)</span>
    <span class="figure-math small" style="left: 13.8%; top: 64.2%;">\\(\\langle\\tau\\rangle\\)</span>
    <span class="figure-math tiny" style="left: 31.6%; top: 64.2%;">\\(\\langle\\sigma^2\\tau\\rangle\\)</span>
    <span class="figure-math small" style="left: 50%; top: 64.2%;">\\(\\langle\\sigma^2\\rangle\\)</span>
    <span class="figure-math small" style="left: 68.4%; top: 64.2%;">\\(\\langle\\sigma\\tau\\rangle\\)</span>
    <span class="figure-math tiny" style="left: 86.2%; top: 64.2%;">\\(\\langle\\sigma^3\\tau\\rangle\\)</span>
    <span class="figure-math small" style="left: 50%; top: 86%;">\\(\\langle 1\\rangle\\)</span>
    <span class="figure-math tiny" style="left: 58.5%; top: 24%;">\\(N_{D_4}(-)\\)</span>`
};

const paperDiagramNotes = {
  "internal-parameterizations": {
    heading: "Local State Classifier",
    keywords: ["hyperconnected quotient", "local state", "classifier", "internal parameterization"],
    concepts: [
      ["Local state classifier", "An object that packages locally determined states and compares them across inclusions."],
      ["Hyperconnected quotient", "A quotient geometric morphism controlled by internal local data."]
    ],
    results: ["Hyperconnected quotients can be parameterized inside the ambient topos by local state classifiers."]
  },
  "quotient-toposes": {
    heading: "Height And Period",
    keywords: ["discrete dynamics", "quotient topos", "height", "period"],
    concepts: [
      ["Discrete dynamical system", "A set equipped with a self-map, drawn here by arrows between states."],
      ["Invariant class", "A class of systems closed under the categorical operations relevant to quotient topoi."]
    ],
    results: ["Quotient topoi of discrete dynamical systems are organized by numerical dynamics such as height and period."]
  },
  "completely-connected": {
    heading: "Completely Connected Topoi",
    keywords: ["connectedness", "Grothendieck topos", "site", "rooted trees"],
    concepts: [
      ["Completely connected", "A strengthened connectedness property detected through adjoints to global sections."],
      ["Site presentation", "A concrete category of shapes used to present the topos."]
    ],
    results: ["The paper gives a site-theoretic way to build a Grothendieck topos with a long adjoint pattern."]
  },
  "lawvere-first": {
    heading: "Inhabited Objects And Quotients",
    keywords: ["Lawvere problem", "quotient topos", "inhabited object classifier", "rigidity"],
    concepts: [
      ["Inhabited object classifier", "The topos iOC classifies inhabited objects through Geom(E, iOC) equivalent to E_inhabited."],
      ["Inhabited-topos-rigid object", "An inhabited object whose corresponding morphism to iOC is connected, hence gives a quotient topos."],
      ["Meta-rigidity of iOC", "Equivalences of iOC are forced to be trivial, so equivalent quotients force the original rigid objects to be isomorphic."]
    ],
    results: ["Proper class many inhabited-topos-rigid objects in one Grothendieck topos give proper class many non-equivalent quotient topoi."]
  },
  "lawvere-fourth": {
    heading: "Pullback And Levels",
    keywords: ["Lawvere problem", "species", "symmetric simplicial set", "pullback", "level"],
    concepts: [
      ["Species", "A structure indexed by finite sets and symmetries."],
      ["Graph pullback", "For a graph y on B and a map alpha: A -> B, the graph x=y alpha on A is obtained by pulling back the edge subset of y."],
      ["EZ-decomposition", "An M-structure x is written as x=y alpha with alpha surjective and y non-degenerate; the colours record the induced EZ-congruence."],
      ["Level", "A layer in the topos of symmetric simplicial sets used to measure locality."]
    ],
    results: ["The pullback behaviour of structures under maps of finite sets is the local combinatorics behind the level calculation."]
  },
  "topoi-automata": {
    heading: "Regular Languages As Topoi",
    keywords: ["automata", "regular languages", "ringed topos", "profinite words"],
    concepts: [
      ["Topos of automata", "A topos-theoretic environment where automata and languages can be compared."],
      ["Ringed topos", "A topos equipped with algebraic structure encoding regular languages."]
    ],
    results: ["Four views of regular languages are tied together by a topos-theoretic construction."]
  },
  "games-coalgebras": {
    heading: "Games As Recursive Coalgebras",
    keywords: ["Nim", "coalgebra", "combinatorial games", "Sprague-Grundy"],
    concepts: [
      ["Recursive coalgebra", "A coalgebra whose unfolding describes recursively generated positions."],
      ["Grundy number", "A value computed by the mex of the values reachable in one move."],
      ["Nim-sum", "The operation that controls sums of impartial games."]
    ],
    results: ["Impartial games and the Nim-sum can be read categorically through recursive coalgebras."]
  },
  normalization: {
    heading: "Normalizer Map",
    keywords: ["normalization", "subgroup", "word congruence", "local state classifier"],
    concepts: [
      ["Normalizer", "An operator sending a subgroup to the largest ambient symmetry preserving it."],
      ["Generalized normalization", "A common pattern appearing for subgroups, topoi, and word congruences."]
    ],
    results: ["The subgroup picture motivates a normalization operator that also applies to topoi and algebraic language theory."]
  }
};

function applyFigureMarkerIds(container, figureId, prefix) {
  const svg = container.querySelector("svg");
  const marker = svg?.querySelector("marker");
  if (!svg || !marker) return;
  const markerId = `${prefix}-${figureId}`;
  marker.id = markerId;
  svg.querySelectorAll(".figure-arrow").forEach((path) => {
    path.setAttribute("marker-end", `url(#${markerId})`);
  });
}

const grundyFigureStates = new WeakMap();

function formatGrundySet(values) {
  return values.length ? `{${values.join(", ")}}` : "empty set";
}

function grundyActiveNodeIds(state) {
  if (!state.step) return new Set();
  if (state.focusId && grundyNodeStep(state.focusId) <= state.step) return new Set([state.focusId]);
  const activeNode = grundyNodeForStep(state.step);
  return activeNode ? new Set([activeNode.id]) : new Set();
}

function updateGrundyPanel(root, state, activeIds) {
  const focus = root.querySelector("[data-grundy-focus]");
  const options = root.querySelector("[data-grundy-options]");
  const mex = root.querySelector("[data-grundy-mex]");
  const status = root.querySelector("[data-grundy-status]");
  const activeNodeId = [...activeIds][0] || "";
  const focusedNode = state.focusId ? grundyGameNodeMap.get(state.focusId) : grundyGameNodeMap.get(activeNodeId);

  if (focusedNode) {
    const values = grundyOptionValues(focusedNode);
    if (focus) focus.textContent = "current node";
    if (options) options.textContent = `reachable values: ${formatGrundySet(values)}`;
    if (mex) mex.textContent = `mex = ${focusedNode.value}`;
    if (status) status.textContent = "cross out the reachable values; choose the first number left.";
    return;
  }

  const copy = state.step >= state.max ? grundyFinalCopy : grundyStepCopy[state.step] || grundyStepCopy[0];
  const activeText = [...activeIds].join(", ");
  if (focus) focus.textContent = activeText || copy.focus;
  if (options) options.textContent = copy.options;
  if (mex) mex.textContent = copy.mex;
  if (status) status.textContent = copy.status;
}

function updateGrundyAlgebraPanel(root, state, activeIds) {
  const activeNodeId = [...activeIds][0] || "";
  const focusedNode = state.focusId ? grundyGameNodeMap.get(state.focusId) : grundyGameNodeMap.get(activeNodeId);
  const values = focusedNode ? grundyOptionValues(focusedNode) : [];
  const mexValue = focusedNode ? grundyMex(values) : null;
  const isReady = Boolean(focusedNode);

  root.querySelectorAll("[data-grundy-natural]").forEach((number) => {
    const value = Number(number.dataset.grundyNatural);
    const excluded = isReady && values.includes(value);
    const isMex = isReady && value === mexValue;
    number.classList.toggle("is-excluded", excluded);
    number.classList.toggle("is-mex", isMex);
    number.classList.toggle("is-after-mex", isReady && value > mexValue && !excluded);
  });

  const reachable = root.querySelector("[data-grundy-reachable-values]");
  const reason = root.querySelector("[data-grundy-mex-reason]");
  const result = root.querySelector("[data-grundy-mex-result]");

  if (!isReady) {
    if (reachable) reachable.textContent = state.step >= state.max ? "all values computed" : "press Play";
    if (reason) reason.textContent = "mex is the first natural number not crossed out.";
    if (result) result.textContent = state.step >= state.max ? "done" : "mex";
    return;
  }

  if (reachable) reachable.textContent = values.length ? values.join(", ") : "none";
  if (reason) reason.textContent = values.length ? "cross these out; take the first remaining number." : "nothing is reachable, so start at 0.";
  if (result) result.textContent = `mex = ${mexValue}`;
}

function updateGrundyPlayControl(root) {
  const state = grundyFigureStates.get(root);
  const play = root.querySelector('[data-grundy-action="play"]');
  if (play && state) play.textContent = state.playing ? "Pause" : "Play";
  root.dataset.grundyPlaying = state?.playing ? "true" : "false";
}

function renderGrundyStep(root) {
  const state = grundyFigureStates.get(root);
  if (!state) return;
  const step = state.step;
  const activeIds = grundyActiveNodeIds(state);
  root.dataset.grundyStep = String(step);
  root.classList.toggle("is-final", step >= state.max);

  root.querySelectorAll("[data-grundy-node]").forEach((node) => {
    const nodeId = node.dataset.grundyNode || "";
    const record = grundyGameNodeMap.get(nodeId);
    if (!record) return;
    const value = node.querySelector("[data-grundy-value]");
    const known = grundyNodeIsKnown(record, step);
    const active = activeIds.has(record.id);
    node.classList.toggle("is-known", known);
    node.classList.toggle("is-computed", known && !active);
    node.classList.toggle("is-active", active);
    node.classList.toggle("is-p-state", step >= state.max && known && record.value === 0);
    node.classList.toggle("is-n-state", step >= state.max && known && record.value !== 0);
    if (value) value.textContent = known ? String(record.value) : "";
  });

  root.querySelectorAll("[data-grundy-edge]").forEach((edge) => {
    const [fromId, toId] = String(edge.dataset.grundyEdge || "").split("-");
    const from = grundyGameNodeMap.get(fromId);
    const to = grundyGameNodeMap.get(toId);
    if (!from || !to) return;
    const active = activeIds.has(from.id) && grundyNodeIsKnown(to, step);
    const known = grundyNodeIsKnown(from, step);
    edge.classList.toggle("is-active", active);
    edge.classList.toggle("is-computed", known && !active);
  });

  const slider = root.querySelector("[data-grundy-slider]");
  if (slider) slider.value = String(step);
  updateGrundyAlgebraPanel(root, state, activeIds);
  updateGrundyPanel(root, state, activeIds);
}

function setGrundyStep(root, step, focusId = "") {
  const state = grundyFigureStates.get(root);
  if (!state) return;
  state.step = Math.max(0, Math.min(state.max, Number(step) || 0));
  state.focusId = focusId;
  renderGrundyStep(root);
}

function stopGrundyFigure(root) {
  const state = grundyFigureStates.get(root);
  if (!state) return;
  if (state.timer) window.clearInterval(state.timer);
  state.timer = null;
  state.playing = false;
  updateGrundyPlayControl(root);
}

function startGrundyFigure(root) {
  const state = grundyFigureStates.get(root);
  if (!state || state.timer) return;
  state.playing = true;
  updateGrundyPlayControl(root);
  state.timer = window.setInterval(() => {
    setGrundyStep(root, state.step >= state.max ? 0 : state.step + 1);
  }, state.intervalMs);
}

function ensureGrundyControls(root) {
  if (root.querySelector("[data-grundy-controls]")) return;
  const controls = el("div", "grundy-controls");
  controls.dataset.grundyControls = "";

  const makeButton = (action, label) => {
    const button = el("button", "grundy-control", label);
    button.type = "button";
    button.dataset.grundyAction = action;
    return button;
  };

  const sliderLabel = el("label", "grundy-slider");
  sliderLabel.append(el("span", null, "node"));
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "0";
  slider.max = root.dataset.grundyMax || String(grundyFinalStep);
  slider.value = root.dataset.grundyStep || "0";
  slider.dataset.grundySlider = "";
  sliderLabel.append(slider);

  controls.append(
    makeButton("reset", "Reset"),
    makeButton("prev", "Prev"),
    makeButton("play", "Play"),
    makeButton("next", "Next"),
    sliderLabel
  );
  root.append(controls);
}

function initializeGrundyFigure(root, options = {}) {
  const previous = grundyFigureStates.get(root);
  if (previous?.timer) window.clearInterval(previous.timer);

  const max = Number(root.dataset.grundyMax || grundyFinalStep);
  const state = {
    max,
    step: Math.max(0, Math.min(max, Number(root.dataset.grundyStep || 0))),
    focusId: "",
    timer: null,
    playing: false,
    intervalMs: options.intervalMs || 1000
  };
  grundyFigureStates.set(root, state);

  if (options.controls) {
    ensureGrundyControls(root);
    root.querySelectorAll("[data-grundy-node]").forEach((node) => {
      const record = grundyGameNodeMap.get(node.dataset.grundyNode || "");
      node.addEventListener("click", (event) => {
        event.stopPropagation();
        stopGrundyFigure(root);
        if (record) setGrundyStep(root, grundyNodeStep(record.id), record.id);
      });
      node.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        stopGrundyFigure(root);
        if (record) setGrundyStep(root, grundyNodeStep(record.id), record.id);
      });
    });
    root.querySelectorAll("[data-grundy-action]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        const action = button.dataset.grundyAction;
        if (action === "play") {
          if (state.playing) stopGrundyFigure(root);
          else startGrundyFigure(root);
          return;
        }
        stopGrundyFigure(root);
        if (action === "reset") setGrundyStep(root, 0);
        if (action === "prev") setGrundyStep(root, state.step - 1);
        if (action === "next") setGrundyStep(root, state.step + 1);
      });
    });
    const slider = root.querySelector("[data-grundy-slider]");
    slider?.addEventListener("input", () => {
      stopGrundyFigure(root);
      setGrundyStep(root, slider.value);
    });
  }

  renderGrundyStep(root);
  updateGrundyPlayControl(root);
  if (options.autoplay) startGrundyFigure(root);
}

function initializeGrundyFigures(scope, options = {}) {
  const roots = scope.matches?.("[data-grundy-figure]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-grundy-figure]"));
  roots.forEach((root) => initializeGrundyFigure(root, options));
}

function stopGrundyFigures(scope) {
  const roots = scope.matches?.("[data-grundy-figure]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-grundy-figure]"));
  roots.forEach((root) => stopGrundyFigure(root));
}

const lawverePullbackGroups = ["rb", "ro", "rg", "og"];
const lawverePullbackStates = new WeakMap();

function renderLawverePullbackStep(root, step) {
  const completeStep = lawverePullbackGroups.length + 1;
  const boundedStep = Math.max(0, Math.min(completeStep, Number(step) || 0));
  root.dataset.pullbackStep = String(boundedStep);
  root.classList.toggle("is-complete", boundedStep === completeStep);

  const activeGroup = lawverePullbackGroups[boundedStep - 1] || "";
  root.querySelectorAll("[data-pullback-source]").forEach((edge) => {
    const index = lawverePullbackGroups.indexOf(edge.dataset.pullbackSource) + 1;
    edge.classList.toggle("is-active", Boolean(activeGroup) && edge.dataset.pullbackSource === activeGroup);
    edge.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
  });
  root.querySelectorAll("[data-pullback-edge]").forEach((edge) => {
    const index = lawverePullbackGroups.indexOf(edge.dataset.pullbackEdge) + 1;
    edge.classList.toggle("is-active", Boolean(activeGroup) && edge.dataset.pullbackEdge === activeGroup);
    edge.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
  });
}

function stopLawverePullbackFigure(root) {
  const state = lawverePullbackStates.get(root);
  if (!state) return;
  state.timers.forEach((timer) => window.clearTimeout(timer));
  state.timers = [];
  state.playing = false;
}

function playLawverePullbackFigure(root) {
  const state = lawverePullbackStates.get(root);
  if (!state) return;
  stopLawverePullbackFigure(root);
  state.playing = true;
  root.classList.add("is-animated");
  root.classList.remove("is-complete");
  renderLawverePullbackStep(root, 0);
  lawverePullbackGroups.forEach((_, index) => {
    state.timers.push(
      window.setTimeout(() => renderLawverePullbackStep(root, index + 1), 420 + index * state.intervalMs)
    );
  });
  state.timers.push(
    window.setTimeout(() => {
      renderLawverePullbackStep(root, lawverePullbackGroups.length + 1);
      state.playing = false;
    }, 420 + lawverePullbackGroups.length * state.intervalMs)
  );
}

function initializeLawverePullbackFigure(root, options = {}) {
  stopLawverePullbackFigure(root);
  lawverePullbackStates.set(root, {
    timers: [],
    playing: false,
    intervalMs: options.intervalMs || 760
  });
  if (options.controls) {
    root.setAttribute("role", "button");
    root.setAttribute("aria-label", "Replay the pullback animation");
    root.tabIndex = 0;
    root.addEventListener("click", (event) => {
      playLawverePullbackFigure(root);
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      playLawverePullbackFigure(root);
    });
  }
  renderLawverePullbackStep(root, lawverePullbackGroups.length + 1);
  if (options.autoplay) playLawverePullbackFigure(root);
}

function initializeLawverePullbackFigures(scope, options = {}) {
  const roots = scope.matches?.("[data-lawvere-pullback]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-lawvere-pullback]"));
  roots.forEach((root) => initializeLawverePullbackFigure(root, options));
}

function stopLawverePullbackFigures(scope) {
  const roots = scope.matches?.("[data-lawvere-pullback]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-lawvere-pullback]"));
  roots.forEach((root) => stopLawverePullbackFigure(root));
}

const connectedCorrespondenceGroups = ["a", "b", "c"];
const connectedCorrespondenceStates = new WeakMap();

function renderConnectedCorrespondenceStep(root, step) {
  const completeStep = connectedCorrespondenceGroups.length + 1;
  const boundedStep = Math.max(0, Math.min(completeStep, Number(step) || 0));
  root.dataset.connectedStep = String(boundedStep);
  root.classList.toggle("is-complete", boundedStep === completeStep);

  const activeGroup = connectedCorrespondenceGroups[boundedStep - 1] || "";
  root.querySelectorAll("[data-connected-left], [data-connected-right]").forEach((group) => {
    const groupId = group.dataset.connectedLeft || group.dataset.connectedRight || "";
    const index = connectedCorrespondenceGroups.indexOf(groupId) + 1;
    group.classList.toggle("is-active", Boolean(activeGroup) && groupId === activeGroup);
    group.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
  });

  root.querySelectorAll("[data-connected-arrow]").forEach((arrow) => {
    const index = connectedCorrespondenceGroups.indexOf(arrow.dataset.connectedArrow) + 1;
    arrow.classList.toggle("is-active", Boolean(activeGroup) && arrow.dataset.connectedArrow === activeGroup);
    arrow.classList.toggle("is-complete", boundedStep === completeStep || (index > 0 && index < boundedStep));
  });
}

function stopConnectedCorrespondenceFigure(root) {
  const state = connectedCorrespondenceStates.get(root);
  if (!state) return;
  state.timers.forEach((timer) => window.clearTimeout(timer));
  state.timers = [];
  state.playing = false;
}

function playConnectedCorrespondenceFigure(root) {
  const state = connectedCorrespondenceStates.get(root);
  if (!state) return;
  stopConnectedCorrespondenceFigure(root);
  state.playing = true;
  root.classList.add("is-animated");
  root.classList.remove("is-complete");
  renderConnectedCorrespondenceStep(root, 0);
  connectedCorrespondenceGroups.forEach((_, index) => {
    state.timers.push(
      window.setTimeout(() => renderConnectedCorrespondenceStep(root, index + 1), 360 + index * state.intervalMs)
    );
  });
  state.timers.push(
    window.setTimeout(() => {
      renderConnectedCorrespondenceStep(root, connectedCorrespondenceGroups.length + 1);
      state.playing = false;
    }, 360 + connectedCorrespondenceGroups.length * state.intervalMs)
  );
}

function initializeConnectedCorrespondenceFigure(root, options = {}) {
  stopConnectedCorrespondenceFigure(root);
  connectedCorrespondenceStates.set(root, {
    timers: [],
    playing: false,
    intervalMs: options.intervalMs || 760
  });
  if (options.controls) {
    root.setAttribute("role", "button");
    root.setAttribute("aria-label", "Replay the rooted tree and rooted forest correspondence animation");
    root.tabIndex = 0;
    root.addEventListener("click", () => playConnectedCorrespondenceFigure(root));
    root.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      playConnectedCorrespondenceFigure(root);
    });
  }
  renderConnectedCorrespondenceStep(root, connectedCorrespondenceGroups.length + 1);
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (options.autoplay && !reducedMotion) playConnectedCorrespondenceFigure(root);
}

function initializeConnectedCorrespondenceFigures(scope, options = {}) {
  const roots = scope.matches?.("[data-connected-correspondence]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-connected-correspondence]"));
  roots.forEach((root) => initializeConnectedCorrespondenceFigure(root, options));
}

function stopConnectedCorrespondenceFigures(scope) {
  const roots = scope.matches?.("[data-connected-correspondence]")
    ? [scope]
    : Array.from(scope.querySelectorAll("[data-connected-correspondence]"));
  roots.forEach((root) => stopConnectedCorrespondenceFigure(root));
}

function ensureDiagramDialog() {
  let dialog = document.querySelector("#paper-diagram-dialog");
  if (dialog) return dialog;

  dialog = el("dialog", "diagram-dialog");
  dialog.id = "paper-diagram-dialog";

  const shell = el("div", "diagram-dialog-shell");
  const header = el("header", "diagram-dialog-header");
  const titleBlock = el("div");
  titleBlock.append(el("p", "section-kicker", "Diagram Mode"), el("h2", null, "Paper Diagram"));
  const close = el("button", "diagram-close", "Close");
  close.type = "button";
  close.addEventListener("click", () => dialog.close());
  header.append(titleBlock, close);

  const body = el("div", "diagram-dialog-body");
  const figure = el("div", "diagram-expanded");
  figure.dataset.diagramFigure = "";
  const details = el("aside", "diagram-notes");
  details.dataset.diagramNotes = "";
  body.append(figure, details);
  shell.append(header, body);
  dialog.append(shell);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => {
    stopGrundyFigures(dialog);
    stopLawverePullbackFigures(dialog);
    stopConnectedCorrespondenceFigures(dialog);
  });

  document.body.append(dialog);
  return dialog;
}

function renderDiagramNotes(panel, paper) {
  const notes = paperDiagramNotes[paper.figure] || {
    heading: "Diagram Notes",
    keywords: paper.tags || [],
    concepts: [],
    results: compactText([paper.summary])
  };
  panel.replaceChildren();
  panel.append(el("p", "section-kicker", notes.heading), el("h3", null, paper.title));
  const people = paperPeopleText(paper, findResearchmapPaper(paper));
  if (people) panel.append(el("p", "diagram-paper-people", people));

  const keywordList = el("div", "diagram-keywords");
  (notes.keywords || paper.tags || []).forEach((keyword) => keywordList.append(el("span", null, keyword)));
  if (keywordList.children.length) panel.append(keywordList);

  if (notes.concepts?.length) {
    const concepts = el("div", "diagram-note-block");
    concepts.append(el("h4", null, "Concepts"));
    notes.concepts.forEach(([term, text]) => {
      const item = el("p");
      item.append(el("strong", null, term), document.createTextNode(`: ${text}`));
      concepts.append(item);
    });
    panel.append(concepts);
  }

  if (notes.results?.length) {
    const results = el("div", "diagram-note-block");
    results.append(el("h4", null, "Result"));
    notes.results.forEach((text) => results.append(el("p", null, text)));
    panel.append(results);
  }

  const links = [["Open paper", paper.link], ...(paper.links || [])];
  appendActionLinks(panel, links);
}

function openPaperDiagram(paper) {
  if (!paper.figure || !paperFigureTemplates[paper.figure]) return;
  const dialog = ensureDiagramDialog();
  const title = dialog.querySelector(".diagram-dialog-header h2");
  const figure = dialog.querySelector("[data-diagram-figure]");
  const notes = dialog.querySelector("[data-diagram-notes]");
  title.textContent = paperDiagramNotes[paper.figure]?.heading || "Paper Diagram";
  stopGrundyFigures(figure);
  stopLawverePullbackFigures(figure);
  stopConnectedCorrespondenceFigures(figure);
  figure.innerHTML = paperFigureTemplates[paper.figure];
  applyFigureMarkerIds(figure, paper.figure, "diagram-arrow");
  initializeGrundyFigures(figure, { controls: true, autoplay: true });
  initializeLawverePullbackFigures(figure, { controls: true, autoplay: true });
  initializeConnectedCorrespondenceFigures(figure, { controls: true, autoplay: true });
  renderDiagramNotes(notes, paper);
  typesetMath(dialog);
  if (dialog.showModal) dialog.showModal();
  else dialog.setAttribute("open", "");
}

function appendActionLinks(parent, records) {
  if (!records || !records.length) return;
  const actions = el("div", "action-links");
  records.forEach(([label, href]) => actions.append(link(label, href, "action-link")));
  parent.append(actions);
}

function currentPositionIcon(icon) {
  const svg = svgEl("svg", {
    viewBox: "0 0 32 32",
    "aria-hidden": "true",
    focusable: "false"
  });
  svg.classList.add("position-icon-svg");
  svg.classList.add(`position-icon-svg--${icon}`);

  const line = (attrs) => svgEl("path", { ...attrs, fill: "none", stroke: "currentColor", "stroke-linecap": "round", "stroke-linejoin": "round", "stroke-width": "2.2" });
  const shape = (tag, attrs) => svgEl(tag, attrs);

  if (icon === "building") {
    svg.append(
      shape("polygon", {
        points: "8,8 24,8 24,11 14,11 24,21 24,24 8,24 8,21 18,21 8,11",
        fill: "currentColor"
      })
    );
    return svg;
  }

  if (icon === "flask") {
    svg.append(
      shape("rect", { x: "7", y: "8", width: "4.4", height: "16", rx: "1.4", fill: "currentColor" }),
      shape("rect", { x: "20.6", y: "8", width: "4.4", height: "16", rx: "1.4", fill: "currentColor" }),
      shape("rect", { x: "11.2", y: "14.2", width: "10", height: "3.6", rx: "1.2", fill: "currentColor" }),
      shape("circle", { cx: "23.1", cy: "8.9", r: "2.15", fill: "#8ad6ff" })
    );
    return svg;
  }

  if (icon === "badge") {
    svg.append(
      shape("rect", { x: "7.3", y: "6.8", width: "3.2", height: "18.4", rx: "1.2", fill: "currentColor" }),
      shape("path", {
        d: "M10.2 16.1L22.7 7.7M10.2 16.1L22.9 24.3",
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "3"
      }),
      shape("rect", { x: "7.3", y: "25.7", width: "16.8", height: "2.3", rx: "1.15", fill: "#d3a336" })
    );
    return svg;
  }

  if (icon === "network") {
    svg.append(
      line({ d: "M9 20.2L16 11.6L23 20.2Z" }),
      shape("circle", { cx: "9", cy: "20.2", r: "2.55", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "16", cy: "11.6", r: "2.55", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "23", cy: "20.2", r: "2.55", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "16", cy: "20.2", r: "1.55", fill: "currentColor" })
    );
    return svg;
  }

  if (icon === "kan-extension") {
    svg.append(
      line({ d: "M11 10.8L20.4 14.9" }),
      line({ d: "M9 13.2V18.8" }),
      line({ d: "M11 21.2L20.4 17.1", "stroke-dasharray": "2.4 2.4" }),
      shape("circle", { cx: "9", cy: "9.6", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "9", cy: "22.4", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "23", cy: "16", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" })
    );
    return svg;
  }

  if (icon === "pullback") {
    svg.append(
      line({ d: "M12.2 9.6H19.8" }),
      line({ d: "M9.6 12.2V19.8" }),
      line({ d: "M22.4 12.2V19.8" }),
      line({ d: "M12.2 22.4H19.8" }),
      shape("path", {
        d: "M13 13H15.7V15.7",
        fill: "none",
        stroke: "currentColor",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "1.5"
      }),
      shape("circle", { cx: "9.6", cy: "9.6", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "22.4", cy: "9.6", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "9.6", cy: "22.4", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" }),
      shape("circle", { cx: "22.4", cy: "22.4", r: "2.45", fill: "#fff9fc", stroke: "currentColor", "stroke-width": "1.8" })
    );
    return svg;
  }

  if (icon === "mentor") {
    svg.append(
      shape("polygon", { points: "8,20 12,18 12,10 8,12", fill: "currentColor", opacity: "0.74" }),
      shape("polygon", { points: "14,22 18,20 18,9 14,11", fill: "currentColor" }),
      shape("polygon", { points: "20,24 24,22 24,12 20,14", fill: "currentColor", opacity: "0.84" }),
      shape("circle", { cx: "11.4", cy: "8.4", r: "2.2", fill: "#7ed0de" })
    );
    return svg;
  }

  if (icon === "hexagon") {
    svg.append(
      shape("polygon", {
        points: "16,6.8 23.97,11.4 23.97,20.6 16,25.2 8.03,20.6 8.03,11.4",
        fill: "currentColor"
      })
    );
    return svg;
  }

  svg.append(
    shape("circle", {
      cx: "16",
      cy: "16.7",
      r: "8.3",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
      "stroke-opacity": "0.24"
    }),
    line({ d: "M9 10.5H23" }),
    line({ d: "M16 10.5V23" }),
    line({ d: "M12.2 10.5C12.2 13 13 14.6 14.5 15.7" })
  );
  return svg;
}

function renderCurrentPositions() {
  document.querySelectorAll("#current-position-list").forEach((root) => {
    root.replaceChildren();
    root.classList.add("position-list");
    siteData.currentPositions.forEach((record) => {
      const item = el("li", "position-item");
      const iconWrap = el("span", "position-icon");
      iconWrap.classList.add(`position-icon--${record.icon}`);
      iconWrap.append(currentPositionIcon(record.icon));
      const content = record.href ? link(record.text, record.href, "position-link") : el("span", "position-link", record.text);
      item.append(iconWrap, content);
      root.append(item);
    });
  });
}

function renderLinkedList(selector, records) {
  const root = document.querySelector(selector);
  if (!root) return;
  root.replaceChildren();
  root.classList.add("icon-list");
  records.forEach((record) => {
    const item = el("li", "icon-list-item");
    item.append(uiIcon(linkedListIconKey(selector, record), "list-item-icon"));
    const body = el("div", "icon-list-body");
    if (record.href) {
      body.append(link(record.text, record.href));
    } else {
      body.textContent = record.text;
    }
    item.append(body);
    root.append(item);
  });
}

function renderProfileLinks() {
  document.querySelectorAll("[data-profile-links]").forEach((root) => {
    root.replaceChildren();
    siteData.profileLinks.forEach(([label, href]) => {
      const item = el("span", "profile-link-chip");
      item.append(uiIcon(iconKeyForLink(label, href, "profile"), "profile-link-icon"), link(label, href, "text-link"));
      root.append(item);
    });
  });
}

function renderTopics() {
  document.querySelectorAll("[data-topics]").forEach((root) => {
    root.replaceChildren();
    siteData.topics.forEach(([label, href]) => root.append(link(label, href)));
  });
}

function renderExplore() {
  const root = document.querySelector("#explore-grid");
  if (!root) return;
  root.replaceChildren();
  siteData.pages.forEach((page) => {
    const item = el("article", "explore-card");
    const thumbnailSrc = pageThumbnailSrc(page);
    if (thumbnailSrc) {
      const media = link("", localHref(page.href), "explore-card-media");
      media.setAttribute("aria-label", `Open ${page.title}`);
      const image = el("img");
      image.src = thumbnailSrc;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        media.remove();
        item.classList.remove("has-thumbnail");
      });
      media.append(image);
      item.classList.add("has-thumbnail");
      item.append(media);
    }
    const body = el("div", "explore-card-body");
    const head = el("div", "explore-card-head");
    head.append(uiIcon(pageIconKey(page), "explore-card-icon"));
    const copy = el("div", "explore-card-copy");
    copy.append(link(page.title, localHref(page.href), "explore-title"), el("p", null, page.description));
    head.append(copy);
    body.append(head);
    item.append(body);
    root.append(item);
  });
}

function renderWebApps() {
  const root = document.querySelector("#web-app-grid");
  if (!root) return;
  root.replaceChildren();
  siteData.webApps.forEach((app) => {
    const item = el("article", "web-app-card");
    item.id = webAppAnchor(app);

    const media = link("", app.href, "web-app-media");
    media.setAttribute("aria-label", `Open ${app.title}`);
    const image = el("img");
    image.src = localHref(app.thumbnail);
    image.alt = `${app.title} screenshot`;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      media.classList.add("is-missing");
      media.append(el("span", "web-app-missing", "Preview unavailable"));
    });
    media.append(image);

    const body = el("div", "web-app-body");
    const heading = el("p", "web-app-title");
    heading.append(link(app.title, app.href));
    body.append(
      el("p", "web-app-tag", app.tag),
      heading,
      localizedText("p", "web-app-summary", app.description, app.descriptionJa)
    );
    appendActionLinks(body, app.links || [["Open app", app.href]]);
    item.append(media, body);
    root.append(item);
  });
  applyLanguage(root);
}

function renderPaperRecord(paper, options = {}) {
  const showFigure = options.showFigure ?? true;
  const item = el("article", showFigure && paper.figure ? "publication-item has-figure" : "publication-item");
  item.id = paperAnchor(paper);
  const template = paperFigureTemplates[paper.figure];
  if (showFigure && template) {
    const figureButton = el("button", "publication-figure publication-figure-button");
    figureButton.type = "button";
    figureButton.setAttribute("aria-label", `Open diagram mode for ${paper.title}`);
    figureButton.innerHTML = template;
    applyFigureMarkerIds(figureButton, paper.figure, "paper-arrow");
    initializeGrundyFigures(figureButton, { autoplay: true, intervalMs: 1100 });
    initializeLawverePullbackFigures(figureButton, { autoplay: true });
    initializeConnectedCorrespondenceFigures(figureButton, { autoplay: true });
    figureButton.addEventListener("click", () => openPaperDiagram(paper));
    item.append(figureButton);
  }

  const titleRow = el("div", "publication-title");
  const title = el("h3");
  title.append(link(paper.title, paper.link));
  titleRow.append(title);
  if (paper.year) titleRow.append(el("span", "publication-venue", paper.year));
  item.append(titleRow);

  const meta = el("div", "publication-meta");
  if (paper.publicationStatus) meta.append(el("span", "publication-status", paper.publicationStatus));
  const people = paperPeopleText(paper);
  if (people) meta.append(el("span", null, people));
  if (paper.venue) meta.append(el("span", null, paper.venue));
  paper.tags?.forEach((tag) => meta.append(el("span", null, tag)));
  if (meta.children.length) item.append(meta);
  if (paper.summary) item.append(el("p", "publication-summary", paper.summary));
  appendActionLinks(item, [...(paper.links || []), ...overleafActionLinks(paper, ["paper", "preprint"])]);
  return item;
}

function updatePaperViewButtons() {
  document.querySelectorAll("[data-paper-view]").forEach((button) => {
    const isActive = button.dataset.paperView === state.paperView;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function paperListingRecords() {
  return [
    ...siteData.papers.published.map((paper) => ({ ...paper, publicationStatus: "Published" })),
    ...siteData.papers.preprints.map((paper) => ({ ...paper, publicationStatus: "Preprint" }))
  ].sort((a, b) => {
    const yearA = Number(String(a.year || "").match(/\d{4}/)?.[0] || 0);
    const yearB = Number(String(b.year || "").match(/\d{4}/)?.[0] || 0);
    return yearB - yearA || a.title.localeCompare(b.title);
  });
}

function renderPapers() {
  const root = document.querySelector("#paper-list");
  if (!root) return;
  updatePaperViewButtons();
  stopGrundyFigures(root);
  stopLawverePullbackFigures(root);
  stopConnectedCorrespondenceFigures(root);
  root.replaceChildren();

  const filtered = paperListingRecords().filter((paper) => {
    const searchText = [paper.title, paper.authors, paper.venue, paper.year, paper.tags?.join(" "), paper.summary].join(" ");
    return matchesQuery(searchText, state.paperQuery);
  });

  if (!filtered.length) {
    root.append(el("p", "empty-state", "No papers match this filter."));
    applyLanguage(root);
    return;
  }
  filtered.forEach((paper) => root.append(renderPaperRecord(paper, { showFigure: state.paperView === "diagram" })));
  typesetMath(root);
  applyLanguage(root);
  scrollToHashTarget();
}

function renderPreparationPapers() {
  const root = document.querySelector("#preparation-paper-list");
  if (!root) return;
  root.replaceChildren();
  const filtered = siteData.papers.preparation.filter((title) => matchesQuery(title, state.paperQuery));
  if (!filtered.length) {
    root.append(el("p", "empty-state", "No papers match this filter."));
    applyLanguage(root);
    return;
  }
  filtered.forEach((title) => {
    const item = el("article", "publication-item publication-item-compact");
    const heading = el("h3");
    heading.innerHTML = title;
    const meta = el("div", "publication-meta");
    meta.append(el("span", "publication-status", "In preparation"));
    item.append(heading, meta);
    root.append(item);
  });
  typesetMath(root);
  applyLanguage(root);
}

function renderHomePapers() {
  const root = document.querySelector("#home-paper-list");
  if (!root) return;
  stopGrundyFigures(root);
  stopLawverePullbackFigures(root);
  stopConnectedCorrespondenceFigures(root);
  root.replaceChildren();
  paperListingRecords().slice(0, 4).forEach((paper) => root.append(renderPaperRecord(paper)));
  typesetMath(root);
}

function renderMiscPapers() {
  const root = document.querySelector("#misc-paper-list");
  if (!root) return;
  root.replaceChildren();
  siteData.papers.misc.forEach((paper) => {
    const item = el("article", "publication-item");
    const row = el("div", "publication-title");
    const heading = el("h3");
    heading.append(link(paper.title, paper.link));
    row.append(heading, el("span", "publication-venue", paper.year));
    item.append(row);
    const meta = el("div", "publication-meta");
    const people = paperPeopleText(paper);
    if (people) meta.append(el("span", null, people));
    if (meta.children.length) item.append(meta);
    item.append(el("p", "publication-summary", paper.venue));
    root.append(item);
  });
}

function researchmapPaperRecord(record) {
  return {
    title: record.title,
    authors: record.authors,
    venue: record.venue || "researchmap",
    year: record.year,
    link: record.link,
    tags: compactText([record.type, record.openAccess ? "open access" : "researchmap"]),
    links: record.links
  };
}

function renderResearchmapPapers() {
  const root = document.querySelector("#researchmap-paper-list");
  if (!root) return;
  root.replaceChildren();
  const records = researchmapData?.papers || [];
  if (!records.length) {
    root.append(el("p", "empty-state", "No generated researchmap paper data is available yet."));
    return;
  }
  records.forEach((record) => root.append(renderPaperRecord(researchmapPaperRecord(record))));
  typesetMath(root);
}

function renderTalkItem(record, href, metaText, actions = []) {
  const item = el("li");
  const shell = el("div", "talk-item-shell");
  const preview = talkThumbnail(record);

  if (preview) {
    const thumb = link("", preview.href, "talk-thumb");
    thumb.setAttribute("aria-label", `Open slides for ${record.title}`);
    const image = el("img");
    image.src = preview.src;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => thumb.remove());
    thumb.append(image);
    shell.append(thumb);
    item.classList.add("has-thumbnail");
  }

  const body = el("div", "talk-item-body");
  const title = el("span", "talk-title");
  title.append(uiIcon("talk", "talk-title-icon"));
  if (href) title.append(link(record.title, href));
  else title.append(el("span", null, record.title));
  body.append(title, el("span", "talk-venue", metaText));
  if (actions.length) appendActionLinks(body, actions);
  shell.append(body);
  item.append(shell);
  return item;
}

function renderResearchmapPresentations() {
  const root = document.querySelector("#researchmap-presentation-list");
  if (!root) return;
  root.replaceChildren();
  const records = visiblePresentationRecords();

  if (!records.length) {
    root.append(el("p", "empty-state", "No talks match this filter."));
    return;
  }

  const groups = new Map();
  records.forEach((record) => {
    const year = record.year || "Undated";
    if (!groups.has(year)) groups.set(year, []);
    groups.get(year).push(record);
  });

  [...groups.entries()]
    .sort(([yearA], [yearB]) => String(yearB).localeCompare(String(yearA)))
    .forEach(([year, items]) => {
      const wrapper = el("article", "timeline-group");
      wrapper.append(el("div", "timeline-year", year));
      const list = el("ul", "talk-items");
      sortedPresentations(items)
        .reverse()
        .forEach((record) => {
        const item = renderTalkItem(record, record.link, presentationMeta(record), slideLinksForTalk(record));
        const key = talkRecordKey(record);
        item.id = talkRecordAnchor(record);
        item.classList.toggle("is-current", key === state.talkTimelineKey);
        list.append(item);
      });
      wrapper.append(list);
      root.append(wrapper);
    });
  scrollToHashTarget();
}

function renderResearchmapAwards() {
  const root = document.querySelector("#researchmap-award-list");
  if (!root) return;
  root.replaceChildren();
  root.classList.add("icon-list");
  const records = researchmapData?.awards || [];
  if (!records.length) {
    root.append(el("li", "empty-state", "No generated researchmap award data is available yet."));
    return;
  }
  records.forEach((record) => {
    const item = el("li", "icon-list-item");
    item.append(uiIcon("award", "list-item-icon"));
    const body = el("div", "icon-list-body");
    const text = compactText([record.date, record.title, record.association]).join(" - ");
    body.append(link(text, record.link));
    item.append(body);
    root.append(item);
  });
}

function renderResearchmapEducation() {
  const root = document.querySelector("#researchmap-education-list");
  if (!root) return;
  root.replaceChildren();
  root.classList.add("icon-list");
  const records = researchmapData?.education || [];
  if (!records.length) {
    root.append(el("li", "empty-state", "No generated researchmap education data is available yet."));
    return;
  }
  records.forEach((record) => {
    const item = el("li", "icon-list-item");
    item.append(uiIcon("education", "list-item-icon"));
    const body = el("div", "icon-list-body");
    const text = compactText([record.period, record.affiliation, record.department, record.course]).join(" - ");
    body.append(link(text, record.link));
    item.append(body);
    root.append(item);
  });
}

function renderTalks(limitSelector = "#talk-list") {
  const root = document.querySelector(limitSelector);
  if (!root) return;
  root.replaceChildren();
  let count = 0;
  const limit = Number(root.dataset.limit || 0);

  siteData.talks.forEach((group) => {
    const filtered = group.items.filter((talk) => {
      const presentationRecord = findResearchmapPresentationForTalk(talk);
      return matchesQuery(
        `${group.year} ${talk.title} ${talk.venue} ${presentationPeopleText(presentationRecord || talk)}`,
        state.talkQuery
      );
    });
    const remaining = limit ? Math.max(limit - count, 0) : filtered.length;
    const visible = filtered.slice(0, remaining);
    if (!visible.length) return;

    count += visible.length;
    const wrapper = el("article", "timeline-group");
    wrapper.append(el("div", "timeline-year", group.year));
    const list = el("ul", "talk-items");
    visible.forEach((talk) => {
      const presentationRecord = findResearchmapPresentationForTalk(talk);
      const item = renderTalkItem(
        presentationRecord || talk,
        talk.href,
        compactText([presentationPeopleText(presentationRecord || talk), talk.venue]).join(" / "),
        slideLinksForTalk(presentationRecord || talk)
      );
      list.append(item);
    });
    wrapper.append(list);
    root.append(wrapper);
  });

  if (!count) root.append(el("p", "empty-state", "No talks match this filter."));
}

function updateSelectOptions(select, options, selected) {
  if (!select) return selected;
  const values = options.map(([value]) => value);
  const nextSelected = values.includes(selected) ? selected : "all";
  const signature = JSON.stringify(options);
  if (select.dataset.optionSignature !== signature) {
    select.replaceChildren(
      ...options.map(([value, label]) => {
        const option = el("option", null, label);
        option.value = value;
        return option;
      })
    );
    select.dataset.optionSignature = signature;
  }
  select.value = nextSelected;
  return nextSelected;
}

function renderNoteFilters(allRecords, shownCount) {
  const input = document.querySelector("#note-filter");
  if (input && input.value !== state.noteQuery) input.value = state.noteQuery;

  const languages = Array.from(new Set(allRecords.map(noteLanguageKey))).sort((a, b) => {
    const order = ["English", "Japanese", "Document", "Other"];
    const aIndex = order.includes(a) ? order.indexOf(a) : order.length;
    const bIndex = order.includes(b) ? order.indexOf(b) : order.length;
    return aIndex - bIndex || a.localeCompare(b);
  });
  state.noteLanguage = updateSelectOptions(
    document.querySelector("#note-language-filter"),
    [["all", "All languages"], ...languages.map((language) => [language, language])],
    state.noteLanguage
  );

  const yearKeys = Array.from(new Set(allRecords.map(noteYearKey)));
  const datedYears = yearKeys
    .filter((year) => year !== "undated")
    .sort((a, b) => Number(b) - Number(a));
  if (yearKeys.includes("undated")) datedYears.push("undated");
  state.noteYear = updateSelectOptions(
    document.querySelector("#note-year-filter"),
    [["all", "All years"], ...datedYears.map((year) => [year, year === "undated" ? "Undated" : year])],
    state.noteYear
  );

  const themes = Array.from(new Set(allRecords.map(noteTheme))).sort((a, b) => {
    const aIndex = noteThemeOrder.includes(a) ? noteThemeOrder.indexOf(a) : noteThemeOrder.length;
    const bIndex = noteThemeOrder.includes(b) ? noteThemeOrder.indexOf(b) : noteThemeOrder.length;
    return aIndex - bIndex || noteThemeLabel(a).localeCompare(noteThemeLabel(b));
  });
  state.noteTheme = updateSelectOptions(
    document.querySelector("#note-theme-filter"),
    [["all", "All themes"], ...themes.map((theme) => [theme, noteThemeLabel(theme)])],
    state.noteTheme
  );

  const count = document.querySelector("#note-filter-count");
  if (count) {
    delete count.dataset.i18nOriginalText;
    count.textContent = `Showing ${shownCount} / ${allRecords.length} notes`;
  }
}

function renderNotes() {
  const root = document.querySelector("#notes-list");
  if (!root) return;
  root.replaceChildren();
  const limit = Number(root.dataset.limit || 0);
  const allRecords = sortedNoteRecords([...overleafNoteRecords(), ...siteData.notes]);
  const filteredRecords = allRecords.filter(noteMatchesFilters);
  const records = limit ? filteredRecords.slice(0, limit) : filteredRecords;

  renderNoteFilters(allRecords, records.length);

  if (!records.length) {
    root.append(el("p", "empty-state", "No notes match this filter."));
    applyLanguage(document.querySelector("[data-page='notes']") || root);
    return;
  }

  records.forEach((note) => {
    const item = el("article", "note-item");
    const [kind, kindLabel, kindIcon] = noteKind(note);
    item.id = noteAnchor(note);
    item.append(noteThumbnail(note));
    const heading = el("h3");
    heading.append(link(shortNoteTitle(note), note.href));
    item.append(heading);
    if (note.description) item.append(el("p", null, note.description));
    const meta = el("div", "note-meta");
    if (kind === "cloud" || kind === "pen") {
      const badge = el("span", `note-kind-badge note-${kind}-badge`, kindLabel);
      badge.dataset.icon = kindIcon || (kind === "cloud" ? "☁︎" : "🖊️");
      meta.append(badge);
    }
    const dateLabel = noteDateLabel(note);
    if (dateLabel) meta.append(el("span", null, dateLabel));
    meta.append(el("span", null, noteLanguageKey(note)), el("span", null, note.file));
    item.append(meta);
    const actions = [["Open", note.href]];
    if (note.download) actions.push(["Download", note.download]);
    appendActionLinks(item, actions);
    root.append(item);
  });
  applyLanguage(document.querySelector("[data-page='notes']") || root);
  scrollToHashTarget();
}

function speculativePostAnchor(post) {
  return `speculative-${slugify(post.slug || post.title)}`;
}

function speculativePostStatus(status) {
  if (status === "cloud" || status === "speculative") return "☁︎ Speculative";
  if (status === "draft") return "Draft";
  return status || "Note";
}

function sortedSpeculativePosts() {
  return [...(siteData.speculativeNotes || [])].sort((a, b) => {
    return String(b.date || "").localeCompare(String(a.date || "")) || String(a.title).localeCompare(String(b.title));
  });
}

function speculativePostSearchText(post) {
  return compactText([
    post.slug,
    post.date,
    post.updated,
    post.title,
    post.status,
    post.abstract,
    ...(post.tags || []),
    ...(post.paragraphs || []),
    ...(post.questions || []),
    ...(post.links || []).map(([label]) => label)
  ]).join(" ");
}

function visibleSpeculativePosts() {
  const tokens = siteSearchTokens(state.speculativeQuery);
  if (!tokens.length) return sortedSpeculativePosts();
  return sortedSpeculativePosts().filter((post) => {
    const text = simplified(speculativePostSearchText(post));
    return tokens.every((token) => text.includes(token));
  });
}

function renderSpeculativeIndex(posts) {
  const root = document.querySelector("#speculative-index");
  if (!root) return;
  root.replaceChildren();
  if (!posts.length) {
    root.append(el("p", "empty-state", state.speculativeQuery ? "No speculative notes match this search." : "No speculative notes yet."));
    return;
  }

  const list = el("ol", "speculative-index-list");
  posts.forEach((post) => {
    const item = el("li");
    item.append(link(post.title, `#${speculativePostAnchor(post)}`), el("span", null, post.date || "Undated"));
    list.append(item);
  });
  root.append(list);
}

function renderSpeculativePost(post) {
  const article = el("article", "speculative-post");
  article.id = speculativePostAnchor(post);

  const head = el("div", "speculative-post-head");
  const title = el("h2");
  title.append(link(post.title, `#${article.id}`));
  head.append(el("p", "speculative-date", post.date || "Undated"), title);

  const meta = el("div", "speculative-meta");
  meta.append(el("span", "speculative-status", speculativePostStatus(post.status)));
  if (post.updated) meta.append(el("span", null, `updated ${post.updated}`));
  (post.tags || []).forEach((tag) => meta.append(el("span", null, tag)));

  article.append(head, meta);
  if (post.abstract) article.append(el("p", "speculative-abstract", post.abstract));

  const body = el("div", "speculative-body");
  (post.paragraphs || []).forEach((paragraph) => body.append(el("p", null, paragraph)));
  if (post.questions?.length) {
    const questions = el("div", "speculative-questions");
    questions.append(el("h3", null, "Questions"));
    const list = el("ul");
    post.questions.forEach((question) => list.append(el("li", null, question)));
    questions.append(list);
    body.append(questions);
  }
  article.append(body);

  const actions = [];
  if (post.noteFile) {
    const noteHref = noteHrefByFile(post.noteFile);
    if (noteHref) actions.push(["Related note", noteHref]);
  }
  (post.links || []).forEach(([label, href]) => actions.push([label, localHref(href)]));
  appendActionLinks(article, actions);

  return article;
}

function renderSpeculativeNotes() {
  const root = document.querySelector("#speculative-posts");
  const input = document.querySelector("#speculative-filter");
  if (input && input.value !== state.speculativeQuery) input.value = state.speculativeQuery;
  const posts = visibleSpeculativePosts();
  renderSpeculativeIndex(posts);
  if (!root) return;
  root.replaceChildren();
  if (!posts.length) {
    root.append(el("p", "empty-state", state.speculativeQuery ? "No speculative notes match this search." : "No speculative notes yet."));
    applyLanguage(root);
    return;
  }
  posts.forEach((post) => root.append(renderSpeculativePost(post)));
  typesetMath(root);
  applyLanguage(root);
  scrollToHashTarget();
}

function activityAnchor(group, record, index) {
  return `activity-${slugify(compactText([group.title, index + 1, record.text]).join(" "))}`;
}

function renderActivities() {
  const root = document.querySelector("#activity-list");
  if (!root) return;
  root.replaceChildren();
  const limitGroups = Number(root.dataset.groups || 0);
  const groups = limitGroups ? siteData.activities.slice(0, limitGroups) : siteData.activities;

  groups.forEach((group) => {
    const column = el("article", "activity-column");
    column.append(el("h3", null, group.title));
    const list = el("ul");
    group.items.forEach((record, index) => {
      const item = el("li", "activity-list-item");
      item.id = activityAnchor(group, record, index);
      item.append(uiIcon(activityIconKey(group, record), "activity-item-icon"));
      const body = el("div", "activity-item-body");
      if (record.date) body.append(el("span", "activity-date", record.date));
      if (record.href) body.append(link(record.text, record.href));
      else body.append(record.text);
      item.append(body);
      list.append(item);
    });
    column.append(list);
    root.append(column);
  });
  scrollToHashTarget();
}

function renderPlans() {
  const root = document.querySelector("#home-plan-list");
  if (!root) return;
  root.replaceChildren();
  const plans = siteData.activities.find((group) => group.title === "Plans")?.items || [];

  if (!plans.length) {
    root.append(el("p", "empty-state", "No current plans listed."));
    return;
  }

  plans.forEach((record) => {
    const item = el("article", "plan-item");
    const heading = el("h3");
    if (record.href) heading.append(link(record.text, record.href));
    else heading.textContent = record.text;
    item.append(heading);
    root.append(item);
  });
}

function problemAnchor(problem) {
  return `problem-${problem.id}`;
}

function problemStatusLabel(status) {
  return problemStatuses[status] || status;
}

function problemSearchText(problem) {
  return compactText([
    problem.id,
    problem.status,
    problem.theme,
    problem.title,
    problem.statement,
    problem.description,
    ...(problem.tags || []),
    ...(problem.links || []).map(([label]) => label),
    ...(problem.trail || []).flatMap((record) => [record.label, record.note])
  ]).join(" ");
}

function problemMatches(problem) {
  const matchesStatus = state.problemStatus === "all" || problem.status === state.problemStatus;
  return matchesStatus && matchesQuery(problemSearchText(problem), state.problemQuery);
}

function problemLink(label, href, className) {
  return link(label, localHref(href), className);
}

function appendProblemActionLinks(parent, records) {
  if (!records || !records.length) return;
  const actions = el("div", "action-links");
  records.forEach(([label, href]) => actions.append(problemLink(label, href, "action-link")));
  parent.append(actions);
}

function renderProblemStatusTabs() {
  const root = document.querySelector("#problem-status-tabs");
  if (!root) return;
  root.replaceChildren();
  problemStatusOrder.forEach((status) => {
    const button = el("button", "tab-button", problemStatusLabel(status));
    button.type = "button";
    button.dataset.problemStatus = status;
    button.classList.toggle("is-active", state.problemStatus === status);
    button.addEventListener("click", () => {
      state.problemStatus = status;
      renderProblems();
    });
    root.append(button);
  });
}

function renderProblemStats(records) {
  const root = document.querySelector("#problem-stats");
  if (!root) return;
  root.replaceChildren();

  const counts = siteData.problems.reduce(
    (acc, problem) => {
      acc[problem.status] = (acc[problem.status] || 0) + 1;
      return acc;
    },
    { open: 0, question: 0, trail: 0, solved: 0 }
  );

  [
    [`${records.length}/${siteData.problems.length}`, "shown"],
    [counts.open, "formal"],
    [counts.question, "other questions"],
    [counts.trail, "trails"],
    [counts.solved, "solved notes"]
  ].forEach(([value, label]) => {
    const item = el("div", "problem-stat");
    item.append(el("strong", null, value), el("span", null, label));
    root.append(item);
  });
}

function renderProblemTrail(problem) {
  const trail = el("ol", "problem-trail-list");
  (problem.trail || []).forEach((record) => {
    const item = el("li");
    const title = el("strong");
    title.append(problemLink(record.label, record.href));
    item.append(title);
    if (record.note) item.append(el("p", null, record.note));
    trail.append(item);
  });
  return trail;
}

function renderProblemTags(problem) {
  const meta = el("div", "publication-meta");
  [problem.theme, ...(problem.tags || [])].forEach((tag) => meta.append(el("span", null, tag)));
  return meta;
}

function problemCommentsConfig() {
  return siteData.problemComments || {};
}

function problemCommentsReady() {
  const config = problemCommentsConfig();
  return Boolean(config.enabled && config.provider === "giscus" && config.repo && config.repoId && config.category && config.categoryId);
}

function problemDiscussionTerm(problem) {
  return `problem:${problem.id}`;
}

function discussionSearchUrl(problem) {
  const config = problemCommentsConfig();
  if (!config.repo) return "https://github.com";
  const term = encodeURIComponent(problemDiscussionTerm(problem));
  return `https://github.com/${config.repo}/discussions?discussions_q=${term}`;
}

function renderProblemCommentSetup(problem) {
  const config = problemCommentsConfig();
  const panel = el("div", "problem-comment-setup");
  panel.append(
    localizedText("h4", null, "Direct comment backend required", "直接コメント用バックエンドが必要です"),
    localizedText(
      "p",
      null,
      "The page-side comment box is already wired for giscus. After setup, visitors sign in with GitHub and comment directly on this page; no email form is involved.",
      "ページ上のコメント欄は giscus 用に実装済みです。設定後は訪問者が GitHub でサインインして、このページ上から直接コメントできます。メール送信ではありません。"
    ),
    localizedText(
      "p",
      null,
      "The current homepage repository is private and Discussions are disabled, so a public discussion repository or another backend is needed before comments can be saved.",
      "現在の homepage repository は private で Discussions も無効なので、コメントを保存するには public な discussion repository か別のバックエンドが必要です。"
    )
  );

  const steps = el("ol");
  [
    [
      "Create or choose a public GitHub repository dedicated to comments.",
      "コメント専用の public GitHub repository を作成または選択する。"
    ],
    [
      "Enable Discussions and create a category for problem discussions.",
      "Discussions を有効化し、problem discussions 用の category を作る。"
    ],
    [
      "Install the giscus app for that repository and copy repoId/categoryId into siteData.problemComments.",
      "その repository に giscus app を入れ、repoId/categoryId を siteData.problemComments に入れる。"
    ],
    [
      "Moderate or delete comments from GitHub Discussions with repository owner permissions.",
      "repository owner 権限で GitHub Discussions からコメントを管理・削除する。"
    ]
  ].forEach(([en, ja]) => steps.append(localizedText("li", null, en, ja)));
  panel.append(steps);

  const actions = el("div", "action-links");
  actions.append(
    link("giscus setup", "https://giscus.app", "action-link"),
    link("Current repo settings", "https://github.com/hora-algebra/ryuya-hora-homepage/settings", "action-link")
  );
  if (config.repo) actions.append(link("Future thread search", discussionSearchUrl(problem), "action-link"));
  panel.append(actions);
  return panel;
}

function renderGiscusWidget(problem) {
  const config = problemCommentsConfig();
  const wrapper = el("div", "problem-comments-widget");
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.setAttribute("data-repo", config.repo);
  script.setAttribute("data-repo-id", config.repoId);
  script.setAttribute("data-category", config.category);
  script.setAttribute("data-category-id", config.categoryId);
  script.setAttribute("data-mapping", "specific");
  script.setAttribute("data-term", problemDiscussionTerm(problem));
  script.setAttribute("data-strict", config.strict || "1");
  script.setAttribute("data-reactions-enabled", config.reactionsEnabled || "1");
  script.setAttribute("data-emit-metadata", config.emitMetadata || "0");
  script.setAttribute("data-input-position", config.inputPosition || "bottom");
  script.setAttribute("data-theme", config.theme || "preferred_color_scheme");
  script.setAttribute("data-lang", config.lang || "en");
  script.setAttribute("data-loading", "lazy");
  wrapper.append(script);
  return wrapper;
}

function renderProblemComments(problem) {
  const section = el("section", "problem-comments");
  const head = el("div", "problem-comments-head");
  head.append(
    el("h3", "problem-comments-title", "Comments"),
    localizedText(
      "p",
      "problem-comments-note",
      "Visitors can comment directly on this problem page after signing in with GitHub. Each problem has a separate discussion thread.",
      "訪問者は GitHub でサインインしたあと、この問題ページ上から直接コメントできます。各問題には別々の discussion thread を持たせます。"
    )
  );
  section.append(head);

  if (!problemCommentsReady()) {
    section.append(
      localizedText(
        "p",
        "problem-comment-state",
        "Comment backend is not configured yet.",
        "コメント用バックエンドはまだ未設定です。"
      ),
      renderProblemCommentSetup(problem)
    );
    return section;
  }

  section.append(renderGiscusWidget(problem));
  const admin = el("p", "problem-comment-admin");
  admin.append(
    localizedText(
      "span",
      "problem-comment-admin-label",
      "Manage or delete comments from GitHub Discussions:",
      "コメントの管理・削除は GitHub Discussions から行えます:"
    ),
    document.createTextNode(" "),
    link(problemDiscussionTerm(problem), discussionSearchUrl(problem))
  );
  section.append(admin);
  return section;
}

function renderProblemFeature(problem) {
  const root = document.querySelector("#problem-feature");
  if (!root) return;
  root.replaceChildren();

  if (!problem) {
    root.append(el("p", "empty-state", "No problem matches the current filter."));
    return;
  }

  const heading = el("div", "problem-feature-head");
  const title = el("div");
  const status = el("span", `problem-badge status-${problem.status}`, problemStatusLabel(problem.status));
  title.append(el("p", "problem-id", problem.id), el("h2", null, problem.title));
  heading.append(title, status);

  const statement = el("p", "problem-statement", problem.statement);
  const details = el("div", "problem-detail-grid");
  details.append(
    el("p", "publication-summary", problem.description),
    el("p", "problem-updated", `Last reviewed: ${problem.updated}`)
  );

  const direct = [["Permalink", `#${problemAnchor(problem)}`]];
  const marker = el("span", "problem-anchor-marker");
  marker.id = problemAnchor(problem);
  root.append(marker, heading, statement, renderProblemTags(problem), details);
  appendProblemActionLinks(root, [...(problem.links || []), ...direct]);
  if ((problem.trail || []).length) {
    const trailBlock = el("div", "problem-trail");
    trailBlock.append(el("h3", null, "Reference Trail"), renderProblemTrail(problem));
    root.append(trailBlock);
  }
  root.append(renderProblemComments(problem));
  typesetMath(root);
}

function renderProblemCard(problem) {
  const card = el("article", `problem-card status-${problem.status}`);
  card.classList.toggle("is-selected", problem.id === state.selectedProblemId);
  card.tabIndex = 0;
  card.dataset.problemSelect = problem.id;
  card.setAttribute("role", "button");
  card.setAttribute("aria-pressed", String(problem.id === state.selectedProblemId));
  card.addEventListener("click", () => setSelectedProblem(problem.id));
  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setSelectedProblem(problem.id);
  });

  const head = el("div", "problem-card-head");
  head.append(el("span", "problem-id", problem.id), el("span", `problem-badge status-${problem.status}`, problemStatusLabel(problem.status)));

  card.append(
    head,
    el("h3", null, problem.title),
    el("p", "problem-card-statement", problem.statement),
    renderProblemTags(problem)
  );
  return card;
}

function setSelectedProblem(problemId, shouldScroll = false) {
  const problem = siteData.problems.find((record) => record.id === problemId);
  if (!problem) return;
  state.selectedProblemId = problem.id;
  if (globalThis.history?.replaceState) {
    globalThis.history.replaceState(null, "", `#${problemAnchor(problem)}`);
  }
  renderProblems();
  if (shouldScroll) document.querySelector("#problem-feature")?.scrollIntoView({ block: "start", behavior: "smooth" });
}

function randomProblem(mode = "any") {
  const visible = siteData.problems.filter(problemMatches);
  let pool = visible.length ? visible : siteData.problems;
  if (mode === "open") {
    const queryMatchedOpen = siteData.problems.filter(
      (problem) => problem.status === "open" && matchesQuery(problemSearchText(problem), state.problemQuery)
    );
    pool = queryMatchedOpen.length ? queryMatchedOpen : siteData.problems.filter((problem) => problem.status === "open");
    state.problemStatus = "open";
  }
  if (!pool.length) return;
  const problem = pool[Math.floor(Math.random() * pool.length)];
  setSelectedProblem(problem.id, true);
}

function initialProblemFromHash() {
  const hash = decodeURIComponent(globalThis.location?.hash?.slice(1) || "");
  return siteData.problems.find((problem) => hash === problemAnchor(problem) || hash === problem.id);
}

function renderProblems() {
  const root = document.querySelector("#problem-list");
  if (!root) return;

  if (!state.selectedProblemId) {
    state.selectedProblemId = initialProblemFromHash()?.id || siteData.problems[0]?.id || "";
  }

  renderProblemStatusTabs();
  const records = siteData.problems.filter(problemMatches);
  const selected =
    records.find((problem) => problem.id === state.selectedProblemId) ||
    siteData.problems.find((problem) => problem.id === state.selectedProblemId) ||
    records[0] ||
    null;

  if (selected) state.selectedProblemId = selected.id;
  renderProblemStats(records);
  renderProblemFeature(selected);

  root.replaceChildren();
  if (!records.length) {
    root.append(el("p", "empty-state", "No problems match this filter."));
    return;
  }

  records.forEach((problem) => root.append(renderProblemCard(problem)));
  typesetMath(root);
}

function renderLinks() {
  const root = document.querySelector("#link-list");
  if (!root) return;
  root.replaceChildren();
  siteData.links.forEach((group) => {
    const column = el("article", "link-column");
    column.append(el("h3", null, group.title));
    const list = el("ul");
    group.items.forEach(([label, href]) => {
      const item = el("li", "icon-list-item");
      item.append(uiIcon(iconKeyForLink(label, href, group.title), "list-item-icon"));
      const body = el("div", "icon-list-body");
      body.append(link(label, href));
      item.append(body);
      list.append(item);
    });
    column.append(list);
    root.append(column);
  });
}

function favoriteToposFromHash() {
  const hash = decodeURIComponent(globalThis.location?.hash?.slice(1) || "");
  return siteData.favoriteTopoi.find((record) => hash === record.id || hash === slugify(record.title));
}

function selectedFavoriteTopos() {
  if (!state.favoriteToposId) {
    state.favoriteToposId = favoriteToposFromHash()?.id || siteData.favoriteTopoi[0]?.id || "";
  }
  return siteData.favoriteTopoi.find((record) => record.id === state.favoriteToposId) || siteData.favoriteTopoi[0];
}

function setFavoriteTopos(toposId) {
  const record = siteData.favoriteTopoi.find((topos) => topos.id === toposId);
  if (!record) return;
  state.favoriteToposId = record.id;
  if (globalThis.history?.replaceState && globalThis.location) {
    const url = new URL(globalThis.location.href);
    url.hash = record.id;
    globalThis.history.replaceState(null, "", url.href);
  }
  renderFavoriteTopoi();
}

function toposDiagramHtml(kind) {
  if (kind === "dynamics") {
    return `
      <svg viewBox="0 0 420 240" role="img" aria-label="Discrete dynamical system diagram">
        <path class="topos-orbit-line" d="M62 76 C128 36, 210 36, 276 76"></path>
        <path class="topos-orbit-line muted-line" d="M102 154 C156 202, 254 202, 316 154"></path>
        <g class="topos-node"><circle cx="62" cy="76" r="25"></circle><text x="62" y="82">x</text></g>
        <g class="topos-node"><circle cx="168" cy="52" r="25"></circle><text x="168" y="58">f(x)</text></g>
        <g class="topos-node"><circle cx="276" cy="76" r="25"></circle><text x="276" y="82">f²(x)</text></g>
        <g class="topos-node warm"><circle cx="102" cy="154" r="24"></circle><text x="102" y="160">h</text></g>
        <g class="topos-node warm"><circle cx="316" cy="154" r="24"></circle><text x="316" y="160">p</text></g>
        <text class="topos-svg-label" x="196" y="117">height-period shadow</text>
      </svg>`;
  }

  if (kind === "sierpinski") {
    return `
      <svg viewBox="0 0 420 240" role="img" aria-label="Sierpinski topos diagram">
        <rect class="topos-open-box whole" x="52" y="45" width="140" height="130" rx="8"></rect>
        <rect class="topos-open-box part" x="84" y="84" width="76" height="58" rx="8"></rect>
        <text class="topos-svg-label large" x="122" y="116">U</text>
        <text class="topos-svg-label" x="122" y="194">U ⊂ X</text>
        <path class="topos-arrow" d="M225 78 L330 78"></path>
        <path class="topos-arrow" d="M330 150 L225 150"></path>
        <text class="topos-svg-label" x="278" y="61">arrow</text>
        <g class="topos-node"><circle cx="225" cy="78" r="24"></circle><text x="225" y="84">A</text></g>
        <g class="topos-node accent"><circle cx="330" cy="78" r="24"></circle><text x="330" y="84">B</text></g>
        <text class="topos-svg-label" x="278" y="175">truth opens</text>
      </svg>`;
  }

  if (kind === "presheaf") {
    return `
      <svg viewBox="0 0 420 240" role="img" aria-label="Presheaf topos diagram">
        <g class="topos-node"><circle cx="84" cy="66" r="24"></circle><text x="84" y="72">c</text></g>
        <g class="topos-node"><circle cx="190" cy="124" r="24"></circle><text x="190" y="130">d</text></g>
        <g class="topos-node"><circle cx="84" cy="182" r="24"></circle><text x="84" y="188">e</text></g>
        <path class="topos-arrow" d="M108 78 L166 111"></path>
        <path class="topos-arrow" d="M108 174 L166 137"></path>
        <rect class="topos-set-box" x="258" y="44" width="92" height="44" rx="8"></rect>
        <rect class="topos-set-box" x="258" y="105" width="92" height="44" rx="8"></rect>
        <rect class="topos-set-box" x="258" y="166" width="92" height="44" rx="8"></rect>
        <text class="topos-svg-label" x="304" y="72">F(c)</text>
        <text class="topos-svg-label" x="304" y="133">F(d)</text>
        <text class="topos-svg-label" x="304" y="194">F(e)</text>
        <path class="topos-arrow muted-arrow" d="M304 98 L304 91"></path>
        <path class="topos-arrow muted-arrow" d="M304 159 L304 152"></path>
      </svg>`;
  }

  if (kind === "automata") {
    return `
      <svg viewBox="0 0 420 240" role="img" aria-label="Topos of automata diagram">
        <g class="topos-node"><circle cx="82" cy="122" r="26"></circle><text x="82" y="128">q₀</text></g>
        <g class="topos-node accent"><circle cx="198" cy="76" r="26"></circle><text x="198" y="82">q₁</text></g>
        <g class="topos-node warm"><circle cx="198" cy="168" r="26"></circle><text x="198" y="174">q₂</text></g>
        <path class="topos-arrow" d="M108 113 L172 87"></path>
        <path class="topos-arrow" d="M108 131 L172 157"></path>
        <path class="topos-arrow muted-arrow" d="M224 76 C296 76, 318 118, 268 148"></path>
        <rect class="topos-language-strip" x="286" y="52" width="84" height="136" rx="10"></rect>
        <text class="topos-svg-label" x="328" y="92">Σ*</text>
        <text class="topos-svg-label" x="328" y="128">L</text>
        <text class="topos-svg-label" x="328" y="164">R</text>
      </svg>`;
  }

  return `
    <svg viewBox="0 0 420 240" role="img" aria-label="Effective topos diagram">
      <rect class="topos-set-box wide" x="52" y="54" width="116" height="132" rx="10"></rect>
      <rect class="topos-set-box warm" x="252" y="54" width="116" height="132" rx="10"></rect>
      <path class="topos-arrow" d="M168 94 C206 70, 216 70, 252 94"></path>
      <path class="topos-arrow muted-arrow" d="M252 146 C216 170, 206 170, 168 146"></path>
      <text class="topos-svg-label large" x="110" y="103">proof</text>
      <text class="topos-svg-label" x="110" y="137">realizer</text>
      <text class="topos-svg-label large" x="310" y="103">truth</text>
      <text class="topos-svg-label" x="310" y="137">program</text>
      <g class="topos-spark"><circle cx="210" cy="120" r="18"></circle><text x="210" y="126">λ</text></g>
    </svg>`;
}

function toposDiagram(kind, title) {
  const figure = el("figure", "topos-diagram");
  figure.setAttribute("aria-label", title);
  figure.innerHTML = toposDiagramHtml(kind);
  return figure;
}

function renderToposActions(parent, records) {
  if (!records || !records.length) return;
  const actions = el("div", "action-links topos-card-links");
  records.forEach(([label, href]) => actions.append(link(label, localHref(href), "action-link")));
  parent.append(actions);
}

function renderFavoriteToposCard(topos) {
  const card = el("article", "topos-card");
  card.classList.toggle("is-selected", topos.id === state.favoriteToposId);

  const button = el("button", "topos-card-main");
  button.type = "button";
  button.dataset.toposId = topos.id;
  button.setAttribute("aria-pressed", String(topos.id === state.favoriteToposId));
  button.setAttribute("aria-label", `Focus this topos: ${topos.title}`);
  button.addEventListener("click", () => setFavoriteTopos(topos.id));

  const formula = el("p", "topos-formula", topos.formula);
  button.append(
    localizedText("p", "topos-card-kicker", topos.subtitle, topos.subtitleJa),
    el("h3", null, topos.title),
    formula,
    toposDiagram(topos.diagram, topos.title),
    localizedText("p", "topos-card-summary", topos.summary, topos.summaryJa)
  );

  card.append(button);
  renderToposActions(card, topos.links);
  return card;
}

function renderFavoriteToposFocus(topos) {
  const root = document.querySelector("#favorite-topoi-focus");
  if (!root || !topos) return;
  root.replaceChildren();

  const header = el("div", "topos-focus-head");
  header.append(
    el("p", "section-kicker", "Focus"),
    el("h2", null, topos.title),
    localizedText("p", "topos-focus-subtitle", topos.subtitle, topos.subtitleJa),
    el("p", "topos-formula", topos.formula)
  );

  const detail = el("dl", "topos-detail");
  (topos.details || []).forEach((item) => {
    detail.append(localizedText("dt", null, item.label, item.labelJa), localizedText("dd", null, item.value, item.valueJa));
  });

  const why = el("div", "topos-why");
  why.append(el("h3", null, "Why it is good"), localizedText("p", "topos-card-reason", topos.why, topos.whyJa));

  const dictionary = el("div", "topos-dictionary");
  dictionary.append(el("h3", null, "Basic dictionary"), detail);

  root.append(header, toposDiagram(topos.diagram, `${topos.title} focus diagram`), localizedText("p", "topos-focus-summary", topos.summary, topos.summaryJa), why, dictionary);
  renderToposActions(root, topos.links);
  typesetMath(root);
}

function renderFavoriteTopoiComparison() {
  const root = document.querySelector("#favorite-topoi-comparison");
  if (!root) return;
  root.replaceChildren();

  siteData.favoriteTopoi.forEach((topos) => {
    const row = el("article", "topos-comparison-row");
    row.append(
      el("h3", "topos-comparison-heading", topos.title),
      el("p", "topos-comparison-formula", topos.formula),
      localizedText("p", "topos-comparison-cell", topos.subtitle, topos.subtitleJa),
      localizedText("p", "topos-comparison-cell", topos.why, topos.whyJa)
    );
    root.append(row);
  });
  typesetMath(root);
}

function renderFavoriteTopoi() {
  const root = document.querySelector("#favorite-topoi-list");
  if (!root) return;

  const selected = selectedFavoriteTopos();
  if (selected) state.favoriteToposId = selected.id;

  root.replaceChildren();
  siteData.favoriteTopoi.forEach((topos) => root.append(renderFavoriteToposCard(topos)));
  renderFavoriteToposFocus(selected);
  renderFavoriteTopoiComparison();
  typesetMath(root);
  applyLanguage(document.querySelector("[data-page='favorite-topoi']") || document.body);
}

function setupInteractions() {
  const paperFilter = document.querySelector("#paper-filter");
  if (paperFilter) {
    paperFilter.addEventListener("input", (event) => {
      state.paperQuery = event.target.value;
      renderPapers();
      renderPreparationPapers();
    });
  }

  document.querySelectorAll("[data-paper-view]").forEach((button) => {
    button.addEventListener("click", () => {
      state.paperView = button.dataset.paperView === "diagram" ? "diagram" : "list";
      renderPapers();
    });
  });

  const talkFilter = document.querySelector("#talk-filter");
  if (talkFilter) {
    talkFilter.addEventListener("input", (event) => {
      state.talkQuery = event.target.value;
      renderTalkTimeline();
      renderTalkMap();
      renderTalks();
      renderResearchmapPresentations();
    });
  }

  const noteFilter = document.querySelector("#note-filter");
  if (noteFilter) {
    noteFilter.addEventListener("input", (event) => {
      state.noteQuery = event.target.value;
      renderNotes();
    });
  }

  const noteLanguageFilter = document.querySelector("#note-language-filter");
  if (noteLanguageFilter) {
    noteLanguageFilter.addEventListener("change", (event) => {
      state.noteLanguage = event.target.value;
      renderNotes();
    });
  }

  const noteYearFilter = document.querySelector("#note-year-filter");
  if (noteYearFilter) {
    noteYearFilter.addEventListener("change", (event) => {
      state.noteYear = event.target.value;
      renderNotes();
    });
  }

  const noteThemeFilter = document.querySelector("#note-theme-filter");
  if (noteThemeFilter) {
    noteThemeFilter.addEventListener("change", (event) => {
      state.noteTheme = event.target.value;
      renderNotes();
    });
  }

  document.querySelectorAll("[data-talk-timeline]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.talkTimeline;
      if (action === "prev") stepTalkTimeline(-1);
      if (action === "next") stepTalkTimeline(1);
    });
  });

  const themeReset = document.querySelector("[data-theme-reset]");
  if (themeReset) {
    themeReset.addEventListener("click", () => setResearchTheme(""));
  }

  const problemFilter = document.querySelector("#problem-filter");
  if (problemFilter) {
    problemFilter.addEventListener("input", (event) => {
      state.problemQuery = event.target.value;
      renderProblems();
    });
  }

  const siteSearchInput = document.querySelector("#site-search-input");
  if (siteSearchInput) {
    siteSearchInput.addEventListener("input", (event) => {
      state.siteSearchQuery = event.target.value;
      syncSiteSearchUrl();
      renderSiteSearch();
    });
  }

  const speculativeFilter = document.querySelector("#speculative-filter");
  if (speculativeFilter) {
    speculativeFilter.addEventListener("input", (event) => {
      state.speculativeQuery = event.target.value;
      renderSpeculativeNotes();
    });
  }

  document.querySelectorAll("[data-problem-random]").forEach((button) => {
    button.addEventListener("click", () => randomProblem(button.dataset.problemRandom));
  });

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".site-nav");
  if (!menuButton || !nav) return;
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

setupLanguage();
renderProfileLinks();
renderTopics();
renderCurrentPositions();
renderLinkedList("#past-position-list", siteData.pastPositions);
renderLinkedList("#award-list", siteData.awards);
renderLinkedList("#education-list", siteData.education);
renderExplore();
renderWebApps();
renderResearchMap();
renderHomeTimeline();
renderPaperTimeline();
renderCategoriesTokyoMap();
renderPapers();
renderPreparationPapers();
renderHomePapers();
renderMiscPapers();
renderResearchmapPapers();
renderTalks();
renderTalks("#home-talk-list");
renderTalkTimeline();
renderTalkMap();
renderResearchmapPresentations();
renderNotes();
renderSpeculativeNotes();
renderActivities();
renderPlans();
renderProblems();
renderSiteSearch();
renderLinks();
renderFavoriteTopoi();
renderResearchmapAwards();
renderResearchmapEducation();
setupInteractions();
applyLanguage();
