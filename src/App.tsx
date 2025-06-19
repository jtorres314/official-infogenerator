
import React, { useState, useCallback, useEffect } from 'react';
import { SijinForm } from './components/reports/SijinForm';
import { DattForm } from './components/reports/DattForm';
import { InpecForm } from './components/reports/InpecForm';
import { WebServiceForm } from './components/paragraphs/WebServiceForm'; 
import { AniForm } from './components/paragraphs/AniForm'; 
import { DashboardView } from './components/dashboard/DashboardView';
import { Navbar, MainMenuItemConfig } from './components/navigation/Navbar';
import { MobileMenu } from './components/navigation/MobileMenu'; 
import { SijinTemplateSettingsForm } from './components/settings/SijinTemplateSettingsForm';
import { DattTemplateSettingsForm } from './components/settings/DattTemplateSettingsForm';
import { InpecTemplateSettingsForm } from './components/settings/InpecTemplateSettingsForm';
import { WebServiceTemplateSettingsForm } from './components/settings/WebServiceTemplateSettingsForm'; 
import { AniTemplateSettingsForm } from './components/settings/AniTemplateSettingsForm'; 
import { ReportType, MainMenuKey, ParagraphSubMenuKey, ReportStatistics, ConfigurationSubMenuKey } from './types';
import { UI_TEXT, REPORT_TEMPLATES } from './constants';
import { FileText, Bot, ClipboardList, Pilcrow, ScanSearch, LayoutDashboard, SlidersHorizontal, Menu as MenuIcon, Award, FileSliders, MapPin, Webcam, Code2 } from 'lucide-react';
import { Toast, ToastType } from './components/shared/Toast';

interface ToastConfig {
  id: string;
  message: string;
  type: ToastType;
}

const App: React.FC = () => {
  const [activeMainCategory, setActiveMainCategory] = useState<MainMenuKey>(MainMenuKey.DASHBOARD);
  const [activeReportType, setActiveReportType] = useState<ReportType | null>(null);
  const [activeParagraphType, setActiveParagraphType] = useState<ParagraphSubMenuKey | null>(null);
  const [activeConfigurationType, setActiveConfigurationType] = useState<ConfigurationSubMenuKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);

  const [reportStats, setReportStats] = useState<ReportStatistics>(() => {
    const savedStats = localStorage.getItem('reportGeneratorStats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats) as ReportStatistics;
        if (typeof parsed.sijin === 'number' &&
            typeof parsed.datt === 'number' &&
            typeof parsed.inpec === 'number') {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing stats from localStorage", e);
      }
    }
    return { sijin: 0, datt: 0, inpec: 0 };
  });

  const [sijinTemplate, setSijinTemplate] = useState<string>(() => {
    const savedTemplate = localStorage.getItem('sijinReportTemplate');
    return savedTemplate || REPORT_TEMPLATES.OPJ_SIJIN;
  });

  const [dattTemplate, setDattTemplate] = useState<string>(() => {
    const savedTemplate = localStorage.getItem('dattReportTemplate');
    return savedTemplate || REPORT_TEMPLATES.DATT;
  });

  const [inpecTemplate, setInpecTemplate] = useState<string>(() => {
    const savedTemplate = localStorage.getItem('inpecReportTemplate');
    return savedTemplate || REPORT_TEMPLATES.INPEC;
  });

  const [webServiceParagraphTemplate, setWebServiceParagraphTemplate] = useState<string>(() => {
    const savedTemplate = localStorage.getItem('webServiceParagraphTemplate');
    return savedTemplate || REPORT_TEMPLATES.DEFAULT_WEB_SERVICE_PARAGRAPH_TEMPLATE;
  });

  const [aniParagraphTemplate, setAniParagraphTemplate] = useState<string>(() => { 
    const savedTemplate = localStorage.getItem('aniParagraphTemplate');
    return savedTemplate || REPORT_TEMPLATES.DEFAULT_ANI_PARAGRAPH_TEMPLATE;
  });

  const showToast = useCallback((message: string, type: ToastType) => {
    setToastConfig({ id: crypto.randomUUID(), message, type });
  }, []);


  const menuItems: MainMenuItemConfig[] = [
     {
      id: MainMenuKey.DASHBOARD,
      label: UI_TEXT.navigation.dashboard,
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: MainMenuKey.REPORTS,
      label: UI_TEXT.navigation.reports,
      icon: <ClipboardList size={18} />,
      subItems: [
        { id: ReportType.OPJ_SIJIN, label: UI_TEXT.navigation.sijin, icon: <Award size={16} />, type: 'report', description: UI_TEXT.navigation.sijinDescription },
        { id: ReportType.DATT, label: UI_TEXT.navigation.datt, icon: <MapPin size={16} />, type: 'report', description: UI_TEXT.navigation.dattDescription },
        { id: ReportType.INPEC, label: UI_TEXT.navigation.inpec, icon: <Webcam size={16} />, type: 'report', description: UI_TEXT.navigation.inpecDescription },
      ],
    },
    {
      id: MainMenuKey.PARAGRAPHS,
      label: UI_TEXT.navigation.paragraphs,
      icon: <Pilcrow size={18} />,
      subItems: [
        { id: ParagraphSubMenuKey.WEB_SERVICE, label: UI_TEXT.navigation.webService, icon: <Code2 size={16} />, type: 'paragraph', description: UI_TEXT.navigation.webServiceParagraphGenerationDescription },
        { id: ParagraphSubMenuKey.ANI, label: UI_TEXT.navigation.ani, icon: <ScanSearch size={16} />, type: 'paragraph', description: UI_TEXT.navigation.aniParagraphGenerationDescription },
      ],
    },
    {
      id: MainMenuKey.CONFIGURATIONS,
      label: UI_TEXT.navigation.configurations,
      icon: <SlidersHorizontal size={18} />, 
      subItems: [
        { 
          id: ConfigurationSubMenuKey.SIJIN_TEMPLATE, 
          label: UI_TEXT.navigation.sijinTemplate, 
          icon: <FileSliders size={16} />,
          type: 'configuration', 
          description: UI_TEXT.navigation.sijinTemplateDescription 
        },
        { 
          id: ConfigurationSubMenuKey.DATT_TEMPLATE,
          label: UI_TEXT.navigation.dattTemplate, 
          icon: <FileSliders size={16} />, 
          type: 'configuration',
          description: UI_TEXT.navigation.dattTemplateDescription 
        },
        { 
          id: ConfigurationSubMenuKey.INPEC_TEMPLATE, 
          label: UI_TEXT.navigation.inpecTemplate, 
          icon: <FileSliders size={16} />, 
          type: 'configuration',
          description: UI_TEXT.navigation.inpecTemplateDescription 
        },
        {
          id: 'separator-report-paragraph-templates', 
          type: 'separator', 
        },
        { 
          id: ConfigurationSubMenuKey.WEB_SERVICE_PARAGRAPH_TEMPLATE, 
          label: UI_TEXT.navigation.webServiceParagraphTemplate, 
          icon: <FileSliders size={16} />, 
          type: 'configuration',
          description: UI_TEXT.navigation.webServiceParagraphTemplateDescription 
        },
        { 
          id: ConfigurationSubMenuKey.ANI_PARAGRAPH_TEMPLATE, 
          label: UI_TEXT.navigation.aniParagraphTemplate, 
          icon: <FileSliders size={16} />, 
          type: 'configuration',
          description: UI_TEXT.navigation.aniParagraphTemplateDescription 
        },
      ],
    },
  ];
  
  useEffect(() => {
    if (activeMainCategory === MainMenuKey.REPORTS && !activeReportType) {
      setActiveReportType(menuItems.find(item => item.id === MainMenuKey.REPORTS)?.subItems?.[0]?.id as ReportType || ReportType.OPJ_SIJIN);
    } else if (activeMainCategory === MainMenuKey.PARAGRAPHS && !activeParagraphType) {
      setActiveParagraphType(menuItems.find(item => item.id === MainMenuKey.PARAGRAPHS)?.subItems?.[0]?.id as ParagraphSubMenuKey || ParagraphSubMenuKey.WEB_SERVICE);
    } else if (activeMainCategory === MainMenuKey.CONFIGURATIONS && !activeConfigurationType) {
      const firstConfigItem = menuItems.find(item => item.id === MainMenuKey.CONFIGURATIONS)?.subItems?.find(sub => sub.type !== 'separator');
      setActiveConfigurationType(firstConfigItem?.id as ConfigurationSubMenuKey || ConfigurationSubMenuKey.SIJIN_TEMPLATE);
    }
  }, [activeMainCategory, activeReportType, activeParagraphType, activeConfigurationType, menuItems]);


  const incrementReportCount = useCallback((reportType: ReportType) => {
    setReportStats(prevStats => {
      const newStats = { ...prevStats };
      if (reportType === ReportType.OPJ_SIJIN) newStats.sijin += 1;
      else if (reportType === ReportType.DATT) newStats.datt += 1;
      else if (reportType === ReportType.INPEC) newStats.inpec += 1;
      
      localStorage.setItem('reportGeneratorStats', JSON.stringify(newStats));
      return newStats;
    });
  }, []);

  const handleSaveSijinTemplate = useCallback((newTemplate: string) => {
    setSijinTemplate(newTemplate);
    localStorage.setItem('sijinReportTemplate', newTemplate);
    showToast(UI_TEXT.settings.templateSavedSuccess, 'success');
  }, [showToast]);

  const handleSaveDattTemplate = useCallback((newTemplate: string) => { 
    setDattTemplate(newTemplate);
    localStorage.setItem('dattReportTemplate', newTemplate);
    showToast(UI_TEXT.settings.templateSavedSuccess, 'success');
  }, [showToast]);

  const handleSaveInpecTemplate = useCallback((newTemplate: string) => { 
    setInpecTemplate(newTemplate);
    localStorage.setItem('inpecReportTemplate', newTemplate);
    showToast(UI_TEXT.settings.templateSavedSuccess, 'success');
  }, [showToast]);

  const handleSaveWebServiceParagraphTemplate = useCallback((newTemplate: string) => { 
    setWebServiceParagraphTemplate(newTemplate);
    localStorage.setItem('webServiceParagraphTemplate', newTemplate);
    showToast(UI_TEXT.settings.templateSavedSuccess, 'success');
  }, [showToast]);

  const handleSaveAniParagraphTemplate = useCallback((newTemplate: string) => { 
    setAniParagraphTemplate(newTemplate);
    localStorage.setItem('aniParagraphTemplate', newTemplate);
    showToast(UI_TEXT.settings.templateSavedSuccess, 'success');
  }, [showToast]);

  const handleMenuItemSelect = useCallback((mainKey: MainMenuKey, subItemId?: string, subItemType?: 'report' | 'paragraph' | 'configuration' | 'separator') => {
    if (subItemType === 'separator') return; 

    setActiveMainCategory(mainKey);
    setActiveReportType(null);
    setActiveParagraphType(null);
    setActiveConfigurationType(null);

    if (mainKey === MainMenuKey.REPORTS) {
      const firstReportSubItem = menuItems.find(item => item.id === MainMenuKey.REPORTS)?.subItems?.find(sub => sub.type === 'report');
      const newReportType = (subItemId as ReportType) || (firstReportSubItem?.id as ReportType) || ReportType.OPJ_SIJIN;
      setActiveReportType(newReportType);
    } else if (mainKey === MainMenuKey.PARAGRAPHS) {
      const firstParagraphSubItem = menuItems.find(item => item.id === MainMenuKey.PARAGRAPHS)?.subItems?.find(sub => sub.type === 'paragraph');
      const newParagraphType = (subItemId as ParagraphSubMenuKey) || (firstParagraphSubItem?.id as ParagraphSubMenuKey) || ParagraphSubMenuKey.WEB_SERVICE;
      setActiveParagraphType(newParagraphType);
    } else if (mainKey === MainMenuKey.CONFIGURATIONS) {
      const firstConfigSubItem = menuItems.find(item => item.id === MainMenuKey.CONFIGURATIONS)?.subItems?.find(sub => sub.type === 'configuration');
      const newConfigType = (subItemId as ConfigurationSubMenuKey) || (firstConfigSubItem?.id as ConfigurationSubMenuKey) || ConfigurationSubMenuKey.SIJIN_TEMPLATE;
      setActiveConfigurationType(newConfigType);
    }
    setIsMobileMenuOpen(false); 
  }, [menuItems]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {toastConfig && (
        <Toast
          key={toastConfig.id}
          message={toastConfig.message}
          type={toastConfig.type}
          onClose={() => setToastConfig(null)}
        />
      )}
      <header className="py-4 px-4 sm:px-8 sticky top-0 z-20 bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot size={32} className="text-indigo-400" />
            <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Official InfoGenerator
            </h1>
            <h1 className="block sm:hidden text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              InfoGenerator
            </h1>
          </div>
          
          <div className="hidden md:flex">
            <Navbar
              items={menuItems}
              activeMainKey={activeMainCategory}
              activeReportKey={activeReportType || undefined}
              activeParagraphKey={activeParagraphType || undefined}
              activeConfigurationKey={activeConfigurationType || undefined}
              onSelect={handleMenuItemSelect}
            />
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-label="Abrir menú principal"
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {isMobileMenuOpen && (
        <MobileMenu
          items={menuItems}
          activeMainKey={activeMainCategory}
          activeReportKey={activeReportType || undefined}
          activeParagraphKey={activeParagraphType || undefined}
          activeConfigurationKey={activeConfigurationType || undefined}
          onSelect={handleMenuItemSelect}
          onClose={toggleMobileMenu}
        />
      )}
      
      <main className={`flex-grow p-4 sm:p-8 w-full max-w-5xl mx-auto ${isMobileMenuOpen ? 'hidden' : 'block'}`}>
        <div className="bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
          {activeMainCategory === MainMenuKey.DASHBOARD && (
            <DashboardView stats={reportStats} />
          )}

          {activeMainCategory === MainMenuKey.REPORTS && (
            <>
              {activeReportType === ReportType.OPJ_SIJIN && 
                <SijinForm 
                  onReportGenerated={incrementReportCount} 
                  currentTemplate={sijinTemplate} 
                  showToast={showToast} 
                />
              }
              {activeReportType === ReportType.DATT && <DattForm onReportGenerated={incrementReportCount} currentTemplate={dattTemplate} showToast={showToast} />}
              {activeReportType === ReportType.INPEC && <InpecForm onReportGenerated={incrementReportCount} currentTemplate={inpecTemplate} showToast={showToast} />}
            </>
          )}

          {activeMainCategory === MainMenuKey.PARAGRAPHS && (
            <>
              {(activeParagraphType === ParagraphSubMenuKey.WEB_SERVICE) &&
                <WebServiceForm 
                  currentTemplate={webServiceParagraphTemplate} 
                  showToast={showToast}
                />
              }
              {(activeParagraphType === ParagraphSubMenuKey.ANI) &&
                <AniForm 
                  currentTemplate={aniParagraphTemplate}
                  showToast={showToast} 
                />
              }
            </>
          )}

          {activeMainCategory === MainMenuKey.CONFIGURATIONS && (
            <>
              {activeConfigurationType === ConfigurationSubMenuKey.SIJIN_TEMPLATE && 
                <SijinTemplateSettingsForm 
                  currentTemplate={sijinTemplate}
                  onSaveTemplate={handleSaveSijinTemplate}
                />
              }
              {activeConfigurationType === ConfigurationSubMenuKey.DATT_TEMPLATE && 
                <DattTemplateSettingsForm 
                  currentTemplate={dattTemplate}
                  onSaveTemplate={handleSaveDattTemplate}
                />
              }
              {activeConfigurationType === ConfigurationSubMenuKey.INPEC_TEMPLATE &&  
                <InpecTemplateSettingsForm 
                  currentTemplate={inpecTemplate}
                  onSaveTemplate={handleSaveInpecTemplate}
                />
              }
              {activeConfigurationType === ConfigurationSubMenuKey.WEB_SERVICE_PARAGRAPH_TEMPLATE &&  
                <WebServiceTemplateSettingsForm
                  currentTemplate={webServiceParagraphTemplate}
                  onSaveTemplate={handleSaveWebServiceParagraphTemplate}
                />
              }
              {activeConfigurationType === ConfigurationSubMenuKey.ANI_PARAGRAPH_TEMPLATE &&  
                <AniTemplateSettingsForm
                  currentTemplate={aniParagraphTemplate}
                  onSaveTemplate={handleSaveAniParagraphTemplate}
                />
              }
              
            </>
          )}
        </div>
      </main>
      
      <footer className={`py-6 text-center text-slate-500 text-sm ${isMobileMenuOpen ? 'hidden' : 'block'}`}>
        <p>© 2025 Official InfoGenerator by <strong className="font-semibold">Ing. Jeyson Torres Torres</strong>. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;