from pydantic import BaseModel
import io
import csv
from fastapi import FastAPI, File, UploadFile, HTTPException
from prisma import Prisma
from typing import Optional
from fastapi import Query
from fastapi.responses import StreamingResponse
import pandas as pd
from routes import controller

app = FastAPI()
db = Prisma()

app.include_router(controller.router)

# App startup aur shutdown par DB connection manage karein
@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    if db.is_connected():
        await db.disconnect()

@app.get("/")
def read_root():
    return {"message": "FastAPI File Read/Write API is running successfully!"}