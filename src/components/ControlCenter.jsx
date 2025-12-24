import { Sun, Moon, Laptop } from "lucide-react";
import useThemeStore from "#store/theme";

const ControlCenter = ({ isOpen, onClose }) => {
  const { themeMode, setThemeMode } = useThemeStore();

  if (!isOpen) return null;

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    onClose();
  };

  return (
    <>
      {/* Backdrop - click to close */}
      <div 
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'transparent' }}
        onClick={onClose}
      />
      
      {/* Control Center Panel */}
      <div className="control-center">
        <button 
          className={`theme-option-item ${themeMode === 'light' ? 'active' : ''}`}
          onClick={() => handleThemeChange('light')}
        >
            <Sun className="icon icon-sun" size={25} />
          <span>Light</span>
        </button>

        <button 
          className={`theme-option-item ${themeMode === 'dark' ? 'active' : ''}`}
          onClick={() => handleThemeChange('dark')}
        >
          <Moon className="icon icon-moon" size={25} />
          <span>Dark</span>
        </button>

        <button 
          className={`theme-option-item ${themeMode === 'system' ? 'active' : ''}`}
          onClick={() => handleThemeChange('system')}
        >
          <Laptop className="icon icon-laptop" size={25} />
          <span>System</span>
        </button>
      </div>
    </>
  );
};

export default ControlCenter;
