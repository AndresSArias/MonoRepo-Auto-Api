from models.schema import DatabaseSchema


def process_schema(schema: DatabaseSchema):
    # Aquí la logica para utilizar lo de gpt
    return {"success": "Schema processed successfully",
            "main.py":
                """if __name__ == "__main__":
                    print("hola mundo")"""
            }
