import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check, X } from "lucide-react";

const MultiSelectField = ({
  label,
  name,
  value = [],
  onChange,
  options = [],
  placeholder = "Select options",
  disabled = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      if (event.target.closest(".multi-select-field-portal")) {
        return;
      }
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const dropUp = spaceBelow < 240 && rect.top > 240;

      setDropdownStyle({
        position: "fixed",
        top: dropUp ? "auto" : rect.bottom + 8,
        bottom: dropUp ? window.innerHeight - rect.top + 8 : "auto",
        left: rect.left,
        width: rect.width,
        zIndex: 99999,
      });

      const handleScroll = (e) => {
        if (!e.target.closest(".multi-select-field-portal")) {
          setIsOpen(false);
        }
      };
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", () => setIsOpen(false));
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", () => setIsOpen(false));
      };
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    let newValue;
    if (value.includes(optionValue)) {
      newValue = value.filter((v) => v !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }
    onChange({ target: { name, value: newValue } });
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
        <div className="flex-1 flex flex-wrap gap-1.5 items-center overflow-hidden">
          {value.length > 0 ? (
            options
              .filter((opt) => value.includes(opt.value))
              .map((opt) => (
                <span
                  key={opt.value}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-ems-primary/10 text-ems-primary dark:bg-ems-primary-dark/20 dark:text-ems-primary-dark"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                >
                  {opt.chipLabel || opt.label}
                  <X className="h-3 w-3 hover:text-red-500 transition-colors" />
                </span>
              ))
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate block">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            style={dropdownStyle}
            className="multi-select-field-portal bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            <ul className="py-2">
              {options.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  No options available
                </li>
              ) : (
                options.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <li
                      key={option.value}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(option.value);
                      }}
                      className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-ems-primary/10 text-ems-primary dark:bg-ems-primary-dark/20 dark:text-ems-primary-dark font-medium"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-ems-primary dark:text-ems-primary-dark" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </div>,
          document.body
        )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default MultiSelectField;
