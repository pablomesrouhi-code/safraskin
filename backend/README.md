# Safraskin API

FastAPI backend for Morocco COD orders.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Easypanel: Dockerfile `backend/Dockerfile`, context `backend`, port `8000`.
Need a Postgres service. Set DATABASE_URL to the internal hostname.