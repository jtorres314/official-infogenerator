
import React, { useState, useCallback, useRef } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { GeneratedReportModal } from './GeneratedReportModal';
import { generateReportText } from '../../services/templateService'; 
import { DattReportData, ReportType } from '../../types';
import { UI_TEXT } from '../../constants';
import { FileText, AlertTriangle, Loader2, MapPin } from 'lucide-react';
import { ToastType } from '../shared/Toast';

interface DattFormProps {
  onReportGenerated: (reportType: ReportType) => void;
  currentTemplate: string; 
  showToast: (message: string, type: ToastType) => void;
}

const initialFormData: DattReportData = {
  eventDate: '',
  eventMunicipality: '',
  eventAddress: '',
  eventModality: '',
  officialRank: '',
  officialReport: '',
};

const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const DattForm: React.FC<DattFormProps> = ({ onReportGenerated, currentTemplate, showToast }) => {
  const [formData, setFormData] = useState<DattReportData>(initialFormData);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const eventDateDattRef = useRef<HTMLInputElement>(null);
  const eventAddressDattRef = useRef<HTMLInputElement>(null);
  const officialRankDattRef = useRef<HTMLInputElement>(null);
  const officialReportDattRef = useRef<HTMLInputElement>(null);
  const eventMunicipalityDattRef = useRef<HTMLInputElement>(null);
  const eventModalityDattRef = useRef<HTMLInputElement>(null);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'officialReport') {
      processedValue = toTitleCase(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setFieldErrors(prev => ({ ...prev, [name]: null }));
    setError(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});
    setGeneratedReport('');
    setIsReportModalOpen(false);

    const newFieldErrors: Record<string, string | null> = {};
    let hasValidationErrors = false;
    let firstErrorFieldToFocus: React.RefObject<HTMLInputElement> | null = null;

    const requiredFields: Array<{ key: keyof DattReportData, ref: React.RefObject<HTMLInputElement>, label: string }> = [
      { key: 'eventDate', ref: eventDateDattRef, label: UI_TEXT.formFields.eventDate },
      { key: 'eventMunicipality', ref: eventMunicipalityDattRef, label: UI_TEXT.formFields.eventMunicipality },
      { key: 'eventAddress', ref: eventAddressDattRef, label: UI_TEXT.formFields.eventAddress },
      { key: 'eventModality', ref: eventModalityDattRef, label: UI_TEXT.formFields.eventModality },
      { key: 'officialRank', ref: officialRankDattRef, label: UI_TEXT.formFields.officialRank },
      { key: 'officialReport', ref: officialReportDattRef, label: UI_TEXT.formFields.officialReport },
    ];

    for (const field of requiredFields) {
      const value = formData[field.key];
      if (!value || String(value).trim() === '') {
        newFieldErrors[field.key as string] = `El campo '${field.label}' es requerido.`;
        hasValidationErrors = true;
        if (!firstErrorFieldToFocus) {
          firstErrorFieldToFocus = field.ref;
        }
      }
    }

    if (hasValidationErrors) {
      setFieldErrors(newFieldErrors);
      firstErrorFieldToFocus?.current?.focus();
      setError(UI_TEXT.errorMessages.formCompletionRequiredReport);
      setIsLoading(false);
      return;
    }

    try {
      const dataForReport: DattReportData = { ...formData };
      const report = generateReportText(ReportType.DATT, dataForReport, currentTemplate); 
      setGeneratedReport(report);
      setIsReportModalOpen(true);
      onReportGenerated(ReportType.DATT);
      showToast(UI_TEXT.toastMessages.reportGeneratedSuccess, 'success');
      setFormData(initialFormData);
      setFieldErrors({});
    } catch (err) {
      setError(err instanceof Error ? err.message : UI_TEXT.errorMessages.reportGenerationFailed);
      setIsReportModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="pb-5 border-b border-slate-700 mb-6">
        <div className="flex items-center">
          <MapPin size={32} className="mr-3 text-indigo-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{UI_TEXT.reportForms.dattTitle}</h2>
        </div>
        <p className="hidden sm:block mt-2 text-sm leading-6 text-slate-400">
          {UI_TEXT.reportForms.dattDescription}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900 border border-red-700 text-red-300 rounded-md flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border border-slate-700 rounded-lg bg-slate-850 shadow-md">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4">Información General del Caso (DATT)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input ref={eventDateDattRef} id="eventDateDatt" name="eventDate" label={UI_TEXT.formFields.eventDate} type="date" value={formData.eventDate} onChange={handleInputChange} max={today} error={fieldErrors.eventDate || undefined} />
            <Input ref={eventMunicipalityDattRef} id="eventMunicipalityDatt" name="eventMunicipality" label={UI_TEXT.formFields.eventMunicipality} type="text" value={formData.eventMunicipality} onChange={handleInputChange} placeholder="Ej: Cartagena" error={fieldErrors.eventMunicipality || undefined} />
            <Input ref={eventAddressDattRef} id="eventAddressDatt" name="eventAddress" label={UI_TEXT.formFields.eventAddress} type="text" value={formData.eventAddress} onChange={handleInputChange} placeholder="EJ: Los Alpes, Ternera" error={fieldErrors.eventAddress || undefined} />
            <Input ref={eventModalityDattRef} id="eventModalityDatt" name="eventModality" label={UI_TEXT.formFields.eventModality} type="text" value={formData.eventModality} onChange={handleInputChange} placeholder="Ej: Accidente de Tránsito" error={fieldErrors.eventModality || undefined} />
            <Input ref={officialRankDattRef} id="officialRankDatt" name="officialRank" label={UI_TEXT.formFields.officialRank} type="text" value={formData.officialRank} onChange={handleInputChange} placeholder="Ej: Agente de Tránsito" error={fieldErrors.officialRank || undefined} />
            <Input ref={officialReportDattRef} id="officialReportDatt" name="officialReport" label={UI_TEXT.formFields.officialReport} type="text" value={formData.officialReport} onChange={handleInputChange} placeholder="Ej: Juan Carlos Pérez Álvarez" error={fieldErrors.officialReport || undefined} />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading}
              className="w-full md:w-8/12 lg:w-7/12 xl:w-6/12"
              leftIcon={isLoading ? <Loader2 className="animate-spin" size={18}/> : <FileText size={18} />}
          >
            {UI_TEXT.generateReportButton}
          </Button>
        </div>

      </form>

      {generatedReport && (
        <GeneratedReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          reportText={generatedReport}
          showToast={showToast}
          modalTitle={UI_TEXT.generatedReportModal.dattTitle}
        />
      )}
    </>
  );
};