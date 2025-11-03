from fastapi import FastAPI
from app.db.database import Base, engine
from app.core.config import settings
from app.api import routes_category, routes_company, routes_products
from app.utils.logger import RequestLoggerMiddleware
from app.utils.logger import logger


# FastAPI app instance
app = FastAPI(title="Product Management API",version="1.0.0")

app.add_middleware(RequestLoggerMiddleware)

# Create all tables (temporary for development)
Base.metadata.create_all(bind=engine)
logger.info("---------- Database tables created successfully. ----------")

#Include routers
app.include_router(routes_company.router)
app.include_router(routes_products.router)
app.include_router(routes_category.router)


@app.get("/")
def read_root():
    return {"message": "FastAPI Product Management API is running successfully!",
        "database": settings.database_name,
        "host": settings.database_hostname
    }
