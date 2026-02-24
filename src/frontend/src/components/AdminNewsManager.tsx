import { useState } from 'react';
import { useGetAllNewsItems } from '../hooks/useGetAllNewsItems';
import { useCreateNewsItem } from '../hooks/useCreateNewsItem';
import { useEditNewsItem } from '../hooks/useEditNewsItem';
import { useDeleteNewsItem } from '../hooks/useDeleteNewsItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { NewsItem } from '../backend';

export default function AdminNewsManager() {
  const { data: newsItems, isLoading } = useGetAllNewsItems();
  const { mutate: createNews, isPending: isCreating } = useCreateNewsItem();
  const { mutate: editNews, isPending: isEditing } = useEditNewsItem();
  const { mutate: deleteNews, isPending: isDeleting } = useDeleteNewsItem();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  const sortedNews = newsItems
    ? [...newsItems].sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    : [];

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const createdAt = BigInt(Date.now());

    if (editingItem) {
      editNews(
        { title: formData.title.trim(), content: formData.content.trim(), createdAt },
        {
          onSuccess: () => {
            toast.success('News updated successfully');
            resetForm();
          },
          onError: (error) => {
            toast.error('Failed to update news: ' + error.message);
          },
        }
      );
    } else {
      createNews(
        { title: formData.title.trim(), content: formData.content.trim(), createdAt },
        {
          onSuccess: () => {
            toast.success('News created successfully');
            resetForm();
          },
          onError: (error) => {
            toast.error('Failed to create news: ' + error.message);
          },
        }
      );
    }
  };

  const handleEdit = (item: NewsItem) => {
    setEditingItem(item);
    setFormData({ title: item.title, content: item.content });
    setIsFormOpen(true);
  };

  const handleDelete = (title: string) => {
    deleteNews(title, {
      onSuccess: () => {
        toast.success('News deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete news: ' + error.message);
      },
    });
  };

  const resetForm = () => {
    setFormData({ title: '', content: '' });
    setEditingItem(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {!isFormOpen ? (
        <Button onClick={() => setIsFormOpen(true)} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Create News Post
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'Edit News Post' : 'Create News Post'}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter news title"
                disabled={isCreating || isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">
                Content <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Enter news content"
                rows={6}
                disabled={isCreating || isEditing}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={isCreating || isEditing} className="flex-1">
                {isCreating || isEditing ? 'Saving...' : editingItem ? 'Update' : 'Create'}
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={isCreating || isEditing}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Published News</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !sortedNews || sortedNews.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No news posts yet</p>
          ) : (
            <div className="space-y-4">
              {sortedNews.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {new Date(Number(item.createdAt)).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" disabled={isDeleting}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete News Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this news post? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.title)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

