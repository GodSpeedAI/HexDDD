from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from .di import inject_uow
from .uow import UnitOfWork
from .repository import UserEntity


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
def get_user(user_id: str, uow: UnitOfWork = Depends(inject_uow)) -> User:
    entity = uow.users_get(user_id)
    if not entity:
        raise HTTPException(status_code=404, detail="User not found")
    return User(id=entity.id, name=entity.name)


@app.post("/users", response_model=User)
def create_user(user: User, uow: UnitOfWork = Depends(inject_uow)) -> User:
    with uow.transaction():
        uow.users_save(UserEntity(**user.dict()))
    return user


@app.post("/users/with-error", status_code=500)
def create_user_then_fail(user: User, uow: UnitOfWork = Depends(inject_uow)):
    try:
        with uow.transaction():
            uow.users_save(UserEntity(**user.dict()))
            raise RuntimeError("boom")
    except RuntimeError:
        # Deliberate failure to test rollback
        raise HTTPException(status_code=500, detail="simulated failure")
