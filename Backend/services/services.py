from models.schema import DatabaseSchema
from openai import OpenAI
from dotenv import load_dotenv
import re
import json

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

def process_schema_response(string_with_json, schema):
    # Usar una expresión regular para extraer el contenido JSON
    match = re.search(r'\{.*\}', string_with_json, re.DOTALL)
    if match:
        json_str = match.group(0)

        # Reemplazar \" con ' y eliminar solo los caracteres de control inválidos excepto \n
        json_str = json_str.replace('\\"', "'")
        
        # Eliminar caracteres de control inválidos pero dejar \n
        json_str = re.sub(r'[^\x20-\x7E\n]', '', json_str)

        # Convertir la cadena JSON a un objeto Python
        try:
            json_data = json.loads(json_str)
            return json_data  # Devolver el diccionario JSON directamente
        except json.JSONDecodeError as e:
            print(f"Error al decodificar JSON: {e}, tipo {str(e)}.\n Volviendolo a intentar...")
            return process_schema(schema)    

    else:
        print("No se encontró un JSON válido en la cadena proporcionada.\n Volviendolo a intentar...\n")
        return process_schema(schema)

    
def process_schema(schema: str):
    
    # Crear el cliente de OpenAI
    client = OpenAI()

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert in FastAPI, skilled in creating REST API applications with relational models. You always respond with a JSON that has the file names involved in your REST API application as keys, and their values are the content of the files, meaning the Python code that you generate."},
            {"role": "user", "content": F"Make me a REST API in FastAPI with this relational model: '{schema}'"}
        ],
    )
    
    return process_schema_response (completion.choices[0].message.content, schema)

     
