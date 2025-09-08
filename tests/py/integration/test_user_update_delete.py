import os
import sys
from fastapi.testclient import TestClient


def _client():
    api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../apps/backend-api'))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from main import app  # type: ignore
    return TestClient(app)


def test_update_user_name():
    client = _client()
    uid = '33333333-3333-3333-3333-333333333333'
    # Create
    res = client.post('/users', json={"id": uid, "name": "Initial"})
    assert res.status_code == 200
    # Update
    res = client.put(f'/users/{uid}', json={"id": uid, "name": "Updated"})
    assert res.status_code == 200
    assert res.json().get('name') == 'Updated'
    # Verify persisted
    res = client.get(f'/users/{uid}')
    assert res.status_code == 200
    assert res.json().get('name') == 'Updated'


def test_delete_user():
    client = _client()
    uid = '44444444-4444-4444-4444-444444444444'
    # Create
    res = client.post('/users', json={"id": uid, "name": "ToDelete"})
    assert res.status_code == 200
    # Delete
    res = client.delete(f'/users/{uid}')
    assert res.status_code == 204
    # Confirm removal
    res = client.get(f'/users/{uid}')
    assert res.status_code == 404

