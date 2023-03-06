#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{ api::process::Command,  Manager, Window };
use tauri::State;
use std::io::BufReader;
use std::process::Command as StdCommand;
use command_group::CommandGroup;
use declarative_discord_rich_presence::{
  activity::{
    Activity, 
    Assets, 
    Timestamps,
    Button
  }, 
  DeclarativeDiscordIpcClient
};


#[tauri::command(async)]
fn discord_set_activity(
  details: &str,
  state: &str,
  timestamp: i64,
  image: &str,
  client: State<'_, DeclarativeDiscordIpcClient>
) -> Result<(), ()> {
  
  let buttons = vec![
    Button::new("Assistir".into(), "https://discord.anima.moe".into())
  ];

  client.set_activity(Activity::new()
    .state(state)
    .details(details)
    .timestamps(Timestamps::new().start(timestamp))
    .assets(Assets::new().large_image(image))
    .buttons(buttons)
  ).ok();

  // println!("{:?}", res);

  Ok(())

}

#[tauri::command(async)]
fn discord_clear_activity(client: State<'_, DeclarativeDiscordIpcClient>) -> Result<(), ()> {

  client.clear_activity().ok();

  Ok(())

}

fn main() {
    tauri_plugin_deep_link::prepare("com.anima.moe");

    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .setup(move |app| {
          // DISCORD RPC
          app.manage(DeclarativeDiscordIpcClient::new("1069047547282325534"));
          let client = app.state::<DeclarativeDiscordIpcClient>();
          client.enable();

          // SIDE CAR
          tauri::async_runtime::spawn(async move {
            let tauri_cmd = Command::new_sidecar("main")
              .expect("failed to setup sidecar");
            let mut std_cmd = StdCommand::from(tauri_cmd);
            let mut child = std_cmd
              .group_spawn() // !
              .expect("failed to spawn sidecar");
            let mut stdout = BufReader::new(child.inner().stdout.take().unwrap());
            let mut buf = Vec::new();
            loop {
              buf.clear();
              match tauri::utils::io::read_line(&mut stdout, &mut buf) {
                  Ok(_n) => {
                      let _line = String::from_utf8_lossy(&buf);
                  }
                  Err(_e) => panic!("idk something bad happened"),
              }
            }
          });

          // DEEP LINK INTEGRATION
          let handle = app.handle();
          tauri_plugin_deep_link::register(
            "anima",
            move |request| {
              dbg!(&request);
              handle
                .emit_all("scheme-request-received", request)
                .unwrap();
            },
          )
          .unwrap();

          Ok(())
        })
        .invoke_handler(tauri::generate_handler![discord_set_activity, discord_clear_activity])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
