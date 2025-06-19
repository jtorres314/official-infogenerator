
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { MainMenuKey, ReportType, ParagraphSubMenuKey, ConfigurationSubMenuKey } from '../../types';

export interface SubMenuItemConfig {
  id: string;
  label?: string; 
  icon?: React.ReactNode; 
  type: 'report' | 'paragraph' | 'configuration' | 'separator'; 
  description?: string; 
}

export interface MainMenuItemConfig {
  id: MainMenuKey;
  label: string;
  icon?: React.ReactNode;
  subItems?: SubMenuItemConfig[];
}

interface NavbarProps {
  items: MainMenuItemConfig[];
  activeMainKey: MainMenuKey;
  activeReportKey?: ReportType;
  activeParagraphKey?: ParagraphSubMenuKey;
  activeConfigurationKey?: ConfigurationSubMenuKey;
  onSelect: (mainKey: MainMenuKey, subItemId?: string, subItemType?: 'report' | 'paragraph' | 'configuration' | 'separator') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
    items,
    activeMainKey,
    activeReportKey,
    activeParagraphKey,
    activeConfigurationKey,
    onSelect
}) => {
  const [openDropdown, setOpenDropdown] = useState<MainMenuKey | null>(null);
  const [hoveredDropdown, setHoveredDropdown] = useState<MainMenuKey | null>(null);
  const closeTimerRef = useRef<number | null>(null); 
  const navRef = useRef<HTMLDivElement>(null); 

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const startCloseTimer = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => { 
      setOpenDropdown(null);
      setHoveredDropdown(null);
    }, 1000); 
  }, [clearCloseTimer]);

  const handleMainMenuEnter = useCallback((mainKey: MainMenuKey) => {
    clearCloseTimer();
    if (items.find(item => item.id === mainKey)?.subItems) {
      setOpenDropdown(mainKey);
      setHoveredDropdown(mainKey);
    }
  }, [clearCloseTimer, items]);

  const handleMainMenuLeave = useCallback(() => {
    if (hoveredDropdown) { 
        startCloseTimer();
    }
  }, [startCloseTimer, hoveredDropdown]);

  const handleDropdownEnter = useCallback((mainKey: MainMenuKey) => {
    clearCloseTimer(); 
    setHoveredDropdown(mainKey); 
  }, [clearCloseTimer]);

  const handleDropdownLeave = useCallback(() => {
    startCloseTimer(); 
    setHoveredDropdown(null);
  }, [startCloseTimer]);


  const handleToggleDropdownOnClick = (mainKey: MainMenuKey) => {
    clearCloseTimer();
    setOpenDropdown(prev => (prev === mainKey ? null : mainKey));
    if (openDropdown !== mainKey) {
        setHoveredDropdown(mainKey); 
    } else {
        setHoveredDropdown(null);
    }
  };

  const handleSelectMainItemDirectly = (mainKey: MainMenuKey) => {
    clearCloseTimer();
    onSelect(mainKey);
    setOpenDropdown(null);
    setHoveredDropdown(null);
  };

  const handleSelectSubItem = (mainKey: MainMenuKey, subItem: SubMenuItemConfig) => {
    clearCloseTimer();
    if (subItem.type === 'separator') return; 
    onSelect(mainKey, subItem.id, subItem.type);
    setOpenDropdown(null);
    setHoveredDropdown(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        clearCloseTimer();
        setOpenDropdown(null);
        setHoveredDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearCloseTimer(); 
    };
  }, [clearCloseTimer, navRef]);

  return (
    <nav>
      <div className="flex items-center" ref={navRef}> 
        <div className="flex items-center space-x-2 sm:space-x-4">
          {items.map((mainItem) => (
            <div
              key={mainItem.id}
              className="relative"
              onMouseEnter={() => handleMainMenuEnter(mainItem.id)}
              onMouseLeave={handleMainMenuLeave}
            >
              <button
                onClick={() => {
                  if (mainItem.subItems && mainItem.subItems.length > 0) {
                    handleToggleDropdownOnClick(mainItem.id);
                  } else {
                    handleSelectMainItemDirectly(mainItem.id);
                  }
                }}
                className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors
                  ${activeMainKey === mainItem.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                `}
                aria-haspopup={!!(mainItem.subItems && mainItem.subItems.length > 0)}
                aria-expanded={openDropdown === mainItem.id}
              >
                {mainItem.icon && <span className="mr-1 sm:mr-2">{mainItem.icon}</span>}
                {mainItem.label}
                {mainItem.subItems && mainItem.subItems.length > 0 && (
                  <ChevronDown size={16} className={`ml-1 transform transition-transform ${openDropdown === mainItem.id ? 'rotate-180' : ''}`} />
                )}
              </button>
              {mainItem.subItems && mainItem.subItems.length > 0 && openDropdown === mainItem.id && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none py-1 z-30"
                  onMouseEnter={() => handleDropdownEnter(mainItem.id)}
                  onMouseLeave={handleDropdownLeave}
                >
                  {mainItem.subItems.map((subItem) => {
                    if (subItem.type === 'separator') {
                      return <hr key={subItem.id} className="my-1 border-slate-700" />;
                    }
                    return (
                      <button
                        key={subItem.id}
                        onClick={() => handleSelectSubItem(mainItem.id, subItem)}
                        className={`w-full text-left px-4 py-3 transition-colors
                          ${(subItem.type === 'report' && activeReportKey === subItem.id && activeMainKey === mainItem.id) ||
                           (subItem.type === 'paragraph' && activeParagraphKey === subItem.id && activeMainKey === mainItem.id) ||
                           (subItem.type === 'configuration' && activeConfigurationKey === subItem.id && activeMainKey === mainItem.id)
                            ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                        `}
                        role="menuitem"
                      >
                        <div className="flex items-center">
                          {subItem.icon && <span className="mr-3 text-slate-400">{subItem.icon}</span>}
                          <div className="flex-grow">
                            <span className="block text-sm font-medium">
                              {subItem.label}
                            </span>
                            {subItem.description && (
                              <span className="block text-xs text-slate-400 mt-0.5">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};