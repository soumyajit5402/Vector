package repository

import (
    "io/ioutil"
    "os"
    "path/filepath"
)

type DocumentRepository struct {
    BaseDir string
}

func NewDocumentRepository() *DocumentRepository {
    return &DocumentRepository{
        BaseDir: filepath.Join(os.Getenv("HOME"), "Desktop", "Artefacts"),
    }
}

func (dr *DocumentRepository) Save(name string, data []byte) error {
    if err := os.MkdirAll(dr.BaseDir, os.ModePerm); err != nil {
        return err
    }

    filePath := filepath.Join(dr.BaseDir, name+".json")
    return ioutil.WriteFile(filePath, data, 0644)
}

func (dr *DocumentRepository) Get(name string) ([]byte, error) {
    filePath := filepath.Join(dr.BaseDir, name+".json")
    return ioutil.ReadFile(filePath)
}

func (dr *DocumentRepository) List() ([]os.FileInfo, error) {
    return ioutil.ReadDir(dr.BaseDir)
} 