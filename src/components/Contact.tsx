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
  Linkedin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Nous vous recontacterons dans les plus brefs délais.",
    });
    setFormData({ name: '', email: '', phone: '', project: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "+33 1 23 45 67 89",
      subtitle: "Lun-Ven 8h-18h"
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@peinturepro.fr",
      subtitle: "Réponse sous 24h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "123 Rue de la Peinture",
      subtitle: "75001 Paris, France"
    },
    {
      icon: Clock,
      title: "Horaires",
      content: "Lundi - Vendredi",
      subtitle: "8h00 - 18h00"
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
              <Mail className="h-5 w-5 text-accent" />
              <span className="text-accent font-medium">Contactez-Nous</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {t('contactTitle')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('contactDescription')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-medium border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-heading text-primary">
                  Demande de Devis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('yourName')}
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
                        placeholder={t('yourEmail')}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('yourPhone')}
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
                      placeholder={t('projectDetails')}
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full hover-lift">
                    {t('sendMessage')}
                    <Send className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid gap-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <Card key={index} className="hover-lift border-border/50">
                      <CardContent className="flex items-center space-x-4 p-6">
                        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-heading font-semibold text-primary mb-1">
                            {info.title}
                          </h3>
                          <p className="text-foreground">{info.content}</p>
                          <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Social Links */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-heading font-semibold text-primary mb-4">
                    Suivez-Nous
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Découvrez nos dernières réalisations sur nos réseaux sociaux
                  </p>
                  <div className="flex justify-center space-x-4">
                    {socialLinks.map((social, index) => {
                      const IconComponent = social.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="hover-lift"
                        >
                          <IconComponent className="h-4 w-4 mr-2" />
                          {social.label}
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