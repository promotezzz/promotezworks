use axum::{Json, response::IntoResponse};
use serde::Serialize;
use std::fs;
use std::path::Path;
use std::process::Command;
use sysinfo::System;

#[derive(Serialize)]
pub struct SystemInfo {
    pub os_name: String,
    pub os_version: String,
    pub host_name: String,
    pub cpu_count: usize,
    pub cpu_brand: String,
}

#[derive(Serialize)]
pub struct TelemetryData {
    pub cpu_usage: f32,
    pub memory_total: u64,
    pub memory_used: u64,
    pub memory_free: u64,
    pub uptime: u64,
}

#[derive(Serialize)]
pub struct ProjectInfo {
    pub name: String,
    pub path: String,
    pub is_git: bool,
    pub size_bytes: u64,
    pub folder_count: usize,
    pub file_count: usize,
}

#[derive(Serialize)]
pub struct WorkspaceStatus {
    pub total_projects: usize,
    pub projects: Vec<ProjectInfo>,
}

#[derive(Serialize)]
pub struct ToolStatus {
    pub name: String,
    pub installed: bool,
    pub version: String,
}

pub async fn get_system_info() -> impl IntoResponse {
    let mut sys = System::new_all();
    sys.refresh_all();

    let os_name = System::name().unwrap_or_else(|| "Unknown".to_string());
    let os_version = System::os_version().unwrap_or_else(|| "Unknown".to_string());
    let host_name = System::host_name().unwrap_or_else(|| "Unknown".to_string());
    let cpu_count = sys.cpus().len();
    let cpu_brand = if let Some(cpu) = sys.cpus().first() {
        cpu.brand().to_string()
    } else {
        "Unknown".to_string()
    };

    Json(SystemInfo {
        os_name,
        os_version,
        host_name,
        cpu_count,
        cpu_brand,
    })
}

pub async fn get_telemetry() -> impl IntoResponse {
    let mut sys = System::new_all();
    sys.refresh_cpu();
    sys.refresh_memory();
    
    // Give CPU counter a short delay to get difference
    tokio::time::sleep(std::time::Duration::from_millis(100)).await;
    sys.refresh_cpu();

    let cpu_usage = sys.global_cpu_info().cpu_usage();
    let memory_total = sys.total_memory();
    let memory_used = sys.used_memory();
    let memory_free = sys.free_memory();
    let uptime = System::uptime();

    Json(TelemetryData {
        cpu_usage,
        memory_total,
        memory_used,
        memory_free,
        uptime,
    })
}

fn scan_directory(path: &Path) -> (u64, usize, usize) {
    let mut total_size = 0;
    let mut file_count = 0;
    let mut folder_count = 0;

    if let Ok(entries) = fs::read_dir(path) {
        for entry in entries.flatten() {
            if let Ok(ft) = entry.file_type() {
                if ft.is_dir() {
                    folder_count += 1;
                    let name = entry.file_name();
                    let name_str = name.to_string_lossy();
                    // Skip scanning massive dependency/target directories for speed
                    if name_str == "node_modules" || name_str == "target" || name_str == ".git" {
                        continue;
                    }
                    let (size, files, folders) = scan_directory(&entry.path());
                    total_size += size;
                    file_count += files;
                    folder_count += folders;
                } else if ft.is_file() {
                    file_count += 1;
                    if let Ok(metadata) = entry.metadata() {
                        total_size += metadata.len();
                    }
                }
            }
        }
    }
    (total_size, file_count, folder_count)
}

pub async fn get_workspace_status() -> impl IntoResponse {
    let projects_dir = Path::new("C:\\Users\\broyl\\OneDrive\\Desktop\\projects");
    let mut projects = Vec::new();

    if let Ok(entries) = fs::read_dir(projects_dir) {
        for entry in entries.flatten() {
            if let Ok(ft) = entry.file_type() {
                if ft.is_dir() {
                    let path = entry.path();
                    let name = entry.file_name().to_string_lossy().to_string();
                    let is_git = path.join(".git").exists();
                    let (size_bytes, file_count, folder_count) = scan_directory(&path);

                    projects.push(ProjectInfo {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_git,
                        size_bytes,
                        folder_count,
                        file_count,
                    });
                }
            }
        }
    }

    let total_projects = projects.len();
    Json(WorkspaceStatus {
        total_projects,
        projects,
    })
}

pub async fn check_tools() -> impl IntoResponse {
    let tools = vec!["git", "node", "npm", "cargo"];
    let mut status_list = Vec::new();

    for tool in tools {
        let output = if cfg!(target_os = "windows") {
            Command::new("cmd")
                .args(["/C", &format!("{} --version", tool)])
                .output()
        } else {
            Command::new("sh")
                .args(["-c", &format!("{} --version", tool)])
                .output()
        };

        match output {
            Ok(out) if out.status.success() => {
                let version = String::from_utf8_lossy(&out.stdout).trim().to_string();
                status_list.push(ToolStatus {
                    name: tool.to_string(),
                    installed: true,
                    version,
                });
            }
            _ => {
                status_list.push(ToolStatus {
                    name: tool.to_string(),
                    installed: false,
                    version: "Not found".to_string(),
                });
            }
        }
    }

    Json(status_list)
}
