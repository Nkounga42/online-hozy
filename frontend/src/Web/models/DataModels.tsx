// ===== Templates =====
export const templates: Record<
  string,
  () => {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }[]
> = {
  quiz: () => [
    {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
,
      type: "radio",
      label: "Quelle est la capitale de la France ?",
      required: true,
      options: ["Paris", "Lyon", "Marseille"],
    },
  ],
  survey: () => [
    {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
,
      type: "textarea",
      label: "Que pensez-vous de notre service ?",
      required: false,
    },
  ],
  registration: () => [
    {
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
,
      type: "text",
      label: "Nom complet",
      required: true,
    },
    {
      id: `field-${Date.now() + 1}`,
      type: "email",
      label: "Email",
      required: true,
    },
    {
      id: `field-${Date.now() + 2}`,
      type: "date",
      label: "Date de participation",
      required: false,
    },
  ],
  blank: () => [],
};

// ===== Models =====
export class Group {
  id: number;
  title: string;
  description: string;
  forms: Form[] = [];



  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}

export class Field {
  id: string;
  type: string;
  label: string;
  required: boolean;

  constructor(id: string, type: string, label: string, required = false) {
    this.id = id;
    this.type = type;
    this.label = label;
    this.required = required;
  }
}

export class Page {
  order: number;
  title: string;
  fields: Field[];

  constructor(order: number, title: string) {
    this.order = order;
    this.title = title;
    this.fields = [];
  }

  addField(field: Field): void {
    this.fields.push(field);
  }

  removeField(fieldId: string): void {
    this.fields = this.fields.filter(f => f.id !== fieldId);
  }
}

export interface FormSettings {
  collectEmails: boolean;
  allowMultipleResponses: boolean;
  showProgressBar: boolean;
  pageNavigation: boolean;
}

export class Form {
  id: number;
  groupId: number;
  theme: string;
  title: string;
  description: string;
  pages: Page[];
  createdAt: string;
  settings?: FormSettings;

  constructor(id: number, groupId: number, theme: string, title: string, description: string) {
    this.id = id;
    this.groupId = groupId;
    this.theme = theme;
    this.title = title;
    this.description = description;
    this.pages = [];
    this.createdAt = new Date().toISOString().slice(0, 10);
    this.settings = {
      collectEmails: false,
      allowMultipleResponses: true,
      showProgressBar: false,
      pageNavigation: true,
    };
  }

  addPage(page: Page): void {
    this.pages.push(page);
  }

  removePage(order: number): void {
    this.pages = this.pages.filter(p => p.order !== order);
  }
}

// ===== Storage Helper =====
class StorageManager {
  private static readonly GROUPS_KEY = 'form_builder_groups';
  private static readonly FORMS_KEY = 'form_builder_forms';

  static saveGroups(groups: Group[]): void {
    try {
      localStorage.setItem(this.GROUPS_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des groupes:', error);
    }
  }

  static loadGroups(): Group[] {
    try {
      const data = localStorage.getItem(this.GROUPS_KEY);
      if (!data) return [];
      
      const groupsData = JSON.parse(data);
      return groupsData.map((g: any) => new Group(g.id, g.title, g.description));
    } catch (error) {
      console.error('Erreur lors du chargement des groupes:', error);
      return [];
    }
  }

  static saveForms(forms: Form[]): void {
    try {
      localStorage.setItem(this.FORMS_KEY, JSON.stringify(forms));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des formulaires:', error);
    }
  }

  static loadForms(): Form[] {
    try {
      const data = localStorage.getItem(this.FORMS_KEY);
      if (!data) return [];
      
      const formsData = JSON.parse(data);
      return formsData.map((f: any) => {
        const form = new Form(f.id, f.groupId, f.theme, f.title, f.description);
        form.createdAt = f.createdAt;
        form.settings = f.settings;
        
        // Reconstruire les pages avec leurs champs
        form.pages = f.pages.map((p: any) => {
          const page = new Page(p.order, p.title);
          page.fields = p.fields.map((field: any) => 
            new Field(field.id, field.type, field.label, field.required)
          );
          return page;
        });
        
        return form;
      });
    } catch (error) {
      console.error('Erreur lors du chargement des formulaires:', error);
      return [];
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(this.GROUPS_KEY);
      localStorage.removeItem(this.FORMS_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des données:', error);
    }
  }
}

// ===== Projects Manager =====
export class Projects {
  private groups: Group[] = [];
  private forms: Form[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    this.groups = StorageManager.loadGroups();
    this.forms = StorageManager.loadForms();
  }

  private saveToStorage(): void {
    StorageManager.saveGroups(this.groups);
    StorageManager.saveForms(this.forms);
  }

  createGroup(title: string, description: string): Group {
    const newId = Math.max(0, ...this.groups.map(g => g.id)) + 1;
    const group = new Group(newId, title, description);
    this.groups.push(group);
    this.saveToStorage();
    return group;
  }

  readGroup(id: number): Group | undefined {
    return this.groups.find(g => g.id === id);
  }

  updateGroup(id: number, data: Partial<Group>): Group | undefined {
    const group = this.readGroup(id);
    if (group) {
      Object.assign(group, data);
      this.saveToStorage();
    }
    return group;
  }

  deleteGroup(id: number): void {
    this.groups = this.groups.filter(g => g.id !== id);
    // Supprimer aussi tous les formulaires de ce groupe
    this.forms = this.forms.filter(f => f.groupId !== id);
    this.saveToStorage();
  }

  createForm(groupId: number, theme: string, title: string, description: string): Form {
    const newId = Math.max(0, ...this.forms.map(f => f.id)) + 1;
    const form = new Form(newId, groupId, theme, title, description);
    this.forms.push(form);
    this.saveToStorage();
    return form;
  }

  readForm(id: number): Form | undefined {
    return this.forms.find(f => f.id === id);
  }

  updateForm(id: number, data: Partial<Form>): Form | undefined {
    const form = this.readForm(id);
    if (form) {
      Object.assign(form, data);
      this.saveToStorage();
    }
    return form;
  }

  deleteForm(id: number): void {
    this.forms = this.forms.filter(f => f.id !== id);
    this.saveToStorage();
  }

  getAllGroups(): Group[] {
    return this.groups;
  }

  getAllForms(): Form[] {
    return this.forms;
  }

  getFormsByGroup(groupId: number): Form[] {
    return this.forms.filter(f => f.groupId === groupId);
  }

  // Méthode pour vider toutes les données
  clearAllData(): void {
    this.groups = [];
    this.forms = [];
    StorageManager.clearAll();
  }

  // Méthode pour exporter les données
  exportData(): string {
    return JSON.stringify({
      groups: this.groups,
      forms: this.forms,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  // Méthode pour importer les données
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.groups && data.forms) {
        this.groups = data.groups.map((g: any) => new Group(g.id, g.title, g.description));
        this.forms = data.forms.map((f: any) => {
          const form = new Form(f.id, f.groupId, f.theme, f.title, f.description);
          form.createdAt = f.createdAt;
          form.settings = f.settings;
          form.pages = f.pages.map((p: any) => {
            const page = new Page(p.order, p.title);
            page.fields = p.fields.map((field: any) => 
              new Field(field.id, field.type, field.label, field.required)
            );
            return page;
          });
          return form;
        });
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }
}

// ===== User Management =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
  lastLogin: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: 'fr' | 'en';
    notifications: boolean;
    defaultFormTheme: string;
  };
}

export class User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
  lastLogin: string;
  preferences: UserProfile['preferences'];

  constructor(
    id: string,
    name: string,
    email: string,
    role: 'admin' | 'editor' | 'viewer' = 'editor'
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date().toISOString();
    this.lastLogin = new Date().toISOString();
    this.preferences = {
      theme: 'auto',
      language: 'fr',
      notifications: true,
      defaultFormTheme: 'default',
    };
  }

  updateLastLogin(): void {
    this.lastLogin = new Date().toISOString();
  }

  updatePreferences(newPreferences: Partial<UserProfile['preferences']>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
  }
}

// ===== User Storage Helper =====
class UserStorageManager {
  private static readonly USER_KEY = 'form_builder_current_user';
  private static readonly USERS_KEY = 'form_builder_users';

  static saveCurrentUser(user: User): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  }

  static loadCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      if (!data) return null;
      
      const userData = JSON.parse(data);
      const user = new User(userData.id, userData.name, userData.email, userData.role);
      user.avatar = userData.avatar;
      user.createdAt = userData.createdAt;
      user.lastLogin = userData.lastLogin;
      user.preferences = userData.preferences;
      return user;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      return null;
    }
  }

  static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
  }

  static loadUsers(): User[] {
    try {
      const data = localStorage.getItem(this.USERS_KEY);
      if (!data) return [];
      
      const usersData = JSON.parse(data);
      return usersData.map((u: any) => {
        const user = new User(u.id, u.name, u.email, u.role);
        user.avatar = u.avatar;
        user.createdAt = u.createdAt;
        user.lastLogin = u.lastLogin;
        user.preferences = u.preferences;
        return user;
      });
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      return [];
    }
  }

  static clearUser(): void {
    try {
      localStorage.removeItem(this.USER_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
  }
}

// ===== User Manager =====
export class UserManager {
  private currentUser: User | null = null;
  private users: User[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    this.currentUser = UserStorageManager.loadCurrentUser();
    this.users = UserStorageManager.loadUsers();
  }

  private saveToStorage(): void {
    if (this.currentUser) {
      UserStorageManager.saveCurrentUser(this.currentUser);
    }
    UserStorageManager.saveUsers(this.users);
  }

  // Authentification
  login(email: string, name?: string): User {
    // Chercher un utilisateur existant
    let user = this.users.find(u => u.email === email);
    
    if (!user && name) {
      // Créer un nouvel utilisateur
      const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      user = new User(userId, name, email);
      this.users.push(user);
    }
    
    if (user) {
      user.updateLastLogin();
      this.currentUser = user;
      this.saveToStorage();
    }
    
    return user!;
  }

  logout(): void {
    this.currentUser = null;
    UserStorageManager.clearUser();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  // Gestion du profil
  updateProfile(data: Partial<Pick<User, 'name' | 'email' | 'avatar'>>): User | null {
    if (!this.currentUser) return null;
    
    Object.assign(this.currentUser, data);
    this.saveToStorage();
    return this.currentUser;
  }

  updatePreferences(preferences: Partial<UserProfile['preferences']>): User | null {
    if (!this.currentUser) return null;
    
    this.currentUser.updatePreferences(preferences);
    this.saveToStorage();
    return this.currentUser;
  }

  // Gestion des utilisateurs (admin)
  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  updateUserRole(userId: string, role: 'admin' | 'editor' | 'viewer'): User | undefined {
    const user = this.getUserById(userId);
    if (user && this.currentUser?.role === 'admin') {
      user.role = role;
      this.saveToStorage();
    }
    return user;
  }

  deleteUser(userId: string): boolean {
    if (this.currentUser?.role !== 'admin' || userId === this.currentUser.id) {
      return false;
    }
    
    this.users = this.users.filter(u => u.id !== userId);
    this.saveToStorage();
    return true;
  }

  // Permissions
  canEdit(): boolean {
    return this.currentUser?.role === 'admin' || this.currentUser?.role === 'editor';
  }

  canDelete(): boolean {
    return this.currentUser?.role === 'admin';
  }

  canManageUsers(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Statistiques utilisateur
  getUserStats(): {
    totalGroups: number;
    totalForms: number;
    recentActivity: string;
  } | null {
    if (!this.currentUser) return null;
    
    return {
      totalGroups: projects.getAllGroups().length,
      totalForms: projects.getAllForms().length,
      recentActivity: this.currentUser.lastLogin,
    };
  }
}

// ===== Instances globales =====
export const userManager = new UserManager();
// export const projects = new Projects(); 
 export const projects = {
  groups: [] as Group[],
  forms: [] as Form[],

  // === Local Storage ===
   load() {
    const groupsLS = localStorage.getItem("groups");
    const formsLS = localStorage.getItem("forms");

    if (groupsLS) this.groups = JSON.parse(groupsLS);

    if (formsLS) {
      const rawForms: Form[] = JSON.parse(formsLS);
      this.forms = rawForms.map(f => {
        const form = new Form(f.id, f.groupId, f.theme, f.title, f.description);

        form.id = f.id;
        form.pages = f.pages.map(p => {
          const page = new Page(p.order, p.title);
          page.fields = p.fields.map((fd: { id: string; type: string; label: string; required: boolean | undefined; }) => new Field(fd.id, fd.type, fd.label, fd.required));
          return page;
        });
        form.settings = f.settings ;
        return form;
      });
    }
  },

  save() {
    localStorage.setItem("groups", JSON.stringify(this.groups));
    localStorage.setItem("forms", JSON.stringify(this.forms));
  },

  // === Getters ===
  getAllGroups() {
    return this.groups;
  },

  getAllForms() {
    return this.forms;
  },

  readGroup(groupId: number) {
    return this.groups.find((g) => g.id === groupId) || null;
  },

  readForm(formId: number) {
    return this.forms.find((f) => f.id === formId) || null;
  },

  // === CRUD Group ===
  createGroup(title: string, description = ""): Group {
    const newGroup: Group = {
      id: Date.now(),
      title,
      description,
      forms: [] as Form[]
    };
    this.groups.push(newGroup);
    this.save();
    return newGroup;
  },

  updateGroup(groupId: number, data: Partial<Group>) {
    const group = this.groups.find((g) => g.id === groupId);
    if (group) Object.assign(group, data);
    this.save();
  },

  deleteGroup(groupId: number) {
    this.groups = this.groups.filter((g) => g.id !== groupId);
    this.forms = this.forms.filter((f) => f.groupId !== groupId);
    this.save();
  },

  // === CRUD Form ===
  createForm(groupId: number, theme: string, title: string, description = ""): Form {
    const newForm: Form = {
      id: Date.now(),
      groupId,
      theme,
      title,
      description,
      pages: [],
      createdAt: "",
      settings: undefined,
      addPage: function (): void {
        throw new Error("Function not implemented.");
      },
      removePage: function (): void {
        throw new Error("Function not implemented.");
      }
    };
    this.forms.push(newForm);
    this.save();
    return newForm;
  },

  updateForm(formId: number, data: Partial<Form>) {
    const form = this.forms.find((f) => f.id === formId);
    if (form) Object.assign(form, data);
    this.save();
  },

  deleteForm(formId: number) {
    this.forms = this.forms.filter((f) => f.id !== formId);
    this.save();
  },
};


// ===== Helper Functions =====
export const getCurrentUser = () => userManager.getCurrentUser();
export const isLoggedIn = () => userManager.isLoggedIn();
export const canEdit = () => userManager.canEdit();
export const canDelete = () => userManager.canDelete();
export const canManageUsers = () => userManager.canManageUsers();
 
 
export const loadGroupsFromLocalStorage = (): Group[] => {
  return StorageManager.loadGroups();
}

export const loadFormsFromLocalStorage = (): Form[] => {
  return StorageManager.loadForms();
}
