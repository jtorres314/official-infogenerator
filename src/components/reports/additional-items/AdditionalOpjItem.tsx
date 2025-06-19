
import React, { useRef, useImperativeHandle } from 'react';
import { Input } from '../../shared/Input';
import { Button } from '../../shared/Button';
import { OtherOpjEntry } from '../../../types';
import { UI_TEXT } from '../../../constants';
import { Trash2 } from 'lucide-react';

interface AdditionalOpjItemProps {
  opj: OtherOpjEntry;
  onChange: (id: string, field: keyof Omit<OtherOpjEntry, 'id'>, value: string) => void;
  onRemove: (id: string) => void;
  index: number;
  maxDate: string;
  opjDateError?: string;
  opjNumberError?: string;
  officerNameError?: string;
}

export interface AdditionalOpjItemRef {
  focusFirstInvalidInput: (errors: { opjDate?: boolean; opjNumber?: boolean; officerName?: boolean }) => void;
}

export const AdditionalOpjItem = React.forwardRef<AdditionalOpjItemRef, AdditionalOpjItemProps>(
  ({ opj, onChange, onRemove, index, maxDate, opjDateError, opjNumberError, officerNameError }, ref) => {
    const opjDateRef = useRef<HTMLInputElement>(null);
    const opjNumberRef = useRef<HTMLInputElement>(null);
    const officerNameRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focusFirstInvalidInput: (errors) => {
        if (errors.opjDate && opjDateRef.current) {
          opjDateRef.current.focus();
        } else if (errors.opjNumber && opjNumberRef.current) {
          opjNumberRef.current.focus();
        } else if (errors.officerName && officerNameRef.current) {
          officerNameRef.current.focus();
        }
      }
    }));

    return (
      <div className={`p-4 border rounded-md mb-4 bg-slate-850 relative ${opjDateError || opjNumberError || officerNameError ? 'border-red-500' : 'border-slate-700'}`}>
        <h4 className="text-sm font-semibold text-indigo-400 mb-2">Otra OPJ #{index + 1}</h4>
        <Input
          ref={opjDateRef}
          id={`otherOpjDate-${opj.id}`}
          label={UI_TEXT.formFields.opjDate}
          type="date"
          value={opj.opjDate}
          onChange={(e) => onChange(opj.id, 'opjDate', e.target.value)}
          containerClassName="mb-2"
          max={maxDate}
          error={opjDateError}
        />
        <Input
          ref={opjNumberRef}
          id={`otherOpjNumber-${opj.id}`}
          label={UI_TEXT.formFields.opjNumber}
          type="text"
          value={opj.opjNumber}
          onChange={(e) => onChange(opj.id, 'opjNumber', e.target.value)}
          placeholder="Ej: 12345678"
          containerClassName="mb-2"
          error={opjNumberError}
        />
        <Input
          ref={officerNameRef}
          id={`otherOfficerName-${opj.id}`}
          label={UI_TEXT.formFields.officerName}
          type="text"
          value={opj.officerName}
          onChange={(e) => onChange(opj.id, 'officerName', e.target.value)}
          placeholder="Ej: Marco Antonio Polo Arnedo"
          containerClassName="mb-2"
          error={officerNameError}
        />
        <Button
          onClick={() => onRemove(opj.id)}
          variant="danger"
          size="sm"
          className="absolute top-3 right-3"
          aria-label={`Eliminar OPJ ${index + 1}`}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    );
  }
);

AdditionalOpjItem.displayName = 'AdditionalOpjItem';