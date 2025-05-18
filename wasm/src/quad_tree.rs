use std::collections::BinaryHeap;

use web_sys::ImageData;

use crate::quad_tree_node::{QuadTreeNode, TQuadTreeNode};

struct QuadTree {
    image_data: ImageData,
    pq: BinaryHeap<QuadTreeNode>,
    iterations: u32,
    height: usize,
    width: usize,
}

pub trait TQuadTree {
    fn new(image_data: ImageData, width: usize, height: usize) -> Self;

    fn reset(&mut self);

    fn step(&mut self) -> Vec<QuadTreeNode>;

    fn get_clicked_nodes(&mut self, x: usize, y: usize) -> Vec<QuadTreeNode>;

    fn step_cordinate(&mut self, x: usize, y: usize) -> Vec<QuadTreeNode>;

    fn divide(&self, node: QuadTreeNode) -> Vec<QuadTreeNode>;
}

impl TQuadTree for QuadTree {
    fn new(image_data: ImageData, width: usize, height: usize) -> Self {
        let mut quad_tree = QuadTree {
            image_data: image_data.clone(),
            pq: BinaryHeap::new(),
            iterations: 0,
            height,
            width,
        };

        quad_tree.reset();
        quad_tree
    }

    fn reset(&mut self) {
        self.iterations = 0;
        self.pq = BinaryHeap::from([QuadTreeNode::new(
            0,
            0,
            self.height,
            self.width,
            &self.image_data,
            self.width,
        )]);
    }

    fn step(&mut self) -> Vec<QuadTreeNode> {
        if self.pq.is_empty() {
            return vec![];
        }

        let node = self.pq.pop();

        let nodes = match node {
            Some(val) => self.divide(val),
            None => vec![],
        };

        for i in 0..nodes.len() {
            self.pq.push(nodes[i].clone());
        }

        // //making sure the divisions amount does not become too small, dividing a uniform image
        while !self.pq.is_empty() {
            let top = self.pq.peek();

            let result = match top {
                Some(val) => val,
                None => break,
            };

            if result.get_width() < 2 || result.get_height() < 2 || result.error <= 0.5 {
                self.pq.pop();
            } else {
                break;
            }
        }

        self.iterations += 1;

        nodes
    }

    fn get_clicked_nodes(&mut self, x: usize, y: usize) -> Vec<QuadTreeNode> {
        let mut clicked_nodes = vec![];
        let mut not_clicked_nodes = vec![];

        for node in self.pq.drain() {
            if node.startx <= x && node.endx >= x && node.starty <= y && node.endy >= y {
                clicked_nodes.push(node);
            } else {
                not_clicked_nodes.push(node);
            }
        }

        self.pq = BinaryHeap::from(not_clicked_nodes);

        clicked_nodes
    }

    fn step_cordinate(&mut self, x: usize, y: usize) -> Vec<QuadTreeNode> {
        if self.pq.is_empty() {
            return vec![];
        }

        let clicked_nodes = self.get_clicked_nodes(x, y);

        if clicked_nodes.len() == 0 {
            return vec![];
        }

        let mut nodes: Vec<QuadTreeNode> = vec![];

        for node in clicked_nodes {
            nodes.append(&mut self.divide(node));
        }

        for i in 0..nodes.len() {
            self.pq.push(nodes[i].clone());
        }

        // //making sure the divisions amount does not become too small, dividing a uniform image
        while !self.pq.is_empty() {
            let top = self.pq.peek();

            let result = match top {
                Some(val) => val,
                None => break,
            };

            if result.get_width() < 2 || result.get_height() < 2 || result.error <= 0.5 {
                self.pq.pop();
            } else {
                break;
            }
        }

        self.iterations += (nodes.len() / 4) as u32;

        nodes
    }

    fn divide(&self, node: QuadTreeNode) -> Vec<QuadTreeNode> {
        let startx = node.startx;
        let midx = node.startx + (node.endx - node.startx) / 2;
        let endx = node.endx;

        let starty = node.starty;
        let midy = node.starty + (node.endy - node.starty) / 2;
        let endy = node.endy;

        return vec![
            QuadTreeNode::new(startx, starty, midx, midy, &self.image_data, self.width), // top left
            QuadTreeNode::new(midx, starty, endx, midy, &self.image_data, self.width), // top right
            QuadTreeNode::new(startx, midy, midx, endy, &self.image_data, self.width), // bottom left
            QuadTreeNode::new(midx, midy, endx, endy, &self.image_data, self.width), // bottom right
        ];
    }
}
