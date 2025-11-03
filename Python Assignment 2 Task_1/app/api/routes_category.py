from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app import model
from app.schema import category as category_schema

router = APIRouter(prefix="/categories", tags=["categories"])



@router.post("/", response_model=category_schema.CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: category_schema.CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(model.category.Category).filter(model.category.Category.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    new_category = model.category.Category(**payload.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category



@router.get("/", response_model=List[category_schema.CategoryRead])
def get_all_categories(db: Session = Depends(get_db)):
    categories = db.query(model.category.Category).all()
    return categories



@router.get("/{category_id}", response_model=category_schema.CategoryRead)
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(model.category.Category).filter(model.category.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category



@router.put("/{category_id}", response_model=category_schema.CategoryRead)
def update_category(category_id: int, payload: category_schema.CategoryCreate, db: Session = Depends(get_db)):
    category = db.query(model.category.Category).filter(model.category.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    category.name = payload.name
    db.commit()
    db.refresh(category)
    return category



@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(model.category.Category).filter(model.category.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db.delete(category)
    db.commit()
    return {"detail": "Category deleted successfully"}
