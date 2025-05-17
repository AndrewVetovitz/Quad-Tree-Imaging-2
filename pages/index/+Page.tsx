import { useEffect, useRef, useState } from "react";
import { QuadTree } from "../../helpers/QuadTree/QuadTree";
import { DrawHelper, FillShape } from "../../helpers/canvas/DrawHelper";

import { downloadFileFromUrl } from "../../helpers/downloadFileFromURL";
import { Button } from "../../components/Button";
import { ColorPickButton } from "../../components/ColorPickButton";
import { DropDownMenu } from "../../components/DropDownMenu";
import { Link } from "../../components/Link";

const FPS: number = 60;
const DEFAULT_IMAGE_URL = "https://res.cloudinary.com/dg25vxfyl/image/upload/v1747510425/apple_with_stem.png";
const DEFAULT_IMAGE_FILENAME = "apple.png";

const canvasSize = 600;

enum CanvasState {
  START,
  STOP,
  RESET,
  STEP,
  DOWNLOAD,
  SET_SHAPE,
  SET_FILL,
}

function Page() {
  const uploadRef = useRef<HTMLInputElement | null>(null);
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [hexFillColor, setHexFillColor] = useState<string>("#ffffff");
  const [fillShape, setFillShape] = useState<FillShape>("square");
  const [canvasHelper, setCanvasHelper] = useState<{
    drawHelper: DrawHelper;
    quadTree: QuadTree;
    filename: string;
  } | null>(null);
  const [iterations, setIterations] = useState<number>(0);
  const [canvasState, setCanvasState] = useState<CanvasState>(CanvasState.STOP);

  // set default image
  useEffect(() => {
    downloadFileFromUrl(DEFAULT_IMAGE_URL, DEFAULT_IMAGE_FILENAME).then((file) => upload(file));
  }, []);

  // setup drag and drop functionality
  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const preventDefaultDrag = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
      };

      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        canvas.addEventListener(eventName, preventDefaultDrag, false);
      });

      const dragAndDropUpload = (event: DragEvent) => {
        upload(event?.dataTransfer?.files[0] ?? null);
      };

      canvas.addEventListener("drop", dragAndDropUpload, false);

      return () => {
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
          canvas.removeEventListener(eventName, preventDefaultDrag);
        });
        canvas.removeEventListener("drop", dragAndDropUpload);
      };
    }
  }, []);

  function upload(file: File | null) {
    if (file) {
      const reader = new FileReader();
      const image = new Image();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (
          event.target?.result !== null &&
          event.target?.result !== undefined &&
          typeof event.target.result === "string"
        ) {
          const canvas = canvasRef.current;

          if (!canvas) {
            return;
          }

          const context = canvas.getContext("2d")!;

          image.src = event.target.result;
          image.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            setCanvasHelper({
              drawHelper: new DrawHelper(context, imageData, canvas.width, canvas.height),
              quadTree: new QuadTree(imageData, canvas.width, canvas.height),
              filename: file.name,
            });
          };
        }
      };

      reader.readAsDataURL(file);
    }
  }

  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }

  useEffect(() => {
    if (!canvasHelper) {
      return;
    }

    const { quadTree, drawHelper } = canvasHelper;

    switch (canvasState) {
      case CanvasState.START: {
        const run = () => {
          if (canvasState == CanvasState.START) {
            drawHelper.updateNodes(quadTree.step());
            drawHelper.drawToCanvas();

            timerRef.current = setTimeout(run, 1000 / FPS);
          }
        };

        run();
        break;
      }
      case CanvasState.STOP: {
        stopTimer();
        break;
      }
      case CanvasState.STEP: {
        drawHelper.updateNodes(quadTree.step());
        drawHelper.drawToCanvas();
        setCanvasState(CanvasState.STOP);
        break;
      }
      case CanvasState.RESET: {
        quadTree.reset();
        drawHelper.resetImageData();
        drawHelper.drawToCanvas();
        break;
      }
      case CanvasState.DOWNLOAD: {
        stopTimer();

        if (downloadRef.current && canvasRef.current) {
          const download = downloadRef.current;
          const fileInfo = canvasHelper.filename.split(".");

          download.href = canvasRef.current.toDataURL(fileInfo[1]); // fileInfo[1] extension
          download.download = fileInfo[0] + "_quad_tree"; // fileInfo[0] origonal filename without extension

          download.click();
        }

        setCanvasState(CanvasState.STOP);
        break;
      }
      case CanvasState.SET_FILL: {
        stopTimer();
        drawHelper.setHexFillColor(hexFillColor);
        setCanvasState(CanvasState.STOP);
        break;
      }
      case CanvasState.SET_SHAPE: {
        stopTimer();
        drawHelper.setFillShape(fillShape);
        setCanvasState(CanvasState.STOP);
        break;
      }
      default: {
        break;
      }
    }

    return () => stopTimer();
  }, [canvasState, canvasHelper?.quadTree, canvasHelper?.drawHelper]);

  useEffect(() => {
    const quadTree = canvasHelper?.quadTree;

    if (quadTree) {
      const intervalID = setInterval(() => {
        setIterations(quadTree.iterations);
      }, 50);

      return () => {
        clearInterval(intervalID);
      };
    }
  }, [canvasHelper?.quadTree]);

  return (
    <div className="mx-5">
      <h1 className="flex items-center justify-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
        Quad Tree Image
      </h1>

      <div className="flex items-center justify-center mb-4 text-base leading-none tracking-tight text-gray-900 dark:text-white">
        Drag and drop image or click &quot;upload&quot; below to begin
      </div>

      <div className="flex flex-col justify-center mb-4 xl:mx-[35%] lg:mx-[25%] md:mx-[22.5%] sm:mx-[20%]">
        <canvas className="border-4 border-black" width={canvasSize} height={canvasSize} ref={canvasRef} />
        <div className="flex flex-row justify-end">
          <div className="content-center text-sm mr-2">iterations: {iterations}</div>
          <div className="content-center text-sm">shapes: {3 * iterations + 1}</div>
        </div>
      </div>

      <div className="flex flex-wrap space-x-2 space-y-2 md:justify-center max-md:justify-between my-2 max-md:after:flex-auto">
        <>
          <Button
            onClick={() => {
              uploadRef.current?.click();
            }}
          >
            upload
          </Button>
          <input
            ref={uploadRef}
            type="file"
            onChange={(event) => {
              const files = event.target.files;

              if (files && files[0]) {
                upload(files[0]);
              }
            }}
            className="hidden"
          />
        </>
        <Button onClick={() => setCanvasState(CanvasState.START)}>start</Button>
        <Button onClick={() => setCanvasState(CanvasState.STOP)}>stop</Button>
        <Button onClick={() => setCanvasState(CanvasState.STEP)}>step</Button>
        <Button onClick={() => setCanvasState(CanvasState.RESET)}>reset</Button>
        <>
          <Button onClick={() => setCanvasState(CanvasState.DOWNLOAD)}>Download</Button>
          <a ref={downloadRef} className="hidden" download />
        </>
        <ColorPickButton
          onChangeColor={(event) => {
            setHexFillColor(event.target.value);
          }}
          onCloseColorPicker={() => {
            setCanvasState(CanvasState.SET_FILL);
          }}
          color={hexFillColor}
        >
          Background Fill Color
        </ColorPickButton>
        <DropDownMenu
          onChangeOption={(event) => {
            const shape: FillShape = event.target.value as FillShape;

            setFillShape(shape);
            setCanvasState(CanvasState.SET_SHAPE);
          }}
        >
          <option className="bg-white text-gray-900" selected={true} value="square">
            Square
          </option>
          <option className="bg-white text-gray-900" value="circle">
            Circle
          </option>
          <option className="bg-white text-gray-900" value="triangle">
            Triangle
          </option>
        </DropDownMenu>
      </div>

      <div className="flex items-center justify-center mb-4 text-base leading-none tracking-tight text-gray-900 dark:text-white">
        <div>
          Link to code on Github:{" "}
          <Link href="https://github.com/AndrewVetovitz/Quad-Tree-Imaging-2">
            https://github.com/AndrewVetovitz/Quad-Tree-Imaging-2
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
