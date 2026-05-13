import { useState } from 'react';
import { 
  LayoutDashboard, FileText, Users, BarChart3, Settings, 
  Bell, Search, Plus, Upload, CheckCircle, AlertTriangle 
} from 'lucide-react';
import Logo from '../components/ui/Logo';
import LogoBlack from '@/components/ui/LogoBlack';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <LogoBlack />
            <span className="px-3 py-1 text-xs font-semibold bg-brand/10 text-brand rounded-full">ADMIN</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-8">
            <div className="uppercase text-xs font-semibold text-gray-500 px-4 mb-3">Overview</div>
            <NavItem icon={LayoutDashboard} label="Dashboard" active onClick={() => setActiveNav('dashboard')} />
          </div>

          <div className="mb-8">
            <div className="uppercase text-xs font-semibold text-gray-500 px-4 mb-3">Management</div>
            <NavItem icon={FileText} label="Documents" badge="2" onClick={() => setActiveNav('documents')} />
            <NavItem icon={Users} label="Users" onClick={() => setActiveNav('users')} />
            {/* <NavItem icon={BarChart3} label="Analytics" onClick={() => setActiveNav('analytics')} /> */}
          </div>

          <div>
            <div className="uppercase text-xs font-semibold text-gray-500 px-4 mb-3">System</div>
            <NavItem icon={Settings} label="Settings" onClick={() => setActiveNav('settings')} />
          </div>
        </div>

        {/* Admin User */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center text-white font-semibold">AD</div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Super Administrator</p>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-16 bg-white border-b border-gray-300 flex items-center px-8 justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Tuesday, May 12, 2026</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl text-sm font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              All systems operational
            </div>

            <div className="relative p-3 hover:bg-gray-100 rounded-xl cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </div>

            <div className="p-3 hover:bg-gray-100 rounded-xl cursor-pointer">
              <Search className="w-5 h-5 text-gray-600" />
            </div>

            <button className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-2xl hover:bg-brand-dark transition">
              <Plus className="w-4 h-4" />
              <span className="font-medium text-sm">Upload Document</span>
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
              value="24" 
              trend="+3" 
            />
            <StatCard 
              icon={Users} 
              color="emerald" 
              label="Active users today" 
              value="142" 
              trend="+7" 
            />
            <StatCard 
              icon={BarChart3} 
              color="amber" 
              label="AI queries today" 
              value="3.8k" 
              trend="+18%" 
            />
            <StatCard 
              icon={CheckCircle} 
              color="blue" 
              label="Answer accuracy rate" 
              value="98.1%" 
              trend="97.4%" 
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Query Volume Chart */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-brand" />
                  <div>
                    <h3 className="font-semibold">Query Volume — Last 7 days</h3>
                    <p className="text-sm text-gray-500">Queries vs Documents</p>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end gap-3">
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col-reverse gap-1 h-52">
                      <div className="bg-brand/90 rounded-t w-full" style={{height: `${40 + i * 12}%`}}></div>
                      <div className="bg-blue-200 rounded-t w-full" style={{height: `${20 + i * 8}%`}}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{day}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-brand rounded"></div>
                  <span>AI Queries</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span>Doc Uploads</span>
                </div>
              </div>
            </div>

            {/* Processing Queue */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <Upload className="w-5 h-5 text-brand" />
                <h3 className="font-semibold">AI Processing Queue</h3>
              </div>
              <QueueItem name="ICU_Formulary_2024.pdf" size="3.2 MB" progress={72} status="processing" />
              <QueueItem name="DrugInteractions_v3.csv" size="1.1 MB" progress={100} status="done" />
              <QueueItem name="Cardiology_Protocol_Q2.docx" size="0.8 MB" progress={0} status="queued" />
            </div>
          </div>

          {/* Recent Activity & Knowledge Base */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <RecentActivity />
            <KnowledgeBase />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====================== Reusable Components ====================== */

function NavItem({ icon: Icon, label, badge, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-sm ${active ? 'bg-brand/10 text-brand font-medium' : 'hover:bg-gray-100 text-gray-600'}`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
      {badge && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>}
    </div>
  );
}

function StatCard({ icon: Icon, color, label, value, trend }: any) {
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
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">+{trend}</span>
      </div>
      <div className="mt-8">
        <p className="text-4xl font-semibold tracking-tighter text-gray-900">{value}</p>
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

function RecentActivity() {
  return (
    <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6">
      <h3 className="font-semibold mb-5 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500" /> Recent Activity
      </h3>
      <div className="space-y-5">
        {[
          "ICU Formulary 2024.pdf uploaded & queued",
          "New user Dr. Ahmed Al-Farsi approved",
          "DrugInteractions_v3.csv indexed successfully",
        ].map((text, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              {i === 0 && <Upload className="w-4 h-4" />}
              {i === 1 && <Users className="w-4 h-4" />}
              {i === 2 && <CheckCircle className="w-4 h-4 text-emerald-600" />}
            </div>
            <div>
              <p className="text-sm">{text}</p>
              <p className="text-xs text-gray-500 mt-1">12 min ago</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnowledgeBase() {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-6">
      <h3 className="font-semibold mb-5">Knowledge Base</h3>
      <div className="space-y-5 text-sm">
        {[
          { label: "PDF files", value: "14", color: "red" },
          { label: "CSV files", value: "6", color: "emerald" },
          { label: "DOCX files", value: "4", color: "blue" },
          { label: "Total vectors", value: "48k", color: "brand" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full bg-${item.color}-500`} />
              <span className="text-gray-600">{item.label}</span>
            </div>
            <span className="font-mono font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}