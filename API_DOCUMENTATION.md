# Truck Dispatch API Documentation

This document outlines the API endpoints available in the application, including the expected request bodies, parameters, and authorization constraints. The application uses cookie-based sessions for authentication.

## Table of Contents
- [Authentication](#authentication)
- [Users/Drivers](#usersdrivers)
- [Loads](#loads)
- [Quotes](#quotes)
- [Database Models Reference](#database-models-reference)

---

## Authentication

All protected routes expect a valid HTTP-only session cookie returned by the `/api/auth/login` endpoint.

### 1. Register a User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Description**: Registers a new user/company/driver in the system.
- **Request Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword",
    "role": "company",  // Options: 'admin', 'company', 'driver'
    "companyName": "Doe Logistics",  // Optional
    "phone": "555-1234"  // Optional
  }
  ```
- **Responses**:
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Missing fields or email already exists.

### 2. Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Description**: Authenticates a user and sets a session cookie.
- **Request Body** (JSON):
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Responses**:
  - `200 OK`: Login successful (cookie set in response header).
  - `400 Bad Request`: Missing email or password.
  - `401 Unauthorized`: Invalid credentials.

### 3. Get Current User
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Description**: Returns the details of the currently authenticated user based on the session cookie.
- **Responses**:
  - `200 OK`: Returns the user object.
  - `401 Unauthorized`: No valid session found.

### 4. Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: Clears the session cookie, logging the user out.
- **Responses**:
  - `200 OK`: Logged out successfully.

---

## Users/Drivers

### 1. Identify Drivers
- **URL**: `/api/drivers`
- **Method**: `GET`
- **Description**: Retrieves a list of all users with the role `driver`.
- **Authorization**: **Admin** only.
- **Responses**:
  - `200 OK`: Returns list of `drivers`.
  - `403 Forbidden`: Unauthorized to view this endpoint.

---

## Loads

### 1. Get Loads
- **URL**: `/api/loads`
- **Method**: `GET`
- **Description**: Retrieves a list of loads based on the logged-in user's role.
  - **Admin**: Views all loads.
  - **Company**: Views loads created by their company.
  - **Driver**: Views `pending` loads by default. Append query param `?filter=my-loads` to view loads currently assigned to them.
- **Query Parameters**:
  - `filter=my-loads` (for drivers)
- **Responses**:
  - `200 OK`: Returns list of `loads`.

### 2. Create a Load
- **URL**: `/api/loads`
- **Method**: `POST`
- **Description**: Creates a new load request (with status `pending`).
- **Authorization**: **Company** only.
- **Request Body** (JSON):
  ```json
  {
    "origin": "New York, NY",
    "destination": "Los Angeles, CA",
    "weight": 20000,
    "loadType": "Dry Van",
    "pickupDate": "2024-05-01T10:00:00Z",
    "deliveryDate": "2024-05-05T10:00:00Z",
    "description": "Fragile goods"
  }
  ```
- **Responses**:
  - `201 Created`: Load safely created.

### 3. Update a Load
- **URL**: `/api/loads/:id`
- **Method**: `PATCH`
- **Description**: Updates specific fields of a load.
  - **Admin**: Can update any field, primarily `driverId` and `status` to assign loads.
  - **Driver (if assigned to load)**: Can only update the `status` strictly to `picked`, `in_transit`, or `delivered`.
- **Request Body** (JSON):
  ```json
  {
    "status": "in_transit",
    "driverId": "60a7d9e..." // Admins only
  }
  ```
- **Responses**:
  - `200 OK`: Updated load returned.
  - `400 Bad Request`: Driver attempting to supply unpermitted status.
  - `403 Forbidden`: Unauthorized modifications.

### 4. Delete a Load
- **URL**: `/api/loads/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific load permanently.
- **Authorization**: **Admin** and **Company** only.
- **Responses**:
  - `200 OK`: Load deleted successfully.

---

## Quotes

### 1. Get Quotes
- **URL**: `/api/quotes`
- **Method**: `GET`
- **Description**: Returns a list of quotes.
  - **Admin**: Sees all quotes.
  - **Company**: Sees only quotes pertaining to their own loads.
- **Query Parameters**:
  - `loadId=<id>`: Filters quotes for a specific load.
- **Responses**:
  - `200 OK`: Contains list of `quotes`.

### 2. Create a Quote
- **URL**: `/api/quotes`
- **Method**: `POST`
- **Description**: Submits a quote proposition for a specific load (automatically sets status to `pending`).
- **Authorization**: **Admin** only.
- **Request Body** (JSON):
  ```json
  {
    "loadId": "60a7e0f...",
    "proposedPrice": 1500,
    "message": "We can get this done efficiently"
  }
  ```
- **Responses**:
  - `201 Created`: Returns newly created quote.
  - `404 Not Found`: Connected load does not exist.

### 3. Update (Accept/Reject) Quote
- **URL**: `/api/quotes/:id`
- **Method**: `PATCH`
- **Description**: For a company to accept or reject an admin's proposed quote.
- **Authorization**: **Company** only (must be the company that owns the load).
- **Request Body** (JSON):
  ```json
  {
    "status": "accepted" // Or "rejected"
  }
  ```
- **Responses**:
  - `200 OK`: Status successfully updated.
  - `400 Bad Request`: Invalid status provided.
  - `403 Forbidden`: Unauthorized to modify this quote.

### 4. Delete a Quote
- **URL**: `/api/quotes/:id`
- **Method**: `DELETE`
- **Description**: Deletes a specific quote permanently.
- **Authorization**: **Admin** only.
- **Responses**:
  - `200 OK`: Successfully deleted.

---

## Database Models Reference

### User Model
- **name** (String, Required)
- **email** (String, Required, Unique)
- **password** (String, Required, Min length: 6)
- **role** (String: `'admin'`, `'driver'`, `'company'`. Default: `'company'`)
- **companyName** (String, Optional)
- **phone** (String, Optional)
- **createdAt** (Date)

### Load Model
- **companyId** (ObjectId -> User, Required)
- **driverId** (ObjectId -> User, Optional)
- **origin** (String, Required)
- **destination** (String, Required)
- **weight** (Number, Required)
- **loadType** (String, Required)
- **status** (String: `'pending'`, `'assigned'`, `'picked'`, `'in_transit'`, `'delivered'`. Default: `'pending'`)
- **pickupDate** (Date, Required)
- **deliveryDate** (Date, Optional)
- **description** (String, Optional)
- **createdAt** (Date)

### Quote Model
- **loadId** (ObjectId -> Load, Required)
- **companyId** (ObjectId -> User, Required)
- **proposedPrice** (Number, Required)
- **status** (String: `'pending'`, `'accepted'`, `'rejected'`. Default: `'pending'`)
- **message** (String, Optional)
- **createdAt** (Date)
