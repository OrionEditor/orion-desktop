// use serde::{Deserialize, Serialize};
// use crate::config::{Config, Project};
// use tauri::command;
// use std::sync::Mutex;
// use lazy_static::lazy_static;
//
// lazy_static! {
//     pub static ref CONFIG: Mutex<Config> = Mutex::new(Config::default());
// }
//
// #[command]
// pub fn get_config() -> Config {
//     CONFIG.lock().unwrap().clone() // Возвращаем клон текущей конфигурации
// }
//
// #[command]
// pub fn get_recent_projects() -> Vec<Project> {
//     let projects = CONFIG.lock().unwrap().recent_projects.clone();
//     println!("Sending recent projects: {:?}", projects);
//     projects
// }
