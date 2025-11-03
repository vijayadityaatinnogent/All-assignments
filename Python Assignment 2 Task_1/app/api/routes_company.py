from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app import model
from app.schema import company as company_schema

router = APIRouter(prefix="/companies", tags=["companies"])


@router.post("/", response_model=company_schema.CompanyRead, status_code=status.HTTP_201_CREATED)
def create_company(payload: company_schema.CompanyCreate, db: Session = Depends(get_db)):
    existing = db.query(model.company.Company).filter(model.company.Company.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company with this name already exists")

    comp = model.company.Company(**payload.model_dump())
    db.add(comp)
    db.commit()
    db.refresh(comp)
    return comp


@router.get("/{company_id}", response_model=company_schema.CompanyRead)
def get_company(company_id: int, db: Session = Depends(get_db)):
    comp = db.query(model.company.Company).filter(model.company.Company.id == company_id).first()
    if not comp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return comp


@router.put("/{company_id}", response_model=company_schema.CompanyRead)
def update_company(company_id: int, payload: company_schema.CompanyCreate, db: Session = Depends(get_db)):
    company = db.query(model.company.Company).filter(model.company.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    company.name = payload.name
    company.location = payload.location

    db.commit()
    db.refresh(company)
    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(model.company.Company).filter(model.company.Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")

    db.delete(company)
    db.commit()
    # For 204 we typically return nothing; but returning small message is fine too.
    return {"detail": "Company deleted successfully"}
