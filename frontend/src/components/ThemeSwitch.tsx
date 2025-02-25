import React from 'react';

interface ThemeSwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ isDarkMode, onToggle }) => {
  return (
    <label className="theme-switch" title={isDarkMode ? '切换到浅色模式' : '切换到深色模式'}>
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={onToggle}
      />
      <span className="theme-switch-slider"></span>
    </label>
  );
};

export default ThemeSwitch;