
import React, { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Input } from '../shared/Input';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { UI_TEXT } from '../../constants';
import { ClipboardCopy, CheckCircle, Download, FileText as FileTextIcon } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import saveAs from 'file-saver';
import { ToastType } from '../shared/Toast';

interface GeneratedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportText: string;
  showToast: (message: string, type: ToastType) => void;
  modalTitle: string; 
}

export const GeneratedReportModal: React.FC<GeneratedReportModalProps> = ({ isOpen, onClose, reportText, showToast, modalTitle }) => {
  const [otNumber, setOtNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [otNumberError, setOtNumberError] = useState<string | null>(null);

  const handleCopyToClipboard = async () => {
    if (!reportText) return;
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showToast(UI_TEXT.toastMessages.textCopiedSuccess, 'success');
    } catch (err) {
      console.error(UI_TEXT.reportCopiedError, err);
      showToast(UI_TEXT.reportCopiedError, 'error');
    }
  };

  const validateOtNumber = (value: string): boolean => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      setOtNumberError(UI_TEXT.generatedReportModal.otNumberValidationError);
      return false;
    }
    if (!/^\d+$/.test(trimmedValue)) {
      setOtNumberError(UI_TEXT.generatedReportModal.otNumberValidationError);
      return false;
    }
    setOtNumberError(null);
    return true;
  };

  const handleExportToWord = async () => {
    if (!reportText) return;
    
    const trimmedOtNumber = otNumber.trim();
    if (!validateOtNumber(trimmedOtNumber)) {
        return;
    }

    const fileName = `INFORME OT ${trimmedOtNumber}.docx`;

    try {
      const paragraphs = reportText.split('\n').map(line =>
        new Paragraph({ children: [new TextRun(line)] })
      );

      const doc = new Document({
        sections: [{
          properties: {},
          children: paragraphs,
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, fileName);
      showToast(UI_TEXT.toastMessages.reportExportedSuccess, 'success');
      onClose(); 
    } catch (error) {
      console.error("Error exporting to Word:", error);
      const errorMessage = error instanceof Error ? `: ${error.message}`: '';
      showToast(UI_TEXT.generatedReportModal.wordExportError + errorMessage, 'error');
    }
  };
  
  React.useEffect(() => {
    if (isOpen) {
        setOtNumber('');
        setCopied(false);
        setOtNumberError(null); 
    }
  }, [isOpen]);


  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={modalTitle} 
        size="5xl" 
    >
      <div className="space-y-4">
        <Input
          id="otNumber"
          name="otNumber"
          label={UI_TEXT.generatedReportModal.otNumberLabel}
          type="text"
          value={otNumber}
          onChange={(e) => {
            setOtNumber(e.target.value);
            if (otNumberError) { 
                validateOtNumber(e.target.value); 
            }
          }}
          onBlur={() => validateOtNumber(otNumber)} 
          placeholder={UI_TEXT.generatedReportModal.otNumberPlaceholder}
          error={otNumberError || undefined} 
        />
        
        <TextArea
          id="generatedSijinReportModal"
          label={UI_TEXT.generatedReportModal.reportTextAreaLabel}
          value={reportText}
          readOnly
          rows={15}
          className="bg-slate-900 text-slate-200 border-slate-700 focus:ring-indigo-600 focus:border-indigo-600 selection:bg-purple-500 selection:text-white"
        />
        
        <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
          <Button 
            onClick={handleCopyToClipboard} 
            variant="secondary" 
            className="w-full sm:w-auto"
            leftIcon={copied ? <CheckCircle size={18} className="text-green-400" /> : <ClipboardCopy size={18} />}
          >
            {copied ? 'Copiado!' : UI_TEXT.copyToClipboardButton}
          </Button>
          <Button 
            onClick={handleExportToWord} 
            variant="primary" 
            className="w-full sm:w-auto"
            leftIcon={<Download size={18} />}
            disabled={!reportText}
          >
            {UI_TEXT.generatedReportModal.exportToWordButton}
          </Button>
        </div>
      </div>
    </Modal>
  );
};