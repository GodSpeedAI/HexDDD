from __future__ import annotations

from .uow import UnitOfWork
from .repository import UserEntity


class UserService:
  def create_user(self, uow: UnitOfWork, *, id: str, name: str) -> UserEntity:
    with uow.transaction():
      entity = UserEntity(id=id, name=name)
      uow.users_save(entity)
      return entity

  def rename_user(self, uow: UnitOfWork, *, id: str, name: str) -> UserEntity:
    with uow.transaction():
      existing = uow.users_get(id)
      if existing is None:
        raise KeyError("user not found")
      updated = UserEntity(id=id, name=name)
      uow.users_update(updated)
      return updated

  def delete_user(self, uow: UnitOfWork, *, id: str) -> None:
    with uow.transaction():
      uow.users_delete(id)

