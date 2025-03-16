use std::env;
use axum::{routing::get, Router};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(handler));

    let port: u16 = env::var("PORT")
        .ok()
        .and_then(|p| p.parse().ok())
        .unwrap_or(3000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    let listener = TcpListener::bind(addr).await.unwrap();

    println!("listening on {}", addr);
    axum::serve(listener, app).await.unwrap();
}

async fn handler() -> &'static str {
    "Hello, world!"
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::Router;
    use axum_test::TestServer;

    #[tokio::test]
    async fn hello_world() {
        let app = Router::new().route("/", get(handler));
        let client = TestServer::new(app);
        let response = client.expect("").get("/").await;

        assert_eq!(response.status_code(), 200);
        assert_eq!(response.text(), "Hello, world!");
    }
}
