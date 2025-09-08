from fastapi import Depends

from .uow import UnitOfWork
from .repository import InMemoryUserRepository

_singleton_user_repo = InMemoryUserRepository()


def get_uow() -> UnitOfWork:
  # In a real app, wire a session factory or connection pool.
  return UnitOfWork(_singleton_user_repo)


def inject_uow(uow: UnitOfWork = Depends(get_uow)) -> UnitOfWork:
  return uow
