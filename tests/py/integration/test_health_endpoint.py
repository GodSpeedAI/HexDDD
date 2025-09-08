import os
import sys

from fastapi.testclient import TestClient


def _load_app():
    # Allow importing apps/backend-api/main.py as module "main"
    api_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../apps/backend-api'))
    if api_dir not in sys.path:
        sys.path.insert(0, api_dir)
    from main import app  # type: ignore
    return app


def test_health_endpoint_ok():
    app = _load_app()
    client = TestClient(app)
    res = client.get('/health')
    assert res.status_code == 200
    body = res.json()
    assert body.get('status') == 'ok'


def test_api_health_endpoint_ok():
    app = _load_app()
    client = TestClient(app)
    res = client.get('/api/health')
    assert res.status_code == 200
    body = res.json()
    assert body.get('status') == 'ok'
