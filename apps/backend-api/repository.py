from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass
class UserEntity:
  id: str
  name: str


class InMemoryUserRepository:
  """Simple in-memory user repository with transactional staging support."""

  def __init__(self) -> None:
    self._store: Dict[str, UserEntity] = {}

  # Transaction staging buffers are provided by the UnitOfWork.
  def get(self, user_id: str, *, staging: Optional[Dict[str, UserEntity]] = None) -> Optional[UserEntity]:
    src = staging if staging is not None else self._store
    return src.get(user_id)

  def save(self, user: UserEntity, *, staging: Optional[Dict[str, UserEntity]] = None) -> None:
    target = staging if staging is not None else self._store
    target[user.id] = user

  # Commit staged changes into the main store
  def commit(self, staged: Dict[str, UserEntity]) -> None:
    self._store = dict(staged)

  def snapshot(self) -> Dict[str, UserEntity]:
    return dict(self._store)

