const paths = {
  googleSite: "https://sites.google.com/view/ryuya-hora",
  notes: "https://sites.google.com/view/ryuya-hora/notes",
  problems: "https://sites.google.com/view/ryuya-hora/problems"
};

const siteData = {
  pages: [
    {
      title: "Papers",
      href: "papers/index.html",
      description: "Published papers, preprints, manuscripts in preparation, and related references."
    },
    {
      title: "Talks",
      href: "talks/index.html",
      description: "Conference talks, seminars, workshop presentations, and selected recordings."
    },
    {
      title: "Notes",
      href: "notes/index.html",
      description: "Lecture notes, slides, speculative notes, and teaching material."
    },
    {
      title: "Activities",
      href: "activities/index.html",
      description: "Research visits, organizing work, seminars, and academic activity by year."
    },
    {
      title: "CV/Awards",
      href: "cv/index.html",
      description: "Awards, education and outreach, teaching, and profile links."
    },
    {
      title: "Problems",
      href: "problems/index.html",
      description: "Open questions and reference trails around topoi, automata, and games."
    },
    {
      title: "Links",
      href: "links/index.html",
      description: "Friends, papers, books, events, and external profile pages."
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
    { text: "Assistant professor at ZEN University since April 2026.", href: "https://zen.ac.jp" },
    { text: "Researcher at the Humai Center since April 2026.", href: "https://zen.ac.jp/humai" },
    { text: "Supported by Grant-in-Aid for JSPS Fellows since April 2024.", href: "https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-24KJ0837/" },
    { text: "Founder and one of the organizers of Categories in Tokyo since 2024.", href: "https://sites.google.com/view/categoriesintokyo/%E3%83%9B%E3%83%BC%E3%83%A0" },
    { text: "Advisor to 角川ドワンゴ学園 研究部 since June 2025.", href: "https://nnn.ed.jp/attractiveness/extracurricular/club/kenkyubu/" },
    { text: "Tutor at Math Space Topos since July 2020.", href: "https://sites.google.com/view/mspacetopos/home" }
  ],
  pastPositions: [
    { text: "Research Associate at Centre for Topos Theory and its Applications, Paris, April-July 2025.", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
    { text: "Ph.D. student at Graduate School of Mathematical Sciences, The University of Tokyo, April 2024-March 2026.", href: "https://www.ms.u-tokyo.ac.jp/" },
    { text: "Graduate student supported by FoPM, October 2022-March 2024.", href: "https://www.s.u-tokyo.ac.jp/en/FoPM/" },
    { text: "Research Assistant at National Institute of Informatics, November 2020-March 2021.", href: "https://www.nii.ac.jp/en/" }
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
  papers: {
    published: [
      {
        title: "Internal Parameterizations of Hyperconnected Quotients",
        venue: "Theory and Applications of Categories 42(11), 263-313",
        year: "2024",
        link: "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html",
        figure: "internal-parameterizations",
        tags: ["topos theory", "local state classifier", "hyperconnected quotient"],
        links: [
          ["TAC", "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"],
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
        link: "https://doi.org/10.1016/j.jpaa.2024.107657",
        figure: "quotient-toposes",
        tags: ["discrete dynamical systems", "quotient toposes", "Lawvere problems"],
        links: [
          ["DOI", "https://doi.org/10.1016/j.jpaa.2024.107657"],
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
        link: "https://doi.org/10.1090/proc/17479",
        figure: "completely-connected",
        tags: ["completely connected topoi", "Grothendieck topoi"],
        links: [["DOI", "https://doi.org/10.1090/proc/17479"]],
        summary:
          "Studies completely connected topoi and gives a site characterization with examples."
      },
      {
        title: "Solution to Lawvere's first problem: a Grothendieck topos that has proper class many quotient topoi",
        authors: "with Yuhi Kamio",
        venue: "Advances in Mathematics 487, 110751",
        year: "2026",
        link: "https://doi.org/10.1016/j.aim.2025.110751",
        figure: "lawvere-first",
        tags: ["Lawvere problems", "quotient topoi", "Grothendieck topoi"],
        links: [
          ["DOI", "https://doi.org/10.1016/j.aim.2025.110751"],
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
      "Topoi of automata III: Geometry of Sigma-sets",
      "Dynamical systems on pretopological spaces",
      "An enriched-categorical origin of epsilon-transition",
      "Category Theoretic Ordinal Invariants",
      "Totally disconnected topoi",
      "A topos-theoretic view on Gabriel's theorem",
      "The lattice of hyperconnected quotients is a module of the semiring of productive weak topologies",
      "On limits in FinSet",
      "Twisted Regular Tetrahedra and Eisenstein Integers",
      "When do finite presheaves form a topos? (with Jeremie Marques)",
      "Local state classifier, permutation model, and the internal axiom of choice"
    ],
    misc: [
      {
        title: "準完全情報ニムとして見たWythoffのゲーム",
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
        { title: "Connectedness and full subcategories of topoi", venue: "Ph.D. thesis presentation, The University of Tokyo, 23 January", href: "https://www.ms.u-tokyo.ac.jp/seminar/thesispres/past.html" },
        { title: "Turning lights out with the Snake Lemma", venue: "20th CGP project, The University of Electro-Communications, 22 February", href: "http://www.alg.cei.uec.ac.jp/itohiro/Games/" },
        { title: "Measure-theoretic closure operators on formal languages", venue: "PPL 2026, Kagawa, 11 March", href: "https://jssst-ppl.org/workshop/2026/" },
        { title: "A space-time for Conway's game of life", venue: "CSCAT 2026, Fukui, 17 March", href: "https://www.kurims.kyoto-u.ac.jp/~tsanada/event/cscat2026.html" },
        { title: "A Rota-Baxter equation for winning games", venue: "Symposium on Differentiation in category theory and program semantics, Kyoto, 6 April", href: "https://sites.google.com/view/differential-kyoto-2026/home" }
      ]
    },
    {
      year: "2025",
      items: [
        { title: "Topoi of automata", venue: "CMUP SAL seminar, Porto University, online, 28 February", href: "https://www.cmup.pt/index.php/events/topoi-automata" },
        { title: "Topoi of automata", venue: "CSCAT 2025, Sojo University, Kumamoto, 12 March", href: "https://hisashi-aratake.gitlab.io/event/cscat2025.html" },
        { title: "Topoi of automata", venue: "Groupe de travail topossique, CTTA at Centre Lagrange, Paris, 30 April", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { title: "Topoi of automata", venue: "Categories for Automata and Language Theory, IRIF, Paris, 6 May", href: "https://autcat.github.io/" },
        { title: "Local state classifier for algebraic language theory", venue: "Groupe de travail topossique, CTTA, Paris, 16 May", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { title: "Local state classifier for automata theory", venue: "Semantique seminar, IRIF, Paris, 27 May", href: "https://www.irif.fr/seminaires/semantique/index" },
        { title: "A topos for regular language theory", venue: "Theoretical Cosynus Seminar, Ecole polytechnique, 11 June", href: "https://www.lix.polytechnique.fr/proofs-algorithms/tcs/" },
        { title: "Topoi of automata", venue: "CT2025, Brno, 17 July", href: "https://conference.math.muni.cz/ct2025/" },
        { title: "Topoi of automata", venue: "SLACS2025, Akita, 31 October", href: "https://sites.google.com/view/slacs2025akita/home" },
        { title: "Connectedness and full subcategories of topoi", venue: "UTokyo Logic seminar, Tokyo, 28 November", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic_e/index_e.html" },
        { title: "The axiom of choice and local state classifier", venue: "UTokyo Logic seminar, Tokyo, 5 December", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic/" }
      ]
    },
    {
      year: "2024",
      items: [
        { title: "Combinatorial games as recursive coalgebras", venue: "CSCAT2024, Chiba University, 15 March", href: "https://sites.google.com/faculty.gs.chiba-u.jp/cscat2024/home" },
        { title: "Introduction to topos theory", venue: "代数トポロジー若手の会, Nagoya University, 16 March" },
        { title: "圏論の利用と濫用", venue: "18th AFSA Colloquium, NII Kanda-Lab, Tokyo, 25 April", href: "https://afsa.jp/g-en/" },
        { title: "Quotient toposes of discrete dynamical systems", venue: "CT2024, Santiago de Compostela, 28 June", href: "https://www.usc.gal/regaca/ct2024/" },
        { title: "Topos theory as a tool of automata theory", venue: "Young Automata Theorists Gathering in Japan, Akita, 29 August", href: "https://sites.google.com/view/ciaa-preworkshop/home" },
        { title: "The colimit of all monomorphisms classifies hyperconnected geometric morphisms", venue: "Toposes in Mondovi, 10 September", href: "https://ctta.igrothendieck.org/" },
        { title: "Quotient topoi and geometry of computation", venue: "AFSA area meeting, Tokyo, 30 November", href: "https://afsa.jp/afsa-2024_generalmeetingautumn/" }
      ]
    },
    {
      year: "2023",
      items: [
        { title: "Internal parameterization of hyperconnected quotients", venue: "CSCAT2023, Kyoto, 9 March", href: "https://sites.google.com/view/cscat2023" },
        { title: "Internal parameterization of hyperconnected quotients", venue: "Australia Category Seminar, online, 19 April", href: "http://web.science.mq.edu.au/groups/coact/seminar/" },
        { title: "Grundy Numbers and Categories", venue: "Japan Combinatorial Game Theory Mini-Workshops, NII, Tokyo, 12 May", href: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A#h.avbqzhxax0hj" },
        { title: "Internal parameterization of hyperconnected quotients", venue: "Category Theory 2023, Belgium, 6 July", href: "https://sites.uclouvain.be/ct2023/" },
        { title: "Category Theory and Combinatorial Game Theory", venue: "7th Japan Combinatorial Game Theory Conference, NII, Tokyo, 21 August", href: "https://sites.google.com/view/jcgtw/%E7%A0%94%E7%A9%B6%E9%9B%86%E4%BC%9A#h.57ljjdhlpx53" },
        { title: "Constructive mathematics and representation theory", venue: "数学基礎論若手の会2023, Chiba, 10 December", href: "https://sites.google.com/view/mlwakatenokai2023" }
      ]
    }
  ],
  notes: [
    { title: "Counting with Exponential of Groups", description: "An introduction to rieg theory", language: "English", file: "COUNTING_WITH_EXPONENTIAL_OF_GROUPS.pdf", href: paths.notes },
    { title: "Combinatorial games as recursive coalgebras", description: "Slides at CSCAT 2024", language: "English", file: "Hora_CSCAT2024.pdf", href: paths.notes },
    { title: "Cloud: Topos theoretic approach to representation theory", language: "English", file: "A_topos_theoretic_view_of_Gabriel_s_theorem-12.pdf", href: paths.notes },
    { title: "Cloud: What is the geometry behind Conway's game of life?", description: "A first step with a relative topos", language: "English", file: "Adv20241210_Dynamical_system_on_a_pretopological_space.pdf", href: paths.notes },
    { title: "Topoi of automata", description: "CSCAT 2025", language: "English", file: "CSCAT_2025-3.pdf", href: paths.notes },
    { title: "Topoi of automata", description: "Groupe de travail topossique, April 30, 2025", language: "English", file: "_Talk__Topoi_of_Automata__CSCAT_2025__GISeminar-3.pdf", href: paths.notes },
    { title: "Local state classifier for algebraic language theory", description: "Centre Lagrange, 16 May", language: "English", file: "Local state classifier for algebraic language theory.pdf", href: paths.notes },
    { title: "Topoi of automata (IRIF)", description: "IRIF, 6 May", language: "English", file: "IRIFtoday.pdf", href: paths.notes },
    { title: "Local state classifier for automata theory", description: "IRIF 26 May / LIPN 5 June", language: "English", file: "IRIF20250527_ver1.pdf", href: paths.notes },
    { title: "Pen: A note on language measurability", description: "March 8, 2026", language: "English", file: "An_ongoing_note_on_language_measurability_under_construction20260308.pdf", href: paths.notes },
    { title: "Cloud: A Rota-Baxter equation for winning games", description: "April 5, 2026", language: "English", file: "RYUYA,HORA.pdf", href: paths.notes },
    { title: "順序集合で遊ぶKan拡張入門", language: "Japanese", file: "Introduction_to_Kan_extensions_with_posets_3__Copy_.pdf", href: paths.notes },
    { title: "圏論のToy Exampleとしての集合演算", language: "Japanese", file: "圏論のToy_Exampleとしての集合演算__Ver2_.pdf", href: paths.notes },
    { title: "Cloud: 構成的数学と表現論", description: "数学基礎論若手の会 2023", language: "Japanese", file: "若手の会2023-8.pdf", href: paths.notes },
    { title: "Turning lights out with the Snake Lemma", description: "CGP project, written with Kyosuke Higashida", language: "Japanese", file: "ライツアウトの代数的研究.pdf", href: paths.notes },
    { title: "ゼータ関数とメビウス反転", description: "数理空間トポス 2021年新歓", language: "Japanese", file: "2021topos_zeta_2-3.pdf", href: paths.notes },
    { title: "順序集合で遊ぶKan拡張", description: "数理空間トポス 2022年新歓", language: "Japanese", file: "2022topos_Kan_ext.pdf", href: paths.notes },
    { title: "母関数の種", description: "数理空間トポス 2023年新歓", language: "Japanese", file: "2023topos_species-8.pdf", href: paths.notes },
    { title: "アイゼンシュタイン整数と組合せ論", description: "数理空間トポス 2024年新歓", language: "Japanese", file: "2024Topos新歓202405-6.pdf", href: paths.notes },
    { title: "Cloud: Space-Time for Conway's Game of Life", description: "CSCAT2026", language: "Japanese", file: "Space⋊Time for Conway's Game of Life.pdf", href: paths.notes },
    { title: "Older notes", description: "Older documents are collected on Notion.", language: "Japanese", file: "Notion archive", href: "https://hora-algebra.notion.site/b6804a9f65af454a897db8351bc9da1b" }
  ],
  activities: [
    {
      title: "Plans",
      items: [
        { text: "March 27, 2026: attend Workshop on Modal Logic.", href: "https://sites.google.com/view/ookayamamodallogic/%E3%83%9B%E3%83%BC%E3%83%A0" },
        { text: "March 27, 2026: attend PCT seminar.", href: "https://pctseminar.github.io" },
        { text: "April 5, 2026: join a public talk at Genron Cafe.", href: "https://genron-cafe.jp/event/20260405/" },
        { text: "April 6-8, 2026: attend and speak at Differentiation in category theory and program semantics, Kyoto University.", href: "https://sites.google.com/view/differential-kyoto-2026/home" },
        { text: "July 2026: planning to attend ACT2026 + TACL2026.", href: "https://progetto-itaca.github.io/fests/fest26.html" },
        { text: "September 29, 2026: give a talk at ItaCatFest.", href: "https://progetto-itaca.github.io/fests/fest26.html" }
      ]
    },
    {
      title: "2026",
      items: [
        { text: "Submitted Ph.D. thesis.", href: "https://www.ms.u-tokyo.ac.jp/seminar/2026/sem26-042.html" },
        { text: "Organized and attended the 2nd Categories in Tokyo.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC2%E5%9B%9E%E9%9B%86%E4%BC%9A" },
        { text: "Attended 20th CGP project.", href: "http://www.alg.cei.uec.ac.jp/itohiro/Games/" },
        { text: "Presented a poster with Ryoma Sin'ya at PPL 2026.", href: "https://jssst-ppl.org/workshop/2026/" },
        { text: "Gave a talk at CSCAT2026.", href: "https://www.kurims.kyoto-u.ac.jp/~tsanada/event/cscat2026.html" },
        { text: "Received Ph.D. as department representative at the graduation ceremony.", href: "https://www.u-tokyo.ac.jp/ja/students/events/h15_04.html" }
      ]
    },
    {
      title: "2025",
      items: [
        { text: "Lab Rotation on condensed mathematics.", href: "https://www.s.u-tokyo.ac.jp/en/FoPM/about/features.html" },
        { text: "Visited Kyoto Category Theory Meeting.", href: "https://sites.google.com/view/kyoto-category-theory-meeting/program" },
        { text: "Gave a talk at CMUP SAL seminar.", href: "https://www.cmup.pt/index.php/events/topoi-automata" },
        { text: "Uploaded Lawvere's fourth open problem preprint.", href: "https://arxiv.org/abs/2503.03439" },
        { text: "Visited Paris as a research associate at CTTA and visitor in Paris-Saclay University.", href: "https://igrothendieck.org/en/centre-for-topos-theory-and-its-applications/" },
        { text: "Gave talks at IRIF and LIPN.", href: "https://www.irif.fr/seminaires/semantique/index" },
        { text: "Gave a talk at CT2025.", href: "https://conference.math.muni.cz/ct2025/" },
        { text: "Wrote in 数学セミナー2025年11月号.", href: "https://www.nippyo.co.jp/shop/magazine/9611.html" },
        { text: "Attended Takagi Lecture 2025.", href: "https://www.kurims.kyoto-u.ac.jp/~toshi/jjm/JJMJ/JJM_JHP/contents/takagi_jp/25th/index.htm" },
        { text: "Uploaded preprint on games as recursive coalgebras.", href: "https://arxiv.org/abs/2510.22886" },
        { text: "Gave a talk at SLACS2025.", href: "https://sites.google.com/view/slacs2025akita/home" },
        { text: "Uploaded preprint on normalization of a subgroup.", href: "https://arxiv.org/abs/2511.05012" },
        { text: "Gave talks at UTokyo Logic seminar.", href: "https://www.ms.u-tokyo.ac.jp/seminar/logic/" }
      ]
    },
    {
      title: "2024",
      items: [
        { text: "Paper on quotient toposes of discrete dynamical systems appeared in JPAA.", href: "https://doi.org/10.1016/j.jpaa.2024.107657" },
        { text: "Spoke at AFSA.", href: "https://afsa.jp/g-en/" },
        { text: "Organized the 0th conference of Categories in Tokyo.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC0%E5%9B%9E%E9%9B%86%E4%BC%9A%E8%A9%A6%E9%96%8B%E5%82%AC" },
        { text: "Gave a talk at CT2024 in Santiago de Compostela.", href: "https://www.usc.gal/regaca/ct2024/" },
        { text: "Attended TACL2024.", href: "https://iiia.csic.es/tacl2024/" },
        { text: "Uploaded Topoi of automata I.", href: "https://arxiv.org/abs/2411.06358" },
        { text: "Organized the first conference of Categories in Tokyo.", href: "https://sites.google.com/view/categoriesintokyo/%E7%AC%AC1%E5%9B%9E%E9%9B%86%E4%BC%9A" },
        { text: "Wrote for Advent Calendar 2024.", href: "https://adventar.org/calendars/10265" }
      ]
    },
    {
      title: "2023",
      items: [
        { text: "Uploaded first paper on arXiv.", href: "https://arxiv.org/abs/2302.06851" },
        { text: "Attended EM-cats.", href: "https://topos.institute/events/em-cats/" },
        { text: "Uploaded a preprint on iterated circumcenter sequences.", href: "https://arxiv.org/abs/2309.05304" },
        { text: "Talked about Joyal's species on a Japanese YouTube channel.", href: "https://www.youtube.com/live/gInu95RiCUo" },
        { text: "Uploaded preprints on quadratic residues and Yama Nim.", href: "https://arxiv.org/abs/2310.06610" },
        { text: "Spoke at 数学基礎論若手の会2023.", href: "https://sites.google.com/view/mlwakatenokai2023" }
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
    { text: "SLACS2025 presentation award, October 2025.", href: "https://sites.google.com/view/slacs2025akita/home" },
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
    {
      title: "Lawvere-style open problems in topos theory",
      description: "References around quotient topoi, hyperconnected quotients, local state classifiers, and Lawvere's open problem list.",
      links: [
        ["Internal parameterizations", "http://www.tac.mta.ca/tac/volumes/42/11/42-11abs.html"],
        ["Lawvere's first problem", "https://ncatlab.org/nlab/show/William+Lawvere#FirstProblemInToposTheory"],
        ["Lawvere's open problems", "https://ncatlab.org/nlab/show/William+Lawvere#OpenProblemsInToposTheory"],
        ["Tierney 1972", "https://eudml.org/doc/91476"]
      ]
    },
    {
      title: "Automata, syntactic structures, and language classes",
      description: "Questions surrounding topoi of automata, syntactic monoids, finite actions, and algebraic language theory.",
      links: [
        ["Topoi of automata I", "https://arxiv.org/abs/2411.06358"],
        ["JPAA paper", "https://www.sciencedirect.com/science/article/abs/pii/S0022404924000549"],
        ["Normalization preprint", "https://arxiv.org/abs/2511.05012"],
        ["Related preprint", "https://arxiv.org/abs/2407.17105"]
      ]
    },
    {
      title: "Local topoi, Lawvere distributions, and categorical probability",
      description: "Reference trail for local geometric morphisms, Lawvere distributions, and tensor products of higher categories.",
      links: [
        ["Lawvere's fourth problem preprint", "https://arxiv.org/abs/2503.04317"],
        ["Local geometric morphism", "https://ncatlab.org/nlab/show/local+geometric+morphism#LocalTopos"],
        ["Lawvere distribution", "https://ncatlab.org/nlab/show/Lawvere+distribution"],
        ["Tensor product", "https://ncatlab.org/nlab/show/Pr%28infinity%2C1%29Cat#tensor_product"]
      ]
    },
    {
      title: "Combinatorial games and recursive coalgebras",
      description: "Problems around Grundy values, Nim-sums, recursive coalgebras, and categorical game semantics.",
      links: [
        ["Games as recursive coalgebras", "https://arxiv.org/abs/2510.22886"],
        ["Joyal's games notes", "https://people.cs.uchicago.edu/~brady/CSPP50102/notes/Joyal-games.pdf"]
      ]
    },
    {
      title: "Other reference trails",
      description: "Older and adjacent references that were linked from the Google Sites problem page.",
      links: [
        ["Classical vs quantum computation", "https://golem.ph.utexas.edu/category/2006/10/classical_vs_quantum_computati_3.html"],
        ["Higgs prime", "https://en.wikipedia.org/wiki/Higgs_prime"],
        ["Sketches of an Elephant", "http://www.tac.mta.ca/tac/reprints/articles/27/tr27abs.html"],
        ["Sketches of an Elephant book", "https://link.springer.com/book/10.1007/978-3-642-01642-4"]
      ]
    }
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
      title: "Papers",
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
  paperTab: "published",
  paperQuery: "",
  talkQuery: ""
};

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

function normalized(value) {
  return String(value || "").toLowerCase();
}

function matchesQuery(value, query) {
  return !query || normalized(value).includes(normalized(query));
}

function getPathPrefix() {
  return document.body.dataset.depth === "child" ? "../" : "";
}

function localHref(href) {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  return `${getPathPrefix()}${href}`;
}

const paperFigureTemplates = {
  "internal-parameterizations": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-internal-title fig-internal-desc">
      <title id="fig-internal-title">Locally determined cocones</title>
      <desc id="fig-internal-desc">A local subobject U maps into X, and both determine a value in the local state classifier Psi.</desc>
      <defs><marker id="arrow-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <text class="figure-label" x="132" y="70">U</text>
      <circle class="figure-node" cx="132" cy="125" r="36"></circle>
      <circle class="figure-dot" cx="132" cy="125" r="4"></circle>
      <text class="figure-small" x="132" y="153">x</text>
      <text class="figure-label" x="470" y="54">X</text>
      <ellipse class="figure-node" cx="470" cy="125" rx="150" ry="72"></ellipse>
      <circle class="figure-dot ghost" cx="438" cy="126" r="21"></circle>
      <circle class="figure-dot" cx="438" cy="126" r="4"></circle>
      <text class="figure-small" x="438" y="153">x</text>
      <rect class="figure-node" x="284" y="283" width="230" height="56" rx="4"></rect>
      <text class="figure-label" x="399" y="318">Psi_U(x) = Psi_X(x)</text>
      <path class="figure-arrow" d="M168 125 H318"></path>
      <text class="figure-small" x="238" y="111">i</text>
      <path class="figure-arrow" d="M138 162 L318 278"></path>
      <text class="figure-small" x="197" y="229">Psi_U</text>
      <path class="figure-arrow" d="M438 197 L425 278"></path>
      <text class="figure-small" x="454" y="236">Psi_X</text>
    </svg>`,
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
        <text class="figure-small" x="101" y="130">(height, period) = (3, 4)</text>
      </g>
      <g transform="translate(365 48)">
        <path class="figure-line" d="M0 116 H270"></path>
        <g class="figure-stem"><path d="M30 20 V116"></path><path d="M90 45 V116"></path><path d="M150 20 V116"></path><path d="M210 45 V116"></path></g>
        <g><circle class="figure-dot" cx="30" cy="20" r="5"></circle><circle class="figure-dot" cx="30" cy="68" r="5"></circle><circle class="figure-dot" cx="90" cy="45" r="5"></circle><circle class="figure-dot" cx="150" cy="20" r="5"></circle><circle class="figure-dot" cx="150" cy="68" r="5"></circle><circle class="figure-dot" cx="210" cy="45" r="5"></circle></g>
        <text class="figure-small" x="58" y="152">(height, period) = (3, 0)</text>
      </g>
      <g transform="translate(110 265)">
        <path class="figure-line dashed" d="M0 0 H540"></path>
        <path class="figure-line" d="M115 0 H255 L312 45 H455"></path>
        <g><circle class="figure-dot ghost-fill" cx="115" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="185" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="255" cy="0" r="5"></circle><circle class="figure-dot ghost-fill" cx="312" cy="45" r="5"></circle><circle class="figure-dot ghost-fill" cx="385" cy="45" r="5"></circle><circle class="figure-dot ghost-fill" cx="455" cy="45" r="5"></circle></g>
        <text class="figure-small" x="220" y="88">(height, period) = (infinity, 0)</text>
      </g>
    </svg>`,
  "completely-connected": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-connected-title fig-connected-desc">
      <title id="fig-connected-title">Rooted trees and rooted forests</title>
      <desc id="fig-connected-desc">A rooted tree corresponds to a rooted forest, separated by a dashed divider.</desc>
      <g transform="translate(74 56)">
        <path class="figure-line" d="M128 0 L58 56 L26 118 M58 56 L96 118 M128 0 L128 56 L128 118 M128 0 L214 56 L184 118 M214 56 L250 118"></path>
        <g><circle class="figure-node pale" cx="128" cy="0" r="12"></circle><circle class="figure-node" cx="58" cy="56" r="12"></circle><circle class="figure-node" cx="214" cy="56" r="12"></circle><circle class="figure-node" cx="128" cy="56" r="12"></circle><circle class="figure-node" cx="26" cy="118" r="12"></circle><circle class="figure-node" cx="96" cy="118" r="12"></circle><circle class="figure-node" cx="128" cy="118" r="12"></circle><circle class="figure-node" cx="184" cy="118" r="12"></circle><circle class="figure-node" cx="250" cy="118" r="12"></circle></g>
        <text class="figure-label" x="132" y="188">rooted tree</text>
      </g>
      <path class="figure-line dashed" d="M380 38 V330"></path>
      <g transform="translate(455 56)">
        <path class="figure-line" d="M52 0 L22 56 L0 118 M52 0 L82 56 L104 118"></path>
        <path class="figure-line" d="M196 0 L196 56 L196 118"></path>
        <g><circle class="figure-node pale" cx="52" cy="0" r="12"></circle><circle class="figure-node" cx="22" cy="56" r="12"></circle><circle class="figure-node" cx="82" cy="56" r="12"></circle><circle class="figure-node" cx="0" cy="118" r="12"></circle><circle class="figure-node" cx="104" cy="118" r="12"></circle><circle class="figure-node pale" cx="196" cy="0" r="12"></circle><circle class="figure-node" cx="196" cy="56" r="12"></circle><circle class="figure-node" cx="196" cy="118" r="12"></circle></g>
        <text class="figure-label" x="98" y="188">rooted forest</text>
      </g>
    </svg>`,
  "lawvere-first": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-lawvere-first-title fig-lawvere-first-desc">
      <title id="fig-lawvere-first-title">Proper class many quotient topoi</title>
      <desc id="fig-lawvere-first-desc">Rigid relational structures feed a classifying topos and yield a proper class of quotient topoi.</desc>
      <defs><marker id="arrow-c" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <g transform="translate(64 52)">
        <rect class="figure-node soft" x="0" y="32" width="190" height="78" rx="8"></rect>
        <text class="figure-label" x="95" y="66">rigid relational</text>
        <text class="figure-label" x="95" y="92">structures</text>
        <g transform="translate(42 154)">
          <circle class="figure-dot" cx="0" cy="0" r="5"></circle><circle class="figure-dot" cx="50" cy="-30" r="5"></circle><circle class="figure-dot" cx="102" cy="6" r="5"></circle><circle class="figure-dot" cx="36" cy="54" r="5"></circle>
          <path class="figure-line" d="M0 0 L50 -30 L102 6 L36 54 L0 0 M50 -30 L36 54"></path>
        </g>
      </g>
      <path class="figure-arrow" d="M280 125 H380"></path>
      <g transform="translate(384 74)">
        <ellipse class="figure-node soft-2" cx="92" cy="72" rx="98" ry="72"></ellipse>
        <text class="figure-label" x="92" y="62">classifying</text>
        <text class="figure-label" x="92" y="91">topos</text>
      </g>
      <path class="figure-arrow" d="M570 125 H666"></path>
      <g transform="translate(610 70)">
        <circle class="figure-node pale" cx="70" cy="8" r="18"></circle>
        <circle class="figure-node pale" cx="28" cy="72" r="18"></circle>
        <circle class="figure-node pale" cx="112" cy="72" r="18"></circle>
        <circle class="figure-node pale" cx="70" cy="137" r="18"></circle>
        <path class="figure-line" d="M70 26 L28 54 M70 26 L112 54 M28 90 L70 119 M112 90 L70 119"></path>
        <text class="figure-small" x="70" y="192">proper class of quotients</text>
      </g>
    </svg>`,
  "lawvere-fourth": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-lawvere-fourth-title fig-lawvere-fourth-desc">
      <title id="fig-lawvere-fourth-title">EZ-congruence and EZ-decomposition</title>
      <desc id="fig-lawvere-fourth-desc">A colored seven-vertex graph maps to a smaller quotient graph by alpha.</desc>
      <defs><marker id="arrow-d" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <g transform="translate(70 64)">
        <circle class="figure-cycle" cx="150" cy="114" r="110"></circle>
        <g class="figure-line"><path d="M150 15 L70 74 L55 155 L118 205 L210 190 L245 114 L150 15 M70 74 L210 190 M55 155 L245 114 M118 205 L150 15 M70 74 L245 114"></path></g>
        <circle class="c-red" cx="150" cy="15" r="9"></circle><circle class="c-blue" cx="70" cy="74" r="9"></circle><circle class="c-blue" cx="55" cy="155" r="9"></circle><circle class="c-green" cx="118" cy="205" r="9"></circle><circle class="c-orange" cx="210" cy="190" r="9"></circle><circle class="c-red" cx="245" cy="114" r="9"></circle><circle class="c-green" cx="238" cy="58" r="9"></circle>
        <text class="figure-small" x="150" y="265">x = y alpha</text>
      </g>
      <path class="figure-arrow" d="M368 178 H474"></path>
      <text class="figure-label" x="421" y="160">alpha</text>
      <g transform="translate(500 84)">
        <circle class="figure-cycle" cx="96" cy="96" r="88"></circle>
        <path class="figure-line" d="M52 55 H142 V138 H52 V55 M52 55 L142 138"></path>
        <circle class="c-red" cx="52" cy="55" r="9"></circle><circle class="c-green" cx="142" cy="55" r="9"></circle><circle class="c-blue" cx="52" cy="138" r="9"></circle><circle class="c-orange" cx="142" cy="138" r="9"></circle>
        <text class="figure-small" x="96" y="232">y</text>
      </g>
    </svg>`,
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
        <text class="figure-small" x="364" y="198">(Sigma-Set, R)</text>
        <path class="figure-line" d="M170 116 L257 154 M554 116 L471 154 M170 238 L257 202 M554 238 L471 202"></path>
      </g>
    </svg>`,
  "games-coalgebras": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-games-title fig-games-desc">
      <title id="fig-games-title">Games as graphs</title>
      <desc id="fig-games-desc">A finite game graph, an infinite line game, and a non-game with an infinite path.</desc>
      <defs><marker id="arrow-e" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <g transform="translate(160 36)">
        <circle class="figure-dot" cx="90" cy="0" r="7"></circle><circle class="figure-dot" cx="210" cy="0" r="7"></circle><circle class="figure-dot" cx="42" cy="66" r="7"></circle><circle class="figure-dot" cx="150" cy="66" r="7"></circle><circle class="figure-dot" cx="270" cy="66" r="7"></circle><circle class="figure-dot" cx="90" cy="142" r="7"></circle><circle class="figure-dot" cx="210" cy="142" r="7"></circle>
        <path class="figure-arrow" d="M90 8 L52 56 M90 8 L143 58 M210 8 L158 58 M210 8 L263 58 M42 74 L84 132 M150 74 L98 132 M150 74 L202 132 M270 74 L218 132"></path>
        <text class="figure-small" x="150" y="178">finite game</text>
      </g>
      <g transform="translate(150 250)">
        <path class="figure-arrow" d="M0 0 H116 H232 H348 H464"></path>
        <circle class="figure-dot" cx="0" cy="0" r="7"></circle><circle class="figure-dot" cx="116" cy="0" r="7"></circle><circle class="figure-dot" cx="232" cy="0" r="7"></circle><circle class="figure-dot" cx="348" cy="0" r="7"></circle><circle class="figure-dot" cx="464" cy="0" r="7"></circle>
        <text class="figure-small" x="232" y="42">infinite game</text>
      </g>
      <g transform="translate(548 140)">
        <path class="figure-arrow" d="M30 0 C82 -8, 82 72, 30 64 C-15 55, -15 10, 30 0"></path>
        <circle class="figure-dot" cx="30" cy="0" r="7"></circle>
        <text class="figure-small" x="30" y="102">infinite path</text>
      </g>
    </svg>`,
  "normalization": `
    <svg viewBox="0 0 760 390" role="img" aria-labelledby="fig-normalization-title fig-normalization-desc">
      <title id="fig-normalization-title">Normalizer-style lifting diagram</title>
      <desc id="fig-normalization-desc">A filter F lifts along a local state classifier Xi through commuting triangles.</desc>
      <defs><marker id="arrow-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"></path></marker></defs>
      <g transform="translate(120 62)">
        <text class="figure-label" x="0" y="44">F</text>
        <text class="figure-label" x="278" y="44">F</text>
        <text class="figure-label" x="148" y="12">Xi</text>
        <text class="figure-label" x="148" y="118">Xi</text>
        <path class="figure-arrow" d="M24 38 H248"></path>
        <path class="figure-arrow" d="M248 48 L172 102"></path>
        <path class="figure-arrow" d="M24 48 L126 102"></path>
        <text class="figure-small" x="132" y="32">exists lift</text>
        <text class="figure-small" x="84" y="88">xi_F</text>
        <text class="figure-small" x="218" y="88">i_F</text>
      </g>
      <g transform="translate(150 222)">
        <text class="figure-label" x="0" y="10">Z</text>
        <text class="figure-label" x="290" y="10">Z'</text>
        <text class="figure-label" x="142" y="126">F</text>
        <path class="figure-arrow" d="M25 0 H265"></path>
        <path class="figure-arrow" d="M40 22 L132 102"></path>
        <path class="figure-arrow" d="M265 22 L168 102"></path>
        <path class="figure-line dashed" d="M72 76 H232"></path>
        <text class="figure-small" x="142" y="50">commuting family</text>
      </g>
    </svg>`
};

function appendActionLinks(parent, records) {
  if (!records || !records.length) return;
  const actions = el("div", "action-links");
  records.forEach(([label, href]) => actions.append(link(label, href, "action-link")));
  parent.append(actions);
}

function renderLinkedList(selector, records) {
  const root = document.querySelector(selector);
  if (!root) return;
  root.replaceChildren();
  records.forEach((record) => {
    const item = el("li");
    if (record.href) {
      item.append(link(record.text, record.href));
    } else {
      item.textContent = record.text;
    }
    root.append(item);
  });
}

function renderProfileLinks() {
  document.querySelectorAll("[data-profile-links]").forEach((root) => {
    root.replaceChildren();
    siteData.profileLinks.forEach(([label, href]) => root.append(link(label, href, "text-link")));
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
    item.append(link(page.title, localHref(page.href), "explore-title"), el("p", null, page.description));
    root.append(item);
  });
}

function renderPaperRecord(paper) {
  const item = el("article", paper.figure ? "publication-item has-figure" : "publication-item");
  const template = paperFigureTemplates[paper.figure];
  if (template) {
    const figureLink = link("", paper.link, "publication-figure");
    figureLink.setAttribute("aria-label", `Open ${paper.title}`);
    figureLink.innerHTML = template;
    const svg = figureLink.querySelector("svg");
    const marker = svg?.querySelector("marker");
    if (svg && marker) {
      const markerId = `paper-arrow-${paper.figure}`;
      marker.id = markerId;
      svg.querySelectorAll(".figure-arrow").forEach((path) => {
        path.setAttribute("marker-end", `url(#${markerId})`);
      });
    }
    item.append(figureLink);
  }

  const titleRow = el("div", "publication-title");
  const title = el("h3");
  title.append(link(paper.title, paper.link));
  titleRow.append(title, el("span", "publication-venue", paper.year));
  item.append(titleRow);

  const meta = el("div", "publication-meta");
  if (paper.authors) meta.append(el("span", null, paper.authors));
  meta.append(el("span", null, paper.venue));
  paper.tags?.forEach((tag) => meta.append(el("span", null, tag)));
  item.append(meta);
  if (paper.summary) item.append(el("p", "publication-summary", paper.summary));
  appendActionLinks(item, paper.links);
  return item;
}

function renderPapers() {
  const root = document.querySelector("#paper-list");
  if (!root) return;
  const records = siteData.papers[state.paperTab];
  root.replaceChildren();

  if (state.paperTab === "preparation") {
    const filtered = records.filter((title) => matchesQuery(title, state.paperQuery));
    if (!filtered.length) {
      root.append(el("p", "empty-state", "No papers match this filter."));
      return;
    }
    filtered.forEach((title) => {
      const item = el("article", "publication-item");
      item.append(el("h3", null, title));
      root.append(item);
    });
    return;
  }

  const filtered = records.filter((paper) => {
    const searchText = [paper.title, paper.authors, paper.venue, paper.year, paper.tags?.join(" "), paper.summary].join(" ");
    return matchesQuery(searchText, state.paperQuery);
  });

  if (!filtered.length) {
    root.append(el("p", "empty-state", "No papers match this filter."));
    return;
  }
  filtered.forEach((paper) => root.append(renderPaperRecord(paper)));
}

function renderHomePapers() {
  const root = document.querySelector("#home-paper-list");
  if (!root) return;
  root.replaceChildren();
  [...siteData.papers.published, ...siteData.papers.preprints].slice(0, 4).forEach((paper) => root.append(renderPaperRecord(paper)));
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
    item.append(el("p", "publication-summary", paper.venue));
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
    const filtered = group.items.filter((talk) => matchesQuery(`${group.year} ${talk.title} ${talk.venue}`, state.talkQuery));
    const remaining = limit ? Math.max(limit - count, 0) : filtered.length;
    const visible = filtered.slice(0, remaining);
    if (!visible.length) return;

    count += visible.length;
    const wrapper = el("article", "timeline-group");
    wrapper.append(el("div", "timeline-year", group.year));
    const list = el("ul", "talk-items");
    visible.forEach((talk) => {
      const item = el("li");
      const title = el("span", "talk-title");
      if (talk.href) title.append(link(talk.title, talk.href));
      else title.textContent = talk.title;
      item.append(title, el("span", "talk-venue", talk.venue));
      list.append(item);
    });
    wrapper.append(list);
    root.append(wrapper);
  });

  if (!count) root.append(el("p", "empty-state", "No talks match this filter."));
}

function renderNotes() {
  const root = document.querySelector("#notes-list");
  if (!root) return;
  root.replaceChildren();
  const limit = Number(root.dataset.limit || 0);
  const records = limit ? siteData.notes.slice(0, limit) : siteData.notes;

  records.forEach((note) => {
    const item = el("article", "note-item");
    const heading = el("h3");
    heading.append(link(note.title, note.href));
    item.append(heading);
    if (note.description) item.append(el("p", null, note.description));
    const meta = el("div", "note-meta");
    meta.append(el("span", null, note.language), el("span", null, note.file));
    item.append(meta);
    appendActionLinks(item, [["Source page", note.href]]);
    root.append(item);
  });
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
    group.items.forEach((record) => {
      const item = el("li");
      if (record.href) item.append(link(record.text, record.href));
      else item.textContent = record.text;
      list.append(item);
    });
    column.append(list);
    root.append(column);
  });
}

function renderProblems() {
  const root = document.querySelector("#problem-list");
  if (!root) return;
  root.replaceChildren();
  siteData.problems.forEach((problem) => {
    const item = el("article", "publication-item");
    item.append(el("h3", null, problem.title), el("p", "publication-summary", problem.description));
    appendActionLinks(item, problem.links);
    root.append(item);
  });
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
      const item = el("li");
      item.append(link(label, href));
      list.append(item);
    });
    column.append(list);
    root.append(column);
  });
}

function setupInteractions() {
  document.querySelectorAll("[data-paper-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.paperTab = button.dataset.paperTab;
      document.querySelectorAll("[data-paper-tab]").forEach((tab) => {
        tab.classList.toggle("is-active", tab === button);
      });
      renderPapers();
    });
  });

  const paperFilter = document.querySelector("#paper-filter");
  if (paperFilter) {
    paperFilter.addEventListener("input", (event) => {
      state.paperQuery = event.target.value;
      renderPapers();
    });
  }

  const talkFilter = document.querySelector("#talk-filter");
  if (talkFilter) {
    talkFilter.addEventListener("input", (event) => {
      state.talkQuery = event.target.value;
      renderTalks();
    });
  }

  const menuButton = document.querySelector(".menu-button");
  const nav = document.querySelector(".site-nav");
  if (!menuButton || !nav) return;
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

renderProfileLinks();
renderTopics();
renderLinkedList("#current-position-list", siteData.currentPositions);
renderLinkedList("#past-position-list", siteData.pastPositions);
renderLinkedList("#award-list", siteData.awards);
renderLinkedList("#education-list", siteData.education);
renderExplore();
renderPapers();
renderHomePapers();
renderMiscPapers();
renderTalks();
renderTalks("#home-talk-list");
renderNotes();
renderActivities();
renderProblems();
renderLinks();
setupInteractions();
