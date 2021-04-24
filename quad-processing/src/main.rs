mod quad_tree;

use image::io::Reader as ImageReader;
use image::{RgbImage, DynamicImage, Rgba, Rgb};
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();
    let image_dir = &args[1];

    println!("image directory {:?}", image_dir);

    let mut final_image = import_image(image_dir);
    let rgb_image = final_image.into_rgba8();

    let (width, height) = rgb_image.dimensions();

    let mut img = RgbImage::new(width, height);

    for x in 0..width {
        for y in 0..height {
            let colors = rgb_image.get_pixel(x, y);

            if x < (0.75 * width as f64) as u32 {
                img.put_pixel(x, y, Rgb([colors[0], colors[1], colors[2]]));
            } else {
                img.put_pixel(x, y, Rgb([255, 0, 0]));
            }
        }
    }

    // reg_mut_image.put_pixel(500, 500, Rgba([255, 0, 0, 0]));
    img.save("new_file.jpg");

    // let (width, height) = reg_mut_image.dimensions();

    println!("width: {}, heigth: {}", width, height);

    let q = quad_tree::QuadTree::new();
    q.speak();
    q.speak();
    q.speak();
    q.speak();
}

fn import_image(image_dir: &String) -> DynamicImage {
    let img = ImageReader::open(image_dir);

    let img_file = match img {
        Ok(s) => s,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };

    let img_decoded = img_file.decode();

    return match img_decoded {
        Ok(s) => s,
        Err(error) => panic!("Problem opening the file: {:?}", error),
    };
}
