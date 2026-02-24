import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminCandidatesList from '../components/AdminCandidatesList';
import AdminGalleryManager from '../components/AdminGalleryManager';
import AdminNewsManager from '../components/AdminNewsManager';

export default function AdminPanel() {
  return (
    <div className="container py-16">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">Manage admission applications, gallery, and news updates</p>
        </div>

        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="candidates">Admission Applications</TabsTrigger>
            <TabsTrigger value="gallery">Photo Gallery</TabsTrigger>
            <TabsTrigger value="news">News & Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates" className="mt-6">
            <AdminCandidatesList />
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <AdminGalleryManager />
          </TabsContent>

          <TabsContent value="news" className="mt-6">
            <AdminNewsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

