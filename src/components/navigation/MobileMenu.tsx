
import React, { useState } from 'react';
import { MainMenuItemConfig, SubMenuItemConfig } from './Navbar'; 
import { MainMenuKey, ReportType, ParagraphSubMenuKey, ConfigurationSubMenuKey } from '../../types';
import { ChevronDown, X as CloseIcon } from 'lucide-react';

interface MobileMenuProps {
  items: MainMenuItemConfig[];
  activeMainKey: MainMenuKey;
  activeReportKey?: ReportType;
  activeParagraphKey?: ParagraphSubMenuKey;
  activeConfigurationKey?: ConfigurationSubMenuKey;
  onSelect: (mainKey: MainMenuKey, subItemId?: string, subItemType?: 'report' | 'paragraph' | 'configuration' | 'separator') => void;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  items,
  activeMainKey,
  activeReportKey,
  activeParagraphKey,
  activeConfigurationKey,
  onSelect,
  onClose
}) => {
  const [expandedItem, setExpandedItem] = useState<MainMenuKey | null>(null);

  const handleMainMenuClick = (mainItem: MainMenuItemConfig) => {
    if (mainItem.subItems && mainItem.subItems.length > 0) {
      setExpandedItem(prev => (prev === mainItem.id ? null : mainItem.id));
    } else {
      onSelect(mainItem.id);
    }
  };

  const handleSubMenuClick = (mainKey: MainMenuKey, subItem: SubMenuItemConfig) => {
    if (subItem.type === 'separator') return; 
    onSelect(mainKey, subItem.id, subItem.type);
  };

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-slate-900 z-10 p-4 overflow-y-auto"> 
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white"
          aria-label="Cerrar menú"
        >
          <CloseIcon size={24} />
        </button>
      </div>
      <nav>
        <ul>
          {items.map((mainItem) => (
            <li key={mainItem.id} className="mb-1">
              <button
                onClick={() => handleMainMenuClick(mainItem)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-left text-base font-medium transition-colors
                  ${(activeMainKey === mainItem.id && (!mainItem.subItems || mainItem.subItems.length === 0 || expandedItem === mainItem.id)) 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'}
                `}
                aria-expanded={expandedItem === mainItem.id}
              >
                <span className="flex items-center">
                  {mainItem.icon && <span className="mr-3">{React.cloneElement(mainItem.icon as React.ReactElement<{ size?: number }>, { size: 20 })}</span>}
                  {mainItem.label}
                </span>
                {mainItem.subItems && mainItem.subItems.length > 0 && (
                  <ChevronDown
                    size={20}
                    className={`transform transition-transform ${expandedItem === mainItem.id ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              {mainItem.subItems && mainItem.subItems.length > 0 && expandedItem === mainItem.id && (
                <ul className="pl-4 mt-1 space-y-1">
                  {mainItem.subItems.map((subItem) => {
                    if (subItem.type === 'separator') {
                      return <hr key={subItem.id} className="my-2 border-slate-700/50" />;
                    }
                    return (
                      <li key={subItem.id}>
                        <button
                          onClick={() => handleSubMenuClick(mainItem.id, subItem)}
                          className={`w-full flex items-center px-3 py-2.5 rounded-md text-left text-sm transition-colors
                            ${(subItem.type === 'report' && activeReportKey === subItem.id && activeMainKey === mainItem.id) ||
                             (subItem.type === 'paragraph' && activeParagraphKey === subItem.id && activeMainKey === mainItem.id) ||
                             (subItem.type === 'configuration' && activeConfigurationKey === subItem.id && activeMainKey === mainItem.id)
                              ? 'bg-indigo-500 text-white' 
                              : 'text-slate-300 hover:bg-slate-700 hover:text-white'}
                          `}
                        >
                          {subItem.icon && <span className="mr-2 opacity-80">{React.cloneElement(subItem.icon as React.ReactElement<{ size?: number }>, { size: 18 })}</span>}
                          <div className="flex-grow">
                            <span>{subItem.label}</span>
                             {subItem.description && (
                              <span className="block text-xs text-slate-400 mt-0.5 opacity-90">
                                {subItem.description}
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};