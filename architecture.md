# Cook Mode: Full-Stack Architecture

This document describes the complete backend-supported architecture for the Cook Mode platform, designed as a full-stack Capstone Project. It transitions the original front-end-heavy application into a scalable, robust, data-driven application using Node.js, Express, and SQLite.

## System Overview

The system is composed of three main layers:

1. **Frontend**: HTML/CSS/JS application providing Recipe Discovery, Cook Mode UI, servings adjustments, and Shopping List generation.
2. **Backend API**: A Node.js/Express RESTful API that handles business logic, including recipe retrieval, ingredient-to-inventory matching, and cart management.
3. **Database**: A SQLite database storing persistent data (Recipes, Ingredients, Supermarkets, Inventory, Users).

---

## Entity Relationship Diagram (ERD)

The following Mermaid diagram maps out the relationships between the database tables.

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email
        string password_hash
        datetime created_at
    }

    CATEGORIES {
        string id PK
        string name
        string emoji
        string image
    }

    SUPERMARKETS {
        string id PK
        string name
        float lat
        float lng
        string address
        string city
        string hours
    }

    INGREDIENTS {
        string id PK
        string name
        string brand
        string category_id FK
        string weight
        string unit_type
        string image
        string tags
    }

    INVENTORY {
        string ingredient_id PK, FK
        string store_id PK, FK
        float price
        string stock_status
    }

    RECIPES {
        string id PK
        string name
        string emoji
        string category
        string servings
    }

    RECIPE_INGREDIENTS {
        string recipe_id PK, FK
        string ingredient_id PK, FK
        string quantity
    }

    CARTS {
        string id PK
        string items
        datetime created_at
        datetime updated_at
    }
    
    CART_MEMBERS {
        int id PK
        string cart_id FK
        string name
        string emoji
        float lat
        float lng
        string location_name
    }

    ORDERS {
        string id PK
        string cart_id FK
        string placed_by
        string items
        float total
        string payment_method
        string payment_details
        string status
        datetime created_at
    }

    %% Relationships
    CATEGORIES ||--o{ INGREDIENTS : "contains"
    INGREDIENTS ||--o{ INVENTORY : "available_as"
    SUPERMARKETS ||--o{ INVENTORY : "stocks"
    RECIPES ||--o{ RECIPE_INGREDIENTS : "requires"
    INGREDIENTS ||--o{ RECIPE_INGREDIENTS : "used_in"
    CARTS ||--o{ CART_MEMBERS : "has"
    CARTS ||--o| ORDERS : "converted_to"
```

## API Endpoint Specifications

Below are the suggested REST API endpoints for the capstone project.

### Recipes
*   `GET /api/recipes`
    *   **Description**: Fetch a list of all recipes.
    *   **Query Params**: `?category=Kazakh Cuisine`, `?search=plov`
*   `GET /api/recipes/:id`
    *   **Description**: Fetch a single recipe by ID, fully populated with its ingredients.

### Ingredients & Categories
*   `GET /api/categories`
    *   **Description**: Returns all categories (including `grains`).
*   `GET /api/ingredients`
    *   **Description**: Fetch ingredients.
    *   **Query Params**: `?category_id=grains`, `?search=rice`

### Stores & Inventory
*   `GET /api/supermarkets`
    *   **Description**: List all supermarkets, optionally filtered by proximity (`?lat=x&lng=y`).
*   `GET /api/inventory`
    *   **Description**: Lookup stock and pricing for specific ingredients across stores.
    *   **Query Params**: `?ingredient_ids=g001,g002,p012`

### Shopping Lists (Carts)
*   `POST /api/carts`
    *   **Description**: Create a new collaborative shopping cart.
*   `GET /api/carts/:id`
    *   **Description**: Retrieve a shopping cart and its members.
*   `PUT /api/carts/:id/items`
    *   **Description**: Update the items (ingredients) in a specific cart.

### Orders
*   `POST /api/orders`
    *   **Description**: Convert a cart into a confirmed order.
    *   **Payload**: `{ "cart_id": "SC-123", "placed_by": "User1", "payment_method": "card" }`
