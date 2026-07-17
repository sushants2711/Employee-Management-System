import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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

  const [dropdownStyle, setDropdownStyle] = useState({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicking inside the portal, ignore it (we'll handle it via onClick)
      // Since the portal is attached to document.body, dropdownRef won't contain it.
      // But we can just rely on the onClick of the items to close it.
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) {
        return;
      }
      
      // If the event target has a specific class or we can just blindly close it 
      // if it's outside the button. To prevent immediate closing when clicking inside 
      // the portal, we can check if it's our portal element.
      if (event.target.closest('.select-field-portal')) {
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

      // Close on scroll to prevent detached floating
      const handleScroll = (e) => {
        if (!e.target.closest('.select-field-portal')) {
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

      {isOpen &&
        createPortal(
          <div
            style={dropdownStyle}
            className="select-field-portal bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            <ul className="py-2">
              {options.length === 0 ? (
                <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                  No options available
                </li>
              ) : (
                options.map((option) => (
                  <li
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
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
          </div>,
          document.body
        )}

      {error && (
        <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default SelectField;
