from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel
from .di import inject_uow
from .uow import UnitOfWork
from .repository import UserEntity
from .services import UserService


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
    svc = UserService()
    created = svc.create_user(uow, id=user.id, name=user.name)
    return User(id=created.id, name=created.name)


@app.post("/users/with-error", status_code=500)
def create_user_then_fail(user: User, uow: UnitOfWork = Depends(inject_uow)):
    try:
        with uow.transaction():
            uow.users_save(UserEntity(**user.dict()))
            raise RuntimeError("boom")
    except RuntimeError:
        # Deliberate failure to test rollback
        raise HTTPException(status_code=500, detail="simulated failure")


@app.put("/users/{user_id}", response_model=User)
def update_user(user_id: str, user: User, uow: UnitOfWork = Depends(inject_uow)) -> User:
    svc = UserService()
    try:
        updated = svc.rename_user(uow, id=user_id, name=user.name)
    except KeyError:
        raise HTTPException(status_code=404, detail="User not found")
    return User(id=updated.id, name=updated.name)


@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: str, uow: UnitOfWork = Depends(inject_uow)):
    svc = UserService()
    svc.delete_user(uow, id=user_id)
    return None


@app.put("/users/{user_id}/with-error", status_code=500)
def update_user_then_fail(user_id: str, user: User, uow: UnitOfWork = Depends(inject_uow)):
    """Simulate an update followed by a failure to exercise rollback semantics."""
    try:
        with uow.transaction():
            # Ensure exists before simulating failure
            if uow.users_get(user_id) is None:
                raise HTTPException(status_code=404, detail="User not found")
            uow.users_update(UserEntity(id=user_id, name=user.name))
            raise RuntimeError("boom")
    except HTTPException:
        # Propagate not found
        raise
    except RuntimeError:
        # Deliberate failure to test rollback
        raise HTTPException(status_code=500, detail="simulated failure")
