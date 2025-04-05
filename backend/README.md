# Vector Backend

A Go-based backend service for the Vector application.

## Directory Structure

```
backend/
├── internal/           # Internal packages
│   ├── controller/    # Business logic implementation
│   └── handler/       # HTTP request handlers
├── service/           # Service interfaces
│   └── documentService.go
├── server/            # Server entry point
│   └── main.go       # Main server file
└── go.mod            # Go module definition
```

## Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Go dependencies:
```bash
go mod download
```

3. Start the server:
```bash
go run server/main.go
```

The backend will run on http://localhost:8080

## API Endpoints

### Save Document
- `POST /saveDocument`
- Request Body:
```json
{
    "name": "document_name",
    "data": "document_data"
}
```

### Get Document
- `GET /getDocument?name=<document_name>`
- Query Parameters:
  - `name`: Document name

### List Documents
- `GET /listDocuments`
- Returns array of document metadata

## Document Storage

Documents are stored in `~/Desktop/Artefacts` as JSON files.

## Error Handling

The service handles:
- Invalid request methods
- Missing/invalid parameters
- File system operations
- JSON parsing errors

## CORS Configuration

Accepts requests from:
- `http://localhost:3000` (Frontend) 