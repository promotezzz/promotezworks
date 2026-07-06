mod handlers;

use axum::{
    routing::get,
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use std::net::SocketAddr;
use std::path::PathBuf;

#[tokio::main]
async fn main() {
    // Set up CORS layer to allow local frontend requests in development
    let cors = CorsLayer::new()
        .allow_origin(Any) // For dev purposes, allows Vite server at 5173
        .allow_methods(Any)
        .allow_headers(Any);

    // Build our application with routes
    let api_router = Router::new()
        .route("/system-info", get(handlers::get_system_info))
        .route("/telemetry", get(handlers::get_telemetry))
        .route("/workspace-status", get(handlers::get_workspace_status))
        .route("/check-tools", get(handlers::check_tools));

    // Try serving compiled static files from ../frontend/dist
    let dist_path = PathBuf::from("../frontend/dist");
    let serve_dir = ServeDir::new(dist_path.clone())
        .fallback(tower_http::services::ServeFile::new(dist_path.join("index.html")));

    let app = Router::new()
        .nest("/api", api_router)
        .fallback_service(serve_dir)
        .layer(cors);

    // Run our app
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("Baerna server running on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
