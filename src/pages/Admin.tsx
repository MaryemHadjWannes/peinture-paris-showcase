import React, { useState, useEffect, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash, Upload, MoveUp, MoveDown } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

interface Category {
  name: string;
  id: string;
  maxImages: number;
}

const CATEGORIES: Category[] = [
  { name: 'Enduit Professionnel', id: 'enduit', maxImages: 20 },
  { name: 'Peinture Intérieure', id: 'peinture-interieure', maxImages: 20 },
  { name: 'Escalier & Détails', id: 'escalier-details', maxImages: 20 },
  { name: 'Avant', id: 'avant', maxImages: 20 },
  { name: 'Après', id: 'apres', maxImages: 20 },
];

interface Image {
  url: string;
  filename: string;
  publicId: string;
}

const getInitialOrder = (): Record<string, string[]> => {
  const saved = localStorage.getItem('portfolioImageOrder');
  return saved ? JSON.parse(saved) : {};
};

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imagesByCat, setImagesByCat] = useState<Record<string, Image[]>>({});
  const [imageOrder, setImageOrder] = useState<Record<string, string[]>>(getInitialOrder());
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [isDragging, setIsDragging] = useState<string | null>(null);

  const fetchImages = useCallback(async (category: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/images/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { files }: { files: Image[] } = await res.json();
      const savedOrder = imageOrder[category] || [];
      const fileMap = new Map(files.map(f => [f.publicId, f]));
      const validOrder = savedOrder.filter(id => fileMap.has(id));
      const newFiles = files.filter(f => !validOrder.includes(f.publicId));
      const ordered = [
        ...validOrder.map(id => fileMap.get(id)!),
        ...newFiles,
      ];
      setImagesByCat(prev => ({ ...prev, [category]: ordered }));
      setImageOrder(prev => ({ ...prev, [category]: ordered.map(i => i.publicId) }));
    } catch (err) {
      console.error('Error fetching images:', err);
      toast({ title: 'Erreur', description: 'Impossible de charger les images', variant: 'destructive' });
    }
  }, [token, toast]);

  useEffect(() => {
    if (token) {
      CATEGORIES.forEach(cat => fetchImages(cat.id));
    }
  }, [token, fetchImages]);

  useEffect(() => {
    localStorage.setItem('portfolioImageOrder', JSON.stringify(imageOrder));
  }, [imageOrder]);

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
    } catch {
      toast({ title: 'Erreur', description: 'Identifiants incorrects', variant: 'destructive' });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = e.target.files;
    if (!files?.length) return;
    const cat = CATEGORIES.find(c => c.id === category);
    if (!cat) return;
    const current = imagesByCat[category] || [];
    if (current.length + files.length > cat.maxImages) {
      toast({
        title: 'Limite dépassée',
        description: `Maximum ${cat.maxImages} images`,
        variant: 'destructive',
      });
      return;
    }
    setIsUploading(prev => ({ ...prev, [category]: true }));
    const uploaded: Image[] = [];
    for (let i = 0; i < files.length; i++) {
      const fd = new FormData();
      fd.append('image', files[i]);
      fd.append('category', category);
      try {
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (!res.ok) throw new Error('Upload failed');
        const json = await res.json();
        uploaded.push({
          url: json.url,
          filename: json.filename,
          publicId: json.publicId,
        });
        toast({ title: 'Succès', description: `${files[i].name} → ${json.filename}` });
      } catch (err) {
        toast({ title: 'Erreur', description: `Échec upload ${files[i].name}`, variant: 'destructive' });
      }
    }
    const newImages = [...current, ...uploaded];
    setImagesByCat(prev => ({ ...prev, [category]: newImages }));
    setImageOrder(prev => ({ ...prev, [category]: newImages.map(i => i.publicId) }));
    setIsUploading(prev => ({ ...prev, [category]: false }));
    e.target.value = '';
  };

  const handleDelete = async (img: Image, category: string, idx: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/delete/${encodeURIComponent(img.publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Delete failed');
      const newImgs = imagesByCat[category].filter((_, i) => i !== idx);
      setImagesByCat(prev => ({ ...prev, [category]: newImgs }));
      setImageOrder(prev => ({ ...prev, [category]: newImgs.map(i => i.publicId) }));
      toast({ title: 'Supprimé', description: img.filename });
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de supprimer', variant: 'destructive' });
    }
  };

  const updateOrder = (category: string, updated: Image[]) => {
    setImagesByCat(prev => ({ ...prev, [category]: updated }));
    setImageOrder(prev => ({ ...prev, [category]: updated.map(i => i.publicId) }));
  };

  const move = (category: string, idx: number, dir: 'up' | 'down') => {
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === imagesByCat[category].length - 1)) return;
    const copy = [...imagesByCat[category]];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    updateOrder(category, copy);
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, category: string, idx: number) => {
    e.dataTransfer.setData('text/plain', `${category}|${idx}`);
    setIsDragging(category);
  };

  const onDragOver = (e: DragEvent) => e.preventDefault();

  const onDrop = (e: DragEvent<HTMLDivElement>, category: string, dropIdx: number) => {
    e.preventDefault();
    const [srcCat, dragIdxStr] = e.dataTransfer.getData('text/plain').split('|');
    const dragIdx = Number(dragIdxStr);
    if (srcCat !== category || dragIdx === dropIdx) return;
    const copy = [...imagesByCat[category]];
    const [moved] = copy.splice(dragIdx, 1);
    copy.splice(dropIdx, 0, moved);
    updateOrder(category, copy);
    setIsDragging(null);
  };

  const onDragEnd = () => setIsDragging(null);

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
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Mot de passe</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
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

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#0A2543]">Admin – Portfolio</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('portfolioImageOrder');
            setToken('');
            setImagesByCat({});
            toast({ title: 'Déconnexion' });
          }}
        >
          Déconnexion
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {CATEGORIES.map(cat => {
          const images = imagesByCat[cat.id] || [];
          const count = images.length;
          const max = cat.maxImages;
          const uploading = isUploading[cat.id];
          return (
            <Card key={cat.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-[#0A2543]">{cat.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {count}/{max} images {count >= max && '(limite atteinte)'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="mx-auto h-7 w-7 text-muted-foreground mb-2" />
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading || count >= max}
                    onChange={e => handleUpload(e, cat.id)}
                    className="mt-1"
                  />
                  {uploading && <Loader2 className="mx-auto h-5 w-5 animate-spin mt-2" />}
                  {count >= max && <p className="text-sm text-destructive mt-2">Limite atteinte</p>}
                  {(cat.id === 'avant' || cat.id === 'apres') && (
                    <p className="text-xs text-muted-foreground mt-2">
                      ID généré automatiquement : <code className="bg-gray-200 px-1 rounded">{cat.id}-xyz123.jpg</code>
                    </p>
                  )}
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <Label>Images (glisser pour réordonner)</Label>
                  {images.length === 0 ? (
                    <p className="text-center text-muted-foreground py-6">Aucune image</p>
                  ) : (
                    images.map((img, idx) => (
                      <div
                        key={img.publicId}
                        draggable
                        onDragStart={e => onDragStart(e, cat.id, idx)}
                        onDragOver={onDragOver}
                        onDrop={e => onDrop(e, cat.id, idx)}
                        onDragEnd={onDragEnd}
                        className={`flex items-center gap-3 p-3 border rounded-lg bg-card cursor-grab transition-opacity ${
                          isDragging === cat.id ? 'opacity-50' : ''
                        } active:cursor-grabbing`}
                      >
                        <img src={img.url} alt="" className="w-14 h-14 object-cover rounded" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{img.filename}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {img.publicId.split('/').pop()}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => move(cat.id, idx, 'up')} disabled={idx === 0}>
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => move(cat.id, idx, 'down')} disabled={idx === images.length - 1}>
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(img, cat.id, idx)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;