# Metaverse User Profiling — Semi-Supervised Learning

A Metaverse user behavior analysis application using semi-supervised learning (SSL), automatically extracting features from images and recommending personalized advertisements.

---
## Dashboard
<img width="1897" height="867" alt="metaverse dashboard" src="https://github.com/user-attachments/assets/073953c6-9668-4f34-be31-3740b50195bf" />

## Project Structure

```
├── backend/    FastAPI + SQLite + ML pipeline
├── frontend/   Next.js 14 + Tailwind CSS (builds to frontend/out/)
└── start.ps1   Single command — build + serve
```

## Quick Start (1 step)

```powershell
.\start.ps1
```

Open browser: **http://localhost:8000**

> The script automatically builds the frontend → copies to `frontend/out/` → FastAPI serves both UI and API on the same port 8000.

---

### Manual Start (if needed)

**Backend (Terminal 1)**

```powershell
.\start_backend.ps1
# or
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

**Frontend (Terminal 2)**

```powershell
.\start_frontend.ps1
# or
cd frontend
npm run dev
```

App: http://localhost:3000

---

## Workflow

1. **Upload** — Upload a ZIP file containing images structured as `user_001/img.jpg`
2. **Processing** — Pipeline: CLIP embedding → Semi-supervised self-training (5 models)
3. **Results** — Dashboard: metrics, interest distribution, ad recommendations
4. **Detail** — View per-image predictions from all 5 models
5. **Export** — Download CSV / Excel / JSON / PDF

---

## ML Pipeline

```
ZIP → CLIP feature extraction (ViT-B/32, 512-dim) → Zero-shot seed labels
    → Self-training (3 rounds, conf ≥ 0.85)
    → 5 classifiers: LR / DT / RF / SVM / KNN
    → User profile aggregation → Ad recommendations
    → Evaluation: Accuracy, Precision, Recall, F1
```

## ML Models

| Model | Characteristics |
|-------|----------------|
| Logistic Regression | Fast, interpretable |
| Decision Tree | Visual, easy to understand |
| Random Forest | Stable, low overfitting |
| SVM | Effective in high-dimensional space |
| KNN | Simple, no training required |

## 30 Interest Labels

advertise, animal, art, baby, beach, beauty, books, cars, cooking, education,
fashion, finance, fitness, food, gaming, garden, health, home, humor, music,
nature, parenting, pets, politics, religion, shopping, sport, tech, travel, wedding
