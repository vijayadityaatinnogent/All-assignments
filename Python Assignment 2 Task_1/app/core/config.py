from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    database_username: str = "root"
    database_password: str = "Demonvijay@786"
    database_hostname: str = "localhost"
    database_port: str = "3306"
    database_name: str = "fastapi"
    database_driver: str = "mysql+mysqlconnector"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
    
    @property
    def database_url(self) -> str:
        return f"{self.database_driver}://{self.database_username}:{self.database_password}@{self.database_hostname}:{self.database_port}/{self.database_name}"

settings = Settings()