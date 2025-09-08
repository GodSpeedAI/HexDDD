from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Backend API")


@app.get("/health")
def health():
    return {"status": "ok"}


class User(BaseModel):
    id: str
    name: str


@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str) -> User:  # pragma: no cover - trivial demo
    # Minimal example: return a sample user. Replace with real data access.
    return User(id=user_id, name="Ada Lovelace")

