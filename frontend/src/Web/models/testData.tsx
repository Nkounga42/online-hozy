// test-data-generator.ts
import { 
  projects, 
  userManager, 
  User,  
  Page, 
  Field 
} from '../models/DataModels';

// ===== Données de test pour les utilisateurs =====
export function createTestUsers() {
  console.log('🔧 Création des utilisateurs de test...');

  // Admin principal
  const admin = userManager.login('admin@formbuilder.com', 'Alexandre Dubois');
  if (admin) {
    admin.role = 'admin';
    admin.avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';
    admin.preferences = {
      theme: 'dark',
      language: 'fr',
      notifications: true,
      defaultFormTheme: 'corporate'
    };
    userManager.updateProfile({
      name: 'Alexandre Dubois (Admin)',
      avatar: admin.avatar
    });
    userManager.updatePreferences(admin.preferences);
  }

  // Éditeur
  const editor = new User(
    'user-editor-001',
    'Sophie Martin',
    'sophie.martin@formbuilder.com',
    'editor'
  );
  editor.avatar = 'https://images.unsplash.com/photo-1494790108755-2616b52bf04b?w=150&h=150&fit=crop&crop=face';
  editor.preferences = {
    theme: 'light',
    language: 'fr',
    notifications: true,
    defaultFormTheme: 'business'
  };

  // Viewer
  const viewer = new User(
    'user-viewer-001',
    'Thomas Leroy',
    'thomas.leroy@formbuilder.com',
    'viewer'
  );
  viewer.avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
  viewer.preferences = {
    theme: 'auto',
    language: 'fr',
    notifications: false,
    defaultFormTheme: 'default'
  };

  // Designer
  const designer = new User(
    'user-designer-001',
    'Emma Rousseau',
    'emma.rousseau@formbuilder.com',
    'editor'
  );
  designer.avatar = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face';
  designer.preferences = {
    theme: 'light',
    language: 'en',
    notifications: true,
    defaultFormTheme: 'luxury'
  };

  console.log('✅ Utilisateurs créés:', { admin: admin?.name, editor: editor.name, viewer: viewer.name, designer: designer.name });
}

// ===== Données de test pour les groupes et formulaires =====
export function createTestData() {
  console.log('📝 Création des données de test...');

  // Groupe 1: Marketing & Communication
  const marketingGroup = projects.createGroup(
    '📢 Marketing & Communication',
    'Formulaires pour les campagnes marketing, enquêtes clients et événements'
  );

  // Formulaire 1: Enquête de satisfaction client
  const satisfactionForm = projects.createForm(
    marketingGroup.id,
    'business',
    '🌟 Enquête de Satisfaction Client 2024',
    'Aidez-nous à améliorer nos services en répondant à cette enquête rapide'
  );

  const page1 = new Page(1, 'Informations personnelles');
  page1.addField(new Field('field-name', 'text', 'Nom complet', true));
  page1.addField(new Field('field-email', 'email', 'Adresse email', true));
  page1.addField(new Field('field-company', 'text', 'Entreprise', false));
  page1.addField(new Field('field-role', 'select', 'Fonction', false));

  const page2 = new Page(2, 'Évaluation du service');
  page2.addField(new Field('field-rating', 'radio', 'Note globale de satisfaction', true));
  page2.addField(new Field('field-recommend', 'radio', 'Recommanderiez-vous nos services ?', true));
  page2.addField(new Field('field-feedback', 'textarea', 'Commentaires et suggestions', false));

  satisfactionForm.addPage(page1);
  satisfactionForm.addPage(page2);
  satisfactionForm.settings = {
    collectEmails: true,
    allowMultipleResponses: false,
    showProgressBar: true,
    pageNavigation: true
  };

  // Formulaire 2: Inscription événement
  const eventForm = projects.createForm(
    marketingGroup.id,
    'corporate',
    '🎪 Inscription Conférence Tech 2024',
    'Inscrivez-vous à notre conférence annuelle sur les nouvelles technologies'
  );

  const eventPage = new Page(1, 'Inscription');
  eventPage.addField(new Field('event-name', 'text', 'Nom et prénom', true));
  eventPage.addField(new Field('event-email', 'email', 'Email professionnel', true));
  eventPage.addField(new Field('event-phone', 'tel', 'Téléphone', false));
  eventPage.addField(new Field('event-company', 'text', 'Entreprise', true));
  eventPage.addField(new Field('event-position', 'text', 'Poste occupé', false));
  eventPage.addField(new Field('event-experience', 'select', 'Années d\'expérience', false));
  eventPage.addField(new Field('event-interests', 'checkbox', 'Sujets d\'intérêt', false));
  eventPage.addField(new Field('event-dietary', 'textarea', 'Régimes alimentaires particuliers', false));

  eventForm.addPage(eventPage);

  // Groupe 2: Ressources Humaines
  const hrGroup = projects.createGroup(
    '👥 Ressources Humaines',
    'Formulaires RH: recrutement, évaluations, formations et enquêtes internes'
  );

  // Formulaire 3: Candidature emploi
  const jobForm = projects.createForm(
    hrGroup.id,
    'luxury',
    '💼 Candidature - Développeur Full Stack',
    'Postulez pour rejoindre notre équipe de développement'
  );

  const jobPage1 = new Page(1, 'Informations personnelles');
  jobPage1.addField(new Field('job-firstname', 'text', 'Prénom', true));
  jobPage1.addField(new Field('job-lastname', 'text', 'Nom de famille', true));
  jobPage1.addField(new Field('job-email', 'email', 'Email', true));
  jobPage1.addField(new Field('job-phone', 'tel', 'Téléphone', true));
  jobPage1.addField(new Field('job-address', 'textarea', 'Adresse complète', false));
  jobPage1.addField(new Field('job-linkedin', 'url', 'Profil LinkedIn', false));
  jobPage1.addField(new Field('job-portfolio', 'url', 'Portfolio / GitHub', false));

  const jobPage2 = new Page(2, 'Expérience professionnelle');
  jobPage2.addField(new Field('job-experience', 'select', 'Années d\'expérience', true));
  jobPage2.addField(new Field('job-current-role', 'text', 'Poste actuel', false));
  jobPage2.addField(new Field('job-skills', 'checkbox', 'Compétences techniques', true));
  jobPage2.addField(new Field('job-languages', 'checkbox', 'Langages de programmation', true));
  jobPage2.addField(new Field('job-frameworks', 'checkbox', 'Frameworks maîtrisés', false));

  const jobPage3 = new Page(3, 'Motivation');
  jobPage3.addField(new Field('job-motivation', 'textarea', 'Lettre de motivation', true));
  jobPage3.addField(new Field('job-salary', 'number', 'Prétentions salariales (€)', false));
  jobPage3.addField(new Field('job-start-date', 'date', 'Date de disponibilité', true));
  jobPage3.addField(new Field('job-remote', 'radio', 'Télétravail souhaité', true));

  jobForm.addPage(jobPage1);
  jobForm.addPage(jobPage2);
  jobForm.addPage(jobPage3);
  jobForm.settings = {
    collectEmails: true,
    allowMultipleResponses: false,
    showProgressBar: true,
    pageNavigation: true
  };

  // Formulaire 4: Évaluation annuelle
  const evaluationForm = projects.createForm(
    hrGroup.id,
    'default',
    '📊 Évaluation Annuelle des Performances',
    'Auto-évaluation et objectifs pour l\'année à venir'
  );

  const evalPage1 = new Page(1, 'Bilan de l\'année');
  evalPage1.addField(new Field('eval-achievements', 'textarea', 'Principales réalisations', true));
  evalPage1.addField(new Field('eval-challenges', 'textarea', 'Difficultés rencontrées', false));
  evalPage1.addField(new Field('eval-skills-rating', 'radio', 'Auto-évaluation des compétences', true));

  const evalPage2 = new Page(2, 'Objectifs futurs');
  evalPage2.addField(new Field('eval-goals', 'textarea', 'Objectifs pour l\'année prochaine', true));
  evalPage2.addField(new Field('eval-training', 'checkbox', 'Formations souhaitées', false));
  evalPage2.addField(new Field('eval-career', 'textarea', 'Évolution de carrière envisagée', false));

  evaluationForm.addPage(evalPage1);
  evaluationForm.addPage(evalPage2);

  // Groupe 3: Éducation & Formation
  const educationGroup = projects.createGroup(
    '🎓 Éducation & Formation',
    'Formulaires éducatifs: inscriptions, évaluations, feedback de formation'
  );

  // Formulaire 5: Inscription formation
  const trainingForm = projects.createForm(
    educationGroup.id,
    'retro',
    '🚀 Formation React & TypeScript',
    'Inscrivez-vous à notre formation intensive de 5 jours'
  );

  const trainingPage = new Page(1, 'Inscription formation');
  trainingPage.addField(new Field('training-name', 'text', 'Nom complet', true));
  trainingPage.addField(new Field('training-email', 'email', 'Email', true));
  trainingPage.addField(new Field('training-level', 'radio', 'Niveau actuel en développement', true));
  trainingPage.addField(new Field('training-experience', 'checkbox', 'Technologies déjà utilisées', false));
  trainingPage.addField(new Field('training-expectations', 'textarea', 'Attentes de la formation', false));
  trainingPage.addField(new Field('training-schedule', 'radio', 'Créneaux préférés', true));

  trainingForm.addPage(trainingPage);

  // Formulaire 6: Quiz technique
  const quizForm = projects.createForm(
    educationGroup.id,
    'cyberpunk',
    '🧠 Quiz JavaScript Avancé',
    'Testez vos connaissances en JavaScript moderne'
  );

  const quizPage1 = new Page(1, 'Questions fondamentales');
  quizPage1.addField(new Field('quiz-q1', 'radio', 'Quelle est la différence entre let et var ?', true));
  quizPage1.addField(new Field('quiz-q2', 'radio', 'Comment fonctionne le hoisting ?', true));
  quizPage1.addField(new Field('quiz-q3', 'checkbox', 'Quelles sont les méthodes d\'array ES6+ ?', true));

  const quizPage2 = new Page(2, 'JavaScript moderne');
  quizPage2.addField(new Field('quiz-q4', 'radio', 'Qu\'est-ce qu\'une Promise ?', true));
  quizPage2.addField(new Field('quiz-q5', 'radio', 'Comment utiliser async/await ?', true));
  quizPage2.addField(new Field('quiz-q6', 'textarea', 'Expliquez les closures', true));

  quizForm.addPage(quizPage1);
  quizForm.addPage(quizPage2);
  quizForm.settings = {
    collectEmails: true,
    allowMultipleResponses: true,
    showProgressBar: true,
    pageNavigation: false
  };

  // Groupe 4: Santé & Bien-être
  const healthGroup = projects.createGroup(
    '🏥 Santé & Bien-être',
    'Formulaires médicaux, enquêtes de santé et questionnaires bien-être'
  );

  // Formulaire 7: Questionnaire santé
  const healthForm = projects.createForm(
    healthGroup.id,
    'emerald',
    '🩺 Questionnaire de Santé Préventive',
    'Évaluation de votre état de santé général'
  );

  const healthPage = new Page(1, 'Informations de santé');
  healthPage.addField(new Field('health-age', 'number', 'Âge', true));
  healthPage.addField(new Field('health-gender', 'radio', 'Genre', false));
  healthPage.addField(new Field('health-conditions', 'checkbox', 'Conditions médicales actuelles', false));
  healthPage.addField(new Field('health-medications', 'textarea', 'Médicaments pris régulièrement', false));
  healthPage.addField(new Field('health-allergies', 'textarea', 'Allergies connues', false));
  healthPage.addField(new Field('health-exercise', 'radio', 'Fréquence d\'exercice', false));
  healthPage.addField(new Field('health-diet', 'radio', 'Type d\'alimentation', false));
  healthPage.addField(new Field('health-sleep', 'radio', 'Qualité du sommeil', false));

  healthForm.addPage(healthPage);

  console.log('✅ Données de test créées:');
  console.log(`📁 Groupes: ${projects.getAllGroups().length}`);
  console.log(`📋 Formulaires: ${projects.getAllForms().length}`);
  console.log('📊 Détail des formulaires:');
  projects.getAllForms().forEach(form => {
    const totalFields = form.pages.reduce((sum, page) => sum + page.fields.length, 0);
    console.log(`  • ${form.title}: ${form.pages.length} page(s), ${totalFields} champ(s)`);
  });
}

// ===== Fonction pour générer des réponses de test =====
export function createTestResponses() {
  console.log('📝 Génération de réponses de test...');
  
  // Simuler des réponses pour quelques formulaires
  const responses = [
    {
      formId: 1,
      responses: {
        'field-name': 'Jean Dupont',
        'field-email': 'jean.dupont@email.com',
        'field-company': 'TechCorp SARL',
        'field-rating': 'Très satisfait',
        'field-recommend': 'Oui, certainement',
        'field-feedback': 'Excellent service, équipe très professionnelle.'
      },
      submittedAt: '2024-01-15T10:30:00Z',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      formId: 2,
      responses: {
        'event-name': 'Marie Dubois',
        'event-email': 'marie.dubois@startup.io',
        'event-company': 'InnovateLab',
        'event-position': 'CTO',
        'event-experience': '5-10 ans',
        'event-interests': ['IA & Machine Learning', 'Cloud Computing', 'Cybersécurité']
      },
      submittedAt: '2024-01-16T14:22:00Z',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  ];

  // Sauvegarder les réponses (vous pourriez étendre votre système pour gérer cela)
  localStorage.setItem('form_builder_responses', JSON.stringify(responses));
  console.log(`✅ ${responses.length} réponses de test générées`);
}

// ===== Fonction principale pour tout initialiser =====
export function initializeTestData() {
  console.log('🚀 Initialisation complète des données de test...');
  
  try {
    createTestUsers();
    createTestData();
    createTestResponses();
    
    console.log('🎉 Toutes les données de test ont été créées avec succès !');
    console.log('📋 Résumé:');
    console.log(`  👥 Utilisateurs: 4`);
    console.log(`  📁 Groupes: ${projects.getAllGroups().length}`);
    console.log(`  📋 Formulaires: ${projects.getAllForms().length}`);
    console.log(`  📊 Réponses: 2`);
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création des données de test:', error);
    return false;
  }
}

// ===== Fonction pour nettoyer toutes les données =====
export function clearAllTestData() {
  console.log('🧹 Suppression de toutes les données de test...');
  
  
  userManager.logout();
  localStorage.removeItem('form_builder_responses');
  localStorage.removeItem('form_builder_users');
  localStorage.removeItem('form_builder_current_user');
  
  console.log('✅ Toutes les données ont été supprimées');
}

// ===== Script d'exécution =====
if (typeof window !== 'undefined') {
  // Ajouter les fonctions au window pour les utiliser dans la console
  (window as any).initTestData = initializeTestData;
  (window as any).clearTestData = clearAllTestData;
  (window as any).projects = projects;
  (window as any).userManager = userManager;
  
  console.log('🔧 Fonctions de test disponibles:');
  console.log('  • initTestData() - Créer toutes les données de test');
  console.log('  • clearTestData() - Supprimer toutes les données');
  console.log('  • projects - Accès à l\'instance projects');
  console.log('  • userManager - Accès à l\'instance userManager');
}

export default {
  initializeTestData,
  clearAllTestData,
  createTestUsers,
  createTestData,
  createTestResponses
};
 