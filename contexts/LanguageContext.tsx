import React, { createContext, useContext, useState } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Auth
    'welcome.back': 'Bienvenue !',
    'create.account': 'Créer un compte',
    'sign.in': 'Se connecter',
    'sign.up': 'S\'inscrire',
    'email': 'Email',
    'password': 'Mot de passe',
    'name': 'Nom',
    
    // Dashboard
    'tickets.management': 'Gestion des Tickets',
    'new.ticket': 'Nouveau Ticket',
    'sign.out': 'Déconnexion',
    'total.tickets': 'Total des Tickets',
    'due.today': 'À faire aujourd\'hui',
    'overdue': 'En retard',
    'completed': 'Terminés',
    
    // Ticket Form
    'ticket.title': 'Titre',
    'ticket.description': 'Description',
    'ticket.location': 'Emplacement',
    'ticket.technician': 'Technicien',
    'ticket.priority': 'Priorité',
    'ticket.status': 'Statut',
    'ticket.dueDate': 'Date limite',
    'ticket.create': 'Créer un Ticket',
    'ticket.update': 'Modifier le Ticket',
    'ticket.delete': 'Supprimer',
    
    // Status
    'status.open': 'Ouvert',
    'status.inProgress': 'En cours',
    'status.onHold': 'En attente',
    'status.completed': 'Terminé',
    
    // Priority
    'priority.low': 'Basse',
    'priority.medium': 'Moyenne',
    'priority.high': 'Haute',
    
    // Product Types
    'product.fixe': 'Fixe',
    'product.adsl': 'ADSL',
    'product.gpon': 'GPON',
    
    // Notifications
    'notifications': 'Notifications',
    'no.notifications': 'Aucune notification',
    
    // Stats
    'performance.overview': 'Aperçu des performances',
    'daily.tickets': 'Tickets quotidiens',
    'deadline.performance': 'Performance des délais',
    'before.deadline': 'Avant échéance',
    'after.deadline': 'Après échéance',
  },
  en: {
    // Auth
    'welcome.back': 'Welcome Back!',
    'create.account': 'Create Account',
    'sign.in': 'Sign In',
    'sign.up': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    
    // Dashboard
    'tickets.management': 'Tickets Management',
    'new.ticket': 'New Ticket',
    'sign.out': 'Sign Out',
    'total.tickets': 'Total Tickets',
    'due.today': 'Due Today',
    'overdue': 'Overdue',
    'completed': 'Completed',
    
    // Ticket Form
    'ticket.title': 'Title',
    'ticket.description': 'Description',
    'ticket.location': 'Location',
    'ticket.technician': 'Technician',
    'ticket.priority': 'Priority',
    'ticket.status': 'Status',
    'ticket.dueDate': 'Due Date',
    'ticket.create': 'Create Ticket',
    'ticket.update': 'Update Ticket',
    'ticket.delete': 'Delete',
    
    // Status
    'status.open': 'Open',
    'status.inProgress': 'In Progress',
    'status.onHold': 'On Hold',
    'status.completed': 'Completed',
    
    // Priority
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    
    // Product Types
    'product.fixe': 'Fixed',
    'product.adsl': 'ADSL',
    'product.gpon': 'GPON',
    
    // Notifications
    'notifications': 'Notifications',
    'no.notifications': 'No notifications',
    
    // Stats
    'performance.overview': 'Performance Overview',
    'daily.tickets': 'Daily Tickets',
    'deadline.performance': 'Deadline Performance',
    'before.deadline': 'Before Deadline',
    'after.deadline': 'After Deadline',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};