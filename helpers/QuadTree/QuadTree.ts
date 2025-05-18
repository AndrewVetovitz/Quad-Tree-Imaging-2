import { PriorityQueue, ICompare } from "@datastructures-js/priority-queue";

import { QuadTreeNode, IQuadTreeNode } from "./QuadTreeNode";

const compareQuadTreeNodes: ICompare<IQuadTreeNode> = (a: IQuadTreeNode, b: IQuadTreeNode) => {
  return a.error - b.error < 0.0001 ? 1 : -1;
};

class QuadTree {
  imageData: ImageData;
  pq!: PriorityQueue<QuadTreeNode>;
  iterations!: number;
  height: number;
  width: number;

  constructor(imageData: ImageData, width: number, height: number) {
    this.imageData = structuredClone(imageData);
    this.height = height;
    this.width = width;
    this.reset();
  }

  reset() {
    this.iterations = 0;
    this.pq = PriorityQueue.fromArray(
      [new QuadTreeNode(0, 0, this.height, this.width, this.imageData, this.width)],
      compareQuadTreeNodes,
    );
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
      (this.pq.front()!.getWidth() < 2 || this.pq.front()!.getHeight() < 2 || this.pq.front()!.error <= 0.5)
    ) {
      this.pq.pop();
    }

    this.iterations++;

    return nodes;
  }

  stepCordinate(x: number, y: number): Array<QuadTreeNode> {
    if (this.pq.isEmpty()) {
      return [];
    }

    const clickedNodes = this.pq.remove((node: QuadTreeNode) => {
      return node.startx <= x && node.endx >= x && node.starty <= y && node.endy >= y;
    });

    if (clickedNodes.length == 0) {
      return [];
    }

    const nodes: QuadTreeNode[] = [];

    for (let i = 0; i < clickedNodes.length; i++) {
      const node = clickedNodes[i];
      nodes.push(...this.#divide(node));
    }

    for (let i = 0; i < nodes.length; i++) {
      this.pq.push(nodes[i]);
    }

    //making sure the divisions amount does not become too small, dividing a uniform image
    while (
      !this.pq.isEmpty() &&
      (this.pq.front()!.getWidth() < 2 || this.pq.front()!.getHeight() < 2 || this.pq.front()!.error <= 0.5)
    ) {
      this.pq.pop();
    }

    this.iterations += nodes.length / 4;

    return nodes;
  }

  #divide(node: QuadTreeNode): Array<QuadTreeNode> {
    const startx = node.startx;
    const midx = node.startx + Math.floor((node.endx - node.startx) / 2);
    const endx = node.endx;

    const starty = node.starty;
    const midy = node.starty + Math.floor((node.endy - node.starty) / 2);
    const endy = node.endy;

    return [
      new QuadTreeNode(startx, starty, midx, midy, this.imageData, this.width), // top left
      new QuadTreeNode(midx, starty, endx, midy, this.imageData, this.width), // top right
      new QuadTreeNode(startx, midy, midx, endy, this.imageData, this.width), // bottom left
      new QuadTreeNode(midx, midy, endx, endy, this.imageData, this.width), // bottom right
    ];
  }
}

export { QuadTree };
