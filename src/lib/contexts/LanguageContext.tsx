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
    'welcome': 'Bienvenue',
    'assigned.tickets': 'Tickets Assignés',
    
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
    'ticket.search': 'Rechercher des tickets...',
    'ticket.estimated.hours': 'Heures estimées',
    'ticket.actual.hours': 'Heures réelles',
    'ticket.coordinates': 'Coordonnées',
    'ticket.tags': 'Tags',
    
    // Status
    'status.open': 'Ouvert',
    'status.inProgress': 'En cours',
    'status.onHold': 'En attente',
    'status.completed': 'Terminé',
    'status.all': 'Tous les statuts',
    
    // Priority
    'priority.low': 'Basse',
    'priority.medium': 'Moyenne',
    'priority.high': 'Haute',
    'priority.all': 'Toutes les priorités',
    
    // Product Types
    'product.type': 'Type de produit',
    'product.fixe': 'Fixe',
    'product.adsl': 'ADSL',
    'product.gpon': 'GPON',
    'product.all': 'Tous les produits',
    
    // Notifications
    'notifications': 'Notifications',
    'no.notifications': 'Aucune notification',
    'mark.as.read': 'Marquer comme lu',
    'notification.new': 'Nouvelle notification',
    'notification.deadline': 'Date limite approchante',
    'notification.urgent': 'Ticket urgent',
    'notification.assignment': 'Attribution de ticket',
    'notification.status': 'Changement de statut',
    
    // Stats
    'stats.overview': 'Vue d\'ensemble',
    'stats.performance': 'Performance',
    'stats.total': 'Total',
    'stats.active.technicians': 'Techniciens actifs',
    'stats.completion.rate': 'Taux de complétion',
    'stats.daily.tickets': 'Tickets quotidiens',
    'stats.monthly.overview': 'Aperçu mensuel',
    'stats.deadline.performance': 'Performance des délais',
    'stats.before.deadline': 'Avant échéance',
    'stats.after.deadline': 'Après échéance',
    'stats.on.time': 'À temps',
    'stats.late': 'En retard',
    'stats.average.resolution': 'Temps moyen de résolution',
    'stats.tickets.completed': 'Tickets complétés',
    
    // Actions
    'action.cancel': 'Annuler',
    'action.save': 'Enregistrer',
    'action.confirm': 'Confirmer',
    'action.edit': 'Modifier',
    'action.delete': 'Supprimer',
    'action.assign': 'Assigner',
    'action.reassign': 'Réassigner',
    'action.search': 'Rechercher',
    'action.filter': 'Filtrer',
    
    // Messages
    'message.confirm.delete': 'Êtes-vous sûr de vouloir supprimer ce ticket ?',
    'message.loading': 'Chargement...',
    'message.no.results': 'Aucun résultat trouvé',
    'message.error': 'Une erreur est survenue',
    'message.success': 'Opération réussie',
    
    // Location
    'location.search': 'Rechercher un emplacement',
    'location.select': 'Sélectionner un emplacement',
    'location.current': 'Position actuelle',
    'location.instructions': 'Cliquez sur la carte ou recherchez un emplacement'
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
    'welcome': 'Welcome',
    'assigned.tickets': 'Assigned Tickets',
    
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
    'ticket.search': 'Search tickets...',
    'ticket.estimated.hours': 'Estimated Hours',
    'ticket.actual.hours': 'Actual Hours',
    'ticket.coordinates': 'Coordinates',
    'ticket.tags': 'Tags',
    
    // Status
    'status.open': 'Open',
    'status.inProgress': 'In Progress',
    'status.onHold': 'On Hold',
    'status.completed': 'Completed',
    'status.all': 'All Statuses',
    
    // Priority
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    'priority.all': 'All Priorities',
    
    // Product Types
    'product.type': 'Product Type',
    'product.fixe': 'Fixed',
    'product.adsl': 'ADSL',
    'product.gpon': 'GPON',
    'product.all': 'All Products',
    
    // Notifications
    'notifications': 'Notifications',
    'no.notifications': 'No notifications',
    'mark.as.read': 'Mark as read',
    'notification.new': 'New notification',
    'notification.deadline': 'Approaching deadline',
    'notification.urgent': 'Urgent ticket',
    'notification.assignment': 'Ticket assignment',
    'notification.status': 'Status change',
    
    // Stats
    'stats.overview': 'Overview',
    'stats.performance': 'Performance',
    'stats.total': 'Total',
    'stats.active.technicians': 'Active Technicians',
    'stats.completion.rate': 'Completion Rate',
    'stats.daily.tickets': 'Daily Tickets',
    'stats.monthly.overview': 'Monthly Overview',
    'stats.deadline.performance': 'Deadline Performance',
    'stats.before.deadline': 'Before Deadline',
    'stats.after.deadline': 'After Deadline',
    'stats.on.time': 'On Time',
    'stats.late': 'Late',
    'stats.average.resolution': 'Average Resolution Time',
    'stats.tickets.completed': 'Tickets Completed',
    
    // Actions
    'action.cancel': 'Cancel',
    'action.save': 'Save',
    'action.confirm': 'Confirm',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.assign': 'Assign',
    'action.reassign': 'Reassign',
    'action.search': 'Search',
    'action.filter': 'Filter',
    
    // Messages
    'message.confirm.delete': 'Are you sure you want to delete this ticket?',
    'message.loading': 'Loading...',
    'message.no.results': 'No results found',
    'message.error': 'An error occurred',
    'message.success': 'Operation successful',
    
    // Location
    'location.search': 'Search for a location',
    'location.select': 'Select location',
    'location.current': 'Current location',
    'location.instructions': 'Click on the map or search for a location'
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