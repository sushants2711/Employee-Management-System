import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-ems-text-light dark:text-ems-text-dark mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-3 border rounded-xl bg-slate-50 dark:bg-slate-900/50 text-left transition-colors disabled:opacity-50 ${
          error
            ? "border-red-500 dark:border-red-500 focus:ring-red-500 dark:focus:ring-red-500 text-red-500"
            : "border-slate-200 dark:border-slate-700 focus:ring-ems-primary dark:focus:ring-ems-primary-dark"
        } focus:outline-none focus:ring-2`}
      >
        <span
          className={`block truncate ${
            !selectedOption
              ? "text-slate-400 dark:text-slate-500"
              : "text-ems-text-light dark:text-ems-text-dark"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-2">
            {options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                No options available
              </li>
            ) : (
              options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    value === option.value
                      ? "bg-ems-primary/10 text-ems-primary dark:bg-ems-primary-dark/20 dark:text-ems-primary-dark font-medium"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  }`}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
