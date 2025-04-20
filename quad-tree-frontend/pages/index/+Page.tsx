import "../../css/buttons.css";
import "../../css/image.css";
import "../../css/title.css";

import { useEffect, useRef, useState } from "react";
import { QuadTree } from "../../QuadTree/QuadTree";
import { DrawHelper } from "../../canvas/DrawHelper";

const FPS: number = 60;

enum CanvasState {
	START,
	STOP,
	RESET,
	STEP,
}

function Page() {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [canvasHelper, setCanvasHelper] = useState<{
		drawHelper: DrawHelper;
		quadTree: QuadTree;
	} | null>(null);
	const canvasWidth = 800;
	const canvasHeight = 750;
	const [iterations, setIterations] = useState<number>(0);
	const [canvasState, setCanvasState] = useState<CanvasState>(
		CanvasState.STOP
	);

	const shapes = 3 * iterations + 1;

	useEffect(() => {
		const canvas = canvasRef.current;

		if (canvas) {
			["dragenter", "dragover", "dragleave", "drop"].forEach(
				(eventName) => {
					canvas.addEventListener(
						eventName,
						(event) => {
							event.preventDefault();
							event.stopPropagation();
						},
						false
					);
				}
			);

			canvas.addEventListener(
				"drop",
				(event: DragEvent) => {
					upload(event?.dataTransfer?.files ?? null);
				},
				false
			);
		}
	}, []);

	function uploadButton(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;

		upload(files);
	}

	function upload(files: FileList | null) {
		if (files && files[0]) {
			const reader = new FileReader();
			const image = new Image();

			reader.onload = (event: ProgressEvent<FileReader>) => {
				if (
					event.target?.result !== null &&
					event.target?.result !== undefined &&
					typeof event.target.result === "string"
				) {
					image.src = event.target.result;

					const canvas = canvasRef.current;

					if (!canvas) {
						return;
					}

					const context = canvas.getContext("2d")!;

					image.onload = () => {
						context.clearRect(0, 0, canvas.width, canvas.height);
						context.drawImage(
							image,
							0,
							0,
							canvas.width,
							canvas.height
						);

						const imageData = context.getImageData(
							0,
							0,
							canvas.width,
							canvas.height
						);

						setCanvasHelper({
							drawHelper: new DrawHelper(
								context,
								imageData,
								canvas.width
							),
							quadTree: new QuadTree(
								imageData,
								canvas.height,
								canvas.width
							),
						});
					};
				}
			};

			reader.readAsDataURL(files[0]);
		}
	}

	function onInputClick() {
		inputRef.current?.click();
	}

	useEffect(() => {
		const quadTree = canvasHelper?.quadTree;
		const drawHelper = canvasHelper?.drawHelper;

		if (!quadTree || !drawHelper) {
			return;
		}

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
				if (timerRef.current) {
					clearTimeout(timerRef.current);
				}

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
			default: {
				break;
			}
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
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
		<div className="lg:flex lg:items-center lg:justify-between">
			<div className="min-w-0 flex-1">
				<h1 className="flex items-center justify-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
					Quad Tree Image
				</h1>
				<canvas
					className="image mb-4 border-4 border-black"
					width={canvasWidth}
					height={canvasHeight}
					ref={canvasRef}
				/>
				<ul className="buttons">
					<li>
						<button
							onClick={onInputClick}
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							upload
						</button>
						<input
							ref={inputRef}
							type="file"
							onChange={uploadButton}
							className="hidden"
						/>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setCanvasState(CanvasState.START)}
						>
							start
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setCanvasState(CanvasState.STOP)}
						>
							stop
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setCanvasState(CanvasState.STEP)}
						>
							step
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setCanvasState(CanvasState.RESET)}
						>
							reset
						</button>
					</li>
					<li>
						<div className="text-sm">iterations: {iterations}</div>
						<div className="width:auto margin-left: 20px"></div>
					</li>
					<li>
						<div className="text-sm">shapes: {shapes}</div>
						<div className="width:auto margin-left: 20px"></div>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Page;
