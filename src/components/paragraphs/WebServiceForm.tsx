import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from '../shared/Button';
import { UI_TEXT } from '../../constants';
import { AdditionalAccusedEntry } from '../../types';
import { AdditionalAccusedWebServiceItem, AdditionalAccusedWebServiceItemRef } from './additional-items/AdditionalAccusedWebServiceItem'; 
import { GeneratedParagraphModal } from './GeneratedParagraphModal'; 
import { Globe, AlertTriangle, PlusCircle, ListOrdered, MessageSquarePlus } from 'lucide-react';
import { ToastType } from '../shared/Toast';
import { generateParagraphText } from '../../services/templateService'; 

interface WebServiceFormProps {
  currentTemplate: string; 
  showToast: (message: string, type: ToastType) => void;
}

const initialWebServiceFormData: { additionalAccused: AdditionalAccusedEntry[] } = { 
  additionalAccused: [] 
};

export const WebServiceForm: React.FC<WebServiceFormProps> = ({ currentTemplate, showToast }: WebServiceFormProps) => {
  const [formData, setFormData] = useState<typeof initialWebServiceFormData>(initialWebServiceFormData);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [generatedParagraphForModal, setGeneratedParagraphForModal] = useState<string | null>(null);
  const [isParagraphModalOpen, setIsParagraphModalOpen] = useState(false);
  const [focusLastAccused, setFocusLastAccused] = useState(false);
  
  const additionalAccusedItemRefs = useRef<Array<AdditionalAccusedWebServiceItemRef | null>>([]);

  useEffect(() => {
    setFormData(initialWebServiceFormData);
    setError(null);
    setFieldErrors({});
    setGeneratedParagraphForModal(null);
    setIsParagraphModalOpen(false);
    additionalAccusedItemRefs.current = [];
    setFocusLastAccused(false);
  }, [currentTemplate]);

  const formTitle = UI_TEXT.paragraphGenerator.titleWebService;
  const formIcon = <Globe size={32} className="mr-3 text-indigo-400" />;

  const handleAddAdditionalAccused = useCallback(() => {
    setFormData((prev: typeof initialWebServiceFormData) => ({
      ...prev,
      additionalAccused: [
        ...prev.additionalAccused, 
        { id: crypto.randomUUID(), accusedName: '', identificationNumber: '', queryResult: '' }
      ]
    }));
    setFocusLastAccused(true);
    setError(null); 
  }, []);

  const handleAdditionalAccusedChange = useCallback((id: string, field: 'accusedName' | 'identificationNumber', value: string) => { 
    let itemIndex = -1;
    setFormData((prev: typeof initialWebServiceFormData) => ({
      ...prev,
      additionalAccused: prev.additionalAccused.map((item: AdditionalAccusedEntry, index: number) => { 
        if (item.id === id) {
          itemIndex = index;
          return { ...item, [field]: value };
        }
        return item;
      })
    }));
    if (itemIndex !== -1) {
      setFieldErrors((prevErrors: Record<string, string | null>) => {
        const newErrors = { ...prevErrors };
        delete newErrors[`additionalAccused[${itemIndex}].${String(field)}`];
        return newErrors;
      });
    }
    setError(null);
  }, []);
  
  const handleAccusedQueryResultChange = useCallback((id: string, value: 'Positivo' | 'Negativo' | '') => {
    setFormData((prev: typeof initialWebServiceFormData) => ({
      ...prev,
      additionalAccused: prev.additionalAccused.map((item: AdditionalAccusedEntry) => (item.id === id ? { ...item, queryResult: value } : item))
    }));
    setError(null);
  }, []);

  const handleRemoveAdditionalAccused = useCallback((id: string) => {
    const removedItemIndex = formData.additionalAccused.findIndex((acc: AdditionalAccusedEntry) => acc.id === id);
    setFormData((prev: typeof initialWebServiceFormData) => ({
      ...prev,
      additionalAccused: prev.additionalAccused.filter((acc: AdditionalAccusedEntry) => acc.id !== id)
    }));
    if (removedItemIndex !== -1) {
        setFieldErrors((prevFieldErrors: Record<string, string | null>) => {
            const newErrors = {...prevFieldErrors};
            delete newErrors[`additionalAccused[${removedItemIndex}].accusedName`];
            delete newErrors[`additionalAccused[${removedItemIndex}].identificationNumber`];
            return newErrors;
        });
    }
    setError(null);
  }, [formData.additionalAccused]);

  const validateForm = (): boolean => {
    const newFieldErrors: Record<string, string | null> = {};
    let hasValidationErrors = false;
    let firstErrorAccusedDetails: { index: number; fieldType: 'accusedName' | 'identificationNumber' } | null = null;

    if (formData.additionalAccused.length === 0) {
      setError(UI_TEXT.errorMessages.formCompletionRequiredParagraph); 
      return false;
    }
    
    formData.additionalAccused.forEach((accusedItem: AdditionalAccusedEntry, index: number) => {
      if (!accusedItem.accusedName.trim()) {
        newFieldErrors[`additionalAccused[${index}].accusedName`] = `El Nombre (Indiciado #${index + 1}) es requerido.`;
        hasValidationErrors = true;
        if (!firstErrorAccusedDetails) firstErrorAccusedDetails = { index, fieldType: 'accusedName' };
      }
      if (!accusedItem.identificationNumber.trim()) {
        newFieldErrors[`additionalAccused[${index}].identificationNumber`] = `La Identificación (Indiciado #${index + 1}) es requerida.`;
        hasValidationErrors = true;
        if (!firstErrorAccusedDetails || firstErrorAccusedDetails.index !== index) firstErrorAccusedDetails = { index, fieldType: 'identificationNumber' };
      }
    });

    if (hasValidationErrors) {
      setFieldErrors(newFieldErrors);
      if (firstErrorAccusedDetails !== null) {
        const details = firstErrorAccusedDetails as { index: number; fieldType: 'accusedName' | 'identificationNumber' };
        const errorsToPassToItem: { accusedName?: boolean; identificationNumber?: boolean } = {};
        if (details.fieldType === 'accusedName') errorsToPassToItem.accusedName = true;
        if (details.fieldType === 'identificationNumber') errorsToPassToItem.identificationNumber = true;
        additionalAccusedItemRefs.current[details.index]?.focusFirstInvalidInput(errorsToPassToItem);
      }
      setError(UI_TEXT.errorMessages.formCompletionRequiredParagraph);
      return false;
    }
    
    setFieldErrors({});
    setError(null);
    return true;
  };
  
  const handleGenerateParagraphLocally = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneratedParagraphForModal(null);
    setIsParagraphModalOpen(false);
    setError(null);
    
    if (validateForm()) {
      const dataForTemplate = {
        additionalAccused: formData.additionalAccused,
      };
      const finalParagraph = generateParagraphText('WEB_SERVICE', dataForTemplate, currentTemplate);
      setGeneratedParagraphForModal(finalParagraph);
      setIsParagraphModalOpen(true);
      showToast(UI_TEXT.toastMessages.paragraphGeneratedSuccess, 'success');
      setFormData(initialWebServiceFormData);
    }
  };

  useEffect(() => {
    additionalAccusedItemRefs.current = additionalAccusedItemRefs.current.slice(0, formData.additionalAccused.length);
  }, [formData.additionalAccused.length]);

  useEffect(() => {
    if (focusLastAccused && formData.additionalAccused.length > 0) {
      const lastItemIndex = formData.additionalAccused.length - 1;
      setTimeout(() => {
        additionalAccusedItemRefs.current[lastItemIndex]?.focusAccusedNameInput();
      }, 0);
      setFocusLastAccused(false); 
    }
  }, [formData.additionalAccused, focusLastAccused]);

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-slate-700 mb-6">
        <div className="flex items-center">
          {formIcon}
          <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{formTitle}</h2>
        </div>
         <p className="hidden sm:block mt-1 text-sm text-slate-400">
          {UI_TEXT.paragraphGenerator.descriptionWebService}
        </p>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-red-900 border border-red-700 text-red-300 rounded-md flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleGenerateParagraphLocally} className="space-y-4">
        <div className="p-4 bg-slate-850 rounded-lg shadow-md border border-slate-700 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
              <ListOrdered size={20} className="mr-2" />
              {UI_TEXT.paragraphGenerator.additionalAccusedTitle}
          </h3>
          {formData.additionalAccused.length > 0 ? (
            formData.additionalAccused.map((accusedItem: AdditionalAccusedEntry, index: number) => (
              <AdditionalAccusedWebServiceItem 
                key={accusedItem.id}
                ref={(el: AdditionalAccusedWebServiceItemRef | null) => { additionalAccusedItemRefs.current[index] = el; }}
                accused={accusedItem}
                index={index}
                onChange={handleAdditionalAccusedChange}
                onQueryResultChange={handleAccusedQueryResultChange} 
                onRemove={handleRemoveAdditionalAccused}
                accusedNameError={fieldErrors[`additionalAccused[${index}].accusedName`] || undefined}
                identificationNumberError={fieldErrors[`additionalAccused[${index}].identificationNumber`] || undefined}
              />
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No hay indiciados añadidos. Por favor, añada al menos uno para generar el párrafo.</p>
          )}
           <Button 
              type="button" 
              onClick={handleAddAdditionalAccused} 
              variant="primary"
              className="w-full sm:w-auto"
              leftIcon={<PlusCircle size={18} />}
          >
              {UI_TEXT.paragraphGenerator.addAdditionalAccusedButton}
          </Button>
        </div>
        
         <div className="flex justify-center mt-4">
           <Button 
            type="submit"
            disabled={formData.additionalAccused.length === 0 && !generatedParagraphForModal} 
            className="w-full md:w-8/12 lg:w-7/12 xl:w-6/12"
            leftIcon={<MessageSquarePlus size={18} />}
          >
            {UI_TEXT.paragraphGenerator.generateButton}
          </Button>
        </div>
      </form>

      {isParagraphModalOpen && generatedParagraphForModal && (
        <GeneratedParagraphModal
          isOpen={isParagraphModalOpen}
          onClose={() => {
            setIsParagraphModalOpen(false);
            setGeneratedParagraphForModal(null); 
          }}
          paragraphText={generatedParagraphForModal}
          showToast={showToast}
          modalTitle={UI_TEXT.paragraphGenerator.viewGeneratedParagraphCardTitle}
        />
      )}
    </div>
  );
};