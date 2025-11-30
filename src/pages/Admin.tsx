import React, { useState, useEffect, useCallback, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash, Upload, MoveUp, MoveDown, Check } from 'lucide-react';

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
  { name: 'Avant / Après', id: 'avant-apres', maxImages: 40 },
];

interface Image {
  url: string;
  filename: string;
  publicId: string;
}

// COMPRESSION FORTE SANS CHANGER DE FORMAT (JPG/PNG seulement)
const compressImageKeepFormat = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_SIZE = 1600;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const quality = 0.80; // 80% → très bon compromis (0.75 si tu veux encore plus petit)
      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression échouée'));
          const ext = file.type === 'image/png' ? '.png' : '.jpg';
          const newName = file.name.replace(/\.[^/.]+$/, '') + ext;
          const compressedFile = new File([blob], newName, {
            type: mimeType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        mimeType,
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

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
  const [pendingPair, setPendingPair] = useState<{ avant?: Image; apres?: Image }>({});

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
      const ordered = [...validOrder.map(id => fileMap.get(id)!), ...newFiles];

      setImagesByCat(prev => ({ ...prev, [category]: ordered }));
      setImageOrder(prev => ({ ...prev, [category]: ordered.map(i => i.publicId) }));
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les images', variant: 'destructive' });
    }
  }, [token, toast, imageOrder]);

  useEffect(() => {
    if (token) CATEGORIES.forEach(cat => fetchImages(cat.id));
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
      if (!res.ok) throw new Error();
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setToken(token);
      toast({ title: 'Connecté !' });
    } catch {
      toast({ title: 'Erreur', description: 'Identifiants incorrects', variant: 'destructive' });
    }
  };

  // UPLOAD UNIVERSEL AVEC COMPRESSION FORTE (JPG/PNG seulement)
  const handleUploadWithCompression = async (
    files: FileList | null,
    category: string,
    type?: 'avant' | 'apres'
  ) => {
    if (!files?.length) return;

    const cat = CATEGORIES.find(c => c.id === category);
    if (!cat) return;

    const current = imagesByCat[category] || [];
    if (current.length + files.length > cat.maxImages) {
      toast({ title: 'Limite atteinte', description: `Maximum ${cat.maxImages} images`, variant: 'destructive' });
      return;
    }

    const uploadKey = type ? `${category}-${type}` : category;
    setIsUploading(prev => ({ ...prev, [uploadKey]: true }));

    const uploaded: Image[] = [];

    for (let i = 0; i < files.length; i++) {
      let fileToUpload: File = files[i];

      // Compression automatique si > 800 Ko (ou toujours si tu veux)
      if (fileToUpload.size > 800 * 1024) {
        toast({ title: 'Compression...', description: fileToUpload.name });
        try {
          fileToUpload = await compressImageKeepFormat(files[i]);
          const reduction = ((files[i].size - fileToUpload.size) / files[i].size * 100).toFixed(0);
          toast({
            title: 'Compressé !',
            description: `${(files[i].size / 1024 / 1024).toFixed(1)} Mo → ${(fileToUpload.size / 1024 / 1024).toFixed(1)} Mo (-${reduction}%)`,
          });
        } catch (err) {
          console.warn('Compression échouée, envoi original', err);
        }
      }

      const fd = new FormData();
      fd.append('image', fileToUpload);
      fd.append('category', category);

      const ext = fileToUpload.type === 'image/png' ? '.png' : '.jpg';
      const tempId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
      const filename = type ? `${type}-temp-${tempId}${ext}` : `${category}-${tempId}${ext}`;
      fd.append('filename', filename);

      try {
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || 'Upload failed');
        }

        const json = await res.json();
        const uploadedImg: Image = {
          url: json.url,
          filename: json.filename,
          publicId: json.publicId,
        };

        uploaded.push(uploadedImg);

        if (type) {
          setPendingPair(prev => ({ ...prev, [type]: uploadedImg }));
          toast({ title: `${type.toUpperCase()} prêt !`, description: 'En attente de confirmation' });
        } else {
          toast({ title: 'Uploadé !', description: json.filename });
        }
      } catch (err) {
        console.error(err);
        toast({ title: 'Échec upload', description: fileToUpload.name, variant: 'destructive' });
      }
    }

    const newImages = [...current, ...uploaded];
    setImagesByCat(prev => ({ ...prev, [category]: newImages }));
    setImageOrder(prev => ({ ...prev, [category]: newImages.map(i => i.publicId) }));
    setIsUploading(prev => ({ ...prev, [uploadKey]: false }));
  };

  // CONFIRMER PAIRE
  const confirmPair = async (category: string) => {
    if (!pendingPair.avant || !pendingPair.apres) {
      toast({ title: 'Manquant', description: 'Il faut avant + après', variant: 'destructive' });
      return;
    }
    const pairId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    setIsUploading(prev => ({ ...prev, [`${category}-confirm`]: true }));

    try {
      const rename = async (img: Image, type: 'avant' | 'apres') => {
        const ext = img.filename.split('.').pop();
        const newName = `${type}-${pairId}.${ext}`;
        const res = await fetch(`${API_BASE}/api/admin/rename`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: img.publicId, newFilename: newName, category }),
        });
        if (!res.ok) throw new Error();
        return await res.json();
      };

      const [avantNew, apresNew] = await Promise.all([
        rename(pendingPair.avant, 'avant'),
        rename(pendingPair.apres, 'apres'),
      ]);

      await Promise.all(
        [pendingPair.avant.publicId, pendingPair.apres.publicId].map(id =>
          fetch(`${API_BASE}/api/admin/delete/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );

      const current = imagesByCat[category] || [];
      const filtered = current.filter(img => ![pendingPair.avant!.publicId, pendingPair.apres!.publicId].includes(img.publicId));
      const updated = [...filtered, avantNew, apresNew].map(i => ({ ...i, publicId: i.publicId }));

      setImagesByCat(prev => ({ ...prev, [category]: updated }));
      setImageOrder(prev => ({ ...prev, [category]: updated.map(i => i.publicId) }));
      setPendingPair({});
      toast({ title: 'Paire confirmée !', description: `ID: ${pairId}` });
    } catch {
      toast({ title: 'Erreur', description: 'Confirmation échouée', variant: 'destructive' });
    } finally {
      setIsUploading(prev => ({ ...prev, [`${category}-confirm`]: false }));
    }
  };

  const handleDelete = async (img: Image, category: string, idx: number) => {
    try {
      await fetch(`${API_BASE}/api/admin/delete/${encodeURIComponent(img.publicId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const newImgs = imagesByCat[category].filter((_, i) => i !== idx);
      setImagesByCat(prev => ({ ...prev, [category]: newImgs }));
      setImageOrder(prev => ({ ...prev, [category]: newImgs.map(i => i.publicId) }));
      toast({ title: 'Supprimé' });
    } catch {
      toast({ title: 'Erreur suppression', variant: 'destructive' });
    }
  };

  const move = (category: string, idx: number, dir: 'up' | 'down') => {
    const images = imagesByCat[category];
    if ((dir === 'up' && idx === 0) || (dir === 'down' && idx === images.length - 1)) return;
    const copy = [...images];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setImagesByCat(prev => ({ ...prev, [category]: copy }));
    setImageOrder(prev => ({ ...prev, [category]: copy.map(i => i.publicId) }));
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
    setImagesByCat(prev => ({ ...prev, [category]: copy }));
    setImageOrder(prev => ({ ...prev, [category]: copy.map(i => i.publicId) }));
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
              <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><Label>Mot de passe</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <Button type="submit" className="w-full bg-[#0A2543] hover:bg-[#DF271C]">Se connecter</Button>
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
        <Button variant="outline" onClick={() => { localStorage.clear(); setToken(''); setImagesByCat({}); toast({ title: 'Déconnecté' }); }}>
          Déconnexion
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {CATEGORIES.map(cat => {
          const images = imagesByCat[cat.id] || [];
          const uploadingNormal = isUploading[cat.id];
          const uploadingAvant = isUploading[`${cat.id}-avant`];
          const uploadingApres = isUploading[`${cat.id}-apres`];
          const confirming = isUploading[`${cat.id}-confirm`];

          return (
            <Card key={cat.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-[#0A2543]">{cat.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{images.length}/{cat.maxImages} images</p>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* AVANT / APRÈS */}
                {cat.id === 'avant-apres' ? (
                  <div className="space-y-6">
                    <Card className="border-2 border-green-500">
                      <CardHeader>
                        <div className="flex gap-3">
                          <Badge variant="outline" className={pendingPair.avant ? 'bg-green-100' : 'bg-gray-100'}>
                            {pendingPair.avant ? 'Avant prêt' : 'Avant manquant'}
                          </Badge>
                          <Badge variant="outline" className={pendingPair.apres ? 'bg-blue-100' : 'bg-gray-100'}>
                            {pendingPair.apres ? 'Après prêt' : 'Après manquant'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={() => confirmPair(cat.id)}
                          disabled={!pendingPair.avant || !pendingPair.apres || confirming}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {confirming ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                          CONFIRMER LA PAIRE
                        </Button>
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-green-600 mb-3" />
                        <Input
                          type="file" accept="image/*" multiple
                          disabled={uploadingAvant || images.length >= cat.maxImages}
                          onChange={e => handleUploadWithCompression(e.target.files, cat.id, 'avant')}
                          className="cursor-pointer"
                        />
                        {uploadingAvant && <Loader2 className="mx-auto mt-3 h-6 w-6 animate-spin" />}
                        <p className="text-xs text-green-600 mt-2 font-medium">Photo AVANT</p>
                      </div>
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                        <Upload className="mx-auto h-8 w-8 text-blue-600 mb-3" />
                        <Input
                          type="file" accept="image/*" multiple
                          disabled={uploadingApres || images.length >= cat.maxImages}
                          onChange={e => handleUploadWithCompression(e.target.files, cat.id, 'apres')}
                          className="cursor-pointer"
                        />
                        {uploadingApres && <Loader2 className="mx-auto mt-3 h-6 w-6 animate-spin" />}
                        <p className="text-xs text-blue-600 mt-2 font-medium">Photo APRÈS</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
                    <Input
                      type="file" accept="image/*" multiple
                      disabled={uploadingNormal || images.length >= cat.maxImages}
                      onChange={e => handleUploadWithCompression(e.target.files, cat.id)}
                      className="cursor-pointer"
                    />
                    {uploadingNormal && <Loader2 className="mx-auto mt-4 h-8 w-8 animate-spin" />}
                  </div>
                )}

                {/* LISTE IMAGES */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <Label>Images ({images.length}) – glisser pour réordonner</Label>
                  {images.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Aucune image</p>
                  ) : (
                    images.map((img, idx) => {
                      const isAvant = img.filename.startsWith('avant-');
                      const isApres = img.filename.startsWith('apres-');
                      return (
                        <div
                          key={img.publicId}
                          draggable
                          onDragStart={e => onDragStart(e, cat.id, idx)}
                          onDragOver={onDragOver}
                          onDrop={e => onDrop(e, cat.id, idx)}
                          onDragEnd={onDragEnd}
                          className={`flex items-center gap-3 p-3 border rounded-lg bg-card cursor-grab active:cursor-grabbing transition-opacity ${isDragging === cat.id ? 'opacity-50' : ''}`}
                        >
                          <img src={img.url} alt="" className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{img.filename}</p>
                            {cat.id === 'avant-apres' && (
                              <p className={`text-xs font-bold ${isAvant ? 'text-green-600' : isApres ? 'text-blue-600' : ''}`}>
                                {isAvant ? 'AVANT' : isApres ? 'APRÈS' : ''}
                              </p>
                            )}
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
                      );
                    })
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