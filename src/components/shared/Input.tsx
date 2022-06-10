import React from "react";
import "../../styles/Input.scss";

interface InputProps {
  required?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  name: string;
  value?: string;
  onChange: (e: any) => void;
  onKeyDown?: (e: any) => void;
  image?: string;
}

export const Input: React.FC<InputProps> = ({
  required = true,
  className,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  onKeyDown,
  image,
}) => {
  const inputClassName = image ? "input image" : `input ${className}`;
  return (
    <>
      {image ? (
        <label htmlFor={name} className={`label ${className}`}>
          <img src={image} alt="" className={`input ${className}`} />
        </label>
      ) : null}
      <input
        placeholder={placeholder}
        className={inputClassName}
        value={value}
        name={name}
        id={name}
        onChange={onChange}
        type={type}
        required={required}
        onKeyDown={onKeyDown}
      />
    </>
  );
};
