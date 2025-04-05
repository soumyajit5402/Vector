package service

import (
	"context"
)

// Document represents a vector document
type Document struct {
	Name string `json:"name"`
	Data string `json:"data"`
}

// DocumentMetadata represents metadata about a document
type DocumentMetadata struct {
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// VectorDocumentBackend defines the interface for document operations
type VectorDocumentBackend interface {
	// SaveDocument saves a document with the given name and data
	SaveDocument(ctx context.Context, name string, data string) error

	// GetDocument retrieves a document by its name
	GetDocument(ctx context.Context, name string) (*Document, error)

	// ListDocuments returns a list of all saved documents with their metadata
	ListDocuments(ctx context.Context) ([]DocumentMetadata, error)
}

// NewVectorDocumentBackend creates a new instance of the document backend service
func NewVectorDocumentBackend() VectorDocumentBackend {
	return &vectorDocumentBackend{}
}

// vectorDocumentBackend implements the VectorDocumentBackend interface
type vectorDocumentBackend struct{}

func (v *vectorDocumentBackend) SaveDocument(ctx context.Context, name string, data string) error {
	// Implementation will be provided by the controller
	return nil
}

func (v *vectorDocumentBackend) GetDocument(ctx context.Context, name string) (*Document, error) {
	// Implementation will be provided by the controller
	return nil, nil
}

func (v *vectorDocumentBackend) ListDocuments(ctx context.Context) ([]DocumentMetadata, error) {
	// Implementation will be provided by the controller
	return nil, nil
} 