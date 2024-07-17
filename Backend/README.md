Hi, to deploy the backend of AUTO_API, follow these steps:

1. python -m venv venv
2. venv\Scripts\activate
3. pip install -r requirements.txt
4. create ".env" with ".env.template"
4. uvicorn main:app --reload

To use the endpoint:
http://127.0.0.1:8000/api/schema/create_model
In the body, send an example.json located in /Ideas
The endpoint responds with JSON.