from fastapi import APIRouter
from models.schema import DatabaseSchema
from services.services import process_schema

router = APIRouter()


@router.post("/create_model")
async def receive_schema(schema: DatabaseSchema):
    result = process_schema(schema)
    return result


