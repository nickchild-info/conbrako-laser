# KoosDoos Fire Pits API

FastAPI backend for the KoosDoos Fire Pits ecommerce platform.

## Quick Start

### 1. Start PostgreSQL with Docker

```bash
docker-compose up -d
```

### 2. Set up Python environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Run migrations

```bash
alembic upgrade head
```

### 5. Start the server

```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/api/v1/health

## Project Structure

```
apps/api/
├── alembic/              # Database migrations
│   ├── versions/         # Migration files
│   └── env.py           # Alembic environment
├── app/
│   ├── core/            # Core configuration
│   │   ├── config.py    # Settings
│   │   └── database.py  # Database setup
│   ├── models/          # SQLAlchemy models
│   ├── routers/         # API endpoints
│   └── schemas/         # Pydantic schemas
├── docker-compose.yml   # PostgreSQL container
├── requirements.txt     # Python dependencies
└── alembic.ini         # Alembic configuration
```

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Migrations**: Alembic
- **Validation**: Pydantic
