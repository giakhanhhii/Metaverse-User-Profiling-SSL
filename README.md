# Metaverse User Profiling — Semi-Supervised Learning

Ứng dụng phân tích hành vi người dùng Metaverse bằng học bán giám sát (SSL), tự động trích xuất đặc trưng từ ảnh và đề xuất quảng cáo cá nhân hóa.

---

## Cấu trúc dự án

```
├── backend/    FastAPI + SQLite + ML pipeline
├── frontend/   Next.js 14 + Tailwind CSS (builds to frontend/out/)
├── docs/       Tài liệu nghiên cứu gốc
└── start.ps1   Một lệnh duy nhất — build + serve
```

## Khởi động (1 bước)

```powershell
.\start.ps1
```

Mở trình duyệt: **http://localhost:8000**

> Script sẽ tự build frontend → copy vào `frontend/out/` → FastAPI serve cả UI lẫn API trên cùng một cổng 8000.

---

### Khởi động thủ công (nếu cần)

```powershell
.\start_backend.ps1
# hoặc
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend (Terminal 2)

```powershell
.\start_frontend.ps1
# hoặc
cd frontend
npm run dev
```

Ứng dụng: http://localhost:3000

---

## Quy trình sử dụng

1. **Tải lên** — Upload file ZIP chứa ảnh theo cấu trúc `user_001/img.jpg`
2. **Xử lý** — Pipeline: CLIP embedding → Semi-supervised self-training (5 models)
3. **Kết quả** — Dashboard: metrics, phân phối sở thích, gợi ý quảng cáo
4. **Chi tiết** — Xem dự đoán từng ảnh từ 5 mô hình
5. **Xuất** — Download CSV / Excel / JSON / PDF

---

## Pipeline ML

```
ZIP → Trích xuất CLIP (ViT-B/32, 512-dim) → Zero-shot seed labels
    → Self-training (3 vòng, conf ≥ 0.85)
    → 5 classifiers: LR / DT / RF / SVM / KNN
    → Tổng hợp user profile → Gợi ý quảng cáo
    → Đánh giá: Accuracy, Precision, Recall, F1
```

## Các mô hình ML

| Mô hình | Đặc điểm |
|---------|----------|
| Logistic Regression | Nhanh, diễn giải được |
| Decision Tree | Trực quan, dễ hiểu |
| Random Forest | Ổn định, ít overfitting |
| SVM | Hiệu quả với không gian chiều cao |
| KNN | Đơn giản, không cần training |

## 30 Nhãn sở thích

advertise, animal, art, baby, beach, beauty, books, cars, cooking, education,
fashion, finance, fitness, food, gaming, garden, health, home, humor, music,
nature, parenting, pets, politics, religion, shopping, sport, tech, travel, wedding
