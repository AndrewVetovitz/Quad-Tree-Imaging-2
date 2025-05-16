import { hexToRgb } from "../hexToRBG";
import { QuadTreeNode } from "../QuadTree/QuadTreeNode";

export type FillShape = "square" | "circle" | "triangle";

class DrawHelper {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  imageData: ImageData;
  imageDataCopy: ImageData;
  #hexFillColor: string;
  #fillShape: FillShape;

  constructor(context: CanvasRenderingContext2D, imageData: ImageData, canvasWidth: number, hexFillColor: string) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.imageData = imageData;
    this.imageDataCopy = structuredClone(imageData);
    this.#hexFillColor = hexFillColor;
    this.#fillShape = "square";
  }

  drawBorder(startx: number, starty: number, endx: number, endy: number, hexColor: string) {
    const { red, green, blue } = hexToRgb(hexColor);

    this.drawRect(startx, starty, startx + 1, endy, red, green, blue); // top
    this.drawRect(endx - 1, starty, endx, endy, red, green, blue); // bottom
    this.drawRect(startx, starty, endx, starty + 1, red, green, blue); // left
    this.drawRect(startx, endy - 1, endx, endy, red, green, blue); // right
  }

  drawRect(startx: number, starty: number, endx: number, endy: number, red: number, green: number, blue: number) {
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
      this.#drawShape(nodes[i], this.#fillShape);
    }
  }

  #drawShape(node: QuadTreeNode, fillShape: FillShape) {
    switch (fillShape) {
      case "square": {
        // TODO
        // TODO this.context.fillRect(); // todo change to this and other native methods
        // TODO
        this.drawRect(node.startx, node.starty, node.endx, node.endy, node.red, node.green, node.blue);
        this.drawBorder(node.startx, node.starty, node.endx, node.endy, this.#hexFillColor);

        break;
      }
      case "circle": {
        console.log("circle not yet supported");
        break;
      }
      case "triangle": {
        console.log("triangle not yet supported");
        break;
      }
      default: {
        console.log(`shape ${fillShape} not supported`);
      }
    }
  }

  setHexFillColor(hexFillColor: string) {
    this.#hexFillColor = hexFillColor;
  }

  setFillShape(fillShape: FillShape) {
    this.#fillShape = fillShape;
  }
}

export { DrawHelper };
