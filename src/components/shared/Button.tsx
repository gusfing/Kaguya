import classNames from "classnames";
import React from "react";
import BaseButton, { BaseButtonProps } from "./BaseButton";

const Button: React.FC<BaseButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <BaseButton
      className={classNames(
        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-opacity-80",
        className
      )}
      {...props}
    >
      {children}
    </BaseButton>
  );
};

export default Button;