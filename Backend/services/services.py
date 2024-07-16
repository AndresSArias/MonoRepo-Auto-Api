from models.schema import DatabaseSchema
from openai import OpenAI
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

def process_schema(schema: str):
    print(f'el modelo:\n{schema}\nyet modelo')
    # Crear el cliente de OpenAI
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are an expert in FastAPI, skilled in creating REST API applications with relational models. You always respond with a JSON that has the file names involved in your REST API application as keys, and their values are the content of the files, meaning the Python code that you generate."},
            {"role": "user", "content": "Make me a REST API in FastAPI with this relational model: {'Hola'}"}
        ],
    )
    
    print(completion.choices[0].message)

    return {"messeage": "Estoy funcionando2"}
