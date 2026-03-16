## Answers

### Question 1

Before creating an order, I would validate in two layers: first the request data shape, then business rules.

Data Validation
    - userId is required, must be an integer, and greater than 0.
    - items is required, must be an array, and must not be empty.
    - Each item in items must include:
        - productId (required, integer, > 0)
        - quantity (required, integer, > 0)

    - Reject malformed JSON or wrong data types (for example "25" instead of 25).

Business Logic Validation
    - User exists in the system.
    - Every productId exists.
    - Requested quantity is available in stock for each product.
    - If the same product appears multiple times in items, merge or reject duplicates before stock checks.

### Question 2

Invalid user ID format
    - Example: userId is missing, negative, or not a number.

User not found
    - The userId does not match any user in the database.

Invalid items payload
    - items is missing, not an array, or an empty array.

Invalid product data in items
    - One item is missing productId or quantity, or quantity is 0/negative.

Product not found
    - A productId in the request does not exist.

Insufficient stock
    - Requested quantity is greater than available inventory.

### Question 3

Successful order creation -> 201 Created
    - Reason: A new order resource is successfully created, so 201 is the standard REST response.

Invalid request body -> 400 Bad Request
    - Reason: The client sent data in a wrong format or missing required fields (e.g., no userId, invalid items, wrong data types).
    This is a client-side input problem, so 400 is appropriate.

Product not found -> 404 Not Found
    - Reason: The client referenced a product ID that does not exist.
    Since the target related resource (product) is missing, 404 is a clear and common choice.

Server error -> 500 Internal Server Error
    - Reason: Something failed on the backend unexpectedly (database crash, unhandled exception, etc.).
    The request might be valid, but the server could not complete it, so 500 fits.