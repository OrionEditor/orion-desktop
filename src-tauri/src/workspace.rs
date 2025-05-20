use chrono::Utc;
use fs::File;
use serde::{Deserialize, Serialize};
use std::fs::{self};
use std::io::Write;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct Workspace {
    pub project_name: String,
    pub presets: u8,
    pub active_tabs: Vec<String>,
}

impl Default for Workspace {
    fn default() -> Self {
        Workspace {
            project_name: "New Project".to_string(),
            presets: 1,
            active_tabs: vec![],
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


    /// Перезаписывает имя проекта в `workspace.json`.
    pub fn set_project_name(
        &mut self,
        workspace_path: &PathBuf,
        new_name: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.project_name = new_name;
        self.save(workspace_path)?;
        println!("Project name updated to: {}", self.project_name);
        Ok(())
    }

    /// Перезаписывает пресет в `workspace.json`.
    pub fn set_preset(
        &mut self,
        workspace_path: &PathBuf,
        new_preset: u8,
    ) -> Result<(), Box<dyn std::error::Error>> {
        self.presets = new_preset;
        self.save(workspace_path)?;
        println!("Preset updated to: {}", self.presets);
        Ok(())
    }

    /// Добавляет путь в `active_tabs`, если он ещё не присутствует.
    pub fn add_active_tab(
        &mut self,
        workspace_path: &PathBuf,
        tab_path: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if !self.active_tabs.contains(&tab_path) {
            self.active_tabs.push(tab_path.clone());
            self.save(workspace_path)?;
            println!("Added tab to active_tabs: {}", tab_path);
        } else {
            println!("Tab already exists in active_tabs: {}", tab_path);
        }
        Ok(())
    }

    /// Удаляет путь из `active_tabs`, если он там есть.
    pub fn remove_active_tab(
        &mut self,
        workspace_path: &PathBuf,
        tab_path: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let initial_len = self.active_tabs.len();
        self.active_tabs.retain(|tab| tab != &tab_path);
        if self.active_tabs.len() < initial_len {
            self.save(workspace_path)?;
            println!("Removed tab from active_tabs: {}", tab_path);
        } else {
            println!("Tab not found in active_tabs: {}", tab_path);
        }
        Ok(())
    }

    /// Возвращает все значения из `active_tabs`.
    pub fn get_active_tabs(workspace_path: &PathBuf) -> Result<Vec<String>, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        println!("Retrieved active_tabs: {:?}", workspace.active_tabs);
        Ok(workspace.active_tabs)
    }

    /// Возвращает имя проекта.
    pub fn get_project_name(workspace_path: &PathBuf) -> Result<String, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        println!("Retrieved project_name: {}", workspace.project_name);
        Ok(workspace.project_name)
    }

    /// Возвращает значение пресета.
    pub fn get_preset(workspace_path: &PathBuf) -> Result<u8, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        println!("Retrieved preset: {}", workspace.presets);
        Ok(workspace.presets)
    }
}
