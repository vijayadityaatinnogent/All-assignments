from pydantic import BaseModel
import io
import csv
from fastapi import APIRouter, APIRouter, FastAPI, File, UploadFile, HTTPException
from prisma import Prisma
from typing import Optional
from fastapi import Query
from fastapi.responses import StreamingResponse
import pandas as pd


router = APIRouter(prefix="/products", tags=["Product Management"])
db = Prisma()


# Task 1: API to upload and process CSV
@router.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    # Check karein ki file CSV hai ya nahi
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Please upload a CSV file.")

    contents = await file.read()
    # Bytes ko string mein decode karein
    file_content_str = contents.decode('utf-8')
    
    # String ko file jaisa treat karne ke liye StringIO ka use karein
    csv_file = io.StringIO(file_content_str)
    reader = csv.DictReader(csv_file)
    
    products_to_create = []
    for row in reader:
        try:
            products_to_create.routerend({
                "name": row['name'],
                "price": int(row['price']),
                "stock": int(row['stock']),
            })
        except (KeyError, ValueError) as e:
            raise HTTPException(status_code=400, detail=f"CSV file has format error: {e}")

    try:
        # Prisma 'create_many' se saara data ek saath save karein
        await db.product.create_many(data=products_to_create)
        # await db.product.create(data={"name": "Pen", "price": 10, "stock": 50}) -- data me dict jaati hai and vo usko accordingly map krta hai
        return {"message": "File processed and data saved successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in saving data in Database: {e}")
    


# Input data ke liye Pydantic model
class ProductCreate(BaseModel):
    name: str
    price: int
    stock: int

# Task 2: API to add data via JSON
@router.post("/add-product-data")
async def add_product(product: ProductCreate):
    try:
        new_product = await db.product.create(
            data={
                "name": product.name,
                "price": product.price,
                "stock": product.stock,
            }
        )
        return new_product
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in adding product: {e}")
    

# Task 3 & 4: API to download data
@router.get("/download-data")
async def download_data(
    format: Optional[str] = Query(None, enum=["csv", "xlsx"]),
    limit: Optional[int] = Query(None), # Advanced
    offset: Optional[int] = Query(None) # Advanced
):
    try:
        products = await db.product.find_many(
            take=limit,
            skip=offset
        )

        if not products:
            return {"message": "No data found."}

        # Prisma models ko list of dictionaries mein convert karein
        products_dict = [p.dict() for p in products]
        
        # Pandas DataFrame banayein
        df = pd.DataFrame(products_dict)
        
        if format == "csv":
            stream = io.StringIO()
            df.to_csv(stream, index=False)
            response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
            response.headers["Content-Disposition"] = "attachment; filename=products.csv"
            return response
            
        elif format == "xlsx":
            stream = io.BytesIO()
            df.to_excel(stream, index=False, sheet_name="Products")
            stream.seek(0) # Pointer ko shuru mein le jaayein
            response = StreamingResponse(stream, media_type="routerlication/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            response.headers["Content-Disposition"] = "attachment; filename=products.xlsx"
            return response

        # Agar koi format nahi diya hai, to JSON return karein
        return products

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in fetching data: {e}")