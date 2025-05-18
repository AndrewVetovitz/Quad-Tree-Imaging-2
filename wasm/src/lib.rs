// mod canvas;
mod quad_tree;
mod quad_tree_node;
mod utils;
mod draw_helper;
mod to_rgb_str;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn start() {
    alert("Start!");

    use web_sys::console;

    console::log_1(&JsValue::from_str("hello from rust"));
}

#[wasm_bindgen]
pub fn stop() {
    alert("Stop!");
}
