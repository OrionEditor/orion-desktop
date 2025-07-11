#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod config;
mod config_global;

use crate::config::Project;
use config::Config;
use tauri::{Builder, Emitter};

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
    .inner_size(750.0, 350.0)
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

#[tauri::command]
async fn reload_all_windows(app: tauri::AppHandle) {
    let windows = app.windows(); // Получаем все окна приложения

    for (label, window) in windows {
        // Отправляем событие фронтенду для перезагрузки
        if let Err(err) = window.emit("reload-windows", ()) {
            eprintln!("Ошибка при отправке события для окна {}: {:?}", label, err);
        } else {
            println!("Событие перезагрузки отправлено для окна {}", label);
        }
    }
}

use tauri_plugin_dialog::{DialogExt, FileDialogBuilder, MessageDialogButtons};

//Workspace commands

mod workspace; // Подключение модуля workspace

use std::path::PathBuf;
use workspace::Workspace;

// #[tauri::command]
// fn create_workspace(workspace_path: String) -> bool {
//     let path = PathBuf::from(workspace_path);
//     let workspace = Workspace::default(); // Создаём workspace с настройками по умолчанию
//     workspace.save(&path).expect("panic message"); // Сохраняем по переданному пути
//     true // Возвращаем true для подтверждения успешного создания
// }

#[tauri::command]
fn create_workspace(workspace_path: String, project_name: String, preset: u8) -> Result<bool, String> {
    let path = PathBuf::from(&workspace_path);
    // Проверяем и создаём директорию
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).map_err(|e| format!("Ошибка при создании директории: {}", e))?;
    }
    let workspace = Workspace::new(project_name, preset);
    workspace.save(&path).map_err(|e| format!("Ошибка при сохранении workspace: {}", e))?;
    Ok(true)
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
use std::{env, fs, io};
use std::fs::DirEntry;
use std::path::Path;
use std::time::SystemTime;
use tauri_plugin_shell::process::Command;
use crate::markdownfiles::MarkdownFiles;

#[derive(Serialize)]
struct FileSystemNode {
    type_id: String,
    name: String,
    path: String,
    is_directory: bool,
    children: Option<Vec<FileSystemNode>>,
    created: Option<u64>,
    last_modified: Option<u64>,
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

                        // Получаем метаданные файла
                        let metadata = fs::metadata(&path).ok();
                        let created = metadata
                            .as_ref()
                            .and_then(|m| m.created().ok())
                            .map(|t| t.duration_since(SystemTime::UNIX_EPOCH).unwrap_or_default().as_millis() as u64);
                        let last_modified = metadata
                            .as_ref()
                            .and_then(|m| m.modified().ok())
                            .map(|t| t.duration_since(SystemTime::UNIX_EPOCH).unwrap_or_default().as_millis() as u64);

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
                            created,
                            last_modified
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
fn delete_file(filePath: String) -> Result<(), String> {
    let path = Path::new(&filePath);

    if !path.exists() {
        return Err("Path does not exist".into());
    }

    if path.is_dir() {
        fs::remove_dir_all(&filePath).map_err(|e| format!("Failed to delete directory: {}", e))?;
    } else {
        fs::remove_file(&filePath).map_err(|e| format!("Failed to delete file: {}", e))?;
    }

    Ok(())
}

#[tauri::command]
fn rename_file(oldPath: String, newName: String) -> Result<(), String> {
    let old_path = Path::new(&oldPath);

    if !old_path.exists() {
        return Err("Path does not exist".into());
    }

    let parent_dir = old_path.parent()
        .ok_or("Cannot determine parent directory".to_string())?
        .to_string_lossy()
        .to_string();

    let new_path = format!("{}/{}", parent_dir, newName);

    fs::rename(&oldPath, &new_path).map_err(|e| format!("Failed to rename: {}", e))?;

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

mod markdownfiles;

#[tauri::command]
fn initialize_markdown_files() -> MarkdownFiles {
    MarkdownFiles::initialize()
}

#[tauri::command]
fn get_markdown_file_content(file_path: String) -> Result<String, String> {
    MarkdownFiles::get_file_content(&file_path)
}

#[tauri::command]
async fn get_project_name(workspace_path: String) -> Result<String, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_project_name(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_preset(workspace_path: String) -> Result<u8, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_preset(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_active_tabs(workspace_path: String) -> Result<Vec<String>, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_active_tabs(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_project_name(workspace_path: String, new_name: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load(&path);
    workspace.set_project_name(&path, new_name).map_err(|e| e.to_string())
}

#[tauri::command]
async fn set_preset(workspace_path: String, new_preset: u8) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load(&path);
    workspace.set_preset(&path, new_preset).map_err(|e| e.to_string())
}

#[tauri::command]
async fn add_active_tab(workspace_path: String, tab_path: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    println!("{:?}", workspace);
    workspace.add_active_tab(&path, tab_path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn remove_active_tab(workspace_path: String, tab_path: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    workspace.remove_active_tab(&path, tab_path).map_err(|e| e.to_string())
}


#[tauri::command]
async fn add_tag(workspace_path: String, tag_label: String, tag_color: String) -> Result<String, String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    workspace.add_tag(&path, tag_label, tag_color).map_err(|e| e.to_string())
}

#[tauri::command]
async fn remove_tag(workspace_path: String, tag_id: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    workspace.remove_tag(&path, tag_id).map_err(|e| e.to_string())
}


#[tauri::command]
async fn get_tags(workspace_path: String) -> Result<Vec<workspace::Tag>, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_tags(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn add_element_tag(workspace_path: String, element_path: String, tag_id: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    workspace.add_element_tag(&path, element_path, tag_id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn remove_element_tag(workspace_path: String, element_path: String, tag_id: String) -> Result<(), String> {
    let path = PathBuf::from(workspace_path);
    let mut workspace = Workspace::load_second(&path);
    workspace.remove_element_tag(&path, element_path, tag_id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_element_tags(workspace_path: String) -> Result<Vec<workspace::ElementTag>, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_element_tags(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn get_tags_by_element_path(workspace_path: String, element_path: String) -> Result<Vec<workspace::Tag>, String> {
    let path = PathBuf::from(workspace_path);
    Workspace::get_tags_by_element_path(&path, element_path).map_err(|e| e.to_string())
}

#[tauri::command]
fn search_orion_projects(deep: bool) -> Vec<Option<Project>> {
    let mut projects = Vec::new();

    // Fast search directories
    let fast_dirs = vec![
        env::var("USERPROFILE").map(|p| format!("{}\\Desktop", p)).unwrap_or_default(),
        env::var("USERPROFILE").map(|p| format!("{}\\Documents", p)).unwrap_or_default(),
        env::var("USERPROFILE").map(|p| format!("{}\\Downloads", p)).unwrap_or_default(),
        env::var("USERPROFILE").map(|p| format!("{}\\Videos", p)).unwrap_or_default(),
        "C:\\".to_string(),
    ];

    // Additional deep search directories
    let deep_dirs = vec![
        "C:\\Program Files".to_string(),
        "C:\\Program Files (x86)".to_string(),
        "C:\\ProgramData".to_string(),
    ];

    // Get all drives
    let drives = get_drives();

    // Fast search
    for dir in fast_dirs.iter().chain(drives.iter()) {
        if let Ok(entries) = fs::read_dir(dir) {
            for entry in entries.flatten() {
                if let Ok(project) = check_dir(&entry, deep) {
                    projects.push(project);
                }
            }
        }
    }

    if deep {
        // Deep search
        for dir in deep_dirs {
            if let Ok(entries) = fs::read_dir(&dir) {
                for entry in entries.flatten() {
                    if let Ok(project) = check_dir(&entry, true) {
                        projects.push(project);
                    }
                }
            }
        }
    }

    projects
}

fn get_drives() -> Vec<String> {
    let mut drives = Vec::new();
    for letter in b'A'..=b'Z' {
        let drive = format!("{}:\\", letter as char);
        if Path::new(&drive).exists() {
            drives.push(drive);
        }
    }
    drives
}

fn check_dir(entry: &DirEntry, deep: bool) -> io::Result<Option<Project>> {
    if entry.file_type()?.is_dir() {
        let path = entry.path();
        let orion_path = path.join(".orion");
        if orion_path.exists() {
            let name = path.file_name()
                .and_then(|n| n.to_str())
                .unwrap_or_default()
                .to_string();
            let path_str = path.to_str().unwrap_or_default().to_string();
            return Ok(Some(Project { name, path: path_str }));
        }
        if deep {
            // Recursive search
            if let Ok(entries) = fs::read_dir(&path) {
                for sub_entry in entries.flatten() {
                    if let Ok(Some(project)) = check_dir(&sub_entry, true) {
                        return Ok(Some(project));
                    }
                }
            }
        }
    }
    Ok(None)
}

fn main() {
    Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
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
            initialize_markdown_files,
            get_markdown_file_content,
            delete_file,
            rename_file,
            reload_all_windows,
            get_project_name,
            get_preset,
            get_active_tabs,
            set_project_name,
            set_preset,
            add_active_tab,
            remove_active_tab,
            search_orion_projects,
            add_tag,
            remove_tag,
            get_tags,
            add_element_tag,
            remove_element_tag,
            get_element_tags,
            get_tags_by_element_path
        ]) // Регистрируем команду
        .run(tauri::generate_context!()) // Запускаем Tauri
        .expect("error while running tauri application");

    // Если mdeditor_lib::run() необходимо использовать, можно вызывать его после Tauri:
    mdeditor_lib::run();
}
