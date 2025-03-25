use chrono::Utc;
use fs::File;
use serde::{Deserialize, Serialize};
use std::fs::{self};
use std::io::Write;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Collaborator {
    pub name: String,
    pub email: String,
    pub role: String,
    pub id: String,
}

#[derive(Serialize, Deserialize)]
pub struct BackupConfig {
    pub enabled: bool,
    pub frequency: String,
    pub last_backup: String,
    pub location: String,
}

#[derive(Serialize, Deserialize)]
pub struct Workspace {
    pub user_id: String,
    pub project_name: String,
    pub project_id: String,
    pub created_at: String,
    pub last_modified: String,
    pub presets: u8,
    pub active_tabs: Vec<String>,
    pub backup: BackupConfig,
    pub collaborators: Vec<Collaborator>,
    pub recent_searches: Vec<String>,
}

impl Default for Workspace {
    fn default() -> Self {
        Workspace {
            user_id: "default_user".to_string(),
            project_name: "New Project".to_string(),
            project_id: "0000".to_string(),
            created_at: Utc::now().to_rfc3339(),
            last_modified: Utc::now().to_rfc3339(),
            presets: 1,
            active_tabs: vec![],
            backup: BackupConfig {
                enabled: true,
                frequency: "daily".to_string(),
                last_backup: Utc::now().to_rfc3339(),
                location: "/path/to/backups".to_string(),
            },
            collaborators: vec![],
            recent_searches: vec![],
        }
    }
}

impl Workspace {
    /// Загружает `workspace.json` по указанному пути.
    pub fn load(workspace_path: &PathBuf) -> Self {
        if let Ok(content) = fs::read_to_string(workspace_path) {
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            let default_workspace = Self::default();
            default_workspace.save(workspace_path);
            default_workspace
        }
    }

    /// Сохраняет `workspace.json` по указанному пути.
    pub fn save(&self, workspace_path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
        // Добавляем "workspace.json" к пути
        let mut full_path = workspace_path.clone();
        full_path.push("workspace.json");

        // Создаём родительские директории, если их нет
        if let Some(parent) = full_path.parent() {
            fs::create_dir_all(parent)?;
        }

        // Сериализуем данные в JSON
        let content = serde_json::to_string_pretty(self)?;

        // Открываем файл и записываем данные
        {
            let mut file = File::create(&full_path)?;
            file.write_all(content.as_bytes())?;
        }

        println!("Workspace file saved to: {}", full_path.display());
        Ok(())
    }

    /// Обновляет поле `last_modified` и сохраняет изменения.
    pub fn update_last_modified(&mut self, workspace_path: &PathBuf) {
        self.last_modified = Utc::now().to_rfc3339();
        self.save(workspace_path);
    }
}
