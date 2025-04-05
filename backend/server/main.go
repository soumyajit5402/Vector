package main

import (
	"log"
	"net/http"

	"vector/backend/internal/handler"
)

func main() {
	documentHandler := handler.NewDocumentHandler()

	http.HandleFunc("/saveDocument", documentHandler.SaveDocumentHandler)
	http.HandleFunc("/getDocument", documentHandler.GetDocumentHandler)
	http.HandleFunc("/listDocuments", documentHandler.ListDocumentsHandler)

	log.Println("Server started on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}