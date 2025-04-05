package controller

import (
	"context"
	"os"
	"path/filepath"
	"time"

	"vector/backend/service"
)

// DocumentController implements the VectorDocumentBackend interface
type DocumentController struct {
	baseDir string
}

// NewDocumentController creates a new instance of DocumentController
func NewDocumentController() *DocumentController {
	return &DocumentController{
		baseDir: filepath.Join(os.Getenv("HOME"), "Desktop", "Artefacts"),
	}
}

// SaveDocument implements the VectorDocumentBackend interface
func (dc *DocumentController) SaveDocument(ctx context.Context, name string, data string) error {
	// Create the directory if it doesn't exist
	if err := os.MkdirAll(dc.baseDir, 0755); err != nil {
		return err
	}

	// Create the file path
	filePath := filepath.Join(dc.baseDir, name+".json")

	// Write the data to the file
	return os.WriteFile(filePath, []byte(data), 0644)
}

// GetDocument implements the VectorDocumentBackend interface
func (dc *DocumentController) GetDocument(ctx context.Context, name string) (*service.Document, error) {
	// Create the file path
	filePath := filepath.Join(dc.baseDir, name+".json")

	// Read the file
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}

	return &service.Document{
		Name: name,
		Data: string(data),
	}, nil
}

// ListDocuments implements the VectorDocumentBackend interface
func (dc *DocumentController) ListDocuments(ctx context.Context) ([]service.DocumentMetadata, error) {
	// Read the directory
	files, err := os.ReadDir(dc.baseDir)
	if err != nil {
		return nil, err
	}

	var documents []service.DocumentMetadata
	for _, file := range files {
		if !file.IsDir() && filepath.Ext(file.Name()) == ".json" {
			info, err := file.Info()
			if err != nil {
				continue
			}

			name := filepath.Base(file.Name())
			name = name[:len(name)-5] // Remove .json extension

			documents = append(documents, service.DocumentMetadata{
				Name:      name,
				CreatedAt: info.ModTime().Format(time.RFC3339),
				UpdatedAt: info.ModTime().Format(time.RFC3339),
			})
		}
	}

	return documents, nil
} 