package util

import (
    "os"
    "path/filepath"
)

func EnsureDirectoryExists(dir string) error {
    return os.MkdirAll(dir, os.ModePerm)
}

func GetFileInfo(path string) (os.FileInfo, error) {
    return os.Stat(path)
}

func JoinPath(elem ...string) string {
    return filepath.Join(elem...)
} 