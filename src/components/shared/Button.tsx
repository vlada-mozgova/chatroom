import React from "react";
import "../../styles/Button.scss";

interface ButtonProps {
  text?: string;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  onClick?: (e: any) => void;
  disabled?: boolean;
  image?: string;
  classNamePic?: string;
}

export const Button: React.FC<ButtonProps> = ({
  text,
  className,
  type = "button",
  onClick,
  disabled = false,
  image,
  classNamePic,
}) => {
  return (
    <button
      className={`button ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {image ? (
        <img src={image} alt="" className={`image ${classNamePic}`} />
      ) : null}{" "}
      {text}
    </button>
  );
};
