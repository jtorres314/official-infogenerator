
import React, { useState } from 'react';
import { TextArea } from '../shared/TextArea';
import { Button } from '../shared/Button';
import { UI_TEXT } from '../../constants';
import { ClipboardCopy, CheckCircle } from 'lucide-react';

interface GeneratedReportDisplayProps {
  reportText: string;
}

export const GeneratedReportDisplay: React.FC<GeneratedReportDisplayProps> = ({ reportText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
      alert(UI_TEXT.reportCopiedSuccess);
    } catch (err) {
      console.error(UI_TEXT.reportCopiedError, err);
      alert(UI_TEXT.reportCopiedError);
    }
  };

  if (!reportText) return null;

  return (
    <div className="mt-8 p-6 bg-slate-850 rounded-lg shadow-inner border border-slate-700">
      <h3 className="text-xl font-semibold text-indigo-400 mb-3">Informe Generado</h3>
      <TextArea
        id="generatedReport"
        label=""
        value={reportText}
        readOnly
        rows={15}
        className="bg-slate-900 text-slate-200 border-slate-700 focus:ring-indigo-600 focus:border-indigo-600 selection:bg-purple-500 selection:text-white"
      />
      <Button 
        onClick={handleCopyToClipboard} 
        variant="secondary" 
        className="mt-4 w-full sm:w-auto"
        leftIcon={copied ? <CheckCircle size={18} className="text-green-400" /> : <ClipboardCopy size={18} />}
      >
        {copied ? 'Copiado!' : UI_TEXT.copyToClipboardButton}
      </Button>
    </div>
  );
};