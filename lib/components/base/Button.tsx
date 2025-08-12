import React from 'react';
import { IButtonProps } from '@/interface/component/base.interface';

const Button = ({
  onClick,
  disabled = false,
  icon,
  text,
  className = '',
}: IButtonProps) => {

  const shouldCenterIcon = !text && icon;

  return (
    <button
      className={`${className} cursor-pointer`}
      disabled={disabled}
      onClick={onClick}
    >
      {shouldCenterIcon ? (
        <span className="flex items-center justify-center w-full h-full">
          {icon}
        </span>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
};

export default Button;