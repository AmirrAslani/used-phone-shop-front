import React from 'react';
import { IButtonProps } from '@/interface/base.interface';

const Button = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {shouldCenterIcon ? (
        <span className="flex items-center justify-center w-full h-full">
          {icon}
        </span>
      ) : (
        <>
          {text}
          {icon && <span>{icon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;