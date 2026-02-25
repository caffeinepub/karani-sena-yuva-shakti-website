import { useState } from 'react';
import AdminCandidatesList from '../components/AdminCandidatesList';
import AdminGalleryManager from '../components/AdminGalleryManager';
import AdminNewsManager from '../components/AdminNewsManager';
import AdminManagementSection from '../components/AdminManagementSection';
import AdminDeleteRecordsSection from '../components/AdminDeleteRecordsSection';
import AdminPendingRequestsSection from '../components/AdminPendingRequestsSection';
import { cn } from '@/lib/utils';
import { Users, Image, Newspaper, Shield, Trash2, Clock } from 'lucide-react';

type AdminSection = 'pending' | 'candidates' | 'gallery' | 'news' | 'admins' | 'delete';

interface MenuItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { id: 'pending', label: 'Pending Requests', icon: <Clock className="h-5 w-5" /> },
  { id: 'candidates', label: 'Admission Applications', icon: <Users className="h-5 w-5" /> },
  { id: 'gallery', label: 'Photo Gallery', icon: <Image className="h-5 w-5" /> },
  { id: 'news', label: 'News & Updates', icon: <Newspaper className="h-5 w-5" /> },
  { id: 'admins', label: 'Manage Admins', icon: <Shield className="h-5 w-5" /> },
  { id: 'delete', label: 'Delete Records', icon: <Trash2 className="h-5 w-5" /> },
];

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState<AdminSection>('pending');

  const renderContent = () => {
    switch (activeSection) {
      case 'pending':
        return <AdminPendingRequestsSection />;
      case 'candidates':
        return <AdminCandidatesList />;
      case 'gallery':
        return <AdminGalleryManager />;
      case 'news':
        return <AdminNewsManager />;
      case 'admins':
        return <AdminManagementSection />;
      case 'delete':
        return <AdminDeleteRecordsSection />;
      default:
        return <AdminPendingRequestsSection />;
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage admission applications, gallery, news updates, and administrators</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-card border rounded-lg p-2 sticky top-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  activeSection === item.id
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'text-muted-foreground',
                  item.id === 'delete' && activeSection !== 'delete'
                    ? 'hover:bg-destructive/10 hover:text-destructive'
                    : ''
                )}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
