from prisma import Prisma
from app.db.prisma_db import prisma

async def create_company(name: str, location: str):
    return await prisma.company.create(
        data={"name": name, "location": location}
    )

async def get_company_by_id(company_id: int):
    return await prisma.company.find_unique(
        where={"id": company_id}
    )

async def update_company(company_id: int, name: str = None, location: str = None):
    data = {}
    if name:
        data["name"] = name
    if location:
        data["location"] = location
    return await prisma.company.update(
        where={"id": company_id},
        data=data
    )

async def delete_company(company_id: int):
    return await prisma.company.delete(
        where={"id": company_id}
    )