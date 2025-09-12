import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import themeService from '../../services/themeService';
import { toast } from 'sonner';

interface ThemeSelectorProps {
  compact?: boolean; 
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ compact = false }) => {
  const [selectedTheme, setSelectedTheme] = useState(themeService.getCurrentTheme());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      setSelectedTheme(event.detail.theme);
    };

    window.addEventListener('theme-changed', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange as EventListener);
    };
  }, []);

  const handleThemeChange = (themeName: string) => {
    themeService.setTheme(themeName);
    setSelectedTheme(themeName);
    setIsOpen(false);
    
    const themeInfo = themeService.getAvailableThemes().find(t => t.name === themeName);
    toast.success(`Thème "${themeInfo?.label}" appliqué`);
  };

  const currentThemeInfo = themeService.getCurrentThemeInfo();
  const availableThemes = themeService.getAvailableThemes();

  if (compact) {
    return (
      <div className="dropdown dropdown-end">
        <div 
          tabIndex={0} 
          role="button" 
          className="btn btn-ghost btn-circle"
          title="Changer le thème"
        >
          <Palette className="w-5 h-5" />
        </div>
        <ul 
          tabIndex={0} 
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto"
        >
          {availableThemes.slice(0, 15).map((theme) => (
            <li key={theme.name}>
              <a 
                onClick={() => handleThemeChange(theme.name)}
                className={selectedTheme === theme.name ? 'active' : ''}
              >
                <div 
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: theme.primary }}
                ></div>
                {theme.label}
                {selectedTheme === theme.name && <Check className="w-4 h-4 ml-auto" />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="form-control w-full flex justify-between gap-2"> 
       <label className="label">
        <span className="label-text-alt">Choisissez le thème de l'interface</span>
      </label>
      <div className="dropdown">
        <label tabIndex={0} className="btn m-1 w-38 flex items-center justify-center">
        <div className="flex items-center justify-center gap-3">
          <div 
            className="w-6 h-6 rounded-full border-2 border-base-content/20"
            style={{ backgroundColor: currentThemeInfo?.primary }}
          ></div>
          <span className="text-sm">{selectedTheme || "Choisir un thème"}</span>
        </div>
          
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {availableThemes.map((theme) => (
            <li key={theme.name}>
              <button onClick={() => handleThemeChange(theme.name)}>
                {theme.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      
      {/* Aperçu des couleurs */}
      <div className="mt-4 p-4 bg-base-200 rounded-lg hidden ">
        
        <div className="flex gap-2">
          <button className="btn btn-primary btn-sm">Bouton principal</button>
          <button className="btn btn-secondary btn-sm">Bouton secondaire</button>
        </div>
      </div>
      
     
    </div>
  );
};

export default ThemeSelector;
