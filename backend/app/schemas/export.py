from pydantic import BaseModel


class ExportRequest(BaseModel):
    include_images: bool = True
    include_users: bool = True
    include_metrics: bool = True
