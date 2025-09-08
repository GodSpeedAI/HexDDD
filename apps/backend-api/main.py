from fastapi import Depends, FastAPI
from pydantic import BaseModel
from .di import inject_uow
from .uow import UnitOfWork


app = FastAPI(title="Backend API")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/health")
def api_health():
    # Mirror /health for clients using "/api" base path.
    return {"status": "ok"}


class User(BaseModel):
    id: str
    name: str


@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str, uow: UnitOfWork = Depends(inject_uow)) -> User:  # pragma: no cover - trivial demo
    # Minimal example: return a sample user. Replace with real data access.
    # Demonstrate UoW presence (not used otherwise).
    _ = uow.is_active()
    return User(id=user_id, name="Ada Lovelace")
