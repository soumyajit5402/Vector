package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"
	"vector/backend/internal/controller"
	"vector/backend/internal/model"
	"vector/backend/internal/util"
)

// documentHandler is a struct that contains a pointer to a DocumentController
type documentHandler struct {
	controller controller.DocumentController
}

// DocumentHandler defines the interface for HTTP handlers
type DocumentHandler interface {
	SaveDocumentHandler(w http.ResponseWriter, r *http.Request)
	GetDocumentHandler(w http.ResponseWriter, r *http.Request)
	ListDocumentsHandler(w http.ResponseWriter, r *http.Request)
}

// NewDocumentHandler creates a new document handler
func NewDocumentHandler(controller controller.DocumentController) *documentHandler {	
	return &documentHandler{
		controller: controller,
	}
}

// SaveDocumentHandler handles saving a document
func (h *documentHandler) SaveDocumentHandler(w http.ResponseWriter, r *http.Request) {
	util.SetCORSHeaders(w)

	if util.HandleOptionsRequest(w, r) {
		return
	}

	if !util.ValidateMethod(w, r, http.MethodPost) {
		return
	}

	var doc model.Document
	if err := json.NewDecoder(r.Body).Decode(&doc); err != nil {
		util.RespondWithError(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	if err := h.controller.SaveDocument(ctx, doc.Name, doc.Data); err != nil {
		util.RespondWithError(w, "Failed to save document", http.StatusInternalServerError)
		return
	}

	util.RespondWithSuccess(w, "Document saved successfully")
}

// GetDocumentHandler handles retrieving a document
func (h *documentHandler) GetDocumentHandler(w http.ResponseWriter, r *http.Request) {
	util.SetCORSHeaders(w)

	if !util.ValidateMethod(w, r, http.MethodGet) {
		return
	}

	docName := r.URL.Query().Get("name")
	if docName == "" {
		util.RespondWithError(w, "Document name is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	doc, err := h.controller.GetDocument(ctx, docName)
	if err != nil {
		util.RespondWithError(w, "Failed to read document", http.StatusInternalServerError)
		return
	}

	util.RespondWithJSON(w, doc)
}	

// ListDocumentsHandler handles listing all documents
func (h *documentHandler) ListDocumentsHandler(w http.ResponseWriter, r *http.Request) {
	util.SetCORSHeaders(w)

	if !util.ValidateMethod(w, r, http.MethodGet) {
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	documents, err := h.controller.ListDocuments(ctx)
	if err != nil {
		util.RespondWithError(w, "Failed to list documents", http.StatusInternalServerError)
		return
	}

	util.RespondWithJSON(w, documents)
} 