import { QuadTreeNode } from "../QuadTree/QuadTreeNode";
import { rgbToHex } from "../RGBToHex";

export type FillShape = "square" | "circle" | "triangle";

class DrawHelper {
  context: CanvasRenderingContext2D;
  canvasWidth: number;
  canvasHeight: number;
  imageData: ImageData;
  imageDataCopy: ImageData;
  #hexFillColor: string;
  #fillShape: FillShape;

  constructor(context: CanvasRenderingContext2D, imageData: ImageData, canvasWidth: number, canvasHeight: number) {
    this.context = context;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.imageData = imageData;
    this.imageDataCopy = structuredClone(imageData);
    this.#hexFillColor = "#ffffff"; // default white
    this.#fillShape = "square";
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
    // fill background
    this.context.fillStyle = this.#hexFillColor;
    this.context.fillRect(node.startx, node.starty, node.getWidth(), node.getHeight());

    this.context.fillStyle = rgbToHex(Math.round(node.red), Math.round(node.green), Math.round(node.blue));
    // fill shape
    switch (fillShape) {
      case "square": {
        this.context.fillRect(node.startx + 1, node.starty + 1, node.getWidth() - 2, node.getHeight() - 2);
        break;
      }
      case "circle": {
        this.context.beginPath();
        this.context.arc(
          node.startx + node.getWidth() / 2,
          node.starty + node.getHeight() / 2,
          node.getWidth() / 2,
          0,
          2 * Math.PI,
        );
        this.context.fill();
        break;
      }
      case "triangle": {
        this.context.beginPath();
        this.context.moveTo(node.startx, node.endy);
        this.context.lineTo(node.startx + node.getWidth() / 2, node.starty);
        this.context.lineTo(node.endx, node.endy);
        this.context.fill();
        break;
      }
      default: {
        console.error(`shape ${fillShape} not supported`);
      }
    }

    // save image data
    this.imageData = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
  }

  setHexFillColor(hexFillColor: string) {
    this.#hexFillColor = hexFillColor;
  }

  setFillShape(fillShape: FillShape) {
    this.#fillShape = fillShape;
  }
}

export { DrawHelper };
