import React, { ChangeEvent, useEffect, useState } from "react";

interface TextareaProps {
  name: string;
  placeholder?: string; // Placeholder text
  rows?: number; // Number of rows
  className?: string; // Additional CSS classes
  disabled?: boolean; // Disabled state
  error?: boolean; // Error state
  hint?: string; // Hint text to display
  defaultValue: string
}

const TextArea: React.FC<TextareaProps> = ({
  name,
  placeholder = "Enter your message", // Default placeholder
  rows = 3, // Default number of rows
  className = "", // Additional custom styles
  disabled = false, // Disabled state
  error = false, // Error state
  hint = "", // Default hint text
  defaultValue = ""
}) => {

  let textareaClasses = `w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-hidden ${className} `;

  if (disabled) {
    textareaClasses += ` bg-gray-100 opacity-50 text-gray-500 border-gray-300 cursor-not-allowed opacity40 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700`;
  } else if (error) {
    textareaClasses += ` bg-transparent  border-gray-300 focus:border-error-300 focus:ring-3 focus:ring-error-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-error-800`;
  } else {
    textareaClasses += ` bg-transparent text-gray-900 dark:text-gray-300 text-gray-900 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800`;
  }

  const [inputValue, setInputValue] = useState(defaultValue)

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
  }

  useEffect(() => setInputValue(defaultValue), [defaultValue])

  return (
    <div className="relative">
      <textarea
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        name={name}
        onChange={onChange}
        value={inputValue}
      />
      {hint && (
        <p
          className={`mt-2 text-sm ${
            error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default TextArea;
