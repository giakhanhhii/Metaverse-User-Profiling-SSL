from pathlib import Path
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    database_url: str = f"sqlite+aiosqlite:///{BASE_DIR}/app.db"
    upload_dir: Path = BASE_DIR / "uploads"
    models_dir: Path = BASE_DIR / "models_saved"
    exports_dir: Path = BASE_DIR / "exports"
    clip_model_name: str = "ViT-B-32"
    clip_pretrained: str = "openai"
    self_training_confidence: float = 0.85
    self_training_iterations: int = 3
    batch_size: int = 32
    cors_origins: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    class Config:
        env_file = ".env"


settings = Settings()

# Ensure runtime directories exist
settings.upload_dir.mkdir(parents=True, exist_ok=True)
settings.models_dir.mkdir(parents=True, exist_ok=True)
settings.exports_dir.mkdir(parents=True, exist_ok=True)
