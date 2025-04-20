interface IQuadTreeNode {
	error: number;
}

class QuadTreeNode implements IQuadTreeNode {
	red: number;
	green: number;
	blue: number;
	error: number;
	startx: number;
	starty: number;
	endx: number;
	endy: number;

	constructor(
		startx: number,
		starty: number,
		endx: number,
		endy: number,
		imageData: ImageData,
		rowWidth: number
	) {
		this.startx = startx;
		this.starty = starty;
		this.endx = endx;
		this.endy = endy;
		const data = calculateRGBAndWeightedError(
			imageData,
			startx,
			starty,
			endx,
			endy,
			rowWidth
		);

		this.red = data[0];
		this.green = data[1];
		this.blue = data[2];
		this.error = data[3];
	}

	getWidth(): number {
		return this.endy - this.starty;
	}

	getHeight(): number {
		return this.endx - this.startx;
	}
}

function calculateRGBAndWeightedError(
	imageData: ImageData,
	startx: number,
	starty: number,
	endx: number,
	endy: number,
	rowWidth: number
): Array<number> {
	const red: Array<number> = new Array<number>(256).fill(0);
	const green: Array<number> = new Array<number>(256).fill(0);
	const blue: Array<number> = new Array<number>(256).fill(0);

	for (let x = startx; x < endx; x++) {
		for (let y = starty; y < endy; y++) {
			const index = (x * rowWidth + y) * 4;

			red[imageData.data[index]]++;
			green[imageData.data[index + 1]]++;
			blue[imageData.data[index + 2]]++;
			// alpha ~ imageData.data[index + 3];
		}
	}

	let totalRed = 0,
		totalGreen = 0,
		totalBlue = 0;
	let weightedRed = 0,
		weightedGreen = 0,
		weightedBlue = 0;

	for (let i = 0; i < 256; i++) {
		totalRed += red[i];
		weightedRed += red[i] * i;

		totalGreen += green[i];
		weightedGreen += green[i] * i;

		totalBlue += blue[i];
		weightedBlue += blue[i] * i;
	}

	const averageRed = weightedRed / totalRed;
	const averageGreen = weightedGreen / totalGreen;
	const averageBlue = weightedBlue / totalBlue;

	//getting errors
	let redError = 0;
	let greenError = 0;
	let blueError = 0;

	for (let i = 0; i < 256; i++) {
		redError += (averageRed - i) * (averageRed - i) * red[i];
		greenError += (averageGreen - i) * (averageGreen - i) * green[i];
		blueError += (averageBlue - i) * (averageBlue - i) * blue[i];
	}

	const rmsRedError = totalRed == 0 ? 0 : Math.sqrt(redError / totalRed);
	const rmsGreenError =
		totalGreen == 0 ? 0 : Math.sqrt(greenError / totalGreen);
	const rmsBlueError = totalBlue == 0 ? 0 : Math.sqrt(blueError / totalBlue);

	const error =
		rmsRedError * 0.2126 + rmsGreenError * 0.7152 + rmsBlueError * 0.0722;
	//Other formula that does not work as well
	//const error = rmsRedError * 0.2989 + rmsGreenError * 0.5870 + rmsBlueError * 0.1140;

	const width = endy - starty;
	const height = endx - startx;

	return [
		averageRed,
		averageGreen,
		averageBlue,
		error * Math.pow(width * height, 0.25),
	];
}

export { QuadTreeNode, IQuadTreeNode };
