export const environment = {
    production: false,
    apiUrl: 'http://127.0.0.1',
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
        }
    }
};