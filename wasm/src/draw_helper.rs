use crate::to_rgb_str::to_rgb_str;

use std::fmt::{Display, Formatter};

use web_sys::{CanvasRenderingContext2d, ImageData};

use crate::quad_tree_node::{QuadTreeNode, TQuadTreeNode};

enum FillShape {
    SQUARE,
    CIRCLE,
    TRIANGLE,
}

impl Display for FillShape {
    fn fmt(&self, _: &mut Formatter<'_>) -> Result<(), std::fmt::Error> {
        todo!()
    }
}

struct DrawHelper {
    context: CanvasRenderingContext2d,
    canvas_width: usize,
    canvas_height: usize,
    image_data: ImageData,
    image_data_copy: ImageData,
    hex_fill_color: String,
    fill_shape: FillShape,
}

pub trait TDrawHelper {
    fn new(
        context: CanvasRenderingContext2d,
        image_data: ImageData,
        canvas_width: usize,
        canvas_height: usize,
    ) -> Self;

    fn draw_to_canvas(&self);

    fn reset_image_data(&mut self);

    fn update_nodes(&mut self, nodes: Vec<QuadTreeNode>);

    fn draw_shape(&mut self, node: QuadTreeNode);

    fn set_hex_fill_color(&mut self, hex_fill_color: String);

    fn set_fill_shape(&mut self, fill_shape: FillShape);
}

impl TDrawHelper for DrawHelper {
    fn new(
        context: CanvasRenderingContext2d,
        image_data: ImageData,
        canvas_width: usize,
        canvas_height: usize,
    ) -> Self {
        let image_data_copy = image_data.clone();

        DrawHelper {
            context,
            canvas_width,
            canvas_height,
            image_data,
            image_data_copy,
            hex_fill_color: "#ffffff".to_owned(), // default white
            fill_shape: FillShape::SQUARE,
        }
    }

    fn draw_to_canvas(&self) {
        self.context.put_image_data(&self.image_data, 0.0, 0.0);
    }

    fn reset_image_data(&mut self) {
        self.image_data = self.image_data_copy.clone();
    }

    fn update_nodes(&mut self, nodes: Vec<QuadTreeNode>) {
        for node in nodes {
            self.draw_shape(node);
        }
    }

    fn draw_shape(&mut self, node: QuadTreeNode) {
        // fill background
        self.context.set_fill_style_str(&self.hex_fill_color);
        self.context.fill_rect(
            node.startx as f64,
            node.starty as f64,
            node.get_width() as f64,
            node.get_height() as f64,
        );

        self.context
            .set_fill_style_str(&to_rgb_str(node.red, node.green, node.blue));
        // fill shape
        match self.fill_shape {
            FillShape::SQUARE => {
                self.context.fill_rect(
                    (node.startx + 1) as f64,
                    (node.starty + 1) as f64,
                    (node.get_width() - 2) as f64,
                    (node.get_height() - 2) as f64,
                );
            }
            FillShape::CIRCLE => {
                self.context.begin_path();
                self.context.arc_to(
                    (node.startx + node.get_height() / 2) as f64,
                    (node.starty + node.get_height() / 2) as f64,
                    (node.get_width() / 2) as f64,
                    0.0,
                    2.0 * std::f64::consts::PI,
                );
                self.context.fill();
            }
            FillShape::TRIANGLE => {
                self.context.begin_path();
                self.context.move_to(node.startx as f64, node.endy as f64);
                self.context.line_to(
                    (node.startx + node.get_width() / 2) as f64,
                    node.starty as f64,
                );
                self.context.line_to(node.endx as f64, node.endy as f64);
                self.context.fill();
            }
        }

        // save image data
        self.image_data = match self.context.get_image_data(
            0.0,
            0.0,
            self.canvas_width as f64,
            self.canvas_height as f64,
        ) {
            Ok(val) => val,
            Err(err) => {
                panic!("{:?}", err);
            }
        };
    }

    fn set_hex_fill_color(&mut self, hex_fill_color: String) {
        self.hex_fill_color = hex_fill_color;
    }

    fn set_fill_shape(&mut self, fill_shape: FillShape) {
        self.fill_shape = fill_shape;
    }
}
