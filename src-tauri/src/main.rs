#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod config_global;

use crate::config::Project;
use config::Config;
use tauri::Builder;

#[tauri::command]
fn get_config() -> Config {
    Config::load()
}

#[tauri::command]
fn get_recent_projects() -> Vec<Project> {
    Config::load().recent_projects
}

#[tauri::command]
fn get_theme() -> String {
    Config::load().theme
}

#[tauri::command]
fn get_language() -> String {
    Config::load().language
}

#[tauri::command]
fn set_language(language: String) {
    let mut config = Config::load();
    config.set_language(&language);
}

#[tauri::command]
fn get_last_opened() -> Option<String> {
    Config::load().last_opened.clone()
}

#[tauri::command]
fn set_last_opened(project_path: String) {
    let mut config = Config::load();
    config.set_last_opened(&project_path);
}

#[tauri::command]
fn toggle_theme() {
    let mut config = Config::load();
    config.toggle_theme();
}

// Убедитесь, что импортируете `AppHandle`, `Manager`, и все необходимые модули
use tauri::{AppHandle, Manager};

use tauri::utils::config::WebviewUrl;
use tauri::WebviewWindowBuilder;
use tauri::Window;

//WindowCommands

#[tauri::command]
async fn create_project_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "create-project",
        WebviewUrl::App("index.html".into()),
    )
    .title("Create New Project")
    .resizable(false)
    .inner_size(750.0, 550.0)
    .fullscreen(false)
    .maximized(false)
    .maximizable(false)
    .always_on_top(true)
    .build()
    .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
async fn create_login_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "login-window",
        WebviewUrl::App("index.html".into()),
    )
    .title("Login")
    .resizable(false)
    .inner_size(700.0, 400.0)
    .fullscreen(false)
    .maximized(false)
    .maximizable(false)
    .always_on_top(true)
    .build()
    .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
async fn create_main_window(handle: AppHandle) {
    let new_window =
        WebviewWindowBuilder::new(&handle, "main", WebviewUrl::App("index.html".into()))
            .title("Orion - Start page")
            .resizable(false)
            .inner_size(800.0, 600.0)
            .fullscreen(false)
            .maximized(false)
            .maximizable(false)
            .always_on_top(true)
            .build()
            .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
async fn create_profile_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "profile-window",
        WebviewUrl::App("index.html".into()),
    )
    .title("Profile")
    .resizable(false)
    .inner_size(700.0, 400.0)
    .fullscreen(false)
    .maximized(false)
    .maximizable(false)
    .always_on_top(true)
    .build()
    .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}

#[tauri::command]
async fn create_fullscreen_project_window(handle: AppHandle) {
    let new_window = WebviewWindowBuilder::new(
        &handle,
        "project-fullscreen",
        WebviewUrl::App("index.html".into()),
    )
    .title("Project Window")
    .maximized(true) // Полноэкранный режим
    .disable_drag_drop_handler()
    .build()
    .expect("Ошибка при создании окна");

    new_window.show().unwrap();
}
#[tauri::command]
async fn get_window_label(window: tauri::Window) -> String {
    window.label().to_string()
}

#[tauri::command]
fn close_all_except_project_window(app: AppHandle) {
    let windows = app.windows(); // Получаем все окна приложения

    for (label, window) in windows {
        if label != "project-fullscreen" {
            window.close().unwrap_or_else(|err| {
                eprintln!("Ошибка при закрытии окна {}: {:?}", label, err);
            });
        }
    }
}

#[tauri::command]
fn close_window_by_label(app: AppHandle, label: String) {
    if let Some(window) = app.get_window(&label) {
        window.close().unwrap_or_else(|err| {
            eprintln!("Ошибка при закрытии окна {}: {:?}", label, err);
        });
    } else {
        eprintln!("Окно с меткой {} не найдено.", label);
    }
}

use tauri_plugin_dialog::{DialogExt, FileDialogBuilder, MessageDialogButtons};

//Workspace commands

mod workspace; // Подключение модуля workspace

use std::path::PathBuf;
use workspace::Workspace;

#[tauri::command]
fn create_workspace(workspace_path: String) -> bool {
    let path = PathBuf::from(workspace_path);
    let workspace = Workspace::default(); // Создаём workspace с настройками по умолчанию
    workspace.save(&path).expect("panic message"); // Сохраняем по переданному пути
    true // Возвращаем true для подтверждения успешного создания
}

#[tauri::command]
fn set_auth_token(token: String) {
    let mut config = Config::load();
    config.set_auth_token(&token);
}

#[tauri::command]
fn get_auth_token() -> Option<String> {
    Config::load().auth_token.clone()
}

#[tauri::command]
fn clear_auth_token() {
    let mut config = Config::load();
    config.clear_auth_token();
}

use serde::Serialize;
use std::fs;
use std::path::Path;
use tauri_plugin_shell::process::Command;

#[derive(Serialize)]
struct FileSystemNode {
    type_id: String,
    name: String,
    path: String,
    is_directory: bool,
    children: Option<Vec<FileSystemNode>>,
}

#[tauri::command]
fn get_file_structure(path: String) -> Result<Vec<FileSystemNode>, String> {
    fn is_directory(path: String) -> bool {
        match fs::metadata(&path) {
            Ok(metadata) => metadata.is_dir(),
            Err(_) => false, // Если путь недоступен или ошибка, возвращаем false
        }
    }

    fn read_dir_recursive(dir: &Path) -> Vec<FileSystemNode> {
        let mut nodes = vec![];

        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries {
                match entry {
                    Ok(entry) => {
                        let path = entry.path();
                        let path_str = path.to_string_lossy().to_string();

                        // println!("Проверяем путь: {}", path_str);

                        // Используем вашу функцию `is_directory` для проверки
                        let is_directory = is_directory(path_str.clone());

                        // println!("Это: {}", is_directory);

                        nodes.push(FileSystemNode {
                            type_id: if is_directory {
                                "Directory".to_string()
                            } else {
                                "File".to_string()
                            }, // Устанавливаем значение type_id
                            name: entry.file_name().to_string_lossy().into_owned(),
                            path: path_str,
                            is_directory,
                            children: if is_directory {
                                Some(read_dir_recursive(&path))
                            } else {
                                None
                            },
                        });
                    }
                    Err(err) => {
                        eprintln!("Ошибка чтения записи: {}", err);
                    }
                }
            }
        } else {
            eprintln!("Ошибка открытия директории: {:?}", dir);
        }

        nodes
    }

    let path = Path::new(&path);
    if !path.exists() {
        return Err("Path does not exist".into());
    }

    Ok(read_dir_recursive(path))
}

#[tauri::command]
fn create_file(path: String, name: String) -> Result<(), String> {
    let file_path = format!("{}/{}", path, name);
    fs::File::create(&file_path).map_err(|e| format!("Failed to create file: {}", e))?;
    Ok(())
}

#[tauri::command]
fn create_directory(path: String, name: String) -> Result<(), String> {
    let dir_path = format!("{}/{}", path, name);
    fs::create_dir_all(&dir_path).map_err(|e| format!("Failed to create directory: {}", e))?;
    Ok(())
}

#[tauri::command]
fn move_folder(source: String, destination: String) -> Result<(), String> {
    let source_path = Path::new(&source);
    let destination_path = Path::new(&destination);

    // Проверяем, существует ли исходная папка
    if !source_path.exists() || !source_path.is_dir() {
        return Err(format!(
            "Source folder does not exist or is not a directory: {}",
            source
        ));
    }

    // Проверяем, существует ли папка назначения
    if destination_path.exists() {
        return Err(format!(
            "Destination folder already exists: {}",
            destination
        ));
    }

    // Выполняем перемещение
    fs::rename(&source_path, &destination_path).map_err(|e| {
        format!(
            "Failed to move folder from '{}' to '{}': {}",
            source, destination, e
        )
    })?;

    Ok(())
}

fn main() {
    Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            get_recent_projects,
            get_theme,
            get_last_opened,
            set_last_opened,
            toggle_theme,
            get_language,
            set_language,
            create_project_window,
            get_window_label,
            create_workspace,
            create_fullscreen_project_window,
            create_profile_window,
            create_main_window,
            close_all_except_project_window,
            close_window_by_label,
            create_login_window,
            set_auth_token,
            get_auth_token,
            clear_auth_token,
            get_file_structure,
            create_directory,
            create_file,
            move_folder,
        ]) // Регистрируем команду
        .run(tauri::generate_context!()) // Запускаем Tauri
        .expect("error while running tauri application");

    // Если mdeditor_lib::run() необходимо использовать, можно вызывать его после Tauri:
    mdeditor_lib::run();
}
