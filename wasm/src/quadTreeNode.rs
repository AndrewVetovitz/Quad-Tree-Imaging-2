// struct QuadTreeNode {
//     red: u8,
//     green: u8,
//     blue: u8,
//     error: u32,
//     startx: u32,
//     starty: u32,
//     endx: u32,
//     endy: u32,
// }

// pub trait TQuadTreeNode {
//     fn new(
//         startx: i32,
//         starty: i32,
//         endx: i32,
//         endy: i32,
//         imageData: ImageData,
//         rowWidth: i32,
//     ) -> QuadTreeNode;
//     fn getWidth(&self) -> u32;
//     fn getHeight(&self) -> u32;
// }

// impl TQuadTreeNode for QuadTreeNode {
//     fn new(
//         startx: i32,
//         starty: i32,
//         endx: i32,
//         endy: i32,
//         imageData: vec<i32>,
//         rowWidth: i32,
//     ) -> Self {
//         let data = calculateRGBAndWeightedError(imageData, startx, starty, endx, endy, rowWidth);

//         let red = data[0];
//         let green = data[1];
//         let blue = data[2];
//         let error = data[3];

//         QuadTreeNode {
//             red,
//             green,
//             blue,
//             error,
//             startx,
//             starty,
//             endx,
//             endy,
//         }
//     }

//     fn getWidth(&self) {
//         self.endx - self.startx;
//     }

//     fn getHeight(&self) {
//         self.endx - self.startx;
//     }
// }

// pub fn calculateRGBAndWeightedError(
//     imageData: vec<i32>,
//     startx: i32,
//     starty: i32,
//     endx: i32,
//     endy: i32,
//     rowWidth: i32,
// ) -> Vec<i32> {
//     let red = vec![0, 256];
//     let green = vec![0, 256];
//     let blue = vec![0, 256];

//     // width
//     for x in startx..endx {
//         // height
//         for y in starty..endy {
//             let index = (y * rowWidth + x) * 4;

//             red[imageData.data[index]] += 1;
//             green[imageData.data[index + 1]] += 1;
//             blue[imageData.data[index + 2]] += 1;
//             // alpha ~ imageData.data[index + 3];
//         }
//     }

//     let totalRed = 0;
//     let totalGreen = 0;
//     let totalBlue = 0;
//     let weightedRed = 0;
//     let weightedGreen = 0;
//     let weightedBlue = 0;

//     for x in 0..256 {
//         totalRed += red[i];
//         weightedRed += red[i] * i;

//         totalGreen += green[i];
//         weightedGreen += green[i] * i;

//         totalBlue += blue[i];
//         weightedBlue += blue[i] * i;
//     }

//     let averageRed = weightedRed / totalRed;
//     let averageGreen = weightedGreen / totalGreen;
//     let averageBlue = weightedBlue / totalBlue;

//     //getting errors
//     let redError = 0;
//     let greenError = 0;
//     let blueError = 0;

//     for i in 0..256 {
//         redError += (averageRed - i) * (averageRed - i) * red[i];
//         greenError += (averageGreen - i) * (averageGreen - i) * green[i];
//         blueError += (averageBlue - i) * (averageBlue - i) * blue[i];
//     }

//     let rmsRedError = if totalRed == 0 {
//         0
//     } else {
//         (redError / totalRed).sqrt()
//     };
//     let rmsGreenError = if totalGreen == 0 {
//         0
//     } else {
//         (greenError / totalGreen).sqrt()
//     };
//     let rmsBlueError = if totalBlue == 0 {
//         0
//     } else {
//         (blueError / totalBlue).sqrt()
//     };

//     let error = rmsRedError * 0.2126 + rmsGreenError * 0.7152 + rmsBlueError * 0.0722;
//     //Other formula that does not work as well
//     //const error = rmsRedError * 0.2989 + rmsGreenError * 0.5870 + rmsBlueError * 0.1140;

//     let width = endx - startx;
//     let height = endy - starty;

//     return vec![
//         averageRed,
//         averageGreen,
//         averageBlue,
//         error * (width * height).pow(0.25),
//     ];
// }

// /*
// function calculateRGBAndWeightedError(
//   imageData: ImageData,
//   startx: number,
//   starty: number,
//   endx: number,
//   endy: number,
//   rowWidth: number,
// ): Array<number> {
//   const red: Array<number> = new Array<number>(256).fill(0);
//   const green: Array<number> = new Array<number>(256).fill(0);
//   const blue: Array<number> = new Array<number>(256).fill(0);

//   // width
//   for (let x = startx; x < endx; x++) {
//     // height
//     for (let y = starty; y < endy; y++) {
//       const index = (y * rowWidth + x) * 4;

//       red[imageData.data[index]]++;
//       green[imageData.data[index + 1]]++;
//       blue[imageData.data[index + 2]]++;
//       // alpha ~ imageData.data[index + 3];
//     }
//   }

//   let totalRed = 0,
//     totalGreen = 0,
//     totalBlue = 0;
//   let weightedRed = 0,
//     weightedGreen = 0,
//     weightedBlue = 0;

//   for (let i = 0; i < 256; i++) {
//     totalRed += red[i];
//     weightedRed += red[i] * i;

//     totalGreen += green[i];
//     weightedGreen += green[i] * i;

//     totalBlue += blue[i];
//     weightedBlue += blue[i] * i;
//   }

//   const averageRed = weightedRed / totalRed;
//   const averageGreen = weightedGreen / totalGreen;
//   const averageBlue = weightedBlue / totalBlue;

//   //getting errors
//   let redError = 0;
//   let greenError = 0;
//   let blueError = 0;

//   for (let i = 0; i < 256; i++) {
//     redError += (averageRed - i) * (averageRed - i) * red[i];
//     greenError += (averageGreen - i) * (averageGreen - i) * green[i];
//     blueError += (averageBlue - i) * (averageBlue - i) * blue[i];
//   }

//   const rmsRedError = totalRed == 0 ? 0 : Math.sqrt(redError / totalRed);
//   const rmsGreenError = totalGreen == 0 ? 0 : Math.sqrt(greenError / totalGreen);
//   const rmsBlueError = totalBlue == 0 ? 0 : Math.sqrt(blueError / totalBlue);

//   const error = rmsRedError * 0.2126 + rmsGreenError * 0.7152 + rmsBlueError * 0.0722;
//   //Other formula that does not work as well
//   //const error = rmsRedError * 0.2989 + rmsGreenError * 0.5870 + rmsBlueError * 0.1140;

//   const width = endx - startx;
//   const height = endy - starty;

//   return [averageRed, averageGreen, averageBlue, error * Math.pow(width * height, 0.25)];
// }

// export { QuadTreeNode, IQuadTreeNode };

//  */
