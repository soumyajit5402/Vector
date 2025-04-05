package controller

import (
	"context"
	"path/filepath"
	"time"

	"vector/backend/internal/model"
	"vector/backend/internal/repository"
)

// documentController is a struct that contains a pointer to a DocumentRepository
type documentController struct {
	repo repository.DocumentRepository
}

// DocumentController defines the interface for document operations
type DocumentController interface {
	SaveDocument(ctx context.Context, name, data string) error
	GetDocument(ctx context.Context, name string) (*model.Document, error)
	ListDocuments(ctx context.Context) ([]model.DocumentMetadata, error)
}

// NewDocumentController creates a new document controller
func NewDocumentController(repo repository.DocumentRepository) *documentController {
	return &documentController{
		repo: repo,
	}
}

// SaveDocument saves a document with the given name and data
func (dc *documentController) SaveDocument(ctx context.Context, name, data string) error {
	return dc.repo.Save(name, []byte(data))
}

// GetDocument retrieves a document by its name
func (dc *documentController) GetDocument(ctx context.Context, name string) (*model.Document, error) {
	data, err := dc.repo.Get(name)
	if err != nil {
		return nil, err
	}

	return &model.Document{
		Name: name,
		Data: string(data),
	}, nil
}

// ListDocuments returns a list of all saved documents with their metadata
func (dc *documentController) ListDocuments(ctx context.Context) ([]model.DocumentMetadata, error) {
	files, err := dc.repo.List()
	if err != nil {
		return nil, err
	}

	var documents []model.DocumentMetadata
	for _, file := range files {
		if !file.IsDir() && filepath.Ext(file.Name()) == ".json" {
			name := filepath.Base(file.Name())
			name = name[:len(name)-5] // Remove .json extension

			documents = append(documents, model.DocumentMetadata{
				Name:      name,
				CreatedAt: file.ModTime().Format(time.RFC3339),
				UpdatedAt: file.ModTime().Format(time.RFC3339),
			})
		}
	}

	return documents, nil
} 