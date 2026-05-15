import { useCallback, useState } from 'react';
import {
  Upload, Search, Filter, Download, Eye, RefreshCw, Trash2,
  FileText, AlertCircle, CheckCircle, X, CloudUpload
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface Document {
  id: number;
  name: string;
  type: 'PDF' | 'CSV' | 'DOCX';
  size: string;
  uploaded: string;
  category: string;
  chunks: number;
  vectors: number;
  status: 'indexed' | 'processing' | 'queued' | 'error';
}

export const DocumentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const [inlineFile, setInlineFile] = useState<File | null>(null);
  const [inlineUploading, setInlineUploading] = useState(false);

  const onDropInline = useCallback((acceptedFiles: File[]) => {
    // Always replace with the latest single file
    if (acceptedFiles.length > 0) setInlineFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropInline,
    multiple: false,          
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
  });

  const handleInlineUpload = async () => {
    if (!inlineFile) return;
    setInlineUploading(true);

    const formData = new FormData();
    formData.append('file', inlineFile);

    try {
      const token = localStorage.getItem('mediq_token');
      const res = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${data.file.filename}" uploaded successfully!`);
        setInlineFile(null);
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Upload error. Check console.');
    } finally {
      setInlineUploading(false);
    }
  };
  // ────────────────────────────────────────────────────────────

  const documents: Document[] = [
    { id: 1, name: "ICU_Formulary_2024.pdf", type: "PDF", size: "3.2 MB", uploaded: "12 min ago", category: "Critical Care", chunks: 1842, vectors: 7201, status: "processing" },
    { id: 2, name: "DrugInteractions_v3.csv", type: "CSV", size: "1.1 MB", uploaded: "1 hr ago", category: "Pharmacology", chunks: 891, vectors: 3420, status: "indexed" },
    { id: 3, name: "WHO_Diabetes_Guidelines_2023.pdf", type: "PDF", size: "4.2 MB", uploaded: "2 days ago", category: "Endocrinology", chunks: 3210, vectors: 12400, status: "indexed" },
    { id: 4, name: "CKD_Formulary_Protocol_v4.docx", type: "DOCX", size: "1.8 MB", uploaded: "5 days ago", category: "Nephrology", chunks: 1120, vectors: 4810, status: "indexed" },
    { id: 5, name: "Warfarin_INR_Monitoring_Protocol.docx", type: "DOCX", size: "2.4 MB", uploaded: "3 weeks ago", category: "Haematology", chunks: 0, vectors: 0, status: "error" },
  ];

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === 'All' ||
      (activeFilter === 'PDF' && doc.type === 'PDF') ||
      (activeFilter === 'CSV' && doc.type === 'CSV') ||
      (activeFilter === 'DOCX' && doc.type === 'DOCX') ||
      (activeFilter === 'Errors' && doc.status === 'error'))
  );

  const getStatusBadge = (status: Document['status']) => {
    if (status === 'indexed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'processing') return 'bg-brand/10 text-brand border-brand/30';
    if (status === 'error') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className='overflow-auto'>
        <div className="flex-1 flex flex-col">

          {/* ── Topbar ── */}
          <div className="h-16 bg-white border-b border-gray-300 px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Document Management</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-2xl hover:bg-gray-50 transition">
                <Download className="w-4 h-4" />
                Export list
              </button>
              {/* Opens the modal */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-6 py-2.5 rounded-2xl transition"
              >
                <Upload className="w-4 h-4" />
                Upload documents
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-8 space-y-8">

            {/* ── Inline Drop Zone ── */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
                ${isDragActive
                  ? 'border-brand bg-brand/5 scale-[1.01]'
                  : 'border-gray-300 hover:border-brand hover:bg-gray-50'
                }`}
            >
              <input {...getInputProps()} />
              <div className="mx-auto w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mb-6">
                <CloudUpload className="w-8 h-8 text-brand" />
              </div>
              {isDragActive ? (
                <h3 className="text-lg font-semibold mb-2 text-brand">Drop the file here!</h3>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2">Drag & drop a pharmaceutical document here</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    or <span className="text-brand font-medium underline underline-offset-2">click to browse</span> • One file at a time • Automatically embedded into the AI knowledge base
                  </p>
                </>
              )}
              <div className="flex justify-center gap-4 mt-6">
                <div className="px-4 py-2 bg-red-50 text-red-700 text-xs font-medium rounded-full">PDF</div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">CSV</div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">DOCX</div>
              </div>
            </div>

            {/* ── Staged file + Upload button (appears only after a file is selected) ── */}
            {inlineFile && (
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-semibold text-gray-800">1 file ready to upload</p>
                  <button
                    onClick={handleInlineUpload}
                    disabled={inlineUploading}
                    className="flex items-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-2xl text-sm font-medium transition"
                  >
                    {inlineUploading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading…</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload & Process</>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 px-6 py-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold
                    ${inlineFile.name.endsWith('.pdf') ? 'bg-red-100 text-red-600' :
                      inlineFile.name.endsWith('.csv') ? 'bg-emerald-100 text-emerald-600' :
                      'bg-blue-100 text-blue-600'}`}>
                    {inlineFile.name.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{inlineFile.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(inlineFile.size)}</p>
                  </div>
                  <button
                    onClick={() => setInlineFile(null)}
                    className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ── Mini Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total documents", value: "24", icon: FileText, color: "brand" },
                { label: "Indexed & active", value: "21", icon: CheckCircle, color: "emerald" },
                { label: "Processing", value: "2", icon: RefreshCw, color: "amber" },
                { label: "Failed / errors", value: "1", icon: AlertCircle, color: "red" },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-3xl p-6 flex gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-100 text-${stat.color}-600`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Filter Bar ── */}
            <div className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[280px] flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['All', 'PDF', 'CSV', 'DOCX', 'Errors'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${activeFilter === filter
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {filter} {filter === 'All' && `(${documents.length})`}
                  </button>
                ))}
              </div>
              <button className="ml-auto flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-2xl hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Sort
              </button>
            </div>

            {/* ── Documents Table ── */}
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300 text-xs font-semibold text-gray-500 px-8 py-4">
                <div className="col-span-5">Document</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-2">Uploaded</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Status</div>
              </div>

              {filteredDocs.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 px-8 py-5 border-b border-gray-300 last:border-none hover:bg-gray-50 transition-all items-center">
                  <div className="col-span-5 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${doc.type === 'PDF' ? 'bg-red-100 text-red-600' : doc.type === 'CSV' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.chunks.toLocaleString()} chunks • {doc.vectors.toLocaleString()} vectors
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 font-medium">{doc.type}</div>
                  <div className="col-span-1 text-gray-600">{doc.size}</div>
                  <div className="col-span-2 text-gray-600">{doc.uploaded}</div>
                  <div className="col-span-2 text-gray-600">{doc.category}</div>
                  <div className="col-span-1">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-full border ${getStatusBadge(doc.status)}`}>
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'processing' ? 'animate-pulse bg-brand' : ''}`} />
                      {doc.status === 'indexed' ? 'Indexed' :
                        doc.status === 'processing' ? 'Processing' :
                          doc.status === 'error' ? 'Error' : 'Queued'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Upload Modal (opened from Topbar) ── */}
        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};

/*  Upload Modal */

function UploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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