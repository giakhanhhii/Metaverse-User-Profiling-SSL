import type { ImagePrediction } from "@/lib/types";

interface Props {
  predictions: ImagePrediction[];
}

const MODEL_LABELS: Record<string, string> = {
  logistic_regression: "Logistic Regression",
  decision_tree:       "Decision Tree",
  random_forest:       "Random Forest",
  svm:                 "SVM",
  knn:                 "KNN",
};

export function PredictionTable({ predictions }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
            <th className="px-3 py-2 text-left font-semibold">Mô hình</th>
            <th className="px-3 py-2 text-left font-semibold">Nhãn dự đoán</th>
            <th className="px-3 py-2 text-left font-semibold">Độ tin cậy</th>
            <th className="px-3 py-2 text-left font-semibold">Top-3 nhãn</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {predictions.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2 font-medium text-gray-700">
                {MODEL_LABELS[p.model_name] ?? p.model_name}
              </td>
              <td className="px-3 py-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
                  {p.predicted_label}
                </span>
              </td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                      style={{ width: `${Math.round(p.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{Math.round(p.confidence * 100)}%</span>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="flex flex-wrap gap-1">
                  {p.top_k_labels.slice(0, 3).map((t) => (
                    <span key={t.label} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {t.label}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
