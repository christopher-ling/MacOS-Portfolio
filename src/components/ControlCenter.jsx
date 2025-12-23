import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import useThemeStore from "#store/theme";

const ControlCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const dropdownRef = useRef(null);

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="icon"
        aria-label="Control Center"
      >
        <img src="icons/mode.svg" alt="control center" className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          <div className="p-3">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 px-2">
              Appearance
            </p>
            <div className="space-y-1">
              {themes.map(({ value, label, icon: ThemeIcon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setTheme(value);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    theme === value
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ThemeIcon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlCenter;
