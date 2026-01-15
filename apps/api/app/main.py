"""KoosDoos Fire Pits - FastAPI Application."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .routers import health, products, collections, design_templates, cart, uploads, webhooks, admin, shipping

settings = get_settings()

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="API for KoosDoos Fire Pits ecommerce platform",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.api_v1_prefix)
app.include_router(products.router, prefix=settings.api_v1_prefix)
app.include_router(collections.router, prefix=settings.api_v1_prefix)
app.include_router(design_templates.router, prefix=settings.api_v1_prefix)
app.include_router(cart.router, prefix=settings.api_v1_prefix)
app.include_router(uploads.router, prefix=settings.api_v1_prefix)
app.include_router(webhooks.router, prefix=settings.api_v1_prefix)
app.include_router(admin.router, prefix=settings.api_v1_prefix)
app.include_router(shipping.router, prefix=settings.api_v1_prefix)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Welcome to KoosDoos Fire Pits API",
        "docs": "/docs",
        "health": f"{settings.api_v1_prefix}/health",
    }
