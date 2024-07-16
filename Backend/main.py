from fastapi import FastAPI
from api.schema import router as schema_router

app = FastAPI()

app.include_router(schema_router, prefix="/api/schema", tags=["schema"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)