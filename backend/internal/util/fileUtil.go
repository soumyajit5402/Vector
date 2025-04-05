package util

import (
    "os"
    "path/filepath"
)

// EnsureDirectoryExists ensures that a directory exists
func EnsureDirectoryExists(dir string) error {
    return os.MkdirAll(dir, os.ModePerm)
}

// GetFileInfo gets the file info for a given path
func GetFileInfo(path string) (os.FileInfo, error) {
    return os.Stat(path)
}

// JoinPath joins a list of elements into a path
func JoinPath(elem ...string) string {
    return filepath.Join(elem...)
} 