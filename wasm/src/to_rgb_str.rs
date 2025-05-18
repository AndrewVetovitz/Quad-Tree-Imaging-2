// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

pub fn to_rgb_str(red: u8, green: u8, blue: u8) -> String {
    // Return the RGB values as rgb(r,g,b)
    "rgb(".to_owned() + &red.to_string() + "," + &green.to_string() + "," + &blue.to_string() + ")"
}
