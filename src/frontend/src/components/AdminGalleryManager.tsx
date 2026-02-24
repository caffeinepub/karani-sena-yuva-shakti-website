import { useState } from 'react';
import { useGetGalleryItems } from '../hooks/useGetGalleryItems';
import { useAddGalleryItem } from '../hooks/useAddGalleryItem';
import { useDeleteGalleryItem } from '../hooks/useDeleteGalleryItem';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ImageUploadField from './ImageUploadField';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';
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

export default function AdminGalleryManager() {
  const { data: galleryItems, isLoading } = useGetGalleryItems();
  const { mutate: addItem, isPending: isAdding } = useAddGalleryItem();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteGalleryItem();

  const [newImage, setNewImage] = useState<ExternalBlob | null>(null);
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    if (!newImage) {
      toast.error('Please select an image');
      return;
    }
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    addItem(
      { image: newImage, description: description.trim() },
      {
        onSuccess: () => {
          toast.success('Photo added to gallery');
          setNewImage(null);
          setDescription('');
        },
        onError: (error) => {
          toast.error('Failed to add photo: ' + error.message);
        },
      }
    );
  };

  const handleDelete = (itemDescription: string) => {
    deleteItem(itemDescription, {
      onSuccess: () => {
        toast.success('Photo deleted from gallery');
      },
      onError: (error) => {
        toast.error('Failed to delete photo: ' + error.message);
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label="Photo"
            value={newImage}
            onChange={setNewImage}
            disabled={isAdding}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter photo description"
              disabled={isAdding}
            />
          </div>

          <Button onClick={handleAdd} disabled={isAdding || !newImage} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isAdding ? 'Adding...' : 'Add to Gallery'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Gallery Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-lg" />
              ))}
            </div>
          ) : !galleryItems || galleryItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No photos in gallery yet</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryItems.map((item, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={item.image.getDirectURL()}
                      alt={item.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm">{item.description}</p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full" disabled={isDeleting}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Photo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this photo? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.description)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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

