import { CloudUpload, RefreshCw, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";


export function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [modalFile, setModalFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) setModalFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,        // ← single file only
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
  });

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!modalFile) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', modalFile);   // field name 'file' → upload.single('file')

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${data.file.filename}" uploaded successfully!`);
        setModalFile(null);
        onClose();
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Upload error. Check console.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setModalFile(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center">
            <Upload className="w-5 h-5 text-brand" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
          <button
            onClick={handleClose}
            className="ml-auto text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
              ${isDragActive
                ? 'border-brand bg-brand/5'
                : 'border-gray-300 hover:border-brand hover:bg-gray-50'
              }`}
          >
            <input {...getInputProps()} />
            <CloudUpload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-brand' : 'text-gray-400'}`} />
            {isDragActive ? (
              <p className="font-medium text-brand">Drop the file here!</p>
            ) : (
              <>
                <p className="font-medium text-gray-700">
                  Drag & drop a file, or{' '}
                  <span className="text-brand underline underline-offset-2">click to browse</span>
                </p>
                <p className="text-sm text-gray-400 mt-1">PDF, CSV, DOCX, TXT • One file • Max 10 MB</p>
              </>
            )}
          </div>

          {/* Single file preview */}
          {modalFile && (
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Selected file</p>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[10px] font-bold
                  ${modalFile.name.endsWith('.pdf') ? 'bg-red-100 text-red-600' :
                    modalFile.name.endsWith('.csv') ? 'bg-emerald-100 text-emerald-600' :
                    'bg-blue-100 text-blue-600'}`}>
                  {modalFile.name.split('.').pop()?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{modalFile.name}</p>
                  <p className="text-xs text-gray-400">{formatBytes(modalFile.size)}</p>
                </div>
                <button
                  onClick={() => setModalFile(null)}
                  className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!modalFile || uploading}
            className="flex-1 py-3 bg-brand text-white rounded-2xl font-medium hover:bg-brand-dark transition text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload & Process
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}