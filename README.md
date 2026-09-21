# ♻️ SortSmart AI — Waste Segregation Assistant

An AI-powered waste-segregation assistant built for the **1M1B AI for Sustainability Virtual Internship** (in collaboration with IBM SkillsBuild & AICTE).

Type any everyday item (e.g. *"used tea bag"*, *"chip packet"*, *"old phone charger"*) and get an instant bin recommendation — **Wet / Dry-Recyclable / Dry-Non-Recyclable / Hazardous** — with a plain-language reason and a practical disposal tip.

**Live demo (hosted, with AI fallback enabled):** https://claude.ai/artifact/ApgW392y1qy92wRyC5c44n
**Live demo (GitHub Pages):** _add your Pages URL here after deploying, e.g. `https://<your-username>.github.io/sortsmart-ai/`_

---

## 🌍 SDG Alignment

- **SDG 11** — Sustainable Cities & Communities
- **SDG 12** — Responsible Consumption & Production

**Problem statement:** How might we use AI to instantly guide people on correctly segregating everyday waste, so campuses and communities can reduce landfill load and recover recyclable value?

---

## 🧠 How it works (the AI pipeline)

The assistant answers in three layered steps — a simple retrieval-augmented design:

1. **Local knowledge base** (`js/script.js` → `DB`) — ~60 common items with hand-written aliases are matched instantly against what the user types. This is the fast, always-available "retrieval" layer, acting as a stand-in for a municipal/campus waste-policy knowledge base.
2. **Rule-based heuristics** (`js/script.js` → `HEURISTICS`) — for items not in the database, broader keyword rules (e.g. "battery", "plastic", "peel") give a reasonable second-pass classification.
3. **AI reasoning fallback** — if neither layer is confident, the app asks Claude directly with a structured prompt using the same four categories, and returns a JSON-formatted answer. **This step only runs inside a published claude.ai Artifact** (it uses the in-browser `window.claude` "sample" capability, scoped to the viewer's own Claude account and usage). On GitHub Pages or any other host, this capability isn't present, so the app gracefully falls back to the local database + heuristics only — it never breaks, it just quietly uses fewer layers.

Every answer shows **which layer produced it** (Local Knowledge Base / Rule-Based Heuristic / AI Reasoning), for transparency.

---

## ✅ Responsible AI

- **Fairness** — matches on casual, everyday phrasing and common aliases, not just formal packaging terms.
- **Transparency** — every answer includes a plain-language reason and its source layer.
- **Ethics** — the assistant never guesses carelessly on hazardous items; anything uncertain is steered toward the hazardous category with a visible safety warning telling the user to confirm locally.
- **Privacy** — nothing typed is stored, logged, or tied to an identity. The only data that ever leaves the browser is the single item description sent to Claude, and only when the AI fallback fires.

---

## 🗂 Project structure

```
sortsmart-ai/
├── index.html      # markup
├── css/
│   └── style.css   # all styling (light/dark theme via CSS variables)
├── js/
│   └── script.js   # knowledge base, heuristics, AI fallback, chat UI logic
└── README.md
```

No build step, no dependencies, no framework — plain HTML/CSS/JS.

---

## ▶️ Run locally

Just open `index.html` in a browser, or serve it with any static server:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```



---

## 📋 Submission summary (for the 1M1B deliverable)

| Field | Detail |
|---|---|
| Title | SortSmart AI — Waste Segregation Assistant |
| SDG Alignment | SDG 11, SDG 12 |
| Target Users | Students, hostel residents, campus housekeeping staff, households |
| AI Components Used | Prompt engineering, retrieval-style local knowledge base, rule-based classification, AI reasoning fallback (Claude) |
| Prototype | This repository + live hosted demo link above |

---

## 📄 License

MIT — feel free to reuse or extend this for future sustainability projects.
