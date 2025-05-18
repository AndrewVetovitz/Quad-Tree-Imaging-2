// use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     #[wasm_bindgen(js_namespace = console)]
//     fn log(s: &str);
// }

// #[wasm_bindgen]
// pub fn set_canvas_state(string_nullable: Option<String>) {
//     let state = match string_nullable {
//         Some(string_nullable) => string_nullable,
//         None => {
//             return;
//         }
//     };

//     match state.as_str() {
//         "start" => {
//             log("start!");
//         }
//         "stop" => {
//             log("stop!");
//         }
//         "reset" => {
//             log("reset!");
//         }
//         "step" => {
//             log("step!");
//         }
//         "download" => {
//             log("download!");
//         }
//         "set_shape" => {
//             log("set_shape!");
//         }
//         "set_file" => {
//             log("set_file!");
//         }
//         _ => log("matched nothing"),
//     }
// }
