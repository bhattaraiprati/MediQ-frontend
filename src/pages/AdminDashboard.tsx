import { UploadModal } from '@/components/ui/UploadModel';
import { dashbaordStats, documentQueue, KnowledgeStats } from '@/lib/dashboardApi';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, Users, BarChart3,  
  Bell, Search, Plus, Upload, CheckCircle, AlertTriangle, 
} from 'lucide-react';
import { useState } from 'react';

interface DashboardStats {
  TotalDocument: number;
  TotalUsers: number;
  BlockUser: number;
}

interface DocumentJob {
  id: string;
  state: string;
  progress: number;
}

interface DocumentQueueItem {
  id: string;
  name: string;
  status: string;
  totalChunks: number;
  job: DocumentJob;
}

interface DocumentQueueResponse {
  success: boolean;
  documents: DocumentQueueItem[];
}

export default function AdminDashboard() {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {data: statsData, isLoading: statsLoading} = useQuery<{ success: boolean; stats: DashboardStats } | undefined>({
    queryKey: ['dashboardStats'],
    queryFn: dashbaordStats,
    refetchOnWindowFocus: false,
  });

  const stats: DashboardStats = statsData?.stats ?? {
    TotalDocument: 0,
    TotalUsers: 0,
    BlockUser: 0,
  };

  const {data: documentQueueData, isLoading: documentQueueLoading} = useQuery<DocumentQueueResponse | undefined>({
    queryKey: ['documentQueue'],
    queryFn: documentQueue,
    refetchOnWindowFocus: false,
  });

  const queueItems = documentQueueData?.documents ?? [];
  const renderStatus = (state: string) =>
    state === 'completed' ? 'done' : state === 'processing' ? 'processing' : 'queued';

  const today = new Date();

  const dayName = today.toLocaleDateString('en-us', {weekday: 'long'})
  const numericDate = today.toLocaleDateString('en-us', {year: 'numeric',  day: '2-digit', month: '2-digit'})

  return (

    <>
  
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-gray-300 flex items-center px-8 justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">{dayName}, {numericDate}</p>
          </div>

          <div className="flex items-center gap-4">

            <button className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-dark transition">
              <Plus className="w-4 h-4" />
              <span className="font-medium text-sm" onClick={() => setIsModalOpen(true)}>Upload Document</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={FileText} 
              color="brand" 
              label="Total documents indexed" 
              value={stats.TotalDocument} 
              loading={statsLoading}
            />
            <StatCard 
              icon={Users} 
              color="emerald" 
              label="Total users" 
              value={stats.TotalUsers}  
              loading={statsLoading}
            />
            <StatCard 
              icon={BarChart3} 
              color="amber" 
              label="Block Users" 
              value={stats.BlockUser} 
              loading={statsLoading}
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Processing Queue */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-5 h-5 text-brand" />
                <h3 className="font-semibold">AI Processing Queue</h3>
              </div>
              {documentQueueLoading ? (
                <p className="text-sm text-gray-500">Loading queue...</p>
              ) : queueItems.length === 0 ? (
                <p className="text-sm text-gray-500">No documents found in the queue.</p>
              ) : (
                queueItems.map((doc) => (
                  <QueueItem
                    key={doc.id}
                    name={doc.name}
                    size={`${doc.totalChunks} chunks`}
                    progress={doc.job.progress}
                    status={renderStatus(doc.job.state)}
                  />
                ))
              )}
            </div>
            <KnowledgeBase />
          </div>

          {/* Recent Activity & Knowledge Base */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* <RecentActivity /> */}
            
          </div>
        </div>
          
        <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      </>
  );
}



function StatCard({ icon: Icon, color, label, value, loading }: any) {
  const colorMap: any = {
    brand: 'text-brand bg-brand/10',
    emerald: 'text-emerald-600 bg-emerald-100',
    amber: 'text-amber-600 bg-amber-100',
    blue: 'text-blue-600 bg-blue-100',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 hover:border-brand transition-all">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {/* <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+{trend}</span> */}
      </div>
      <div className="mt-8">
        <p className="text-4xl font-semibold tracking-tighter text-gray-900">{loading ? '...' : value}</p>
        <p className="text-sm text-gray-500 mt-1.5">{label}</p>
      </div>
    </div>
  );
}

function QueueItem({ name, size, progress, status }: any) {

  const statusColor = status === 'done' ? 'bg-emerald-500' : status === 'processing' ? 'bg-brand' : 'bg-gray-400';

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-300 last:border-none">
      <div className="w-10 h-10 bg-gray-100 rounded-2xl flex items-center justify-center">
        <FileText className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{name}</p>
        <p className="text-xs text-gray-500">{size}</p>
      </div>
      <div className="w-24">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${statusColor}`} style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <span className={`text-xs font-medium px-4 py-1 rounded-full ${
        status === 'done' ? 'bg-emerald-100 text-emerald-700' :
        status === 'processing' ? 'bg-brand/10 text-brand' : 'bg-gray-100 text-gray-500'
      }`}>
        {status === 'done' ? 'Done' : status === 'processing' ? 'Processing' : 'Queued'}
      </span>
    </div>
  );
}

// function RecentActivity() {
//   return (
//     <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-6">
//       <h3 className="font-semibold mb-5 flex items-center gap-3">
//         <AlertTriangle className="w-5 h-5 text-amber-500" /> Recent Activity
//       </h3>
//       <div className="space-y-5">
//         {[
//           "ICU Formulary 2024.pdf uploaded & queued",
//           "New user Dr. Ahmed Al-Farsi approved",
//           "DrugInteractions_v3.csv indexed successfully",
//         ].map((text, i) => (
//           <div key={i} className="flex gap-4">
//             <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
//               {i === 0 && <Upload className="w-4 h-4" />}
//               {i === 1 && <Users className="w-4 h-4" />}
//               {i === 2 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
//             </div>
//             <div>
//               <p className="text-sm">{text}</p>
//               <p className="text-xs text-gray-500 mt-1">12 min ago</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

interface KnowledgeResponse {
  success: boolean;
  docsCount: {
    pdf: number;
    word: number;
    csv: number;
    plain: number;
  };
}

interface KnowledgeItem {
  label: string;
  color: 'brand' | 'emerald' | 'blue' | 'amber';
  value: number;
}

function KnowledgeBase() {
  const {data: knowledgeData, isLoading: knowledgeLoading} = useQuery<KnowledgeResponse | undefined>({
    queryKey: ['knowledgeStats'],
    queryFn: KnowledgeStats,
    refetchOnWindowFocus: false,
  });

  const colorMap: Record<KnowledgeItem['color'], string> = {
    brand: 'bg-brand',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  const items: KnowledgeItem[] = knowledgeData
    ? [
        { label: 'PDF', color: 'brand', value: knowledgeData.docsCount.pdf },
        { label: 'Word', color: 'blue', value: knowledgeData.docsCount.word },
        { label: 'Plain text', color: 'amber', value: knowledgeData.docsCount.plain },
      ]
    : [];

  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6">
      <h3 className="font-semibold mb-5">Knowledge Base</h3>
      <div className="space-y-5 text-sm">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${colorMap[item.color]}`} />
              <span className="text-gray-600">{item.label}</span>
            </div>
            <span className="font-mono font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}