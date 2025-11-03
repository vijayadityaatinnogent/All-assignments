from sqlalchemy.orm import Session
from sqlalchemy import or_, String
from fastapi import HTTPException, status
from app.model import product as models
from app.model import company, category
from app.schema import product as schemas
from app.schema.product import ProductCreate, ProductRead, ProductBase



class ProductService:
    @staticmethod
    def create_product(db: Session, product_in: ProductCreate):

        # duplicate check: same name within same company
        exists = db.query(models.Product).filter(
            models.Product.name == product_in.name,
            models.Product.company_id == product_in.company_id
        ).first()
        if exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Product already exists for this company")

        # ensure company and category exist
        company = db.query(models.Company).filter(
            models.Company.id == product_in.company_id).first()
        if not company:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Company not found")

        category = db.query(models.category.Category).filter(
            models.category.Category.id == product_in.category_id).first()
        if not category:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail="Category not found")

        db_obj = models.Product(**product_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    @staticmethod
    def get_product(db: Session, product_id: int):
        prod = db.query(models.Product).filter(
            models.Product.id == product_id).first()
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        return prod

    @staticmethod
    def update_product(db: Session, product_id: int, product_in: ProductCreate):
        prod = db.query(models.Product).filter(
            models.Product.id == product_id).first()
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        # duplicate name check (if name changed)
        dup = db.query(models.Product).filter(
            models.Product.name == product_in.name,
            models.Product.company_id == product_in.company_id,
            models.Product.id != product_id
        ).first()
        if dup:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail="Another product with same name exists for this company")

        for field, value in product_in.model.dump().items():
            setattr(prod, field, value)

        db.add(prod)
        db.commit()
        db.refresh(prod)
        return prod

    @staticmethod
    def delete_product(db: Session, product_id: int):
        prod = db.query(models.Product).filter(
            models.Product.id == product_id).first()
        if not prod:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
        db.delete(prod)
        db.commit()
        return {"detail": "Deleted"}

    @staticmethod
    def search_products(db: Session, q: str = None, company_id: int = None, skip: int = 0, limit: int = 10):
        query = db.query(models.Product)

        if q:
            like_q = f"%{q}%"
        # search across name, description, price (price as text)
        query = query.filter(
            or_(
                models.Product.name.ilike(like_q),
                models.Product.description.ilike(like_q),
                models.Product.price.cast(String).ilike(like_q)
            )
        )

        if company_id:
            query = query.filter(models.Product.company_id == company_id)

        total = query.count()
        items = query.offset(skip).limit(limit).all()
        return {"total": total, "items": items}
