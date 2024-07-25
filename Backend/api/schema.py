from fastapi import APIRouter, Request
from models.schema import DatabaseSchema
from services.services import process_schema
import json

router = APIRouter()

@router.get("/")
async def root ():
    return {"messeage": "Estoy funcionando"}

@router.post("/create_model")
async def receive_schema(schema: Request):
    schema = await schema.json()
    schema = json.dumps(schema)
    result = process_schema(schema)
    return result

