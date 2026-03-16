# 🌐 Metaverse User Profiling & Advertising Personalization
### 🚀 Personalized Advertising via Semi-Supervised Learning (SSL)

<p align="center">
  <img src="https://img.shields.io/badge/Research-Scientific-blue?style=for-the-badge&logo=googlescholar" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Metaverse-Personalization-8A2BE2?style=for-the-badge" />
</p>

---

## 📌 Project Overview

This repository contains the experimental framework and research findings for a scientific study conducted at **Thuongmai University**: 
> *"Utilizing Semi-Supervised Learning for User Profiling: Applications in Metaverse Advertising Personalization"*.

In the emerging Metaverse era, understanding user characteristics is essential for optimizing advertising costs and enhancing user experience. This study proposes a **Semi-Supervised Learning (SSL)** approach to classify user image data, addressing the challenge of limited labeled data in complex digital environments.

---

## 🛠 Technical Framework & Methodology

The project utilizes a **Self-training** architecture to leverage a small set of labeled data alongside a larger pool of unlabeled images.

### 🏗️ Data Pipeline
* **Preprocessing:** Pixel values scaled to `(0, 1)`.
* **Standardization:** All images resized to $128 \times 128$ (RGB).
* **Feature Engineering:** * **HOG** (Histogram of Oriented Gradients) for shape extraction.
    * **PCA** (Principal Component Analysis) for dimensionality reduction.

### 🤖 Evaluated Algorithms
We compared five core models to find the optimal classifier for the SSL loop:
* **Random Forest** (SOTA in this study)
* **SVM** | **Logistic Regression** | **KNN** | **Decision Tree**

---

## 📊 Dataset Specifications

The research utilized a custom-built dataset derived from real-world digital activity to represent the Metaverse social ecosystem.

| Metric | Details |
| :--- | :--- |
| **Total Images** | 9,748 validated images |
| **User Profiles** | 500 unique profiles |
| **Granular Labels** | 52 categories (Fashion, Tech, Food, etc.) |
| **Demographic** | Users aged 18–45 |

---

## 🏆 Performance Benchmarks

Experimental results conducted on *Intel Core i5-1235U, 16GB RAM*. **Random Forest** provided the best balance of accuracy and speed.

| Algorithm | Avg. Accuracy (5-folds) | Test Accuracy | Training Time |
| :--- | :---: | :---: | :---: |
| 🌲 **Random Forest** | **0.7880** | **0.7868** | **7.19s** |
| 🛡️ SVM | 0.7418 | 0.7342 | 170.56s |
| 📈 Logistic Regression | 0.7120 | 0.7059 | 212.50s |
| 📍 KNN | 0.6865 | 0.6923 | 2.09s |
| 🌳 Decision Tree | 0.6305 | 0.6397 | 123.74s |

---

## 🚀 Future Roadmap

- [ ] **Deep Learning:** Transitioning to CNNs and Siamese Networks.
- [ ] **Multimodal AI:** Integrating OCR and NLP for post-caption analysis.
- [ ] **Graph Mining:** Utilizing social relationship networks to refine clusters.

---

## 🎓 Research Team

**Management Information Systems (MIS), Thuongmai University**

* **Nguyen Trieu Gia Khanh**
* **Pham Huong Giang**
* **Dinh Thi Ngoc Diem**

**Supervised by:** 👨‍🏫 **Dr. Nguyen Thi Hoi** *Vice Dean of Faculty of Economic Information Systems and E-commerce.*

---
<p align="center">© 2025 Research Project - Thuongmai University</p> # 🌐 Metaverse User Profiling & Advertising Personalization
### 🚀 Personalized Advertising via Semi-Supervised Learning (SSL)

<p align="center">
  <img src="https://img.shields.io/badge/Research-Scientific-blue?style=for-the-badge&logo=googlescholar" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Metaverse-Personalization-8A2BE2?style=for-the-badge" />
</p>

---

## 📌 Project Overview

This repository contains the experimental framework and research findings for a scientific study conducted at **Thuongmai University**: 
> *"Utilizing Semi-Supervised Learning for User Profiling: Applications in Metaverse Advertising Personalization"*.

In the emerging Metaverse era, understanding user characteristics is essential for optimizing advertising costs and enhancing user experience. This study proposes a **Semi-Supervised Learning (SSL)** approach to classify user image data, addressing the challenge of limited labeled data in complex digital environments.

---

## 🛠 Technical Framework & Methodology

The project utilizes a **Self-training** architecture to leverage a small set of labeled data alongside a larger pool of unlabeled images.

### 🏗️ Data Pipeline
* **Preprocessing:** Pixel values scaled to `(0, 1)`.
* **Standardization:** All images resized to $128 \times 128$ (RGB).
* **Feature Engineering:** * **HOG** (Histogram of Oriented Gradients) for shape extraction.
    * **PCA** (Principal Component Analysis) for dimensionality reduction.

### 🤖 Evaluated Algorithms
We compared five core models to find the optimal classifier for the SSL loop:
* **Random Forest** (SOTA in this study)
* **SVM** | **Logistic Regression** | **KNN** | **Decision Tree**

---

## 📊 Dataset Specifications

The research utilized a custom-built dataset derived from real-world digital activity to represent the Metaverse social ecosystem.

| Metric | Details |
| :--- | :--- |
| **Total Images** | 9,748 validated images |
| **User Profiles** | 500 unique profiles |
| **Granular Labels** | 52 categories (Fashion, Tech, Food, etc.) |
| **Demographic** | Users aged 18–45 |

---

## 🏆 Performance Benchmarks

Experimental results conducted on *Intel Core i5-1235U, 16GB RAM*. **Random Forest** provided the best balance of accuracy and speed.

| Algorithm | Avg. Accuracy (5-folds) | Test Accuracy | Training Time |
| :--- | :---: | :---: | :---: |
| 🌲 **Random Forest** | **0.7880** | **0.7868** | **7.19s** |
| 🛡️ SVM | 0.7418 | 0.7342 | 170.56s |
| 📈 Logistic Regression | 0.7120 | 0.7059 | 212.50s |
| 📍 KNN | 0.6865 | 0.6923 | 2.09s |
| 🌳 Decision Tree | 0.6305 | 0.6397 | 123.74s |

---

## 🚀 Future Roadmap

- [ ] **Deep Learning:** Transitioning to CNNs and Siamese Networks.
- [ ] **Multimodal AI:** Integrating OCR and NLP for post-caption analysis.
- [ ] **Graph Mining:** Utilizing social relationship networks to refine clusters.

---

## 🎓 Research Team

**Management Information Systems (MIS), Thuongmai University**

* **Nguyen Trieu Gia Khanh**
* **Pham Huong Giang**
* **Dinh Thi Ngoc Diem**

**Supervised by:** 👨‍🏫 **Dr. Nguyen Thi Hoi** *Vice Dean of Faculty of Economic Information Systems and E-commerce.*

---
<p align="center">© 2025 Research Project - Thuongmai University</p>
