from fastapi import Depends

from .uow import UnitOfWork


def get_uow() -> UnitOfWork:
  # In a real app, wire a session factory or connection pool.
  return UnitOfWork()


def inject_uow(uow: UnitOfWork = Depends(get_uow)) -> UnitOfWork:
  return uow

