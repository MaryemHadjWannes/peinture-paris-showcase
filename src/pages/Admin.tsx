// src/pages/Admin.tsx
import React, { useState, useEffect, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash, Upload, MoveUp, MoveDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// === API BASE – AUTO SWITCH DEV / PROD ===
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// === CATEGORIES ===
interface Category {
  name: string;
  id: string;
  maxImages: number;
}

const CATEGORIES: Category[] = [
  { name: 'Enduit Professionnel', id: 'enduit', maxImages: 20 },
  { name: 'Peinture Intérieure', id: 'peinture-interieure', maxImages: 20 },
  { name: 'Escalier & Détails', id: 'escalier-details', maxImages: 20 },
  { name: 'Avant / Après', id: 'avant-apres', maxImages: 20 },
];

// === R2 IMAGE INTERFACE ===
interface Image {
  url: string;
  filename: string;
  publicId: string; // <-- R2 Key: Used for deletion
}

// =================================================================================
// 🚨 RETAINING LOCAL STORAGE FOR ORDER ONLY (Simplified)
// We only use localStorage to store the ORDER (publicId list) once images are fetched.
// =================================================================================
const getInitialOrder = () => {
  const saved = localStorage.getItem('portfolioImageOrder');
  return saved ? JSON.parse(saved) : {};
};
const getInitialData = () => {
    const saved = localStorage.getItem('portfolioImages');
    return saved ? JSON.parse(saved) : {};
  };

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Stores the actual fetched image data (PublicID, URL, etc.)
  const [images, setImages] = useState<Image[]>([]); 
  
  // Stores the desired order (list of publicIds) for each category
  const [imageOrder, setImageOrder] = useState<Record<string, string[]>>(getInitialOrder()); 

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  /* -------------------------------------------------------------- */
  /* FETCH IMAGES (FINAL R2 VERSION)                               */
  /* -------------------------------------------------------------- */
  const fetchImages = useCallback(async (category: string, currentOrder: string[]) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/images/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const { files }: { files: Image[] } = await res.json();
      
      // 1. Convert fetched files into a map for quick lookup
      const fileMap = new Map(files.map(f => [f.publicId, f]));
      
      // 2. Determine the order for the current category
      // Filter out deleted items from the stored order list
      const validOrder = currentOrder.filter(id => fileMap.has(id));
      
      // Identify new files that were just uploaded and are not in the stored order list
      const newFiles = files.filter(f => !validOrder.includes(f.publicId));

      // 3. Create the final ordered list
      // First, include images based on the saved order
      let finalImages: Image[] = validOrder.map(id => fileMap.get(id)!);
      // Then, append any brand new files to the end
      finalImages = [...finalImages, ...newFiles];
      
      // 4. Update both state variables
      setImages(finalImages);
      setImageOrder(prev => ({ ...prev, [category]: finalImages.map(img => img.publicId) }));

    } catch (err) {
      console.error('Error fetching images:', err);
      toast({ title: 'Erreur', description: 'Impossible de charger les images', variant: 'destructive' });
    }
  }, [token, toast]);

  /* -------------------------------------------------------------- */
  /* EFFECT: INITIAL FETCH & CATEGORY SWITCH                       */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    if (token) {
      // Get the last known order for the selected category, or an empty array
      const currentOrder = imageOrder[selectedCategory] || [];
      fetchImages(selectedCategory, currentOrder);
    }
  }, [selectedCategory, token, fetchImages, imageOrder]);
  
  /* -------------------------------------------------------------- */
  /* EFFECT: SAVE ORDER TO localStorage                            */
  /* -------------------------------------------------------------- */
  useEffect(() => {
    localStorage.setItem('portfolioImageOrder', JSON.stringify(imageOrder));
  }, [imageOrder]);

  /* -------------------------------------------------------------- */
  /* LOGIN (Unchanged)                                             */
  /* -------------------------------------------------------------- */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const { token } = await res.json();
      localStorage.setItem('token', token);
      setToken(token);
      toast({ title: 'Connexion réussie' });
      
      // Fetch images immediately after successful login using the current selected category
      const currentOrder = imageOrder[selectedCategory] || [];
      fetchImages(selectedCategory, currentOrder); 
    } catch {
      toast({ title: 'Erreur', description: 'Identifiants incorrects', variant: 'destructive' });
    }
  };

  /* -------------------------------------------------------------- */
  /* UPLOAD (R2 version)                                           */
  /* -------------------------------------------------------------- */
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const cat = CATEGORIES.find(c => c.id === selectedCategory);
    if (!cat) return;

    if (images.length + files.length > cat.maxImages) {
      toast({
        title: 'Limite dépassée',
        description: `Maximum ${cat.maxImages} images pour cette catégorie`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    const uploaded: Image[] = [];

    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('image', files[i]);
      fd.append('category', selectedCategory);

      try {
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        if (!res.ok) throw new Error('Upload failed');

        const json = await res.json();
        const img: Image = { url: json.url, filename: json.filename, publicId: json.publicId };
        uploaded.push(img);
        toast({ title: 'Succès', description: `${files[i].name} uploadé` });
      } catch (err) {
        console.error(err);
        toast({ title: 'Erreur', description: `Échec upload ${files[i].name}`, variant: 'destructive' });
      }
    }

    const newImages = [...images, ...uploaded];
    const newOrder = newImages.map(img => img.publicId);

    setImages(newImages);
    setImageOrder(prev => ({ ...prev, [selectedCategory]: newOrder }));
    
    setIsUploading(false);
    e.target.value = '';
  };

  /* -------------------------------------------------------------- */
  /* DELETE (R2 version)                                           */
  /* -------------------------------------------------------------- */
 const handleDelete = async (img: Image, idx: number) => {
    try {
      // Uses the R2 Key (publicId) for deletion
      const res = await fetch(`${API_BASE}/api/admin/delete/${encodeURIComponent(img.publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');

      const newImgs = images.filter((_, i) => i !== idx);
      const newOrder = newImgs.map(i => i.publicId);

      setImages(newImgs);
      setImageOrder(prev => ({ ...prev, [selectedCategory]: newOrder }));
      toast({ title: 'Supprimé', description: img.filename });
    } catch (err) {
      console.error(err);
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  /* -------------------------------------------------------------- */
  /* REORDER & DRAG-AND-DROP (FINAL)                               */
  /* -------------------------------------------------------------- */
  const updateOrder = (updatedImages: Image[]) => {
    const newOrder = updatedImages.map(img => img.publicId);
    setImages(updatedImages);
    setImageOrder(prev => ({ ...prev, [selectedCategory]: newOrder }));
  };

  const move = (idx: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === images.length - 1)) return;
    const copy = [...images];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    updateOrder(copy);
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, idx: number) => {
    e.dataTransfer.setData('text/plain', idx.toString());
    setIsDragging(true);
  };
  const onDragOver = (e: DragEvent) => e.preventDefault();
  const onDrop = (e: DragEvent<HTMLDivElement>, dropIdx: number) => {
    e.preventDefault();
    const dragIdx = Number(e.dataTransfer.getData('text/plain'));
    if (dragIdx === dropIdx) return;
    const copy = [...images];
    const [moved] = copy.splice(dragIdx, 1);
    copy.splice(dropIdx, 0, moved);
    updateOrder(copy);
    setIsDragging(false);
  };
  const onDragEnd = () => setIsDragging(false);

  /* -------------------------------------------------------------- */
  /* LOGIN SCREEN (Unchanged)                                      */
  /* -------------------------------------------------------------- */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-96 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0A2543]">Connexion Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="admin@exemple.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-[#0A2543] hover:bg-[#DF271C]">
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* -------------------------------------------------------------- */
  /* MAIN ADMIN UI (Unchanged)                                     */
  /* -------------------------------------------------------------- */
  const cat = CATEGORIES.find(c => c.id === selectedCategory)!;
  const count = images.length;
  const max = cat.maxImages;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0A2543]">Admin – Portfolio</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('portfolioImageOrder'); // Clear order on logout
            setToken('');
            setImages([]);
            toast({ title: 'Déconnexion' });
          }}
        >
          Déconnexion
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-[#0A2543]">{cat.name}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {count}/{max} images
            {count >= max ? ' (limite atteinte)' : ''}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* CATEGORY SELECT */}
          <div>
            <Label>Catégorie</Label>
            <Select value={selectedCategory} onValueChange={v => setSelectedCategory(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* UPLOAD ZONE */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading || count >= max}
              onChange={handleUpload}
              className="mt-2"
            />
            {isUploading && <Loader2 className="mx-auto h-6 w-6 animate-spin mt-2" />}
            {count >= max && <p className="text-sm text-destructive mt-2">Limite atteinte</p>}
          </div>

          {/* IMAGE LIST */}
          <div className="space-y-3">
            <Label>Images (glisser pour réordonner)</Label>
            {images.length === 0 && (
              <p className="text-center text-muted-foreground py-8">Aucune image</p>
            )}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {images.map((img, idx) => (
                <div
                  key={img.publicId} // Use publicId as key for stability
                  draggable
                  onDragStart={e => onDragStart(e, idx)}
                  onDragOver={onDragOver}
                  onDrop={e => onDrop(e, idx)}
                  onDragEnd={onDragEnd}
                  className={`flex items-center gap-3 p-3 border rounded-lg bg-card cursor-grab ${isDragging ? 'opacity-50' : 'active:cursor-grabbing'}`}
                >
                  {/* Since you are no longer using Cloudinary, the replace for transformation is removed */}
                  <img src={img.url} alt="" className="w-16 h-16 object-cover rounded" /> 
                  <div className="flex-1">
                    <p className="font-medium text-sm">{img.filename}</p>
                    <p className="text-xs text-muted-foreground break-all" title="R2 Key">{img.publicId.length > 50 ? img.publicId.substring(0, 47) + '...' : img.publicId}</p> 
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => move(idx, 'up')} disabled={idx === 0}>
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => move(idx, 'down')} disabled={idx === images.length - 1}>
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(img, idx)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;