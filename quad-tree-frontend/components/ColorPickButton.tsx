import { useRef } from "react";
import { Button } from "./Button";

export function ColorPickButton({
  children,
  onClick,
  className,
  color,
  onChangeColor,
  onCloseColorPicker,
}: {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  color: string;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCloseColorPicker: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  const buttonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (ref.current) {
      ref.current.click();
      ref.current.focus();
    }

    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Button className={className} onClick={buttonClick}>
      {children}
      <input
        ref={ref}
        type="color"
        onChange={onChangeColor}
        onBlur={(event) => {
          onCloseColorPicker(event);
        }}
        className="opacity-0 cursor-pointer h-0 w-0"
        value={color}
      />
    </Button>
  );
}
