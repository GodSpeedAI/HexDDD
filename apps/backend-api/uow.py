from __future__ import annotations

from contextlib import contextmanager
from typing import Dict, Iterator, Optional

from repository import InMemoryUserRepository, UserEntity


class UnitOfWork:
  """Minimal Unit of Work stub for alignment with architecture.

  In real usage, this would manage DB sessions/transactions.
  """

  def __init__(self, repo: InMemoryUserRepository) -> None:
    self._active = False
    self._repo = repo
    self._staged: Optional[Dict[str, UserEntity]] = None

  @contextmanager
  def transaction(self) -> Iterator["UnitOfWork"]:
    self._active = True
    # Begin transaction by taking a snapshot of repo state
    self._staged = self._repo.snapshot()
    try:
      yield self
      # commit staged changes into repository
      if self._staged is not None:
        self._repo.commit(self._staged)
    except Exception:
      # rollback: drop staged changes by not committing
      raise
    finally:
      self._active = False
      self._staged = None

  def is_active(self) -> bool:
    return self._active

  # Convenience methods to operate on repo within a transaction
  def users_get(self, user_id: str) -> Optional[UserEntity]:
    return self._repo.get(user_id, staging=self._staged)

  def users_save(self, user: UserEntity) -> None:
    if self._staged is None:
      # Allow save outside transaction as immediate write (not typical, but safe for demo)
      self._repo.save(user)
    else:
      self._repo.save(user, staging=self._staged)

  def users_update(self, user: UserEntity) -> None:
    if self._staged is None:
      self._repo.update(user)
    else:
      self._repo.update(user, staging=self._staged)

  def users_delete(self, user_id: str) -> None:
    if self._staged is None:
      self._repo.delete(user_id)
    else:
      self._repo.delete(user_id, staging=self._staged)
