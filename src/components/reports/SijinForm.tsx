
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { AdditionalOpjItem, AdditionalOpjItemRef } from './additional-items/AdditionalOpjItem';
import { GeneratedReportModal } from './GeneratedReportModal'; 
import { generateReportText } from '../../services/templateService'; 
import { OpjSijinReportData, OtherOpjEntry, ReportType } from '../../types'; 
import { UI_TEXT } from '../../constants';
import { PlusCircle, FileText, AlertTriangle, Loader2, Info, ListOrdered, Award } from 'lucide-react'; 
import { ToastType } from '../shared/Toast';

interface SijinFormProps {
  onReportGenerated: (reportType: ReportType) => void;
  currentTemplate: string; 
  showToast: (message: string, type: ToastType) => void;
}

const initialFormData: OpjSijinReportData = { 
  eventDate: '',
  eventMunicipality: '',
  eventAddress: '',
  eventModality: '',
  officialRank: '',
  officialReport: '',
  otherOpjs: [],
};

const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const SijinForm: React.FC<SijinFormProps> = ({ 
  onReportGenerated, 
  currentTemplate, 
  showToast 
}) => {
  const [formData, setFormData] = useState<OpjSijinReportData>(initialFormData);
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false); 

  const today = new Date().toISOString().split('T')[0];

  const eventDateRef = useRef<HTMLInputElement>(null);
  const eventMunicipalityRef = useRef<HTMLInputElement>(null);
  const eventAddressRef = useRef<HTMLInputElement>(null);
  const eventModalityRef = useRef<HTMLInputElement>(null);
  const officialRankRef = useRef<HTMLInputElement>(null);
  const officialReportRef = useRef<HTMLInputElement>(null);
  const otherOpjItemRefs = useRef<Array<AdditionalOpjItemRef | null>>([]);

  useEffect(() => {
     otherOpjItemRefs.current = otherOpjItemRefs.current.slice(0, formData.otherOpjs.length);
  }, [formData.otherOpjs.length]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === 'officialReport' || name === 'officerName') {
      processedValue = toTitleCase(value);
    }
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    setFieldErrors(prev => ({ ...prev, [name]: null })); 
    setError(null); 
  }, []);

  const handleAddOtherOpj = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      otherOpjs: [...prev.otherOpjs, { id: crypto.randomUUID(), opjDate: '', opjNumber: '', officerName: '' }]
    }));
    setError(null); 
  }, []);

  const handleOtherOpjChange = useCallback((id: string, field: keyof Omit<OtherOpjEntry, 'id'>, value: string) => {
    let itemIndex = -1;
    let processedValue = value;
    if (field === 'officerName') {
      processedValue = toTitleCase(value);
    }

    setFormData(prev => ({
      ...prev,
      otherOpjs: prev.otherOpjs.map((opj, index) => {
        if (opj.id === id) {
          itemIndex = index;
          return { ...opj, [field]: processedValue };
        }
        return opj;
      })
    }));
    if (itemIndex !== -1) {
      setFieldErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[`otherOpjs[${itemIndex}].${String(field)}`];
        return newErrors;
      });
    }
    setError(null);
  }, []);

  const handleRemoveOtherOpj = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      otherOpjs: prev.otherOpjs.filter(opj => opj.id !== id)
    }));
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
    let firstErrorFieldRef: React.RefObject<HTMLInputElement> | null = null;
    let firstErrorOpjDetails: { index: number; fieldType: 'opjDate' | 'opjNumber' | 'officerName' } | null = null;

    const requiredMainFields: Array<{ key: keyof OpjSijinReportData, ref: React.RefObject<HTMLInputElement>, label: string }> = [
        { key: 'eventDate', ref: eventDateRef, label: UI_TEXT.formFields.eventDate },
        { key: 'eventMunicipality', ref: eventMunicipalityRef, label: UI_TEXT.formFields.eventMunicipality },
        { key: 'eventAddress', ref: eventAddressRef, label: UI_TEXT.formFields.eventAddress },
        { key: 'eventModality', ref: eventModalityRef, label: UI_TEXT.formFields.eventModality },
        { key: 'officialRank', ref: officialRankRef, label: UI_TEXT.formFields.officialRank },
        { key: 'officialReport', ref: officialReportRef, label: UI_TEXT.formFields.officialReport },
    ];

    for (const field of requiredMainFields) {
        const value = formData[field.key];
        if (!value || String(value).trim() === '') {
            newFieldErrors[field.key as string] = `El campo '${field.label}' es requerido.`;
            hasValidationErrors = true;
            if (!firstErrorFieldRef && !firstErrorOpjDetails) {
                firstErrorFieldRef = field.ref;
            }
        }
    }

    formData.otherOpjs.forEach((opj, index) => {
      if (!opj.opjDate) {
        newFieldErrors[`otherOpjs[${index}].opjDate`] = `La Fecha OPJ (Adicional #${index + 1}) es requerida.`;
        hasValidationErrors = true;
        if (!firstErrorFieldRef && !firstErrorOpjDetails) firstErrorOpjDetails = { index, fieldType: 'opjDate' };
      }
      if (!opj.opjNumber.trim()) {
        newFieldErrors[`otherOpjs[${index}].opjNumber`] = `El Número OPJ (Adicional #${index + 1}) es requerido.`;
        hasValidationErrors = true;
        if (!firstErrorFieldRef && !firstErrorOpjDetails) firstErrorOpjDetails = { index, fieldType: 'opjNumber' };
      }
      if (!opj.officerName.trim()) {
        newFieldErrors[`otherOpjs[${index}].officerName`] = `El Nombre Funcionario (Adicional #${index + 1}) es requerido.`;
        hasValidationErrors = true;
        if (!firstErrorFieldRef && !firstErrorOpjDetails) firstErrorOpjDetails = { index, fieldType: 'officerName' };
      }
    });

    if (hasValidationErrors) {
        setFieldErrors(newFieldErrors);
        if (firstErrorFieldRef) {
            firstErrorFieldRef.current?.focus();
        } else if (firstErrorOpjDetails) {
            const errorsToPassToItem: any = {};
            if (firstErrorOpjDetails.fieldType === 'opjDate') errorsToPassToItem.opjDate = true;
            if (firstErrorOpjDetails.fieldType === 'opjNumber') errorsToPassToItem.opjNumber = true;
            if (firstErrorOpjDetails.fieldType === 'officerName') errorsToPassToItem.officerName = true;
            otherOpjItemRefs.current[firstErrorOpjDetails.index]?.focusFirstInvalidInput(errorsToPassToItem);
        }
        setError(UI_TEXT.errorMessages.formCompletionRequiredReport); 
        setIsLoading(false);
        return;
    }

    try {
      const reportText = generateReportText(ReportType.OPJ_SIJIN, formData, currentTemplate);
      
      setGeneratedReport(reportText);
      setIsReportModalOpen(true); 
      onReportGenerated(ReportType.OPJ_SIJIN);
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
          <Award size={32} className="mr-3 text-indigo-400" />
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{UI_TEXT.reportForms.sijinTitle}</h2>
        </div>
        <p className="hidden sm:block mt-2 text-sm leading-6 text-slate-400">
          {UI_TEXT.reportForms.sijinDescription}
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
          <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center">
            <Info size={20} className="mr-2" />
            {UI_TEXT.sijinForm.generalCaseInfoTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input ref={eventDateRef} id="eventDate" name="eventDate" label={UI_TEXT.formFields.eventDate} type="date" value={formData.eventDate} onChange={handleInputChange} max={today} error={fieldErrors.eventDate || undefined} />
            <Input ref={eventMunicipalityRef} id="eventMunicipality" name="eventMunicipality" label={UI_TEXT.formFields.eventMunicipality} type="text" value={formData.eventMunicipality} onChange={handleInputChange} placeholder="Ej: Cartagena, Santa Catalina" error={fieldErrors.eventMunicipality || undefined} />
            <Input ref={eventAddressRef} id="eventAddress" name="eventAddress" label={UI_TEXT.formFields.eventAddress} type="text" value={formData.eventAddress} onChange={handleInputChange} placeholder="Ej: San Francisco, San Fernando" error={fieldErrors.eventAddress || undefined} />
            <Input ref={eventModalityRef} id="eventModality" name="eventModality" label={UI_TEXT.formFields.eventModality} type="text" value={formData.eventModality} onChange={handleInputChange} placeholder="Ej: Sicariato, Riña" error={fieldErrors.eventModality || undefined} />
            <Input ref={officialRankRef} id="officialRank" name="officialRank" label={UI_TEXT.formFields.officialRank} type="text" value={formData.officialRank} onChange={handleInputChange} placeholder="Ej: Patrullero, Intendente" error={fieldErrors.officialRank || undefined} />
            <Input ref={officialReportRef} id="officialReport" name="officialReport" label={UI_TEXT.formFields.officialReport} type="text" value={formData.officialReport} onChange={handleInputChange} placeholder="Ej: Juan Carlos Pérez Álvarez" error={fieldErrors.officialReport || undefined} />
          </div>
        </div>
        
        <div className="p-4 border border-slate-700 rounded-lg bg-slate-850 shadow-md space-y-4">
          <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center">
              <ListOrdered size={20} className="mr-2" />
              {UI_TEXT.otherOrdersTitle}
          </h3>

          {formData.otherOpjs.length > 0 ? (
              formData.otherOpjs.map((opj, index) => (
                  <AdditionalOpjItem 
                    key={opj.id} 
                    ref={el => { otherOpjItemRefs.current[index] = el; }}
                    opj={opj} 
                    index={index} 
                    onChange={handleOtherOpjChange} 
                    onRemove={handleRemoveOtherOpj} 
                    maxDate={today} 
                    opjDateError={fieldErrors[`otherOpjs[${index}].opjDate`] || undefined}
                    opjNumberError={fieldErrors[`otherOpjs[${index}].opjNumber`] || undefined}
                    officerNameError={fieldErrors[`otherOpjs[${index}].officerName`] || undefined}
                  />
              ))
          ) : (
              <p className="text-sm text-slate-400 italic">No hay órdenes adicionales cargadas.</p>
          )}

          <Button type="button" onClick={handleAddOtherOpj} variant="primary" className="w-full sm:w-auto" leftIcon={<PlusCircle size={18}/>}>
              {UI_TEXT.addOtherOpjButton}
          </Button>
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
          modalTitle={UI_TEXT.generatedReportModal.sijinTitle} 
        />
      )}
    </>
  );
};