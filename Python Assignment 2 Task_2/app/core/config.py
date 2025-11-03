# app/core/config.py
from pydantic import computed_field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # typed settings
    database_username: str = "root"
    database_password: str = "Demonvijay@786"
    database_hostname: str = "localhost"
    database_port: int = 3306
    database_name: str = "fastapi_db"
    database_driver: str = "mysql"  # use 'mysql' for prisma or 'mysql+mysqlconnector' for SQLAlchemy

    # Pydantic v2 settings: use model_config to set env_file and extra handling
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        # allow env vars that do not map to model fields (so DATABASE_URL won't raise)
        "extra": "ignore",
    }

    @computed_field
    def database_url(self) -> str:
        # this is a computed field (not read from env); use this string for connections
        return f"{self.database_driver}://{self.database_username}:{self.database_password}@{self.database_hostname}:{self.database_port}/{self.database_name}"


settings = Settings()
