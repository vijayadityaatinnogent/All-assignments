from fastapi import FastAPI
from app.db.database import prisma_db  # sirf ye import
from app.core.config import settings
from app.api import routes_category, routes_company, routes_products
from app.utils.logger import RequestLoggerMiddleware
from app.utils.logger import logger

app = FastAPI(title="Product Management API", version="1.0.0")
# print(settings.database_url)
import os
print("ENV DATABASE_URL:", os.environ.get("DATABASE_URL"))


@app.on_event("startup")
async def startup():
    logger.info("---------- Starting up the application. ----------")
    await prisma_db.connect()

@app.on_event("shutdown")
async def shutdown():
    logger.info("---------- Shutting down the application. ----------")
    await prisma_db.disconnect()

app.add_middleware(RequestLoggerMiddleware)

# Include routers
app.include_router(routes_company.router)
app.include_router(routes_products.router)
app.include_router(routes_category.router)

@app.get("/")
def read_root():
    return {
        "message": "FastAPI Product Management API is running successfully! WITH PRISMA",
        "database": settings.database_name,
        "host": settings.database_hostname
    }
