# Service Utilisateur - Documentation

## Vue d'ensemble

Le service utilisateur fournit une gestion complète de l'authentification et des informations utilisateur dans toute l'application. Il utilise React Context pour partager l'état de l'utilisateur entre tous les composants et se connecte à votre backend personnalisé.

## Composants principaux

### 1. UserProvider
Le composant principal qui enveloppe l'application et fournit le contexte utilisateur.

```tsx
import { UserProvider } from './services/userService';

function App() {
  return (
    <UserProvider>
      {/* Votre application ici */}
    </UserProvider>
  );
}
```

### 2. useUser Hook
Hook principal pour accéder aux fonctionnalités du service utilisateur.

```tsx
import { useUser } from './services/userService';

function MonComposant() {
  const { user, login, logout, loading } = useUser();
  
  // Utiliser les fonctions et l'état
}
```

### 3. Hooks spécialisés
Hooks utilitaires pour des cas d'usage spécifiques.

```tsx
import { useUserInfo, useUserBasic, useUserPermissions } from '../hooks/useUserInfo';

function MonComposant() {
  const userInfo = useUserInfo();
  const basicInfo = useUserBasic();
  const permissions = useUserPermissions();
}
```

## Fonctionnalités disponibles

### Authentification
- **Connexion** : `login(email, password, rememberMe?)`
- **Inscription** : `register(email, password, displayName)`
- **Déconnexion** : `logout()`

### Gestion du profil
- **Mise à jour du profil** : `updateUserProfile(data)`
- **Mise à jour des préférences** : `updateUserPreferences(preferences)`

### Informations utilisateur
- Données de base (id, email, nom d'affichage)
- Photo de profil
- Rôle et permissions
- Date de création et dernière connexion
- Préférences personnalisées

## Structure des données utilisateur

```typescript
interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
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
```

## Système de rôles et permissions

### Rôles disponibles
- **admin** : Accès complet à toutes les fonctionnalités
- **editor** : Peut créer, modifier et supprimer des formulaires
- **viewer** : Peut uniquement consulter les formulaires

### Vérifications de permissions
```tsx
const { canEditForms, canDeleteForms, canManageUsers } = useUserInfo();

if (canEditForms) {
  // Afficher les boutons d'édition
}

if (canDeleteForms) {
  // Afficher les boutons de suppression
}
```

## Utilisation dans les composants

### Affichage des informations utilisateur
```tsx
import UserProfile from './components/ui/UserProfile';

function Header() {
  return (
    <header>
      <UserProfile />
    </header>
  );
}
```

### Affichage détaillé des informations
```tsx
import UserInfoDisplay from './components/ui/UserInfoDisplay';

function ProfilePage() {
  return (
    <div>
      <h1>Mon Profil</h1>
      <UserInfoDisplay />
    </div>
  );
}
```

### Bouton de connexion/déconnexion
```tsx
import LoginButton from './components/ui/LoginButton';

function Navigation() {
  return (
    <nav>
      <LoginButton />
    </nav>
  );
}
```

## Configuration de l'API

Le service se connecte à votre backend via l'URL configurée dans `API_BASE_URL`.

### Endpoints utilisés
- **Connexion** : `POST /api/users/login`
- **Inscription** : `POST /api/users/register`
- **Profil utilisateur** : `GET /api/users/me`
- **Mise à jour profil** : `PUT /api/users/profile`
- **Mise à jour préférences** : `PUT /api/users/preferences`
- **Déconnexion** : `POST /api/users/logout` (optionnel)

### Gestion des tokens
- **localStorage** : Pour "Se souvenir de moi"
- **sessionStorage** : Pour la session courante
- **Authorization Header** : `Bearer {token}`

## Persistance des données

Le service utilise votre backend pour l'authentification et le localStorage pour la persistance des données utilisateur.

### Sauvegarde automatique
- Les informations utilisateur sont automatiquement sauvegardées dans le localStorage
- Synchronisation avec votre backend lors des changements d'état d'authentification

### Fonctions utilitaires
```tsx
import { 
  getUserFromLocalStorage, 
  saveUserToLocalStorage, 
  clearUserFromLocalStorage,
  isAuthenticated
} from './services/userService';

// Récupérer l'utilisateur depuis le localStorage
const user = getUserFromLocalStorage();

// Sauvegarder l'utilisateur dans le localStorage
saveUserToLocalStorage(user);

// Supprimer l'utilisateur du localStorage
clearUserFromLocalStorage();

// Vérifier si l'utilisateur est connecté
const connected = isAuthenticated();
```

## Gestion des erreurs

Le service gère automatiquement les erreurs d'authentification et les affiche dans les composants.

```tsx
const { login } = useUser();

try {
  await login(email, password, rememberMe);
} catch (error) {
  // L'erreur est automatiquement gérée et affichée
  console.error('Erreur de connexion:', error);
}
```

## Exemples d'utilisation avancée

### Protection de routes
```tsx
import { useUser } from './services/userService';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user, loading } = useUser();
  
  if (loading) return <div>Chargement...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
}
```

### Affichage conditionnel basé sur les permissions
```tsx
import { useUserPermissions } from '../hooks/useUserInfo';

function FormActions() {
  const { canEdit, canDelete } = useUserPermissions();
  
  return (
    <div>
      {canEdit && <button>Modifier</button>}
      {canDelete && <button>Supprimer</button>}
    </div>
  );
}
```

### Personnalisation basée sur les préférences utilisateur
```tsx
import { useUserInfo } from '../hooks/useUserInfo';

function ThemeProvider() {
  const { theme } = useUserInfo();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  return null;
}
```

## Configuration du backend

Assurez-vous que votre backend expose les endpoints suivants :

### Endpoint de connexion
```javascript
POST /api/users/login
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}

// Réponse attendue
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Nom Utilisateur",
    "role": "editor",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLogin": "2024-01-01T00:00:00.000Z"
  }
}
```

### Endpoint d'inscription
```javascript
POST /api/users/register
{
  "name": "Nom Utilisateur",
  "email": "user@example.com",
  "password": "password123",
  "id": "user_id_generated"
}

// Réponse attendue
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Nom Utilisateur",
    "role": "editor",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Endpoint de vérification du statut
```javascript
GET /api/users/me
Authorization: Bearer {token}

// Réponse attendue
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "Nom Utilisateur",
  "role": "editor",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z"
}
```

## Support et maintenance

Pour toute question ou problème avec le service utilisateur, consultez :
1. Les logs de la console pour les erreurs
2. Le localStorage pour vérifier la persistance des données
3. Les réponses de votre API backend
4. La configuration des endpoints dans le service
