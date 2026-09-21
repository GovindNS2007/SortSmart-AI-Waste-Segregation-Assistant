(function () {
  "use strict";

  // ---------------- Category metadata ----------------
  var CATS = {
    wet: { label: "Wet / Organic Waste", color: "#2C5F2D" },
    dryR: { label: "Dry Waste — Recyclable", color: "#1C7293" },
    dryNR: { label: "Dry Waste — Non-Recyclable", color: "#5C6B57" },
    hazard: { label: "Hazardous — Special Handling", color: "#B3261E" }
  };

  // ---------------- Local knowledge base (retrieval layer) ----------------
  // Each entry: aliases (things a user might type), category, reason, tip, hazardous(optional flag for extra note)
  var DB = [
    { a: ["tea bag", "used tea bag", "tea leaves", "chai patti"], c: "wet", r: "Tea leaves are organic and fully compostable.", t: "If the bag has a synthetic mesh or staple, tip the leaves into wet waste and bin the mesh/staple separately as dry waste." },
    { a: ["coffee grounds", "used coffee", "coffee filter"], c: "wet", r: "Coffee grounds break down quickly and are great for compost.", t: "Paper filters can go in with the grounds; foil-lined pods cannot." },
    { a: ["banana peel", "fruit peel", "apple core", "orange peel", "vegetable peel", "potato peel", "onion peel"], c: "wet", r: "Fruit and vegetable scraps are biodegradable organic waste.", t: "Keep peels loose or in a compostable bag — avoid plastic bags in the wet-waste bin." },
    { a: ["eggshell", "egg shell"], c: "wet", r: "Eggshells are organic and break down in compost.", t: "Crush them slightly to help them decompose faster." },
    { a: ["cooked food", "leftover food", "food scraps", "plate scrapings", "rice", "curry"], c: "wet", r: "Cooked food waste is organic and belongs with wet waste.", t: "Drain excess liquid before disposing to reduce odour and weight." },
    { a: ["coconut shell"], c: "wet", r: "Coconut shells are organic, though they take longer to break down.", t: "Many composting programs accept them — check if yours does before binning as dry waste." },
    { a: ["garden waste", "leaves", "dry leaves", "grass clippings", "flowers", "puja flowers"], c: "wet", r: "Plant matter is organic waste suited to composting.", t: "Large branches may need a separate green-waste pickup." },

    { a: ["newspaper", "old newspaper"], c: "dryR", r: "Newspaper is clean paper and widely recyclable.", t: "Keep it dry and bundle it — wet paper loses recycling value." },
    { a: ["cardboard", "cardboard box", "carton"], c: "dryR", r: "Cardboard is a high-value recyclable when clean and dry.", t: "Flatten boxes and remove tape or plastic labels first." },
    { a: ["magazine", "notebook", "paper", "office paper", "printer paper"], c: "dryR", r: "Clean paper products are recyclable.", t: "Remove plastic spiral bindings or laminated covers if possible." },
    { a: ["plastic bottle", "water bottle", "pet bottle"], c: "dryR", r: "PET bottles are one of the most commonly recycled plastics.", t: "Rinse out residue and flatten the bottle; caps can usually stay on." },
    { a: ["glass bottle", "glass jar"], c: "dryR", r: "Glass is 100% recyclable and can be recycled endlessly.", t: "Rinse clean and remove metal lids — dispose of broken glass separately, wrapped, and hazard-labelled." },
    { a: ["metal can", "tin can", "aluminium can", "aluminum can", "soda can"], c: "dryR", r: "Metal cans are valuable, easily recycled materials.", t: "Rinse out food residue before disposing." },
    { a: ["aluminium foil", "aluminum foil", "foil"], c: "dryR", r: "Clean foil is recyclable as scrap metal.", t: "Foil with food residue should be wiped or rinsed first, or it's better placed in dry non-recyclable waste." },
    { a: ["tetra pack", "juice carton", "milk carton"], c: "dryR", r: "Tetra packs are recyclable through specialised facilities due to their layered material.", t: "Rinse, flatten, and check if your local center accepts tetra packs specifically." },

    { a: ["chip packet", "chips packet", "wrapper", "snack wrapper", "biscuit wrapper"], c: "dryNR", r: "Multi-layer laminated plastic (foil + plastic) cannot be recycled through normal streams.", t: "Some brands run dedicated take-back programs for multi-layer plastic — check before binning." },
    { a: ["thermocol", "styrofoam", "packaging foam"], c: "dryNR", r: "Thermocol/styrofoam is not accepted by most municipal recycling programs.", t: "Reuse as packing material where possible instead of discarding." },
    { a: ["cloth", "rag", "old clothes", "fabric scraps"], c: "dryNR", r: "Mixed-fibre textiles are generally not recyclable through household streams.", t: "Consider donating wearable clothes instead of discarding them." },
    { a: ["shoes", "old shoes", "sandals"], c: "dryNR", r: "Footwear mixes materials that are hard to separate for recycling.", t: "Donate if still usable; some brands run shoe take-back/recycling schemes." },
    { a: ["rubber", "rubber band", "balloon"], c: "dryNR", r: "Rubber items are generally non-recyclable in standard streams.", t: "Keep out of the wet-waste bin — rubber doesn't biodegrade." },
    { a: ["ice cream stick", "wooden stick", "toothpick"], c: "dryNR", r: "Small treated-wood items usually aren't accepted in compost or recycling streams.", t: "Reuse craft-friendly sticks for classroom or hobby projects if clean." },
    { a: ["straw", "plastic straw"], c: "dryNR", r: "Small, thin plastics like straws are usually not recyclable — they fall through sorting machinery.", t: "Switch to reusable or paper straws where possible." },
    { a: ["cigarette butt", "cigarette"], c: "dryNR", r: "Cigarette filters contain plastic (cellulose acetate) and are not recyclable or compostable.", t: "Always dispose of in a bin, never on the ground — they're a common source of litter and microplastics." },
    { a: ["broken ceramic", "broken plate", "broken mug", "ceramic"], c: "dryNR", r: "Ceramics have a different melting point than glass and cannot be recycled together with it.", t: "Wrap broken pieces carefully so they don't injure waste handlers." },
    { a: ["mirror", "broken mirror"], c: "dryNR", r: "Mirrors have a reflective coating that makes them unsuitable for standard glass recycling.", t: "Wrap well and label as sharp/broken before disposal." },
    { a: ["hair", "nail clippings"], c: "dryNR", r: "Small amounts of hair or nail waste are typically treated as dry general waste.", t: "Large volumes (e.g. salon waste) may need separate handling — check local rules." },

    { a: ["battery", "batteries", "aa battery", "button battery"], c: "hazard", r: "Batteries contain heavy metals and chemicals that can leak and contaminate soil/water.", t: "Take to a designated e-waste or battery collection point — never put in a regular bin." },
    { a: ["e-waste", "old phone", "mobile phone", "charger", "cable", "wire", "laptop", "electronic"], c: "hazard", r: "Electronics contain metals and components that need specialised, controlled processing.", t: "Drop off at an authorised e-waste collection center or manufacturer take-back program." },
    { a: ["cfl bulb", "led bulb", "light bulb", "tube light", "fluorescent tube"], c: "hazard", r: "CFL and fluorescent bulbs contain trace mercury and require careful handling.", t: "Take to an e-waste or bulb take-back point — do not smash or bin with regular waste." },
    { a: ["medicine", "expired medicine", "tablets", "pills", "syrup"], c: "hazard", r: "Expired medicines can contaminate water systems and pose a poisoning risk if binned normally.", t: "Return to a pharmacy take-back program where available, or hand to a municipal hazardous-waste collection point." },
    { a: ["syringe", "needle", "medical waste"], c: "hazard", r: "Sharps and medical waste pose injury and infection risks to waste handlers.", t: "Use a proper sharps container and hand over to a clinic, pharmacy, or authorised medical-waste collector — never loose in household waste." },
    { a: ["sanitary napkin", "sanitary pad", "diaper", "nappy"], c: "hazard", r: "These items require hygienic, contained disposal separate from other dry/wet waste.", t: "Wrap securely (many municipalities specify a dedicated wrapper/pouch) before placing in the bin your local authority designates." },
    { a: ["paint can", "paint tin", "leftover paint"], c: "hazard", r: "Paint contains solvents and chemicals unsafe for landfill or waterways.", t: "Let small amounts dry out fully before disposal, or take to a hazardous-waste facility — never pour down a drain." },
    { a: ["pesticide", "pesticide container", "insecticide"], c: "hazard", r: "Pesticide residue is toxic and needs controlled disposal to avoid contamination.", t: "Rinse only per label instructions and hand over to a hazardous-waste collection point — never reuse the container." },
    { a: ["motor oil", "engine oil", "used oil"], c: "hazard", r: "Used oil is a major water contaminant if disposed of improperly.", t: "Take to an authorised recycling/collection center — many auto-service shops accept it." },
    { a: ["car battery", "lead acid battery"], c: "hazard", r: "Lead-acid batteries are highly toxic and corrosive.", t: "Return to the retailer or an authorised battery-recycling center — many offer exchange credit." },
    { a: ["thermometer", "mercury thermometer"], c: "hazard", r: "Mercury is highly toxic if released.", t: "Do not break it — take to a hazardous-waste or pharmacy take-back point." },
    { a: ["spray can", "aerosol", "aerosol can"], c: "hazard", r: "Pressurised aerosol cans can be dangerous if punctured or incinerated.", t: "Ensure it's fully empty, then check local rules — many areas want these at hazardous-waste points, not regular recycling." }
  ];

  // ---------------- Heuristic keyword fallback (broader rules) ----------------
  var HEURISTICS = [
    { k: ["peel", "vegetable", "fruit", "leftover", "food waste", "compost"], c: "wet", r: "This looks like organic/food matter, which is generally compostable.", t: "When unsure, organic-looking scraps are almost always safe in wet waste." },
    { k: ["battery", "e-waste", "electronic", "charger", "circuit", "wire", "bulb"], c: "hazard", r: "Items with electronic or battery components need specialised handling, not regular bins.", t: "Take this to a certified e-waste collection point." },
    { k: ["medicine", "syringe", "needle", "medical", "pharma"], c: "hazard", r: "Medical items can pose contamination or injury risk if binned normally.", t: "Hand this to a pharmacy or medical-waste collection point rather than a household bin." },
    { k: ["chemical", "paint", "pesticide", "solvent", "acid", "oil"], c: "hazard", r: "Chemical residues need controlled disposal to avoid contaminating soil or water.", t: "Look for a hazardous-waste drop-off point in your area." },
    { k: ["glass"], c: "dryR", r: "Glass is generally recyclable when clean and unbroken.", t: "Rinse before disposal; wrap broken pieces separately and label them as sharp." },
    { k: ["metal", "tin", "aluminium", "aluminum", "steel"], c: "dryR", r: "Clean metal items are usually recyclable.", t: "Rinse off any food residue first." },
    { k: ["paper", "cardboard", "carton", "newspaper"], c: "dryR", r: "Clean, dry paper-based items are generally recyclable.", t: "Keep them dry and free of food residue for best recycling value." },
    { k: ["plastic", "bottle", "packet", "wrapper", "plastic bag"], c: "dryNR", r: "Many plastics need checking — rigid plastics are often recyclable, but thin films and multi-layer wrappers usually aren't.", t: "If it's a rigid bottle or container, rinse and treat as recyclable; if it's a thin wrapper or bag, treat as non-recyclable dry waste." },
    { k: ["cloth", "textile", "fabric"], c: "dryNR", r: "Textiles are generally not accepted in standard recycling streams.", t: "Consider donating usable clothing instead." }
  ];

  // ---------------- Utility: normalize + match ----------------
  function normalize(s) {
    return s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function localMatch(query) {
    var q = normalize(query);
    if (!q) return null;
    var best = null, bestLen = 0;
    for (var i = 0; i < DB.length; i++) {
      var entry = DB[i];
      for (var j = 0; j < entry.a.length; j++) {
        var alias = entry.a[j];
        if (q.indexOf(alias) !== -1 || alias.indexOf(q) !== -1) {
          if (alias.length > bestLen) {
            bestLen = alias.length;
            best = entry;
          }
        }
      }
    }
    if (best) return { category: best.c, reason: best.r, tip: best.t, source: "local" };
    return null;
  }

  function heuristicMatch(query) {
    var q = normalize(query);
    for (var i = 0; i < HEURISTICS.length; i++) {
      var h = HEURISTICS[i];
      for (var j = 0; j < h.k.length; j++) {
        if (q.indexOf(h.k[j]) !== -1) {
          return { category: h.c, reason: h.r, tip: h.t, source: "heuristic" };
        }
      }
    }
    return null;
  }

  // ---------------- Rendering ----------------
  var chatEl = document.getElementById("chat");

  function scrollToBottom() {
    chatEl.scrollTop = chatEl.scrollHeight;
  }

  function addUserBubble(text) {
    var row = document.createElement("div");
    row.className = "row user";
    var b = document.createElement("div");
    b.className = "bubble-user";
    b.textContent = text;
    row.appendChild(b);
    chatEl.appendChild(row);
    scrollToBottom();
  }

  function addThinkingCard() {
    var row = document.createElement("div");
    row.className = "row assistant";
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML = '<div class="thinking"><span class="spinner"></span><span>Checking local waste guidance…</span></div>';
    row.appendChild(card);
    chatEl.appendChild(row);
    scrollToBottom();
    return card;
  }

  var SRC_LABEL = {
    local: "Local Knowledge Base",
    heuristic: "Rule-Based Heuristic",
    ai: "AI Reasoning (Claude)"
  };

  function renderResult(card, result) {
    var cat = CATS[result.category] || CATS.dryNR;
    var hazardHtml = "";
    if (result.category === "hazard") {
      hazardHtml = '<div class="hazard-note">⚠ Handle with care — do not place in a regular bin. When unsure, confirm with local municipal or campus guidance.</div>';
    }
    card.innerHTML =
      '<div class="result-head">' +
        '<span class="cat-pill" style="background:' + cat.color + '"><span class="dot"></span>' + cat.label + '</span>' +
        '<span class="src-tag">' + SRC_LABEL[result.source] + '</span>' +
      '</div>' +
      '<p class="reason">' + escapeHtml(result.reason) + '</p>' +
      '<p class="tip"><b>Tip:</b> ' + escapeHtml(result.tip) + '</p>' +
      hazardHtml;
    scrollToBottom();
  }

  function renderError(card, msg) {
    card.innerHTML = '<div class="err-card">' + escapeHtml(msg) + '</div>';
    scrollToBottom();
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // ---------------- AI fallback (sample capability) ----------------
  var sampleFn = null;
  var sampleTried = false;

  function ensureSample() {
    if (sampleTried) return;
    sampleTried = true;
    if (window.claude && typeof window.claude.use === "function") {
      window.claude.use("sample").then(function (s) { sampleFn = s; }).catch(function () { sampleFn = null; });
    }
  }
  ensureSample();

  function askAI(item) {
    if (!sampleFn) return Promise.reject({ code: "not_granted" });
    var prompt =
      'You are SortSmart AI, a waste-segregation assistant. Classify the item below into exactly one of these four categories:\n' +
      '- "wet": organic / biodegradable / food waste\n' +
      '- "dryR": dry waste that is commonly recyclable (clean paper, cardboard, glass, metal, rigid plastics)\n' +
      '- "dryNR": dry waste that is generally NOT recyclable (multi-layer wrappers, thermocol, mixed textiles, small plastics)\n' +
      '- "hazard": anything needing special/hazardous handling (batteries, e-waste, medicines, sharps, chemicals, paint)\n\n' +
      'Item: "' + item + '"\n\n' +
      'Reply with ONLY a JSON object, no other text, in exactly this shape:\n' +
      '{"category":"wet|dryR|dryNR|hazard","reason":"one short sentence explaining why, in plain language","tip":"one short, practical disposal tip"}\n\n' +
      'If you are not confident, or the item could be hazardous, prefer "hazard" and say so — never guess carelessly on anything that could be unsafe.';

    return sampleFn.json(prompt, { modelTier: "quick", cache: true });
  }

  // ---------------- Main flow ----------------
  function handleQuery(rawText) {
    var text = rawText.trim();
    if (!text) return;

    addUserBubble(text);
    var card = addThinkingCard();

    var local = localMatch(text);
    if (local) {
      setTimeout(function () { renderResult(card, local); }, 260);
      return;
    }

    var heuristic = heuristicMatch(text);

    // Try AI for a sharper answer; fall back to heuristic or a generic message.
    askAI(text).then(function (data) {
      if (data && data.category && CATS[data.category] && data.reason && data.tip) {
        renderResult(card, { category: data.category, reason: data.reason, tip: data.tip, source: "ai" });
      } else if (heuristic) {
        renderResult(card, heuristic);
      } else {
        renderError(card, "Couldn't confidently classify that item. Try a simpler name (e.g. “battery” instead of a brand name), or check with your local municipal/campus waste guidelines.");
      }
    }).catch(function (err) {
      if (heuristic) {
        renderResult(card, heuristic);
      } else if (err && err.code === "not_granted") {
        renderError(card, "AI lookup isn't enabled for this view, and this item isn't in the local database yet. Try describing it differently, or check local waste guidelines.");
      } else if (err && err.code === "rate_limited") {
        renderError(card, "Too many requests right now — please try again in a moment.");
      } else {
        renderError(card, "Couldn't get a confident answer for that item. Try a simpler description, or check local waste guidelines.");
      }
    });
  }

  // ---------------- Welcome message ----------------
  function renderWelcome() {
    var row = document.createElement("div");
    row.className = "row assistant";
    var w = document.createElement("div");
    w.className = "welcome";
    w.innerHTML =
      '<b>Hi! I\'m SortSmart AI.</b><br>Tell me what you\'re throwing away and I\'ll tell you which bin it belongs in, why, and how to prep it.' +
      '<div class="chips" id="chips"></div>';
    row.appendChild(w);
    chatEl.appendChild(row);

    var examples = ["Used tea bag", "Chip packet", "Old phone charger", "Glass bottle", "Expired medicine", "Cardboard box"];
    var chipWrap = w.querySelector("#chips");
    examples.forEach(function (ex) {
      var chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = ex;
      chip.onclick = function () { handleQuery(ex); };
      chipWrap.appendChild(chip);
    });
  }
  renderWelcome();

  // ---------------- Input wiring ----------------
  var input = document.getElementById("textInput");
  var sendBtn = document.getElementById("sendBtn");

  function submit() {
    var v = input.value;
    if (!v.trim()) return;
    input.value = "";
    handleQuery(v);
  }
  sendBtn.addEventListener("click", submit);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submit();
  });

  // ---------------- Info panel + theme toggle ----------------
  var infoPanel = document.getElementById("infoPanel");
  document.getElementById("infoBtn").addEventListener("click", function () {
    infoPanel.classList.toggle("open");
  });

  var root = document.documentElement;
  document.getElementById("themeBtn").addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    if (current === "dark") { root.setAttribute("data-theme", "light"); }
    else { root.setAttribute("data-theme", "dark"); }
  });
})();
