from __future__ import annotations

from contextlib import contextmanager


class UnitOfWork:
  """Minimal Unit of Work stub for alignment with architecture.

  In real usage, this would manage DB sessions/transactions.
  """

  def __init__(self) -> None:
    # Placeholder for session/connection handles
    self._active = False

  @contextmanager
  def transaction(self):
    self._active = True
    try:
      yield self
      # commit would happen here
    except Exception:
      # rollback would happen here
      raise
    finally:
      self._active = False

  def is_active(self) -> bool:
    return self._active

