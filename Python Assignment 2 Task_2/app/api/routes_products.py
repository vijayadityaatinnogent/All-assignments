from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional
from prisma import Prisma
from app.schema import product as product_schema
# from app.db.prisma_db import prisma as db


router = APIRouter(prefix="/products", tags=["Products"])
db = Prisma()


@router.post("/", response_model=product_schema.ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(payload: product_schema.ProductCreate):
    product = await db.product.create(data=payload.model_dump())
    return product


@router.get("/", response_model=list[product_schema.ProductRead])
async def list_products(skip: int = 0, limit: int = 100, q: Optional[str] = Query(None)):
    filters = {}
    if q:
        filters = {"name": {"contains": q, "mode": "insensitive"}}

    products = await db.product.find_many(where=filters, skip=skip, take=limit)
    return products


@router.get("/{product_id}", response_model=product_schema.ProductRead)
async def get_product(product_id: int):
    product = await db.product.find_unique(where={"id": product_id})
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


@router.put("/{product_id}", response_model=product_schema.ProductRead)
async def update_product(product_id: int, payload: product_schema.ProductCreate):
    existing = await db.product.find_unique(where={"id": product_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    updated = await db.product.update(where={"id": product_id}, data=payload.model_dump())
    return updated


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int):
    existing = await db.product.find_unique(where={"id": product_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    await db.product.delete(where={"id": product_id})
    return {"detail": "Product deleted successfully"}
