# Vector Backend

This is the backend service for the Vector project, providing document storage and retrieval functionality.

## Project Structure

```
backend/
├── internal/
│   ├── handler/
│   │   └── documentHandler.go    # HTTP request handlers
│   ├── controller/
│   │   └── documentController.go # Business logic layer
│   ├── repository/
│   │   └── documentRepository.go # Data storage layer
│   └── utils/
│       └── http.go              # Common HTTP utilities
├── server/
│   └── main.go                  # Application entry point
└── go.mod                       # Go module definition
```

## Architecture

The backend follows a clean architecture pattern with three main layers:

### Handler Layer (documentHandler.go)
- Handles HTTP requests and responses
- Manages CORS and request validation
- Converts between HTTP and domain formats
- Exposes endpoints:
  - POST `/saveDocument`: Save a document
  - GET `/getDocument`: Retrieve a document
  - GET `/listDocuments`: List all documents

### Controller Layer (documentController.go)
- Implements business logic
- Manages document operations
- Handles data transformation
- Provides interface:
  - `SaveDocument(ctx context.Context, name, data string) error`
  - `GetDocument(ctx context.Context, name string) (*Document, error)`
  - `ListDocuments(ctx context.Context) ([]DocumentMetadata, error)`

### Repository Layer (documentRepository.go)
- Manages data persistence
- Handles file system operations
- Provides interface:
  - `Save(name string, data []byte) error`
  - `Get(name string) ([]byte, error)`
  - `List() ([]fs.FileInfo, error)`

## Data Storage

Documents are stored as JSON files in the `~/Desktop/Artefacts` directory with the following structure:
- Each document is saved as a separate JSON file
- Filenames are in the format: `{documentName}.json`
- File content includes document data and metadata

## API Endpoints

### Save Document
```
POST /saveDocument
Content-Type: application/json

{
    "name": "string",
    "data": "string"  // JSON stringified document data
}
```

### Get Document
```
GET /getDocument?name=documentName
```

### List Documents
```
GET /listDocuments
```

## Development

To modify or extend the backend:

1. HTTP-related changes should be made in the handler layer
2. Business logic should be added to the controller layer
3. Storage operations should be implemented in the repository layer
4. Common utilities should be placed in the utils package

## Building and Running

1. Build the backend:
   ```bash
   cd backend
   go build -o vector-backend server/main.go
   ```

2. Run the server:
   ```bash
   ./vector-backend
   ```

The server will start on port 8080 and create the Artefacts directory if it doesn't exist.

## Error Handling

The backend implements comprehensive error handling:
- Invalid requests return appropriate HTTP status codes
- File system errors are properly propagated
- CORS errors are handled gracefully
- All errors include descriptive messages

## Dependencies

- Go 1.20 or higher
- Standard library packages:
  - `net/http`
  - `encoding/json`
  - `io/fs`
  - `os`
  - `path/filepath`

## CORS Configuration

Accepts requests from:
- `http://localhost:3000` (Frontend) 