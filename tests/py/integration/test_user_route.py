import os
import sys

from fastapi.testclient import TestClient


def _load_app():
    api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../apps/backend-api'))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from main import app  # type: ignore
    return app


def test_create_and_get_user():
    app = _load_app()
    client = TestClient(app)
    user_id = '00000000-0000-0000-0000-000000000000'
    # Create
    res = client.post('/users', json={"id": user_id, "name": "Ada"})
    assert res.status_code == 200
    # Read
    res = client.get(f'/users/{user_id}')
    assert res.status_code == 200
    body = res.json()
    assert body.get('id') == user_id
    assert body.get('name') == 'Ada'
