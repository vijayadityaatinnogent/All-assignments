from sqlalchemy import Column, Integer, String
from app.model.base import Base
from sqlalchemy.orm import relationship 
class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(String(500), nullable=True)
    
    products = relationship("Product", back_populates="company", cascade="all, delete")
    