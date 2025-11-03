from pydantic import BaseModel
from typing import Optional

class Category(BaseModel):
    name: str

class CategoryCreate(Category):
    pass

class CategoryRead(Category):
    id: int

    class Config:
        from_attributes = True