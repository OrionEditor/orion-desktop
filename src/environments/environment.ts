export const environment = {
    production: false,
    apiUrl: 'http://127.0.0.1:8080',
    //webSocketUrl: 'ws://localhost',
    endpoints:{
        auth: {
            verifyEmail: 'verify-email',
            login: 'login',
            register: 'register',
            verify_code: ''
        },
        refreshToken: {
            refresh: 'refresh'
        },
        user: {
            get_profile: 'user/profile'
        },
        project: {
            create_project: 'projects',
            get_project_by_id: (projectId: string) => `projects/${projectId}`,
            update_project_by_id: (projectId: string) => `projects/${projectId}`,
            delete_project_by_id: (projectId: string) => `projects/${projectId}`,
            get_projects_by_user: 'project/ProGet'
        },
        document: {
            create_document: 'documents',
            get_document_by_id: (documentId: string) => `documents/${documentId}`,
            update_document: (documentId: string) => `documents/${documentId}`,
            delete_document: (documentId: string) => `documents/${documentId}`,
            get_document_by_name: (projectId: string, documentName: string) => `documents/project/${projectId}/name/${documentName}`,
        },
        version: {
            get_version_by_document_id: (documentId: string) => `documents/${documentId}/versions`,
            create_version: (documentId: string) => `documents/${documentId}/versions`,
            get_version: (versionId: string) => `documents/versions/${versionId}`,
            delete_version: (versionId: string) => `documents/versions/${versionId}`,
        }
    }
};