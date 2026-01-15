"""Tests for design templates endpoints."""
import pytest
from app.models.design import DesignTemplate, DesignCategory


def seed_design_templates(db_session):
    """Helper to seed design templates."""
    templates = [
        DesignTemplate(
            id=1,
            name="Elephant",
            category=DesignCategory.WILDLIFE,
            thumbnail="/images/templates/elephant.jpg",
            svg_path="/templates/elephant.svg",
        ),
        DesignTemplate(
            id=2,
            name="Lion",
            category=DesignCategory.WILDLIFE,
            thumbnail="/images/templates/lion.jpg",
            svg_path="/templates/lion.svg",
        ),
        DesignTemplate(
            id=3,
            name="Protea",
            category=DesignCategory.NATURE,
            thumbnail="/images/templates/protea.jpg",
            svg_path="/templates/protea.svg",
        ),
        DesignTemplate(
            id=4,
            name="Rugby Ball",
            category=DesignCategory.SPORTS,
            thumbnail="/images/templates/rugby.jpg",
            svg_path="/templates/rugby.svg",
        ),
        DesignTemplate(
            id=5,
            name="Geometric Pattern",
            category=DesignCategory.PATTERNS,
            thumbnail="/images/templates/geometric.jpg",
            svg_path="/templates/geometric.svg",
        ),
    ]

    db_session.add_all(templates)
    db_session.commit()

    return templates


class TestDesignTemplatesList:
    """Tests for design templates list endpoint."""

    def test_list_templates_empty(self, client, db_session):
        """Test listing templates when database is empty."""
        response = client.get("/api/v1/design-templates")
        assert response.status_code == 200
        data = response.json()
        assert data["templates"] == []
        assert data["total"] == 0

    def test_list_all_templates(self, client, db_session):
        """Test listing all design templates."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates")
        assert response.status_code == 200
        data = response.json()
        assert len(data["templates"]) == 5
        assert data["total"] == 5

    def test_filter_templates_by_category(self, client, db_session):
        """Test filtering templates by category."""
        seed_design_templates(db_session)

        # Filter for wildlife templates
        response = client.get("/api/v1/design-templates?category=wildlife")
        assert response.status_code == 200
        data = response.json()
        assert len(data["templates"]) == 2

        for template in data["templates"]:
            assert template["category"] == "wildlife"

    def test_filter_templates_nature(self, client, db_session):
        """Test filtering templates by nature category."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates?category=nature")
        assert response.status_code == 200
        data = response.json()
        assert len(data["templates"]) == 1
        assert data["templates"][0]["name"] == "Protea"

    def test_filter_templates_sports(self, client, db_session):
        """Test filtering templates by sports category."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates?category=sports")
        assert response.status_code == 200
        data = response.json()
        assert len(data["templates"]) == 1
        assert data["templates"][0]["name"] == "Rugby Ball"

    def test_filter_templates_patterns(self, client, db_session):
        """Test filtering templates by patterns category."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates?category=patterns")
        assert response.status_code == 200
        data = response.json()
        assert len(data["templates"]) == 1
        assert data["templates"][0]["name"] == "Geometric Pattern"

    def test_filter_templates_invalid_category(self, client, db_session):
        """Test filtering with invalid category."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates?category=invalid")
        # Should either return empty or 422 validation error
        assert response.status_code in [200, 422]

    def test_template_structure(self, client, db_session):
        """Test that template response has correct structure."""
        seed_design_templates(db_session)

        response = client.get("/api/v1/design-templates")
        assert response.status_code == 200
        data = response.json()

        template = data["templates"][0]
        assert "id" in template
        assert "name" in template
        assert "category" in template
        assert "thumbnail" in template
        assert "svg_path" in template
