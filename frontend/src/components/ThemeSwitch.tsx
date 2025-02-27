import React from 'react';
import { BsSun, BsMoon } from 'react-icons/bs';

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className={`theme-switch-button ${isDarkMode ? 'dark' : 'light'}`}
      onClick={onToggle}
      title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}
      aria-label="切换主题"
    >
      {isDarkMode ? <BsSun className="theme-icon" /> : <BsMoon className="theme-icon" />}
    </button>
  );
};

export default ThemeSwitch;