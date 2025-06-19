
import React, { useState, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { UI_TEXT } from '../../constants';
import { ClipboardCopy, CheckCircle, ClipboardPaste } from 'lucide-react';
import { ToastType } from '../shared/Toast';

interface GeneratedParagraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  paragraphText: string | null;
  showToast: (message: string, type: ToastType) => void;
  modalTitle: string;
}

export const GeneratedParagraphModal: React.FC<GeneratedParagraphModalProps> = ({
  isOpen,
  onClose,
  paragraphText,
  showToast,
  modalTitle,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    if (!paragraphText) return;
    try {
      await navigator.clipboard.writeText(paragraphText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(UI_TEXT.toastMessages.textCopiedSuccess, 'success');
    } catch (err) {
      console.error(UI_TEXT.reportCopiedError, err);
      showToast(UI_TEXT.reportCopiedError, 'error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCopied(false); 
    }
  }, [isOpen]);

  if (!paragraphText && isOpen) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="4xl"> 
            <p className="text-slate-400">No hay párrafo para mostrar.</p>
        </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="4xl"> 
      <div className="space-y-4">
        <TextArea
          id="generatedParagraphModalText"
          label={UI_TEXT.paragraphGenerator.generatedParagraphLabel}
          value={paragraphText || ''}
          readOnly
          rows={10} 
          className="bg-slate-900 text-slate-200 border-slate-700 focus:ring-indigo-600 focus:border-indigo-600 selection:bg-purple-500 selection:text-white"
        />
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleCopyToClipboard}
            variant="secondary"
            className="w-full sm:w-auto"
            leftIcon={copied ? <CheckCircle size={18} className="text-green-400" /> : <ClipboardCopy size={18} />}
          >
            {copied ? 'Copiado!' : UI_TEXT.copyToClipboardButton}
          </Button>
        </div>
      </div>
    </Modal>
  );
};