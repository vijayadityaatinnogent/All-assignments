from fastapi import APIRouter, HTTPException, status
from prisma import Prisma
from pydantic import BaseModel

router = APIRouter(prefix="/categories", tags=["Categories"])
db = Prisma()


# ---------- Pydantic Schemas ----------
class CategoryCreate(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        orm_mode = True


# ---------- Routes ----------

@router.post("/categories/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate):
    """Create a new category"""
    existing = await db.Category.find_first(where={"name": payload.name})
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")

    category = await db.Category.create(data={"name": payload.name})
    return category


@router.get("/categories/", response_model=list[CategoryResponse])
async def get_all_categories():
    """Get all categories"""
    categories = await db.Category.find_many()
    return categories


@router.get("/categories/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int):
    """Get a category by ID"""
    category = await db.Category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, payload: CategoryCreate):
    """Update a category"""
    category = await db.Category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    updated = await db.Category.update(
        where={"id": category_id},
        data={"name": payload.name}
    )
    return updated


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int):
    """Delete a category"""
    category = await db.Category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.Category.delete(where={"id": category_id})
    return None
