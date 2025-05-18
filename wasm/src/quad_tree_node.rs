use std::cmp::Ordering;
use web_sys::ImageData;

struct ErrorCalcuation {
    red: u8,
    green: u8,
    blue: u8,
    error: f32,
}

#[derive(Clone)]
pub struct QuadTreeNode {
    pub red: u8,
    pub green: u8,
    pub blue: u8,
    pub error: f32,
    pub startx: usize,
    pub starty: usize,
    pub endx: usize,
    pub endy: usize,
}

impl Ord for QuadTreeNode {
    // return a.error - b.error < 0.0001 ? 1 : -1;
    fn cmp(&self, other: &Self) -> Ordering {
        if self.error - &other.error < 0.0001 {
            Ordering::Greater
        } else {
            Ordering::Less
        }
    }
}

impl PartialOrd for QuadTreeNode {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

impl PartialEq for QuadTreeNode {
    fn eq(&self, _other: &Self) -> bool {
        false
    }
}

impl Eq for QuadTreeNode {}

pub trait TQuadTreeNode {
    fn new(
        startx: usize,
        starty: usize,
        endx: usize,
        endy: usize,
        image_data: &ImageData,
        row_width: usize,
    ) -> QuadTreeNode;

    fn get_width(&self) -> usize;

    fn get_height(&self) -> usize;
}

impl TQuadTreeNode for QuadTreeNode {
    fn new(
        startx: usize,
        starty: usize,
        endx: usize,
        endy: usize,
        image_data: &ImageData,
        row_width: usize,
    ) -> Self {
        let data =
            calculate_rgb_and_weighted_error(image_data, startx, starty, endx, endy, row_width);

        let red: u8 = data.red;
        let green: u8 = data.green;
        let blue: u8 = data.blue;
        let error: f32 = data.error;

        QuadTreeNode {
            red,
            green,
            blue,
            error,
            startx,
            starty,
            endx,
            endy,
        }
    }

    fn get_width(&self) -> usize {
        self.endx - self.startx
    }

    fn get_height(&self) -> usize {
        self.endx - self.startx
    }
}

fn calculate_rgb_and_weighted_error(
    image_data: &ImageData,
    startx: usize,
    starty: usize,
    endx: usize,
    endy: usize,
    row_width: usize,
) -> ErrorCalcuation {
    let mut red: Vec<u32> = vec![0, 256];
    let mut green: Vec<u32> = vec![0, 256];
    let mut blue: Vec<u32> = vec![0, 256];

    // width
    for x in startx..endx {
        // height
        for y in starty..endy {
            let index = (y * row_width + x) * 4;

            red[image_data.data()[index] as usize] += 1;
            green[image_data.data()[index + 1] as usize] += 1;
            blue[image_data.data()[index + 2] as usize] += 1;
            // alpha ~ image_data.data()[index + 3] as usize;
        }
    }

    let mut total_red: u32 = 0;
    let mut total_green: u32 = 0;
    let mut total_blue: u32 = 0;
    let mut weighted_red: u32 = 0;
    let mut weighted_green: u32 = 0;
    let mut weighted_blue: u32 = 0;

    for i in 0..256 {
        total_red += red[i];
        weighted_red += red[i] * i as u32;

        total_green += green[i];
        weighted_green += green[i] * i as u32;

        total_blue += blue[i];
        weighted_blue += blue[i] * i as u32;
    }

    let average_red: u32 = weighted_red / total_red;
    let average_green: u32 = weighted_green / total_green;
    let average_blue: u32 = weighted_blue / total_blue;

    //getting errors
    let mut red_error = 0;
    let mut green_error = 0;
    let mut blue_error = 0;

    for i in 0..256 {
        red_error += (average_red - i) * (average_red - i) * red[i as usize];
        green_error += (average_green - i) * (average_green - i) * green[i as usize];
        blue_error += (average_blue - i) * (average_blue - i) * blue[i as usize];
    }

    let rms_red_error: f32 = if total_red == 0 {
        0.0
    } else {
        (red_error as f32 / total_red as f32).sqrt()
    };
    let rms_green_error: f32 = if total_green == 0 {
        0.0
    } else {
        (green_error as f32 / total_green as f32).sqrt()
    };
    let rms_blue_error: f32 = if total_blue == 0 {
        0.0
    } else {
        (blue_error as f32 / total_blue as f32).sqrt()
    };

    let error = rms_red_error * 0.2126 + rms_green_error * 0.7152 + rms_blue_error * 0.0722;
    //Other formula that does not work as well
    //const error = rmsRedError * 0.2989 + rmsGreenError * 0.5870 + rmsBlueError * 0.1140;

    let width = endx - startx;
    let height = endy - starty;
    let area = width * height;

    return ErrorCalcuation {
        red: average_red as u8,
        green: average_green as u8,
        blue: average_blue as u8,
        error: error * f32::powf(area as f32, 1.0 / 4.0),
    };
}
