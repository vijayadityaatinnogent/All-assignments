from fastapi import APIRouter, Depends, status, HTTPException, Query
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.service import product_service
from app.service.product_service import ProductService
from app import model
from app.schema import product as product_schema

router = APIRouter(prefix="/products", tags=["products"])


@router.post("/", response_model=product_schema.ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: product_schema.ProductCreate, db: Session = Depends(get_db)):
    # If you have create logic inside product_service, call it. Fallback to direct DB if not.
    if hasattr(product_service, "create_product"):
        return product_service.create_product(db, payload)
    # fallback (basic):
    prod = model.product.Product(**payload.model_dump())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

# def create_product(payload: product_schema.ProductCreate, db: Session = Depends(get_db)):
#     try:
#         return ProductService.create_product(db, payload)
#     except Exception as e:
#         import traceback
#         print("INTERNAL_SERVER_ERROR:", str(e))
#         traceback.print_exc()
#         db.rollback()
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/", response_model=List[product_schema.ProductRead])
def list_products(skip: int = 0, limit: int = 100, q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if hasattr(product_service, "get_all_products"):
        return product_service.get_all_products(db, skip=skip, limit=limit, q=q)
    # fallback:
    query = db.query(model.product.Product)
    if q:
        query = query.filter(model.product.Product.name.ilike(f"%{q}%"))
    return query.offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=product_schema.ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    if hasattr(product_service, "get_product_by_id"):
        prod = product_service.get_product_by_id(db, product_id)
    else:
        prod = db.query(model.product.Product).filter(model.product.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return prod


@router.put("/{product_id}", response_model=product_schema.ProductRead)
def update_product(product_id: int, payload: product_schema.ProductCreate, db: Session = Depends(get_db)):
    if hasattr(product_service, "update_product"):
        return product_service.update_product(db, product_id, payload)
    # fallback:
    prod = db.query(model.product.Product).filter(model.product.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    for k, v in payload.model_dump().items():
        setattr(prod, k, v)
    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    if hasattr(product_service, "delete_product"):
        return product_service.delete_product(db, product_id)
    prod = db.query(model.product.Product).filter(model.product.Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    db.delete(prod)
    db.commit()
    return {"detail": "Product deleted successfully"}
