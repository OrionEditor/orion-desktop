export interface Document {
    id: string;
    project_id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Version {
    id: number;
    document_id: string;
    version_number: number;
    s3_path: string;
    content_hash: string;
    created_at: string;
    is_active?: boolean;
}

export interface CreateDocumentResponse {
    document: Document;
    version: Version;
}

export interface GetDocumentResponse {
    document: Document;
    versions: Version[];
}