export interface Settings {
    general: {
        language: string;
        theme: string;
        autoSaveInterval: number;
    };
    editor: {
        fontSize: number;
        lineNumbers: boolean;
        wordWrap: boolean;
        defaultView: string;
    };
    account: {
        isLoggedIn: boolean;
        username: string | null;
        email: string | null;
        syncEnabled: boolean;      
    };
}