import os
import sys
from fastapi.testclient import TestClient


def _client():
    api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../apps/backend-api'))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from main import app  # type: ignore
    return TestClient(app)


def test_uow_commit_persists_user():
    client = _client()
    uid = '11111111-1111-1111-1111-111111111111'
    res = client.post('/users', json={"id": uid, "name": "Grace"})
    assert res.status_code == 200
    res = client.get(f'/users/{uid}')
    assert res.status_code == 200
    assert res.json().get('name') == 'Grace'


def test_uow_rollback_on_error():
    client = _client()
    uid = '22222222-2222-2222-2222-222222222222'
    res = client.post('/users/with-error', json={"id": uid, "name": "Failing"})
    assert res.status_code == 500
    res = client.get(f'/users/{uid}')
    assert res.status_code == 404


def test_uow_update_rollback_on_error():
    client = _client()
    uid = '55555555-5555-5555-5555-555555555555'
    # Seed a user
    res = client.post('/users', json={"id": uid, "name": "Original"})
    assert res.status_code == 200
    # Attempt to update then fail
    res = client.put(f'/users/{uid}/with-error', json={"id": uid, "name": "Changed"})
    assert res.status_code == 500
    # Verify name has not changed
    res = client.get(f'/users/{uid}')
    assert res.status_code == 200
    assert res.json().get('name') == 'Original'
