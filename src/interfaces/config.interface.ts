export interface Project {
    name: string;
    path: string;
}

export interface Config {
    recent_projects: Project[];
    last_opened: string | null;
    theme: string;
    language: string
}