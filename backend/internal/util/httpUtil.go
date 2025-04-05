package util

import (
    "encoding/json"
    "net/http"
)

// SetCORSHeaders sets the common CORS headers for all responses
func SetCORSHeaders(w http.ResponseWriter) {
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

// HandleOptionsRequest handles OPTIONS requests for CORS preflight
func HandleOptionsRequest(w http.ResponseWriter, r *http.Request) bool {
    if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return true
    }
    return false
}

// RespondWithJSON sends a JSON response with the specified data and status code
func RespondWithJSON(w http.ResponseWriter, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

// RespondWithSuccess sends a success response with the specified message
func RespondWithSuccess(w http.ResponseWriter, message string) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(message))
}

// RespondWithError sends an error response with the specified message and status code
func RespondWithError(w http.ResponseWriter, message string, statusCode int) {
	http.Error(w, message, statusCode)
}

// ValidateMethod checks if the request method matches the expected method
func ValidateMethod(w http.ResponseWriter, r *http.Request, expectedMethod string) bool {
    if r.Method != expectedMethod {
        RespondWithError(w, "Invalid request method", http.StatusMethodNotAllowed)
        return false
    }
    return true
} 