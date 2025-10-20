// src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// HARDCODED DATA - This will be saved in localStorage
const getInitialData = () => {
  const saved = localStorage.getItem('adminData');
  if (saved) return JSON.parse(saved);
  
  // Default hardcoded data
  return {
    portfolio: {
      projects: [
        {
          title: "Enduit Professionnel",
          category: "enduit",
          description: "Surfaces parfaitement préparées et ratissées pour des finitions impeccables.",
          images: [
            { url: "/photos/ENDUIT/enduit8.webp", publicId: "enduit8" },
            { url: "/photos/ENDUIT/enduit1.webp", publicId: "enduit1" },
          ],
          tags: ["Finition lisse", "Ratissage", "Calicot"]
        },
        {
          title: "Peinture Intérieure",
          category: "peinture",
          description: "Finitions soignées et durables avec peintures écologiques.",
          images: [{ url: "/photos/PEINTURE INTERIEUR/interieur1.webp", publicId: "interieur1" }],
          tags: ["Couleurs", "Décoration", "Confort"]
        }
      ],
      avant_apres: [
        {
          title: "Couloir",
          before: { url: "/photos/AVANT-APRES/avant-couloir.jpeg", publicId: "avant-couloir" },
          after: { url: "/photos/AVANT-APRES/apres-couloir.jpeg", publicId: "apres-couloir" }
        }
      ]
    },
    contact: {
      email: "hn.renovation.fr@gmail.com",
      phone: "+33 06 02 22 80 01",
      address: "103 rue Saint Ladre, 59400 Cambrai, France"
    },
    about: {
      description: "HN Rénovation transforme vos espaces avec passion et précision. Nous apportons innovation et excellence à chaque projet."
    },
    services: [
      { title: "Enduit Professionnel", description: "Préparation parfaite des surfaces avec des enduits de haute qualité" },
      { title: "Peinture Intérieure", description: "Revitalisez vos espaces intérieurs avec des finitions soignées" },
      { title: "Peinture Extérieure", description: "Protégez et embellissez vos façades avec des revêtements résistants" },
      { title: "Plâtrerie et Finition", description: "Solutions complètes pour plâtrerie et aménagements décoratifs" }
    ]
  };
};

const Admin: React.FC = () => {
  const { toast } = useToast();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(getInitialData());

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('adminData', JSON.stringify(data));
  }, [data]);

  // Login mutation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === process.env.EMAIL_USER && password === process.env.EMAIL_PASS) {
      const token = 'hardcoded-admin-token-123';
      localStorage.setItem('token', token);
      setToken(token);
      toast({ title: 'Connexion réussie' });
    } else {
      toast({ title: 'Erreur', description: 'Identifiants incorrects', variant: 'destructive' });
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[350px] shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#0A2543]">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-[#0A2543]">Email</Label>
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#0A2543] focus:ring-[#DF271C]"
                />
              </div>
              <div>
                <Label className="text-[#0A2543]">Mot de passe</Label>
                <Input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#0A2543] focus:ring-[#DF271C]"
                />
              </div>
              <Button
                type="submit"
                className="bg-[#0A2543] text-white hover:bg-[#DF271C] transition-colors w-full"
              >
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#0A2543]">Panneau d'Administration</h1>
        <Button
          variant="outline"
          onClick={() => {
            localStorage.removeItem('token');
            setToken('');
            toast({ title: 'Déconnexion réussie' });
          }}
        >
          Déconnexion
        </Button>
      </div>

      <Tabs defaultValue="portfolio" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="about">À propos</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <PortfolioEditor data={data} setData={setData} toast={toast} />
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-6">
          <ContactEditor data={data} setData={setData} toast={toast} />
        </TabsContent>
        
        <TabsContent value="about" className="space-y-6">
          <AboutEditor data={data} setData={setData} toast={toast} />
        </TabsContent>
        
        <TabsContent value="services" className="space-y-6">
          <ServicesEditor data={data} setData={setData} toast={toast} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Portfolio Editor Component
const PortfolioEditor: React.FC<{
  data: any;
  setData: (data: any) => void;
  toast: any;
}> = ({ data, setData, toast }) => {
  const [newImage, setNewImage] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    const publicId = `temp-${Date.now()}-${file.name}`;
    
    setData({
      ...data,
      portfolio: {
        ...data.portfolio,
        projects: [
          ...data.portfolio.projects,
          {
            title: `Nouveau Projet ${data.portfolio.projects.length + 1}`,
            category: '',
            description: '',
            images: [{ url, publicId }],
            tags: []
          }
        ]
      }
    });
    toast({ title: 'Image ajoutée' });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const updateProject = (index: number, updates: Partial<any>) => {
    const newProjects = [...data.portfolio.projects];
    newProjects[index] = { ...newProjects[index], ...updates };
    setData({ ...data, portfolio: { ...data.portfolio, projects: newProjects } });
  };

  const deleteImage = (projectIndex: number, imageIndex: number) => {
    const newProjects = [...data.portfolio.projects];
    newProjects[projectIndex].images.splice(imageIndex, 1);
    if (newProjects[projectIndex].images.length === 0) {
      newProjects.splice(projectIndex, 1);
    }
    setData({ ...data, portfolio: { ...data.portfolio, projects: newProjects } });
  };

  const addTag = (projectIndex: number) => {
    const newProjects = [...data.portfolio.projects];
    newProjects[projectIndex].tags.push('');
    setData({ ...data, portfolio: { ...data.portfolio, projects: newProjects } });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#0A2543]">Portfolio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragging ? 'border-accent bg-accent/10' : 'border-border'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setDragging(true)}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p className="text-muted-foreground mb-2">Glissez-déposez une image ou</p>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
            className="mt-2"
          />
        </div>

        {/* Projects */}
        {data.portfolio.projects.map((project: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="grid gap-4">
              <Input
                placeholder="Titre"
                value={project.title}
                onChange={(e) => updateProject(index, { title: e.target.value })}
              />
              <Input
                placeholder="Catégorie"
                value={project.category}
                onChange={(e) => updateProject(index, { category: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={project.description}
                onChange={(e) => updateProject(index, { description: e.target.value })}
              />
              
              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag: string, tagIndex: number) => (
                    <div key={tagIndex} className="flex gap-1">
                      <Input
                        value={tag}
                        onChange={(e) => {
                          const newTags = [...project.tags];
                          newTags[tagIndex] = e.target.value;
                          updateProject(index, { tags: newTags });
                        }}
                        className="w-20"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          const newTags = project.tags.filter((_: any, i: number) => i !== tagIndex);
                          updateProject(index, { tags: newTags });
                        }}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addTag(index)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Tag
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div>
                <Label>Images</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {project.images.map((img: any, imgIndex: number) => (
                    <div key={imgIndex} className="relative group">
                      <img src={img.url} alt="Project" className="w-full h-24 object-cover rounded" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => deleteImage(index, imgIndex)}
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

// Contact Editor Component
const ContactEditor: React.FC<{
  data: any;
  setData: (data: any) => void;
  toast: any;
}> = ({ data, setData }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#0A2543]">Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Email"
          value={data.contact.email}
          onChange={(e) => setData({
            ...data,
            contact: { ...data.contact, email: e.target.value }
          })}
        />
        <Input
          placeholder="Téléphone"
          value={data.contact.phone}
          onChange={(e) => setData({
            ...data,
            contact: { ...data.contact, phone: e.target.value }
          })}
        />
        <Textarea
          placeholder="Adresse"
          value={data.contact.address}
          onChange={(e) => setData({
            ...data,
            contact: { ...data.contact, address: e.target.value }
          })}
        />
      </CardContent>
    </Card>
  );
};

// About Editor Component
const AboutEditor: React.FC<{
  data: any;
  setData: (data: any) => void;
  toast: any;
}> = ({ data, setData }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#0A2543]">À propos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Description"
          value={data.about.description}
          onChange={(e) => setData({
            ...data,
            about: { ...data.about, description: e.target.value }
          })}
          rows={5}
        />
      </CardContent>
    </Card>
  );
};

// Services Editor Component
const ServicesEditor: React.FC<{
  data: any;
  setData: (data: any) => void;
  toast: any;
}> = ({ data, setData }) => {
  const addService = () => {
    setData({
      ...data,
      services: [...data.services, { title: '', description: '' }]
    });
  };

  const updateService = (index: number, field: 'title' | 'description', value: string) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setData({ ...data, services: newServices });
  };

  const deleteService = (index: number) => {
    const newServices = data.services.filter((_: any, i: number) => i !== index);
    setData({ ...data, services: newServices });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-[#0A2543]">Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.services.map((service: any, index: number) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold">Service {index + 1}</h4>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteService(index)}
              >
                <Trash className="h-3 w-3" />
              </Button>
            </div>
            <Input
              placeholder="Titre"
              value={service.title}
              onChange={(e) => updateService(index, 'title', e.target.value)}
              className="mb-2"
            />
            <Textarea
              placeholder="Description"
              value={service.description}
              onChange={(e) => updateService(index, 'description', e.target.value)}
              rows={2}
            />
          </Card>
        ))}
        <Button onClick={addService} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Ajouter un Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default Admin;