package model

// Document represents the document data structure
type Document struct {
	Name string `json:"name"`
	Data string `json:"data"`
}

// DocumentMetadata represents document metadata
type DocumentMetadata struct {
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}