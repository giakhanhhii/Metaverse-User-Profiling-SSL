import axios from "axios";
import type {
  Dataset,
  ImageItem,
  ImageListOut,
  ModelMetric,
  UserFeature,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
const api = axios.create({ baseURL: BASE });

// Datasets
export const uploadDataset = (file: File, onProgress?: (pct: number) => void) => {
  const form = new FormData();
  form.append("file", file);
  return api.post<Dataset>("/api/datasets/upload", form, {
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};

export const listDatasets = () => api.get<Dataset[]>("/api/datasets");
export const getDataset = (id: string) => api.get<Dataset>(`/api/datasets/${id}`);
export const deleteDataset = (id: string) => api.delete(`/api/datasets/${id}`);

// Processing
export const startProcessing = (id: string) =>
  api.post<Dataset>(`/api/datasets/${id}/process`);
export const getStatus = (id: string) =>
  api.get<Dataset>(`/api/datasets/${id}/status`);

// Results
export const listImages = (
  datasetId: string,
  page = 1,
  pageSize = 20,
  userId?: string
) =>
  api.get<ImageListOut>(`/api/datasets/${datasetId}/images`, {
    params: { page, page_size: pageSize, ...(userId ? { user_id: userId } : {}) },
  });

export const getImage = (datasetId: string, imageId: string) =>
  api.get<ImageItem>(`/api/datasets/${datasetId}/images/${imageId}`);

export const listUsers = (datasetId: string) =>
  api.get<UserFeature[]>(`/api/datasets/${datasetId}/users`);

export const getUser = (datasetId: string, userId: string) =>
  api.get<UserFeature>(`/api/datasets/${datasetId}/users/${userId}`);

export const getMetrics = (datasetId: string) =>
  api.get<ModelMetric[]>(`/api/datasets/${datasetId}/metrics`);

// Export URLs (direct download)
export const exportUrl = (datasetId: string, format: "csv" | "excel" | "json" | "pdf") =>
  `${BASE}/api/datasets/${datasetId}/export/${format}`;

// Image preview URL
export const imageUrl = (datasetId: string, userId: string, fileName: string) =>
  `${BASE}/uploads/${datasetId}/${userId}/${fileName}`;
