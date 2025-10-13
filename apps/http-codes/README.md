# HTTP Codes Explainer

A simple micro app for web developers to lookup and understand HTTP response codes.

## Description

This tool helps web developers quickly find information about HTTP status codes. It provides detailed explanations, categories, and search functionality for all standard HTTP response codes.

## Features

- Lookup HTTP status codes by number
- Detailed descriptions and meanings for each code
- Search functionality to find codes by keyword
- Organized by categories (1xx Informational, 2xx Success, etc.)
- Copy code information to clipboard

## Installation

No installation required. Simply open `index.html` in a web browser.

## Usage

1. Open `index.html` in your web browser.
2. Type an HTTP status code (e.g., 404) in the search field.
3. The details for the code will appear instantly below.
4. Alternatively, append `?code=XXX` to the URL to directly view a specific code (e.g., `index.html?code=404`).

For server deployment with routing (e.g., to support URLs like `/404`), configure your server to serve `index.html` for all routes and handle the code via query parameters.

## Development

To run locally with a server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

The app consists of:
- `index.html`: Main HTML page with embedded CSS and JavaScript
- `http-codes.json`: Data file containing HTTP status code information

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
