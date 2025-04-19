import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";

import { QuadTreeNode, IQuadTreeNode } from "./QuadTreeNode";

const compareQuadTreeNodes: ICompare<IQuadTreeNode> = (
	a: IQuadTreeNode,
	b: IQuadTreeNode
) => {
	return a.error - b.error < 0.0001 ? 1 : -1;
};

class QuadTree {
	imageData: ImageData;
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
		this.iterations = 0;
		this.widthOffset = widthOffset;
		this.heightOffset = heightOffset;
		this.imageData = structuredClone(imageData);
		this.canvasHeight = canvasHeight;
		this.canvasWidth = canvasWidth;

		this.#initPriorityQueue();
	}

	reset() {
		this.iterations = 0;
		this.#initPriorityQueue();
	}

	step(): Array<QuadTreeNode> {
		if (this.pq.isEmpty()) {
			return [];
		}

		const node: QuadTreeNode = this.pq.pop()!;
		const nodes: QuadTreeNode[] = this.#divide(node);

		for (let i = 0; i < nodes.length; i++) {
			this.pq.push(nodes[i]);
		}

		//making sure the divisions amount does not become too small, dividing a uniform image
		while (
			!this.pq.isEmpty() &&
			(this.pq.front()!.getWidth() < 2 ||
				this.pq.front()!.getHeight() < 2 ||
				this.pq.front()!.error <= 0.5)
		) {
			this.pq.pop();
		}

		this.iterations++;

		return nodes;
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
				this.imageData,
				this.canvasWidth
			), // top left
			new QuadTreeNode(
				startx,
				midy,
				midx,
				endy,
				this.imageData,
				this.canvasWidth
			), // top right
			new QuadTreeNode(
				midx,
				starty,
				endx,
				midy,
				this.imageData,
				this.canvasWidth
			), // bottom left
			new QuadTreeNode(
				midx,
				midy,
				endx,
				endy,
				this.imageData,
				this.canvasWidth
			), // bottom right
		];
	}

	#initPriorityQueue() {
		this.pq = PriorityQueue.fromArray(
			[
				new QuadTreeNode(
					0,
					0,
					this.canvasHeight,
					this.canvasWidth,
					this.imageData,
					this.canvasWidth
				),
			],
			compareQuadTreeNodes
		);
	}
}

export { QuadTree };
