import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '../shared/Input'; 
import { Button } from '../shared/Button';
import { UI_TEXT } from '../../constants';
import { ScanSearch, AlertTriangle, PlusCircle, ListOrdered, MessageSquarePlus, Contact2 } from 'lucide-react'; 
import { AdditionalAccusedEntry } from '../../types';
import { AdditionalAccusedAniItem, AdditionalAccusedAniItemRef } from './additional-items/AdditionalAccusedAniItem'; 
import { GeneratedParagraphModal } from './GeneratedParagraphModal';
import { ToastType } from '../shared/Toast';
import { generateParagraphText } from '../../services/templateService'; 

interface AniFormProps {
  currentTemplate: string; 
  showToast: (message: string, type: ToastType) => void;
}

interface AniFormState {
  officialAnswerQuery: string;
  additionalAccused: AdditionalAccusedEntry[];
}

const initialAniFormData: AniFormState = {
  officialAnswerQuery: '',
  additionalAccused: [],
};

const toTitleCase = (str: string): string => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const AniForm: React.FC<AniFormProps> = ({ currentTemplate, showToast }) => {
  const [formData, setFormData] = useState<AniFormState>(initialAniFormData);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string | null>>({});
  const [generatedParagraphForModal, setGeneratedParagraphForModal] = useState<string | null>(null);
  const [isParagraphModalOpen, setIsParagraphModalOpen] = useState(false);
  const [focusLastAccused, setFocusLastAccused] = useState(false);
  
  const officialAnswerQueryRef = useRef<HTMLInputElement>(null) as React.RefObject<HTMLInputElement>;
  const additionalAccusedItemRefs = useRef<Array<AdditionalAccusedAniItemRef | null>>([]);

  useEffect(() => {
    setFormData(initialAniFormData);
    setError(null);
    setFieldErrors({});
    setGeneratedParagraphForModal(null);
    setIsParagraphModalOpen(false);
    additionalAccusedItemRefs.current = [];
    setFocusLastAccused(false);
  }, [currentTemplate]);

  const formTitle = UI_TEXT.paragraphGenerator.titleAni;
  const formIcon = <ScanSearch size={32} className="mr-3 text-indigo-400" />;
  
  const handleOfficialAnswerQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const titleCasedValue = toTitleCase(e.target.value);
    setFormData(prev => ({ ...prev, officialAnswerQuery: titleCasedValue }));
    setFieldErrors(prev => ({ ...prev, officialAnswerQuery: null })); 
    setError(null); 
  }, []);

  const handleAddAdditionalAccused = useCallback(() => {
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      additionalAccused: prev.additionalAccused.map((acc, index) => {
        if (acc.id === id) {
          itemIndex = index;
          return { ...acc, [field]: value };
        }
        return acc;
      })
    }));
    
    if (itemIndex !== -1) {
        const currentItem = formData.additionalAccused.find(a => a.id === id);
        setFieldErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[`additionalAccused[${itemIndex}].${String(field)}`];
            if (field === 'identificationNumber' && value.trim() !== '' && currentItem?.queryResult === 'Positivo') {
                delete newErrors[`additionalAccused[${itemIndex}].identificationNumber`];
            }
            return newErrors;
        });
    }
    setError(null);
  }, [formData.additionalAccused]); 
  
  const handleAccusedQueryResultChange = useCallback((id: string, value: 'Positivo' | 'Negativo' | '') => {
    setFormData(prev => ({
      ...prev,
      additionalAccused: prev.additionalAccused.map((acc, itemIndex) => {
        if (acc.id === id) {
          if (value !== 'Positivo') { 
            setFieldErrors(prevFieldErrors => {
              const newFieldErrors = {...prevFieldErrors};
              delete newFieldErrors[`additionalAccused[${itemIndex}].identificationNumber`];
              return newFieldErrors;
            });
            return { ...acc, queryResult: value, identificationNumber: '' }; 
          }
          
          if (acc.identificationNumber.trim() !== '') {
             setFieldErrors(prevFieldErrors => { 
              const newFieldErrors = {...prevFieldErrors};
              delete newFieldErrors[`additionalAccused[${itemIndex}].identificationNumber`];
              return newFieldErrors;
            });
          }
          return { ...acc, queryResult: value };
        }
        return acc;
      })
    }));
    setError(null);
  }, []);

  const handleRemoveAdditionalAccused = useCallback((id: string) => {
    const removedItemIndex = formData.additionalAccused.findIndex(acc => acc.id === id);
    setFormData(prev => ({
      ...prev,
      additionalAccused: prev.additionalAccused.filter(acc => acc.id !== id)
    }));
    
    if (removedItemIndex !== -1) {
        setFieldErrors(prevFieldErrors => {
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
    let firstErrorFieldToFocus: React.RefObject<HTMLInputElement> | null = null;

    if (!formData.officialAnswerQuery.trim()) {
      newFieldErrors.officialAnswerQuery = UI_TEXT.errorMessages.funcionarioRespondeConsultaRequired;
      hasValidationErrors = true;
      if (!firstErrorFieldToFocus) {
        firstErrorFieldToFocus = officialAnswerQueryRef;
      }
    }

    if (formData.additionalAccused.length === 0) {
      setError(UI_TEXT.errorMessages.formCompletionRequiredParagraph + " Debe añadir al menos un indiciado.");
      hasValidationErrors = true; 
    } else {
        let firstErrorAccusedDetails: { index: number; fieldType: 'accusedName' | 'identificationNumber' } | null = null;
        formData.additionalAccused.forEach((accusedItem, index) => {
          if (!accusedItem.accusedName.trim()) {
            newFieldErrors[`additionalAccused[${index}].accusedName`] = `El Nombre (Indiciado #${index + 1}) es requerido.`;
            hasValidationErrors = true;
            if (!firstErrorFieldToFocus && !firstErrorAccusedDetails) firstErrorAccusedDetails = { index, fieldType: 'accusedName' };
          }
          if (accusedItem.queryResult === 'Positivo' && !accusedItem.identificationNumber.trim()) {
            newFieldErrors[`additionalAccused[${index}].identificationNumber`] = `La Identificación (Indiciado #${index + 1}) es requerida si el resultado es Positivo.`;
            hasValidationErrors = true;
            if (!firstErrorFieldToFocus && !firstErrorAccusedDetails) firstErrorAccusedDetails = { index, fieldType: 'identificationNumber' };
          }
        });
         if (firstErrorAccusedDetails && !firstErrorFieldToFocus) {
            const details = firstErrorAccusedDetails as { index: number; fieldType: 'accusedName' | 'identificationNumber' };
            const fieldTypeToFocus = newFieldErrors[`additionalAccused[${details.index}].accusedName`] ? 'accusedName' : 'identificationNumber';
            additionalAccusedItemRefs.current[details.index]?.focusFirstInvalidInput(
                fieldTypeToFocus === 'accusedName' ? { accusedName: true } : { identificationNumber: true }
            );
         }
    }

    if (hasValidationErrors) {
      setFieldErrors(newFieldErrors);
      if(!error && formData.additionalAccused.length > 0) setError(UI_TEXT.errorMessages.formCompletionRequiredParagraph); 
      
      if (firstErrorFieldToFocus) {
        firstErrorFieldToFocus.current?.focus();
      }
      return false;
    }
    
    setFieldErrors({});
    setError(null);
    return true;
  };

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedParagraphForModal(null);
    setIsParagraphModalOpen(false);
    setError(null);
    
    if (validateForm()) {
      const dataForTemplate = {
        officialAnswerQuery: formData.officialAnswerQuery,
        additionalAccused: formData.additionalAccused,
      };
      const finalParagraph = generateParagraphText('ANI', dataForTemplate, currentTemplate);
      setGeneratedParagraphForModal(finalParagraph);
      setIsParagraphModalOpen(true);
      showToast(UI_TEXT.toastMessages.paragraphGeneratedSuccess, 'success');
      setFormData(initialAniFormData);
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
          {UI_TEXT.paragraphGenerator.descriptionAni}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-900 border border-red-700 text-red-300 rounded-md flex items-center space-x-2">
          <AlertTriangle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLocalSubmit} className="space-y-4">
        <div className="p-4 bg-slate-850 rounded-lg shadow-md border border-slate-700 space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
            <Contact2 size={20} className="mr-2" />
            {UI_TEXT.paragraphGenerator.consultingOfficerCardTitle}
          </h3>
          <Input
            ref={officialAnswerQueryRef}
            id="officialAnswerQueryAni"
            name="officialAnswerQuery" 
            label={UI_TEXT.formFields.officialAnswerQuery}
            type="text"
            value={formData.officialAnswerQuery}
            onChange={handleOfficialAnswerQueryChange}
            placeholder="Ej: Sandra Milena Arias Salazar, Investigador SAC Nivel Central"
            error={fieldErrors.officialAnswerQuery || undefined}
          />
        </div>

        <div className="p-4 bg-slate-850 rounded-lg shadow-md border border-slate-700 space-y-4">
          <h3 className="text-lg font-semibold text-indigo-400 flex items-center">
            <ListOrdered size={20} className="mr-2" />
            {UI_TEXT.paragraphGenerator.additionalAccusedTitle}
          </h3>
          {formData.additionalAccused.length > 0 ? (
            formData.additionalAccused.map((accusedItem, index) => (
              <AdditionalAccusedAniItem
                key={accusedItem.id}
                ref={el => { additionalAccusedItemRefs.current[index] = el; }}
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
            disabled={formData.additionalAccused.length === 0} 
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
          modalTitle="Párrafo ANI Generado" 
        />
      )}
    </div>
  );
};