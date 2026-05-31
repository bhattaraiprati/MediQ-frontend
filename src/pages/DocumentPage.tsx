import { useCallback, useState } from 'react';
import {
  Upload, Search, Filter, Download, RefreshCw, X, CloudUpload, FileText
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { UploadModal } from '@/components/ui/UploadModel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllDocuments, uploadDocument } from '@/lib/documentApi';

interface Document {
  id: string;
  name: string;
  file_type: string;
  createdAt: string;
  cloudinary_url: string;
  status: 'completed' | 'processing' | 'queued' | 'error';
  totalChunks: number;
}

interface ApiResponse {
  success: boolean;
  documents: Document[];
}

export const DocumentPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [inlineFile, setInlineFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  // Fetch documents
  const { data: apiResponse, isLoading: documentsLoading } = useQuery<ApiResponse>({
    queryKey: ['documents'],
    queryFn: getAllDocuments,
    staleTime: 5 * 60 * 1000,
  });

  // Extract documents array safely
  const documents: Document[] = apiResponse?.documents || [];

  const uploadMutation = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      alert(`"${data.file?.filename || 'File'}" uploaded successfully!`);
      setInlineFile(null);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (error: any) => {
      console.error(error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    },
  });

  const onDropInline = useCallback((acceptedFiles: File[]) => {
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

  const handleInlineUpload = () => {
    if (!inlineFile) return;
    uploadMutation.mutate(inlineFile);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'PDF' && doc.file_type.includes('pdf')) ||
      (activeFilter === 'CSV' && doc.file_type.includes('csv')) ||
      (activeFilter === 'DOCX' && (doc.file_type.includes('word') || doc.file_type.includes('document'))) ||
      (activeFilter === 'Errors' && doc.status === 'error');

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    if (status === 'completed') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (status === 'processing') return 'bg-brand/10 text-brand border-brand/30';
    if (status === 'error') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-gray-100 text-gray-600';
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType.includes('pdf')) return 'PDF';
    if (fileType.includes('csv')) return 'CSV';
    if (fileType.includes('word') || fileType.includes('document')) return 'DOCX';
    return fileType.split('/').pop()?.toUpperCase() || 'FILE';
  };

  const handleCloudinaryUrl = (url:string)=>{
    window.open(url, "_blank", "noreferrer");

  }

  return (
    <>
      <div className="overflow-auto">
        <div className="flex-1 flex flex-col">
          {/* Topbar */}
          <div className="h-16 bg-white border-b border-gray-300 px-8 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Document Management</h1>

            <div className="flex items-center gap-3">
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
            {/* Inline Drop Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
                ${isDragActive ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-gray-300 hover:border-brand hover:bg-gray-50'}`}
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
                    or <span className="text-brand font-medium underline underline-offset-2">click to browse</span>
                  </p>
                </>
              )}
            </div>

            {/* Staged File */}
            {inlineFile && (
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-semibold text-gray-800">1 file ready to upload</p>
                  <button
                    onClick={handleInlineUpload}
                    disabled={uploadMutation.isPending}
                    className="flex items-center gap-2 bg-brand hover:bg-brand-dark disabled:opacity-40 text-white px-6 py-2.5 rounded-2xl text-sm font-medium transition"
                  >
                    {uploadMutation.isPending ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading…</>
                    ) : (
                      <><Upload className="w-4 h-4" /> Upload & Process</>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4 px-6 py-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold bg-red-100 text-red-600">
                    {inlineFile.name.split('.').pop()?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{inlineFile.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(inlineFile.size)}</p>
                  </div>
                  <button
                    onClick={() => setInlineFile(null)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Filter Bar */}
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
                    className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${
                      activeFilter === filter ? 'bg-brand text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {filter} {filter === 'All' && `(${documents.length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-300 text-xs font-semibold text-gray-500 px-8 py-4">
                <div className="col-span-4">Document</div>
                <div className="col-span-1 grid grid-flow-col justify-items-center">Type</div>
                <div className="col-span-2 grid grid-flow-col justify-items-center">Uploaded</div>
                <div className="col-span-2 grid grid-flow-col justify-items-center">Status</div>
                <div className="col-span-2 grid grid-flow-col justify-items-center">Action</div>

              </div>

              {filteredDocs.map((doc) => (
                <div key={doc.id} className="grid grid-cols-12 px-8 py-5 border-b border-gray-300 last:border-none hover:bg-gray-50 transition-all items-center">
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {doc.totalChunks.toLocaleString()} chunks
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1 font-medium grid grid-flow-col justify-items-center">{getFileTypeLabel(doc.file_type)}</div>
                  <div className="col-span-2 text-gray-600 grid grid-flow-col justify-items-center">
                    {new Date(doc.createdAt).toLocaleString()}
                  </div>
                  <div className="col-span-2 grid grid-flow-col justify-items-center">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1 text-xs font-medium rounded-full border ${getStatusBadge(doc.status)}`}>
                      <div className={`w-2 h-2 rounded-full ${doc.status === 'processing' ? 'animate-pulse bg-brand' : 'bg-brand'}`} />
                      {doc.status === 'completed' ? 'Completed' :
                        doc.status === 'processing' ? 'Processing' : doc.status}
                    </span>
                  </div>
                  <div className="col-span-2 grid grid-flow-col justify-items-center text-gray-600">
                    <button 
                    onClick={ () => handleCloudinaryUrl(doc.cloudinary_url)}
                    className='px-4 py-1 border border-brand rounded-lg bg-brand text-white '
                    >View</button>
                     <button 
                    onClick={ () => handleCloudinaryUrl(doc.cloudinary_url)}
                    className='px-4 py-1 border border-red-500 rounded-lg bg-red-500 text-white '
                    >Delete</button>
                  </div>
                  
                </div>
              ))}

              {documents.length === 0 && !documentsLoading && (
                <div className="p-12 text-center text-gray-500 py-20">No documents found</div>
              )}
            </div>
          </div>
        </div>

        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </>
  );
};