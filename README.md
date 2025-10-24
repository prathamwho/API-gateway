# Airline Management System - API Gateway

This service is the central API Gateway for the Airline Management System. It acts as a single entry point for all incoming client requests, sitting in front of the backend microservices. Built with Node.js and Express, its primary roles are to route traffic, enforce security policies, and provide a unified interface to the distributed system.

---

## Features

-   **Reverse Proxy:** Uses `http-proxy-middleware` to intelligently forward incoming requests to the appropriate backend microservice based on the request path.
-   **Rate Limiting:** Protects backend services from traffic spikes and abuse by enforcing a global rate limit on incoming requests. By default, it is configured to allow a maximum of **5 requests every 2 minutes** per client.
-   **Request Logging:** Utilizes `morgan` for detailed, production-style logging of all HTTP traffic that passes through the gateway, which is essential for monitoring and debugging.
-   **Centralized Cross-Cutting Concerns:** Provides a single, logical place to manage concerns like rate limiting, and can be easily extended to handle authentication, caching, and more.

---

## Project Setup

Follow these steps to get the API Gateway running on your local machine.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or higher)

### 2. Installation

-   Clone the project repository:
    ```bash
    git clone git@github.com:prathamwho/API-gateway.git
    ```
-   Navigate to the project's root directory:
    ```bash
    cd <project-directory-name>
    ```
-   Install all the required npm packages:
    ```bash
    npm install
    ```

### 3. Environment Configuration

This service does not require a `.env` file as its configuration (like target service URLs) is currently hardcoded in `index.js`.

### 4. Running the Server

-   Start the server using the npm script (this will use `nodemon` for automatic restarts during development):

    ```bash
    npm start
    ```
-   The server should now be running on port `3005` (e.g., `http://localhost:3005`).

---

## How It Works

The API Gateway acts as a simple but powerful traffic manager.

1.  A client sends a request to the gateway. For example: `http://localhost:3005/bookingservice/api/v1/bookings`.
2.  The gateway intercepts the request.
3.  It first applies the **rate limiter**. If the client has exceeded the limit, the request is rejected with a `429 Too Many Requests` error.
4.  It **logs** the incoming request details.
5.  It inspects the URL path. Because the path starts with `/bookingservice`, the proxy rule is matched.
6.  The gateway forwards the request to the target defined for that rule: `http://localhost:3002/`, while appending the rest of the path. The final request made to the backend service is `http://localhost:3002/api/v1/bookings`.
7.  The Booking Service processes the request and sends a response back to the gateway.
8.  The gateway relays this response back to the original client.