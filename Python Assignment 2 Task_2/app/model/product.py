from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.model.base import Base
from sqlalchemy.orm import relationship

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    price = Column(Float, nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)

    company = relationship("Company", back_populates="products")
    category = relationship("Category", back_populates="products")