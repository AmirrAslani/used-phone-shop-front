import React from 'react';
import { IInputProps } from "@/interface/components/base.interface";

const Input = ({
  type = 'text',
  name,
  label,
  placeholder = '',
  className = '',
  inputClassName = '',
  value,
  onChange,
  icon,
}: IInputProps) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      {icon && (
        <div className="absolute right-[8px] top-[11px]">
          {icon}
        </div>
      )}
      <div className='w-full'>
        {label &&
          <label className="block font-medium mb-1">{label}</label>
        }
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full py-2 ${icon ? 'px-8' : 'px-2'} bg-[#f0f5f7] font-light text-sm md:text-base placeholder:text-gray-600 placeholder:text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-[#008ECC] focus:border-transparent ${inputClassName}`}
        />
      </div>
    </div>
  );
};

export default Input;