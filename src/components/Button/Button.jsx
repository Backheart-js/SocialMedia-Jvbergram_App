import React from "react";
import "./Button.scss";

function Button({
  className,
  btnPrimary = false,
  btnWhite = false,
  children,
  handleClick,
  ...props
}) {
  const classes = `${className} ${
    btnPrimary && "bg-blue-primary hover:bg-blue-bold text-white"
  } ${
    btnWhite && "bg-white text-blue-primary hover:text-blue-bold"
  } flex items-center justify-center rounded-lg`;

  return (
    <button className={classes} onClick={handleClick} {...props}>
      <span className="font-semibold">
        {children}
      </span>
    </button>
  );
}

export default Button;
