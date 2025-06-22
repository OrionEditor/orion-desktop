use chrono::Utc;
use fs::File;
use serde::{Deserialize, Serialize};
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
pub struct Workspace {
    pub project_name: String,
    pub presets: u8,
    pub active_tabs: Vec<String>,
    pub tags: Vec<Tag>,
    pub element_tags: Vec<ElementTag>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Tag {
    pub tag_id: String,
    pub tag_label: String,
    pub tag_color: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ElementTag {
    pub element_path: String,
    pub tag_id: String,
}

impl Default for Workspace {
    fn default() -> Self {
        Workspace {
            project_name: "New Project".to_string(),
            presets: 0,
            active_tabs: vec![],
            tags: vec![],
            element_tags: vec![],
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
            default_workspace.save(workspace_path).expect("TODO: panic message");
            default_workspace
        }
    }

    /// Загружает `workspace.json` из директории, указанной в `workspace_path`.
    pub fn load_second(workspace_path: &PathBuf) -> Self {
        let mut full_path = workspace_path.clone();
        full_path.push("workspace.json");
        println!("[{}] Загрузка workspace из: ", full_path.display());
        if let Ok(content) = fs::read_to_string(&full_path) {
            if content.trim().is_empty() {
                eprintln!("[{}] Файл workspace.json пуст, использование дефолтных значений", Utc::now().to_rfc3339());
                Self::default()
            } else {
                serde_json::from_str(&content).unwrap_or_else(|e| {
                    eprintln!("[{}] Ошибка десериализации workspace.json: {}, использование дефолтных значений", Utc::now().to_rfc3339(), e);
                    Self::default()
                })
            }
        } else {
            println!("[{}] Файл workspace.json не существует, создание нового", Utc::now().to_rfc3339());
            let default_workspace = Self::default();
            default_workspace.save(workspace_path).unwrap_or_else(|e| {
                eprintln!("[{}] Ошибка при сохранении дефолтного workspace: {}", Utc::now().to_rfc3339(), e);
            });
            default_workspace
        }
    }


    /// Создаёт новый экземпляр Workspace с указанными значениями.
    pub fn new(project_name: String, presets: u8) -> Self {
        Workspace {
            project_name,
            presets,
            active_tabs: vec![],
            tags: vec![],
            element_tags: vec![],
        }
    }

    // /// Сохраняет `workspace.json` по указанному пути.
    // pub fn save(&self, workspace_path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
    //     // Добавляем "workspace.json" к пути
    //     let mut full_path = workspace_path.clone();
    //     full_path.push("workspace.json");
    //
    //     // Создаём родительские директории, если их нет
    //     if let Some(parent) = full_path.parent() {
    //         fs::create_dir_all(parent)?;
    //     }
    //
    //     // Сериализуем данные в JSON
    //     let content = serde_json::to_string_pretty(self)?;
    //
    //     // Открываем файл и записываем данные
    //     {
    //         let mut file = File::create(&full_path)?;
    //         file.write_all(content.as_bytes())?;
    //     }
    //
    //     println!("Workspace file saved to: {}", full_path.display());
    //     Ok(())
    // }

    /// Сохраняет `workspace.json` по указанному пути.
    pub fn save(&self, workspace_path: &PathBuf) -> Result<(), Box<dyn std::error::Error>> {
        // Добавляем "workspace.json" к пути
        let mut full_path = workspace_path.clone();
        full_path.push("workspace.json");

        // Создаем родительские директории, если их нет
        if let Some(parent) = full_path.parent() {
            fs::create_dir_all(parent)?;
        }

        // Сериализуем данные в JSON
        let content = serde_json::to_string_pretty(self)?;

        // Используем OpenOptions для перезаписи файла
        let mut file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&full_path)?;
        file.write_all(content.as_bytes())?;
        file.flush()?;

        println!("[{}] Workspace file saved to: {}", Utc::now().to_rfc3339(), full_path.display());
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

    /// Добавляет новый тег в `tags`.
    pub fn add_tag(
        &mut self,
        workspace_path: &PathBuf,
        tag_label: String,
        tag_color: String,
    ) -> Result<String, Box<dyn std::error::Error>> {
        let tag_id = Uuid::new_v4().to_string();
        let tag = Tag {
            tag_id: tag_id.clone(),
            tag_label,
            tag_color,
        };
        self.tags.push(tag);
        self.save(workspace_path)?;
        println!("Added tag: {}", tag_id);
        Ok(tag_id)
    }

    /// Удаляет тег из `tags` и все связанные `element_tags`.
    pub fn remove_tag(
        &mut self,
        workspace_path: &PathBuf,
        tag_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let initial_len = self.tags.len();
        self.tags.retain(|tag| tag.tag_id != tag_id);
        self.element_tags.retain(|et| et.tag_id != tag_id);
        if self.tags.len() < initial_len {
            self.save(workspace_path)?;
            println!("Removed tag: {}", tag_id);
        } else {
            println!("Tag not found: {}", tag_id);
        }
        Ok(())
    }

    /// Возвращает все теги.
    pub fn get_tags(workspace_path: &PathBuf) -> Result<Vec<Tag>, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        println!("Retrieved tags: {:?}", workspace.tags);
        Ok(workspace.tags)
    }

    /// Привязывает тег к файлу или папке.
    pub fn add_element_tag(
        &mut self,
        workspace_path: &PathBuf,
        element_path: String,
        tag_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        if !self.element_tags.iter().any(|et| et.element_path == element_path && et.tag_id == tag_id) {
            self.element_tags.push(ElementTag {
                element_path,
                tag_id,
            });
            self.save(workspace_path)?;
        } else {
            println!("Element tag already exists for path: {}", element_path);
        }
        Ok(())
    }

    /// Удаляет связь тега с файлом или папкой.
    pub fn remove_element_tag(
        &mut self,
        workspace_path: &PathBuf,
        element_path: String,
        tag_id: String,
    ) -> Result<(), Box<dyn std::error::Error>> {
        let initial_len = self.element_tags.len();
        self.element_tags.retain(|et| !(et.element_path == element_path && et.tag_id == tag_id));
        if self.element_tags.len() < initial_len {
            self.save(workspace_path)?;
            println!("Removed element tag for path: {}", element_path);
        } else {
            println!("Element tag not found for path: {}", element_path);
        }
        Ok(())
    }

    /// Возвращает все связи тегов с элементами.
    pub fn get_element_tags(workspace_path: &PathBuf) -> Result<Vec<ElementTag>, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        println!("Retrieved element_tags: {:?}", workspace.element_tags);
        Ok(workspace.element_tags)
    }

    /// Возвращает все теги, связанные с элементом по его пути.
    pub fn get_tags_by_element_path(
        workspace_path: &PathBuf,
        element_path: String,
    ) -> Result<Vec<Tag>, Box<dyn std::error::Error>> {
        let workspace = Self::load(workspace_path);
        let element_tag_ids: Vec<String> = workspace
            .element_tags
            .into_iter()
            .filter(|et| et.element_path == element_path)
            .map(|et| et.tag_id)
            .collect();
        let tags: Vec<Tag> = workspace
            .tags
            .into_iter()
            .filter(|tag| element_tag_ids.contains(&tag.tag_id))
            .collect();
        println!("Retrieved tags for path {}: {:?}", element_path, tags);
        Ok(tags)
    }
}
