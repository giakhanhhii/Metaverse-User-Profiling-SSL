export type DatasetStatus = "pending" | "processing" | "done" | "error";

export interface Dataset {
  id: string;
  name: string;
  status: DatasetStatus;
  progress: number;
  current_step: string;
  total_images: number;
  valid_images: number;
  invalid_images: number;
  error_message: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface TopKLabel {
  label: string;
  confidence: number;
}

export interface ImagePrediction {
  id: string;
  model_name: string;
  predicted_label: string;
  confidence: number;
  top_k_labels: TopKLabel[];
  is_correct: boolean | null;
}

export interface ImageItem {
  id: string;
  dataset_id: string;
  user_id: string;
  file_name: string;
  manual_label: string | null;
  created_at: string;
  predictions: ImagePrediction[];
}

export interface ImageListOut {
  items: ImageItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface UserFeature {
  id: string;
  dataset_id: string;
  user_id: string;
  total_images: number;
  top_interests: string[];
  interest_distribution: Record<string, number>;
  recommended_ads: string[];
  created_at: string;
}

export interface ModelMetric {
  id: string;
  dataset_id: string;
  model_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
  created_at: string;
}
