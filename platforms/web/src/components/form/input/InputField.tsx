import { ChangeEvent, useEffect, useState, type FC } from "react";

interface InputProps {
  searchData?: { name: string; value: string }[];
  defaultValue?: string;
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  name,
  placeholder,
  searchData,
  className = "",
  min,
  max,
  step,
  defaultValue = "",
  disabled = false,
  success = false,
  error = false,
}) => {
  let inputClasses = ` h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error) {
    inputClasses += `  border-error-500 focus:border-error-300 focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-error-800`;
  } else if (success) {
    inputClasses += `  border-success-500 focus:border-success-300 focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-success-800`;
  } else {
    inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90  dark:focus:border-brand-800`;
  }

  const [value, setValue] = useState(defaultValue);
  const [searchOpened, setSearchOpened] = useState(false);

  const [selected, setSelected] = useState({ name: "", value: "" });

  const onChange = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);


  const unFocusOnBlur = () => setTimeout(() => setSearchOpened(false), 300)

useEffect(() => {

  if (!searchData && defaultValue) {
    setValue(defaultValue)
    return
  }

  if (!searchData || !defaultValue) return;

  const selected = searchData.filter(data => data.name === defaultValue);

  if (selected.length === 0) return;

  setValue(selected[0].name);
  setSelected(selected[0]);
}, [defaultValue, searchData]);


  useEffect(() => setSearchOpened(value ? true : false), [value]);


  return (
    <div className="relative">
      {searchData && 
      <input type="hidden" value={selected.value} name={name} />}
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        name={searchData ? "" : name}
        onChange={onChange}
        onBlur={unFocusOnBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {searchOpened && searchData && type == "text" ? (
        <div
          className={
            inputClasses +
            " mt-4 absolute overflow-y-scroll min-h-[200px] z-99 space-y-2"
          }
        >
          {searchData
            .filter((data) =>
              data.name.toLowerCase().includes(value.toLowerCase())
            )
            .map((data, index) => (
              <button
              type="button"
                key={index}
                onClick={() => {
                  setSelected(data);
                  setValue(data.name);
                  setTimeout(() => setSearchOpened(false), 100);
                }}
                className="hover:bg-white hover:text-black w-full text-left px-2 py-1 rounded-md"
              >
                <p>{data.name}</p>
              </button>
            ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Input;
