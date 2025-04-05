package main

import (
	"log"
	"net/http"
	"vector/backend/internal/controller"
	"vector/backend/internal/handler"
	"vector/backend/internal/repository"
)

func main() {
	// Initialize repository
	repo, err := repository.NewDocumentRepository("")
	if err != nil {
		log.Fatalf("Failed to create repository: %v", err)
	}

	// Initialize controller with repository
	ctrl := controller.NewDocumentController(repo)

	// Initialize handler with controller
	docHandler := handler.NewDocumentHandler(ctrl)

	// Set up routes
	http.HandleFunc("/saveDocument", docHandler.SaveDocumentHandler)
	http.HandleFunc("/getDocument", docHandler.GetDocumentHandler)
	http.HandleFunc("/listDocuments", docHandler.ListDocumentsHandler)

	// Start server
	log.Println("Server starting on port 8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}