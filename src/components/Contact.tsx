import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Facebook,
  Instagram,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: '',
    photos: [] as File[],
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, ...newPhotos],
      }));
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Replace with your Formspree endpoint after signup (see below)
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdkwzzlz';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('project', formData.project);
    data.append('message', formData.message);
    // Formspree supports file uploads on paid plans, but for free plan, just send text fields

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
        },
      });
      if (res.ok) {
        toast({
          title: 'Message envoyé !',
          description: 'Nous vous recontacterons dans les plus brefs délais.',
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          project: '',
          message: '',
          photos: [],
        });
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible d’envoyer le message. Veuillez réessayer.',
        });
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Impossible d’envoyer le message. Veuillez réessayer.',
      });
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 06 02 22 80 01',
      subtitle: 'Lun-Ven 8h-18h',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'hn.renovation.fr@gmail.com',
      subtitle: 'Réponse sous 24h',
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '103 rue Saint Ladre',
      subtitle: '59400 Cambrai, France',
    },
    {
      icon: Clock,
      title: 'Horaires',
      content: 'Lundi - Vendredi',
      subtitle: '8h00 - 18h00',
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61576234322277', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-4 sm:mb-6">
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <span className="text-accent font-medium text-sm sm:text-base">
                Contactez-Nous
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 sm:mb-6">
              Démarrons Votre
              <span className="block text-accent">Projet Ensemble</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Prêt à transformer votre espace ? Contactez-nous pour un devis gratuit
              et personnalisé. Notre équipe est à votre écoute.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Form */}
            <Card className="shadow-medium border-border/50">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl font-heading text-primary">
                  Demande de Devis
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Replace the Formspree endpoint in handleSubmit with your real endpoint after signup! */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Votre nom"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="votre@email.com"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+33 06 02 22 80 01"
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project">Type de projet</Label>
                      <Input
                        id="project"
                        name="project"
                        value={formData.project}
                        onChange={handleChange}
                        placeholder="Ex: Peinture intérieure"
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Description du projet *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Décrivez votre projet en détail..."
                      rows={4}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  {/* File upload is not supported on Formspree free plan. Remove for now. */}
                  {/* <div className="space-y-2">
                    <Label htmlFor="photos">Photos de votre maison / projet</Label>
                    <Input
                      id="photos"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="text-sm sm:text-base"
                    />
                    {formData.photos.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 sm:gap-3">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`preview ${index}`}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              aria-label={`Supprimer la photo ${index + 1}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div> */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto hover-lift px-6 sm:px-8"
                  >
                    Envoyer la Demande
                    <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6 sm:space-y-8">
              <div className="grid gap-4 sm:gap-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="hover-lift border-border/50">
                      <CardContent className="flex items-center space-x-4 p-4 sm:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-full flex items-center justify-center">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-primary text-base sm:text-lg mb-1">
                            {info.title}
                          </h3>
                          <p className="text-foreground text-sm sm:text-base">
                            {info.content}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {info.subtitle}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Social Links */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="font-heading font-semibold text-primary text-base sm:text-lg mb-3 sm:mb-4">
                    Suivez-Nous
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                    Découvrez nos dernières réalisations sur nos réseaux sociaux
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="hover-lift w-full sm:w-auto px-4 sm:px-6"
                          asChild
                        >
                          <a href={social.href} target="_blank" rel="noopener noreferrer">
                            <IconComponent className="h-4 w-4 mr-2" />
                            {social.label}
                          </a>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;