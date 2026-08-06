import React, { useState } from 'react';
import { X, Camera, Sparkles, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { formatCurrency } from '../utils/currencies';

export default function BillScanner({ isOpen, onClose, onImportExtracted, currencySymbol = '$' }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setError('');
    setExtractedData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target.result);
    };
    reader.readAsDataURL(selected);
  };

  const handleScan = async () => {
    if (!preview) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.scanReceipt(preview, file ? file.type : 'image/jpeg');
      setLoading(false);
      if (res.data) {
        setExtractedData(res.data);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to extract bill data');
    }
  };

  const handleConfirmImport = () => {
    if (!extractedData) return;
    onImportExtracted(extractedData);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card max-w-lg">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="modal-title flex items-center gap-1.5">
                AI Bill & Receipt OCR Scanner <Sparkles className="w-4 h-4 text-purple-400" />
              </h3>
              <p className="text-xs text-slate-400">Upload paper receipt or bill photo to auto-extract transaction details</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-button"><X className="w-5 h-5" /></button>
        </div>

        {error && (
          <div className="alert-banner alert-banner-danger text-xs mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!preview ? (
          <div className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-colors rounded-xl p-8 text-center bg-purple-950/20">
            <Upload className="w-10 h-10 text-purple-400 mx-auto mb-3 opacity-80" />
            <p className="text-sm font-medium text-slate-200">Upload Receipt or Bill Image</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Supports PNG, JPG, JPEG receipt scans</p>
            <label className="btn btn-primary inline-flex items-center gap-2 text-xs py-2 px-4 cursor-pointer">
              <Camera className="w-4 h-4" />
              <span>Choose Photo</span>
              <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <img src={preview} alt="Receipt preview" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{file ? file.name : 'Receipt Image'}</p>
                <p className="text-[11px] text-slate-400">Ready for AI Vision Extraction</p>
              </div>
              <button
                onClick={() => { setPreview(null); setExtractedData(null); }}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Change
              </button>
            </div>

            {!extractedData ? (
              <button
                onClick={handleScan}
                disabled={loading}
                className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI OCR Scanner</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-purple-950/30 border border-purple-500/40 p-4 rounded-xl space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="font-semibold text-purple-300">Extracted Merchant / Title:</span>
                  <span className="font-bold text-slate-100">{extractedData.title}</span>
                </div>
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="font-semibold text-purple-300">Extracted Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">{formatCurrency(extractedData.amount, currencySymbol)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="font-semibold text-purple-300">Category:</span>
                  <span className="badge badge-indigo">{extractedData.category}</span>
                </div>
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                  <span className="font-semibold text-purple-300">Transaction Date:</span>
                  <span className="text-slate-300">{extractedData.date}</span>
                </div>

                <button
                  onClick={handleConfirmImport}
                  className="btn btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Save to Transaction Log</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
