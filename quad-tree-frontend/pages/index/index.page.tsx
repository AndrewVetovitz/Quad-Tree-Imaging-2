import "../../css/buttons.css";
import "../../css/image.css";
import "../../css/title.css";

import { useEffect, useRef, useState } from "react";
import { QuadTree } from "../../QuadTree/QuadTree";

enum TreeState {
	RESET,
	START,
	STOP,
	STEP,
	NEUTRAL,
}

function Page() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const canvasWidth = 800;
	const canvasHeight = 750;
	const [quadTree, setQuadTree] = useState<QuadTree | null>(null);
	const [treeState, setTreeState] = useState<TreeState>(TreeState.STOP);
	const [iterations, setIterations] = useState<number>(0);

	const shapes = 3 * iterations + 1;

	const element = (
		<canvas
			className="image mb-4"
			ref={canvasRef}
			width={canvasWidth}
			height={canvasHeight}
		/>
	);

	function upload(input: EventTarget & HTMLInputElement) {
		if (input.files && input.files[0]) {
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

					if (canvas) {
						const ctx = canvas.getContext("2d")!;

						image.onload = () => {
							const ratio = image.width / image.height;

							const height = Math.round(
								Math.min(canvasHeight, image.height)
							);
							const width = Math.round(ratio * height);

							const widthOffset = (canvasWidth - width) / 2;

							ctx.drawImage(image, widthOffset, 0, width, height);
							const imageData = ctx.getImageData(
								widthOffset,
								0,
								width,
								height
							);

							setQuadTree(
								new QuadTree(
									imageData,
									0,
									widthOffset,
									height,
									width
								)
							);

							setTreeState(TreeState.START);
						};
					}
				}
			};

			reader.readAsDataURL(input.files[0]);
		}
	}

	function onChange(event: React.ChangeEvent<HTMLInputElement>) {
		upload(event.target);
	}

	function onInputClick() {
		inputRef.current?.click();
	}

	useEffect(() => {
		if (quadTree) {
			const canvas = canvasRef.current!;
			const ctx = canvas.getContext("2d")!;

			switch (treeState) {
				case TreeState.START: {
					quadTree.start(ctx);
					break;
				}
				case TreeState.STOP: {
					quadTree.stop();
					break;
				}
				case TreeState.RESET: {
					quadTree.reset(ctx);
					break;
				}
				case TreeState.STEP: {
					quadTree.step(ctx);
					setTreeState(TreeState.NEUTRAL);
					break;
				}
				default: {
					break;
				}
			}
		}
	}, [treeState, quadTree]);

	useEffect(() => {
		const intervalID = setInterval(() => {
			if (quadTree) {
				setIterations(quadTree.getIterations());
			}
		}, 50);

		return () => {
			clearInterval(intervalID);
		};
	}, [quadTree]);

	return (
		<div className="lg:flex lg:items-center lg:justify-between">
			<div className="min-w-0 flex-1">
				<h1 className="flex items-center justify-center mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-white">
					Quad Tree Image
				</h1>
				{element}
				<ul className="buttons">
					<li>
						<button
							onClick={onInputClick}
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							upload
						</button>
						<input
							ref={inputRef}
							type="file"
							onChange={onChange}
							className="hidden"
						/>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setTreeState(TreeState.START)}
						>
							start
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setTreeState(TreeState.STOP)}
						>
							stop
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setTreeState(TreeState.STEP)}
						>
							step
						</button>
					</li>
					<li>
						<button
							className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
							onClick={() => setTreeState(TreeState.RESET)}
						>
							reset
						</button>
					</li>
					<li>
						<div>iterations: {iterations}</div>
					</li>
					<li>
						<div>shapes: {shapes}</div>
					</li>
				</ul>
			</div>
		</div>
	);
}

export { Page };
