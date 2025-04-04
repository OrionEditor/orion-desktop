use serde::{Deserialize, Serialize};
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct MarkdownFiles {
    pub help_ru_path: String,
    pub help_en_path: String,
    pub syntax_ru_path: String,
    pub syntax_en_path: String,
}

impl MarkdownFiles {
    pub fn initialize() -> Self {
        let markdown_dir = Self::get_markdown_dir();
        let help_dir = markdown_dir.join("help");
        let syntax_dir = markdown_dir.join("syntax");

        // Создаём директории, если их нет
        fs::create_dir_all(&help_dir).expect("Не удалось создать директорию help");
        fs::create_dir_all(&syntax_dir).expect("Не удалось создать директорию syntax");

        // Пути к файлам
        let help_ru_path = help_dir.join("help_ru.md");
        let help_en_path = help_dir.join("help_en.md");
        let syntax_ru_path = syntax_dir.join("syntax_ru.md");
        let syntax_en_path = syntax_dir.join("syntax_en.md");

        // Создаём файлы с содержимым, если их нет
        Self::create_file_if_not_exists(&help_ru_path, include_str!("assets/Markdown/help/help_ru.md"));
        Self::create_file_if_not_exists(&help_en_path, include_str!("assets/Markdown/help/help_en.md"));
        Self::create_file_if_not_exists(&syntax_ru_path, include_str!("assets/Markdown/syntax/syntax_ru.md"));
        Self::create_file_if_not_exists(&syntax_en_path, include_str!("assets/Markdown/syntax/syntax_en.md"));

        MarkdownFiles {
            help_ru_path: help_ru_path.to_string_lossy().into_owned(),
            help_en_path: help_en_path.to_string_lossy().into_owned(),
            syntax_ru_path: syntax_ru_path.to_string_lossy().into_owned(),
            syntax_en_path: syntax_en_path.to_string_lossy().into_owned(),
        }
    }

    fn get_markdown_dir() -> PathBuf {
        let app_dir = dirs::config_dir().expect("Не удалось получить директорию AppData");
        app_dir.join("Orion").join("Markdown")
    }

    fn create_file_if_not_exists(path: &PathBuf, content: &str) {
        if !path.exists() {
            let mut file = File::create(path).expect("Не удалось создать Markdown-файл");
            file.write_all(content.as_bytes()).expect("Не удалось записать содержимое в Markdown-файл");
            println!("Создан файл: {}", path.display());
        }
    }

    pub fn get_file_content(file_path: &str) -> Result<String, String> {
        fs::read_to_string(file_path).map_err(|e| format!("Не удалось прочитать файл {}: {}", file_path, e))
    }
}