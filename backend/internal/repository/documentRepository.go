package repository

import (
    "fmt"
    "io/fs"
    "os"
    "path/filepath"
)

// documentRepository is a struct that contains a pointer to a baseDir
type documentRepository struct {
    baseDir string
}

// DocumentRepository defines the interface for document storage operations
type DocumentRepository interface {
    Save(name string, data []byte) error
    Get(name string) ([]byte, error)
    List() ([]fs.FileInfo, error)
}

// NewDocumentRepository creates a new document repository
func NewDocumentRepository(baseDir string) (*documentRepository, error) {
    if baseDir == "" {
        homeDir, err := os.UserHomeDir()
        if err != nil {
            return nil, fmt.Errorf("failed to get home directory: %w", err)
        }
        baseDir = filepath.Join(homeDir, "Desktop", "Artefacts")
    }

    // Create the directory if it doesn't exist
    if err := os.MkdirAll(baseDir, 0755); err != nil {
        return nil, fmt.Errorf("failed to create base directory: %w", err)
    }

    return &documentRepository{
        baseDir: baseDir,
    }, nil
}

// Save saves a document to the repository
func (r *documentRepository) Save(name string, data []byte) error {
    if name == "" {
        return fmt.Errorf("document name cannot be empty")
    }

    filePath := filepath.Join(r.baseDir, name+".json")
    if err := os.WriteFile(filePath, data, 0644); err != nil {
        return fmt.Errorf("failed to write file: %w", err)
    }

    return nil
}

// Get retrieves a document from the repository
func (r *documentRepository) Get(name string) ([]byte, error) {
    if name == "" {
        return nil, fmt.Errorf("document name cannot be empty")
    }

    filePath := filepath.Join(r.baseDir, name+".json")
    data, err := os.ReadFile(filePath)
    if err != nil {
        if os.IsNotExist(err) {
            return nil, fmt.Errorf("document not found: %s", name)
        }
        return nil, fmt.Errorf("failed to read file: %w", err)
    }

    return data, nil
}

// List returns a list of all documents in the repository
func (r *documentRepository) List() ([]fs.FileInfo, error) {
    files, err := os.ReadDir(r.baseDir)
    if err != nil {
        return nil, fmt.Errorf("failed to read directory: %w", err)
    }

    var fileInfos []fs.FileInfo
    for _, file := range files {
        if !file.IsDir() && filepath.Ext(file.Name()) == ".json" {
            info, err := file.Info()
            if err != nil {
                continue
            }
            fileInfos = append(fileInfos, info)
        }
    }

    return fileInfos, nil
} 