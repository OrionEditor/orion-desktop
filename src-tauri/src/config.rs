use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;

#[derive(Serialize, Deserialize)]
pub struct Project {
    pub name: String,
    pub path: String,
}

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub recent_projects: Vec<Project>,
    pub last_opened: Option<String>,
    pub theme: String,
    pub font_size: u8,
    pub language: String,
    pub auth_token: Option<String>,
}

// Реализация Default для Config
impl Default for Config {
    fn default() -> Self {
        Config {
            recent_projects: vec![],
            last_opened: None,
            theme: "dark".to_string(),
            font_size: 14,
            language: "ru".to_string(), // Язык по умолчанию
            auth_token: None,
        }
    }
}

impl Config {
    pub fn load() -> Self {
        let config_path = Self::get_config_path();
        if let Ok(content) = fs::read_to_string(&config_path) {
            // Преобразуем строку JSON в объекты Config, ожидая, что recent_projects будет список объектов Project
            serde_json::from_str(&content).unwrap_or_default()
        } else {
            // Если файл не существует, создаём конфиг с дефолтными значениями
            Self::default().save(); // Сохраняем дефолтный конфиг
            Self::default() // Возвращаем дефолтный объект
        }
    }

    pub fn save(&self) {
        let config_path = Self::get_config_path();

        // Создание директории, если её нет
        if let Some(parent) = config_path.parent() {
            fs::create_dir_all(parent).unwrap(); // Создаём директории, если их нет
        }

        // Запись содержимого в файл
        let content = serde_json::to_string_pretty(self).unwrap();

        // Создание файла
        {
            let mut file = File::create(&config_path).unwrap(); // Создаём файл, если его нет
            file.write_all(content.as_bytes()).unwrap();
        }

        // Логируем путь к конфигу для проверки
        println!("Config file saved to: {}", config_path.display());

        // Открытие папки с файлом
        //Self::open_folder_with_config();
    }

    // Метод для изменения и сохранения языка
    pub fn set_language(&mut self, language: &str) {
        // Обновляем значение поля language
        self.language = language.to_string();

        // Получаем путь к конфигу
        let config_path = Self::get_config_path();

        // Читаем существующий конфиг и обновляем только поле language
        if let Ok(existing_config) = fs::read_to_string(&config_path) {
            if let Ok(mut config_json) = serde_json::from_str::<serde_json::Value>(&existing_config)
            {
                if let Some(language_field) = config_json.get_mut("language") {
                    *language_field = serde_json::Value::String(self.language.clone());
                    // Записываем обратно в файл только изменённое поле language
                    let updated_content = serde_json::to_string_pretty(&config_json).unwrap();
                    fs::write(config_path, updated_content)
                        .expect("Не удалось записать обновленный конфиг.");
                }
            }
        }
    }

    pub fn get_language(&self) -> &str {
        &self.language
    }

    fn get_config_path() -> PathBuf {
        // Печать пути для проверки
        let app_dir = dirs::config_dir().expect("Failed to get AppData directory");
        println!("App config directory: {}", app_dir.display()); // Логируем путь к конфигу
        app_dir.join("Orion").join("config.json")
    }

    fn open_folder_with_config() {
        let config_path = Self::get_config_path();
        let folder_path = config_path.parent().unwrap(); // Получаем родительскую директорию

        #[cfg(target_os = "windows")]
        {
            // Для Windows используем проводник
            Command::new("explorer")
                .arg(folder_path.to_str().unwrap())
                .spawn()
                .expect("Failed to open folder");
        }

        #[cfg(target_os = "linux")]
        {
            // Для Linux используем команду xdg-open
            Command::new("xdg-open")
                .arg(folder_path.to_str().unwrap())
                .spawn()
                .expect("Failed to open folder");
        }

        #[cfg(target_os = "macos")]
        {
            // Для macOS используем команду open
            Command::new("open")
                .arg(folder_path.to_str().unwrap())
                .spawn()
                .expect("Failed to open folder");
        }
    }

    pub fn set_last_opened(&mut self, project_path: &str) {
        // Обновляем поле last_opened
        self.last_opened = Some(project_path.to_string());

        // Получаем путь к конфигу
        let config_path = Self::get_config_path();

        // Читаем существующий конфиг и обновляем только поле last_opened
        if let Ok(existing_config) = fs::read_to_string(&config_path) {
            if let Ok(mut config_json) = serde_json::from_str::<serde_json::Value>(&existing_config)
            {
                if let Some(last_opened_field) = config_json.get_mut("last_opened") {
                    *last_opened_field = serde_json::Value::String(project_path.to_string());
                    // Записываем обратно в файл только изменённое поле
                    let updated_content = serde_json::to_string_pretty(&config_json).unwrap();
                    fs::write(config_path, updated_content)
                        .expect("Не удалось записать обновленный конфиг.");
                }
            }
        }
    }

    pub fn set_auth_token(&mut self, token: &str) {
        // Обновляем поле auth_token в структуре
        self.auth_token = Some(token.to_string());

        // Получаем путь к конфигу
        let config_path = Self::get_config_path();

        // Читаем существующий конфиг и обновляем только поле auth_token
        if let Ok(existing_config) = fs::read_to_string(&config_path) {
            if let Ok(mut config_json) = serde_json::from_str::<serde_json::Value>(&existing_config)
            {
                // Если поле auth_token существует, обновляем его, иначе создаём
                if let Some(auth_token_field) = config_json.get_mut("auth_token") {
                    *auth_token_field = serde_json::Value::String(token.to_string());
                } else {
                    config_json["auth_token"] = serde_json::Value::String(token.to_string());
                }

                // Записываем обратно в файл только изменённое поле
                let updated_content = serde_json::to_string_pretty(&config_json).unwrap();
                fs::write(config_path, updated_content)
                    .expect("Не удалось записать обновленный конфиг.");
            }
        }
    }

    pub fn clear_auth_token(&mut self) {
        // Очищаем поле auth_token в структуре
        self.auth_token = None;

        // Получаем путь к конфигу
        let config_path = Self::get_config_path();

        // Читаем существующий конфиг и обновляем только поле auth_token
        if let Ok(existing_config) = fs::read_to_string(&config_path) {
            if let Ok(mut config_json) = serde_json::from_str::<serde_json::Value>(&existing_config)
            {
                // Если поле auth_token существует, удаляем его, иначе ничего не делаем
                if config_json.get("auth_token").is_some() {
                    config_json["auth_token"] = serde_json::Value::Null;
                }

                // Записываем обратно в файл с изменениями
                let updated_content = serde_json::to_string_pretty(&config_json).unwrap();
                fs::write(config_path, updated_content)
                    .expect("Не удалось записать обновленный конфиг.");
            }
        }
    }

    pub fn toggle_theme(&mut self) {
        // Меняем тему
        self.theme = if self.theme == "dark" {
            "light".to_string()
        } else {
            "dark".to_string()
        };

        // Сохраняем только поле theme
        let config_path = Self::get_config_path();
        if let Ok(mut existing_config) = fs::read_to_string(&config_path) {
            // Преобразуем JSON в объект
            if let Ok(mut config_json) = serde_json::from_str::<serde_json::Value>(&existing_config)
            {
                if let Some(theme_field) = config_json.get_mut("theme") {
                    *theme_field = serde_json::Value::String(self.theme.clone());
                    // Записываем обратно в файл только изменённый theme
                    let updated_content = serde_json::to_string_pretty(&config_json).unwrap();
                    fs::write(config_path, updated_content)
                        .expect("Не удалось записать обновленный конфиг.");
                }
            }
        }
    }
}
