"""Application configuration using pydantic-settings."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    app_name: str = "KoosDoos Fire Pits API"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    # Database (SQLite for local dev, PostgreSQL for production)
    database_url: str = "sqlite:///./koosdoos.db"

    # CORS
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
    ]

    # Payfast (SA Payment Gateway)
    payfast_merchant_id: str = "10000100"  # Sandbox default
    payfast_merchant_key: str = "46f0cd694581a"  # Sandbox default
    payfast_passphrase: str = ""  # Empty for sandbox
    payfast_sandbox: bool = True
    payfast_return_url: str = "http://localhost:3000/order-confirmation"
    payfast_cancel_url: str = "http://localhost:3000/cart"
    payfast_notify_url: str = "http://localhost:8001/api/v1/webhooks/payfast"

    # The Courier Guy (Shipping)
    tcg_api_key: str = ""
    tcg_account_number: str = ""
    tcg_api_url: str = "https://api.thecourierguy.co.za"
    tcg_sandbox: bool = True  # Use mock responses when True

    # Warehouse address for shipping (collection point)
    warehouse_address: str = "123 Industrial Road"
    warehouse_suburb: str = "Centurion"
    warehouse_city: str = "Pretoria"
    warehouse_province: str = "Gauteng"
    warehouse_postal_code: str = "0157"
    warehouse_country: str = "ZA"

    # S3/Storage
    s3_bucket: str = ""
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_endpoint_url: str = ""

    # Admin
    admin_api_key: str = "koosdoos-admin-secret-key-change-in-production"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
