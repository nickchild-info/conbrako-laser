"""Tests for health check endpoints."""
import pytest


def test_root_endpoint(client):
    """Test the root endpoint returns welcome message."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "KoosDoos" in data["message"]
    assert "docs" in data
    assert "health" in data


def test_health_check(client):
    """Test the basic health check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data


def test_health_check_db(client, db_session):
    """Test the database health check endpoint."""
    response = client.get("/api/v1/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
