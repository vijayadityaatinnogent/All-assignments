from pydantic import BaseModel
from typing import Optional, List

class Company(BaseModel):
    name: str
    description: Optional[str] = None

class CompanyCreate(Company):
    pass

class CompanyRead(Company):
    class Config:
        from_attributes = True