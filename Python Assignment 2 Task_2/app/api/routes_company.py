from fastapi import APIRouter, HTTPException, status
from prisma import Prisma
# from app.db.prisma_db import prisma as db


router = APIRouter(prefix="/companies", tags=["Companies"])
db = Prisma()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_company(name: str, location: str):
    company = await db.company.create(data={"name": name, "location": location})
    return company


@router.get("/{company_id}")
async def get_company(company_id: int):
    company = await db.company.find_unique(where={"id": company_id})
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return company


@router.put("/{company_id}")
async def update_company(company_id: int, name: str = None, location: str = None):
    data = {}
    if name:
        data["name"] = name
    if location:
        data["location"] = location

    existing = await db.company.find_unique(where={"id": company_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    updated = await db.company.update(where={"id": company_id}, data=data)
    return updated


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int):
    existing = await db.company.find_unique(where={"id": company_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    await db.company.delete(where={"id": company_id})
    return {"detail": "Company deleted successfully"}
