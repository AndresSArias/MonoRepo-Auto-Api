from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.schema import router as schema_router

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todas las orígenes, cambiar según sea necesario
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)


app.include_router(schema_router, prefix="/api/schema", tags=["schema"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)