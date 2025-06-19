
import React, { useRef, useImperativeHandle } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { AdditionalAccusedEntry } from '../../types';
import { UI_TEXT } from '../../constants';
import { Trash2 } from 'lucide-react';

interface AdditionalAccusedWebServiceItemProps {
  accused: AdditionalAccusedEntry;
  onChange: (id: string, field: 'accusedName' | 'identificationNumber', value: string) => void;
  onQueryResultChange: (id: string, value: 'Positivo' | 'Negativo' | '') => void;
  onRemove: (id: string) => void;
  index: number;
  accusedNameError?: string;
  identificationNumberError?: string;
}

export interface AdditionalAccusedWebServiceItemRef {
  focusFirstInvalidInput: (errors: { accusedName?: boolean; identificationNumber?: boolean }) => void;
  focusAccusedNameInput: () => void;
}

export const AdditionalAccusedWebServiceItem = React.forwardRef<AdditionalAccusedWebServiceItemRef, AdditionalAccusedWebServiceItemProps>(
  ({
    accused,
    onChange,
    onQueryResultChange,
    onRemove,
    index,
    accusedNameError,
    identificationNumberError,
  }, ref) => {
    const accusedNameRef = useRef<HTMLInputElement>(null);
    const identificationNumberRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusFirstInvalidInput: (errors) => {
        if (errors.accusedName && accusedNameRef.current) {
          accusedNameRef.current.focus();
        } else if (errors.identificationNumber && identificationNumberRef.current) {
          identificationNumberRef.current.focus();
        }
      },
      focusAccusedNameInput: () => {
        accusedNameRef.current?.focus();
      }
    }));

    const hasError = !!accusedNameError || !!identificationNumberError;

    return (
      <div className={`p-3 border rounded-md mb-3 bg-slate-900 relative ${hasError ? 'border-red-500' : 'border-slate-700'}`}>
        <h4 className="text-sm font-semibold text-indigo-300 mb-2">Indiciado #{index + 1}</h4>
        <Input
          ref={accusedNameRef}
          id={`accusedName-ws-${accused.id}`}
          name={`accusedName-ws-${accused.id}`}
          label={UI_TEXT.formFields.accusedName}
          type="text"
          value={accused.accusedName}
          onChange={(e) => onChange(accused.id, 'accusedName', e.target.value)}
          placeholder={UI_TEXT.paragraphGenerator.accusedNamePlaceholder}
          containerClassName="mb-2"
          error={accusedNameError}
        />
        <Input
          ref={identificationNumberRef}
          id={`identificationNumber-ws-${accused.id}`}
          name={`identificationNumber-ws-${accused.id}`}
          label={UI_TEXT.formFields.identificationNumber}
          type="text"
          value={accused.identificationNumber}
          onChange={(e) => onChange(accused.id, 'identificationNumber', e.target.value)}
          placeholder={UI_TEXT.paragraphGenerator.identificationNumberPlaceholder}
          containerClassName="mb-2"
          error={identificationNumberError}
        />
        <div className="mb-3">
          <label htmlFor={`queryResult-ws-${accused.id}`} className="block text-sm font-medium text-slate-300 mb-1">
            {UI_TEXT.formFields.queryResultLabel}
          </label>
          <select
            id={`queryResult-ws-${accused.id}`}
            name={`queryResult-ws-${accused.id}`}
            value={accused.queryResult || ''}
            onChange={(e) => onQueryResultChange(accused.id, e.target.value as 'Positivo' | 'Negativo' | '')}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-100"
          >
            <option value="">{UI_TEXT.formFields.queryResultOptionSelect}</option>
            <option value="Positivo">{UI_TEXT.formFields.queryResultOptionPositive}</option>
            <option value="Negativo">{UI_TEXT.formFields.queryResultOptionNegative}</option>
          </select>
        </div>
        <Button
          onClick={() => onRemove(accused.id)}
          variant="danger"
          size="sm"
          className="absolute top-2 right-2 px-2 py-1"
          aria-label={`Eliminar Indiciado ${index + 1}`}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    );
  }
);

AdditionalAccusedWebServiceItem.displayName = 'AdditionalAccusedWebServiceItem';
