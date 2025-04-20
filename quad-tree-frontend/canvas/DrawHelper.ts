import { QuadTreeNode } from "../QuadTree/QuadTreeNode";

enum Color {
	BLACK = 0,
	WHITE = 255,
}

class DrawHelper {
	context: CanvasRenderingContext2D;
	canvasWidth: number;
	imageData: ImageData;
	imageDataCopy: ImageData;

	constructor(
		context: CanvasRenderingContext2D,
		imageData: ImageData,
		canvasWidth: number
	) {
		this.context = context;
		this.canvasWidth = canvasWidth;
		this.imageData = imageData;
		this.imageDataCopy = structuredClone(imageData);
	}

	drawBorder(
		startx: number,
		starty: number,
		endx: number,
		endy: number,
		colorEnum: Color
	) {
		const color = colorEnum.valueOf();

		this.drawRect(startx, starty, startx + 1, endy, color, color, color); // top
		this.drawRect(endx - 1, starty, endx, endy, color, color, color); // bottom
		this.drawRect(startx, starty, endx, starty + 1, color, color, color); // left
		this.drawRect(startx, endy - 1, endx, endy, color, color, color); // right
	}

	drawRect(
		startx: number,
		starty: number,
		endx: number,
		endy: number,
		red: number,
		green: number,
		blue: number
	) {
		for (let x = startx; x < endx; x++) {
			for (let y = starty; y < endy; y++) {
				const index = (x * this.canvasWidth + y) * 4;

				this.imageData.data[index] = red;
				this.imageData.data[index + 1] = green;
				this.imageData.data[index + 2] = blue;
			}
		}
	}

	drawToCanvas() {
		this.context.putImageData(this.imageData, 0, 0);
	}

	resetImageData() {
		this.imageData = structuredClone(this.imageDataCopy);
	}

	updateNodes(nodes: Array<QuadTreeNode>) {
		for (let i = 0; i < nodes.length; i++) {
			this.drawRect(
				nodes[i].startx,
				nodes[i].starty,
				nodes[i].endx,
				nodes[i].endy,
				nodes[i].red,
				nodes[i].green,
				nodes[i].blue
			);

			this.drawBorder(
				nodes[i].startx,
				nodes[i].starty,
				nodes[i].endx,
				nodes[i].endy,
				Color.BLACK
			);
		}
	}
}

export { DrawHelper };
