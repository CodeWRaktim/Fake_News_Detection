import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, label, error, type = 'text', id, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={cn(
          'flex w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm',
          'placeholder:text-gray-400',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white',
          'dark:border-gray-700 dark:bg-gray-800 dark:focus:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-400 focus:ring-red-500 focus:border-red-500',
          className
        )}
        ref={ref}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
