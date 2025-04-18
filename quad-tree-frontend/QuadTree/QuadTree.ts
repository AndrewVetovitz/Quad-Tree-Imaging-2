import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";

import { QuadTreeNode, IQuadTreeNode } from "./QuadTreeNode";

const compareQuadTreeNodes: ICompare<IQuadTreeNode> = (
	a: IQuadTreeNode,
	b: IQuadTreeNode
) => {
	return a.data[3] - b.data[3] < 0.0001 ? 1 : -1;
};

const FPS: number = 30;

class QuadTree {
	started: boolean;
	origionalImageData: ImageData;
	copiedImageData: ImageData;
	pq!: PriorityQueue<QuadTreeNode>;
	iterations: number;
	heightOffset: number;
	widthOffset: number;
	canvasHeight: number;
	canvasWidth: number;

	constructor(
		imageData: ImageData,
		heightOffset: number,
		widthOffset: number,
		canvasHeight: number,
		canvasWidth: number
	) {
		this.started = true;
		this.iterations = 0;
		this.widthOffset = widthOffset;
		this.heightOffset = heightOffset;
		this.origionalImageData = imageData;
		this.copiedImageData = structuredClone(imageData);
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;

		this.#initPriorityQueue();
	}

	getStarted() {
		return this.started;
	}

	start(context: CanvasRenderingContext2D) {
		this.started = true;
		this.run(context);
	}

	stop() {
		this.started = false;
	}

	reset(context: CanvasRenderingContext2D) {
		this.started = false;
		this.iterations = 0;
		this.copiedImageData = structuredClone(this.origionalImageData);

		this.#initPriorityQueue();
		this.#draw(context);
	}

	run(context: CanvasRenderingContext2D) {
		setTimeout(() => {
			if (this.started) {
				this.step(context);
				this.run(context);
			}
		}, 1000 / FPS);
	}

	step(context: CanvasRenderingContext2D) {
		if (this.pq.size() > 0) {
			const node: QuadTreeNode = this.pq.pop()!;
			const nodes: QuadTreeNode[] = this.#divide(node);

			for (let i = 0; i < nodes.length; i++) {
				this.#updateImage(nodes[i]);
				this.pq.push(nodes[i]);
			}
		}

		this.iterations++;
		this.#draw(context);
	}

	getData(): ImageData {
		return this.copiedImageData;
	}

	getIterations(): number {
		return this.iterations;
	}

	#divide(node: QuadTreeNode): Array<QuadTreeNode> {
		const startx = node.startx;
		const midx = node.startx + Math.floor((node.endx - node.startx) / 2);
		const endx = node.endx;

		const starty = node.starty;
		const midy = node.starty + Math.floor((node.endy - node.starty) / 2);
		const endy = node.endy;

		return [
			new QuadTreeNode(
				startx,
				starty,
				midx,
				midy,
				this.origionalImageData,
				this.canvasWidth
			), // top left
			new QuadTreeNode(
				startx,
				midy,
				midx,
				endy,
				this.origionalImageData,
				this.canvasWidth
			), // top right
			new QuadTreeNode(
				midx,
				starty,
				endx,
				midy,
				this.origionalImageData,
				this.canvasWidth
			), // bottom left
			new QuadTreeNode(
				midx,
				midy,
				endx,
				endy,
				this.origionalImageData,
				this.canvasWidth
			), // bottom right
		];
	}

	#updateImage(node: QuadTreeNode) {
		const startx = node.startx;
		const starty = node.starty;
		const endx = node.endx;
		const endy = node.endy;

		const red = node.data[0];
		const green = node.data[1];
		const blue = node.data[2];

		for (let x = startx; x < endx; x++) {
			for (let y = starty; y < endy; y++) {
				const index = (x * this.canvasWidth + y) * 4;

				this.copiedImageData.data[index] = red;
				this.copiedImageData.data[index + 1] = green;
				this.copiedImageData.data[index + 2] = blue;
			}
		}
	}

	#draw(context: CanvasRenderingContext2D) {
		context.putImageData(
			this.getData(),
			this.widthOffset,
			this.heightOffset
		);
	}

	#initPriorityQueue() {
		this.pq = new PriorityQueue<QuadTreeNode>(compareQuadTreeNodes);
		this.pq.push(
			new QuadTreeNode(
				0,
				0,
				this.canvasHeight,
				this.canvasWidth,
				this.copiedImageData,
				this.canvasWidth
			)
		);
	}
}

export { QuadTree };
