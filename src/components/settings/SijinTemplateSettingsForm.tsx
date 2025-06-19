
import React, { useState, useEffect } from 'react';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { FileUpload } from '../shared/FileUpload';
import { UI_TEXT } from '../../constants';
import { Save, ListChecks, AlertTriangle, UploadCloud, FileText as FileTextIcon, Info, FileSliders } from 'lucide-react';

interface SijinTemplateSettingsFormProps {
  currentTemplate: string;
  onSaveTemplate: (newTemplate: string) => void;
}

const sijinPlaceholderOrder: Array<keyof typeof UI_TEXT.settings.placeholders> = [
  'eventDate', 
  'eventMunicipality', 
  'eventAddress', 
  'eventModality', 
  'officialRank', 
  'officialReport', 
  'otherOpjs', 
  'opjNumber', 
  'opjDate', 
  'officerName', 
  'helperIsCartagena', 
  'helperIsCorregimiento'
];

export const SijinTemplateSettingsForm: React.FC<SijinTemplateSettingsFormProps> = ({ currentTemplate, onSaveTemplate }) => {
  const [template, setTemplate] = useState(currentTemplate);
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [fileReadError, setFileReadError] = useState<string | null>(null); 


  useEffect(() => {
    setTemplate(currentTemplate);
    setFileReadError(null); 
  }, [currentTemplate]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value);
    setError(null); 
    setSuccessMessage(null);
  };

  const handleSave = () => {
    setSuccessMessage(null);
    setFileReadError(null); 
    if (!template.trim()) {
      setError("La plantilla no puede estar vacía.");
      return;
    }
    setError(null); 
    try {
      onSaveTemplate(template);
      setSuccessMessage(UI_TEXT.settings.templateSavedSuccess);
    } catch (e) {
      console.error("Error saving template:", e);
      setError(UI_TEXT.errorMessages.templateSaveError);
    }
  };

  const handleTemplateFileSelect = (file: File | null) => {
    setError(null); 
    setSuccessMessage(null);
    setFileReadError(null); 

    if (file) {
      if (file.type !== "text/plain") {
        setFileReadError("Por favor, seleccione un archivo .txt válido.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        if (fileContent) {
          setTemplate(fileContent);
        } else {
          setFileReadError(UI_TEXT.settings.templateReadError);
        }
      };
      reader.onerror = () => {
        setFileReadError(UI_TEXT.settings.templateReadError);
      };
      reader.readAsText(file);
    }
  };
  
  const placeholders = UI_TEXT.settings.placeholders; 

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-700">
        <div className="flex items-center">
          <FileSliders size={32} className="mr-3 text-indigo-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{UI_TEXT.settings.sijinTemplateFormTitle}</h2>
        </div>
        <p className="hidden sm:block mt-2 text-sm leading-6 text-slate-400">
          {UI_TEXT.settings.sijinTemplateFormDescription} 
        </p>
      </div>

      {error && (
        <div className="p-3 my-4 bg-red-900 border border-red-700 text-red-300 rounded-md flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-3 my-4 bg-green-900 border border-green-700 text-green-300 rounded-md flex items-center space-x-2">
          <Save size={20} />
          <span>{successMessage}</span>
        </div>
      )}
       {fileReadError && (
         <div className="p-3 my-4 bg-red-900 border border-red-700 text-red-300 rounded-md flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>{fileReadError}</span>
        </div>
      )}
      
      <div className="p-4 bg-slate-850 rounded-lg shadow-md border border-slate-700 space-y-3">
        <h4 className="text-md font-semibold text-slate-300 flex items-center">
            <FileTextIcon size={18} className="mr-2 text-indigo-400" />
            {UI_TEXT.settings.templateEditorTitle} (Handlebars)
        </h4>
        <TextArea
          id="sijinTemplateEditor"
          label="" 
          value={template}
          onChange={handleTemplateChange}
          rows={20} 
          className="font-mono text-sm bg-slate-700 border-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Escriba aquí su plantilla Handlebars personalizada o cargue un archivo .txt..."
          error={error && template.trim() === "" ? error : undefined}
        />
      </div>

      <div className="p-4 bg-slate-850 rounded-lg shadow-md border border-slate-700 space-y-3">
        <h4 className="text-md font-semibold text-slate-300 flex items-center">
            <UploadCloud size={18} className="mr-2 text-indigo-400" />
            {UI_TEXT.settings.uploadCardTitle} 
        </h4>
        <p className="text-xs text-slate-400">{UI_TEXT.settings.uploadTemplateDescription}</p> 
        <FileUpload
          id="templateFile"
          label="" 
          onFileSelect={handleTemplateFileSelect}
          accept=".txt"
          containerClassName="mt-1"
        />
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button onClick={handleSave} leftIcon={<Save size={18} />} className="w-full md:w-8/12 lg:w-7/12 xl:w-6/12">
          {UI_TEXT.settings.saveTemplateButton}
        </Button>
      </div>

      <div className="mt-8 p-4 bg-slate-850 rounded-md border border-slate-700">
        <h4 className="text-md font-semibold text-slate-300 mb-3 flex items-center">
            <ListChecks size={20} className="mr-2 text-indigo-400" /> 
            {UI_TEXT.settings.availablePlaceholdersTitle}
        </h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-400">
          {sijinPlaceholderOrder.map(key => {
            const desc = placeholders[key];
            if (desc) {
              return <li key={String(key)}>{desc}</li>;
            }
            return null;
          })}
        </ul>
      </div>
    </div>
  );
};