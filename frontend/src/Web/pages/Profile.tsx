import React, { useState, useEffect } from 'react';
import { useUser } from '../services/userService';
import { toast } from 'sonner';
import { 
  User, 
  Settings, 
  Save, 
  Eye, 
  EyeOff, 
  Lock,
  Palette,
  Bell,
  Shield,
  Trash2,
  Upload,
  BarChart3,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import themeService from '../services/themeService';
import ThemeSelector from '../components/ui/ThemeSelector';
import Header from '../components/ui/Header';

interface UserSettings {
  emailNotifications: boolean;
  formNotifications: boolean;
  defaultFormTheme: string;
  autoSave: boolean;
  showPreviewByDefault: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserStats {
  totalForms: number;
  totalResponses: number;
  totalViews: number;
  formsThisMonth: number;
  responsesThisMonth: number;
  averageResponseRate: number;
  mostPopularForm: string;
  joinDate: string;
}

const Profile = () => {
  const { user, updateUserProfile, changePassword, deleteAccount, updateUserPreferences } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    formNotifications: true,
    defaultFormTheme: themeService.getCurrentTheme(),
    autoSave: true,
    showPreviewByDefault: false
  });

  const [stats, setStats] = useState<UserStats>({
    totalForms: 0,
    totalResponses: 0,
    totalViews: 0,
    formsThisMonth: 0,
    responsesThisMonth: 0,
    averageResponseRate: 0,
    mostPopularForm: '',
    joinDate: ''
  });


  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
      
      // Charger les statistiques utilisateur
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      // Simuler des données de statistiques (à remplacer par un vrai appel API)
      const mockStats: UserStats = {
        totalForms: 12,
        totalResponses: 248,
        totalViews: 1456,
        formsThisMonth: 3,
        responsesThisMonth: 67,
        averageResponseRate: 85.2,
        mostPopularForm: "Enquête de satisfaction client",
        joinDate: "Mars 2024"
      };
      
      setStats(mockStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        displayName: profile.name,
        phone: profile.phone,
        email: profile.email
      });

      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.newPassword !== profile.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (profile.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await changePassword(profile.currentPassword, profile.newPassword);

      toast.success('Mot de passe modifié avec succès');
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    setLoading(true);

    try {
      await updateUserPreferences({
        notifications: settings.emailNotifications,
        defaultFormTheme: settings.defaultFormTheme
      });
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour des paramètres');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteAccount = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    setLoading(true);

    try {
      await deleteAccount();
      toast.success('Compte supprimé avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
    <Header backurl="/" backtext="Retour"/>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">Mon Profil</h1>
            <p className="text-base-content/70">Gérez vos informations personnelles et paramètres</p>
          </div>
            <div className="mb-10 bg-base-300 py-10 rounded-xl">
                <div className=""> 
                <div className=" flex">
                  <div className="flex flex-col w-1/4 flex items-center justify-center">
                  <div className="flex flex-col relative">
                    <img  
                      src={user?.photoURL || 'https://i.pinimg.com/1200x/57/c2/47/57c2478055a7806f2bb54ce93d4db47a.jpg'} alt={user?.displayName || user?.email || ''} 
                      className="w-35 h-35 hover:border-5 transition-all duration-00 border-primary rounded-full" />
                    <button className="btn btn-primary btn-circle  absolute bottom-3 scale-110 left-5/6 -translate-x-1/2">
                      <Upload className="w-3 h-3" />
                    </button>
                  </div>  
                  </div>  
                    <div className="flex justify-center items-start flex-col">
                      <div className="flex flex-col font-bold text-xl">
                         {profile.name} 
                      </div>

                      <div className="flex flex-col ">
                         {profile.email} 
                      </div>
                    </div>
 
                </div>
                </div>
              </div>
          <div className="tabs tabs-boxed border-b border-base-200 mb-8">
            <button 
              className={`tab ${activeTab === 'profile' ? 'tab-active border-b border-primary text-primary' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profil
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'tab-active border-b border-primary text-primary' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </button>
            <button 
              className={`tab ${activeTab === 'security' ? 'tab-active border-b border-primary text-primary' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Sécurité
            </button>
          </div>
          <div className="flex gap-10 mb-10">
          <div className="w-2/3">

          
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Statistiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="stat border-none bg-base-300 rounded-lg p-4">
                  <div className="stat-figure text-primary">
                    <FileText className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Formulaires créés</div>
                  <div className="stat-value text-primary">{stats.totalForms}</div>
                  <div className="stat-desc">+{stats.formsThisMonth} ce mois</div>
                </div>

                <div className="stat border-none bg-base-300 rounded-lg p-4">
                  <div className="stat-figure text-secondary">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="stat-title">Réponses reçues</div>
                  <div className="stat-value text-secondary">{stats.totalResponses}</div>
                  <div className="stat-desc">+{stats.responsesThisMonth} ce mois</div>
                </div>

                <div className="stat border-none bg-base-300 rounded-lg p-4">
                  <div className="stat-title">Vues totales</div>
                  <div className="stat-value text-accent">{stats.totalViews.toLocaleString()}</div>
                  <div className="stat-desc">Taux de réponse: {stats.averageResponseRate}%</div>
                </div>

                 
              </div>

              {/* Formulaire le plus populaire
              {stats.mostPopularForm && (
                <div className="alert alert-info">
                  <TrendingUp className="w-6 h-6" />
                  <div>
                    <h3 className="font-bold">Formulaire le plus populaire</h3>
                    <div className="text-xs">{stats.mostPopularForm}</div>
                  </div>
                </div>
              )} */}

              <div>
              
              </div>

              
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div className="">
                <div className="">
                  <h2 className="flex gap-3 mb-3 font-bold">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h2>
                  
                  <div className="space-y-4 mb-10">
                    <div className="">
                      <label className="label cursor-pointer flex justify-between">
                        <span className="label-text">Notifications par email</span>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        />
                      </label>
                    </div>

                    <div className="">
                      <label className="label cursor-pointer  flex justify-between">
                        <span className="label-text">Notifications de formulaires</span>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary"
                          checked={settings.formNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, formNotifications: e.target.checked }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Settings */}
              <div className="">
                <div className="">
                  <h2 className="flex gap-3 font-bold">
                    <Palette className="w-5 h-5" />
                    Thème de l'application
                  </h2>
                  
                  <div className="space-y-4">
                    <ThemeSelector />
                  </div>
                </div>
              </div>

              {/* Form Settings */}
              <div className="">
                <div className="">
                  <h2 className="flex gap-3 mb-6 font-bold">
                    <Settings className="w-5 h-5" />
                    Paramètres des formulaires
                  </h2>
                  
                  <div className="space-y-4 ">
                    <div className="">
                      <label className="label cursor-pointer flex justify-between">
                        <span className="label-text">Sauvegarde automatique</span>
                      
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={settings.autoSave}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                      />
                      </label>
                    </div>

                    <div className="">
                      <label className="label cursor-pointer flex justify-between">
                        <span className="label-text">Afficher l'aperçu par défaut</span>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary"
                          checked={settings.showPreviewByDefault}
                          onChange={(e) => setSettings(prev => ({ ...prev, showPreviewByDefault: e.target.checked }))}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="-actions justify-end mt-10 flex justify-between">
                    <button 
                      onClick={handleSettingsUpdate}
                      className={`btn btn-primary ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              
              <div className="">
                <div className="">
                  <h2 className="flex gap-3 mb-6 font-bold">
                    <Lock className="w-5 h-5" />
                    Changer le mot de passe
                  </h2>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="">
                      <label className="label">
                        <span className="label-text">Mot de passe actuel</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          className="input input-bordered flex-1"
                          value={profile.currentPassword}
                          onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-square btn-ghost"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="">
                      <label className="label">
                        <span className="label-text">Nouveau mot de passe</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          className="input input-bordered flex-1"
                          value={profile.newPassword}
                          onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                        />
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="">
                      <label className="label">
                        <span className="label-text">Confirmer le nouveau mot de passe</span>
                      </label>
                      <div className="input-group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          className="input input-bordered flex-1"
                          value={profile.confirmPassword}
                          onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="-actions justify-end">
                      <button 
                        type="submit" 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Changer le mot de passe
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="mt-20 bg-error/10 border border-error/20 ">
                <div className=" p-4"> 
                  <div className="mb-6 text-error ">
                    <div>
                      <h3 className="font-bold">Supprimer le compte</h3>
                      <div className="text-xs">Cette action est irréversible. Tous vos formulaires et données seront supprimés.</div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={handleDeleteAccount}
                      className={`btn btn-error ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
          <form onSubmit={handleProfileUpdate} className="space-y-4 w-1/3">
                <h1 className="text-2xl font-bold">Informations personnelles  </h1>
                    <div className="flex  flex-col gap-6">
                    <div className="flex gap-6">
                      <div className="flex   flex-col">
                        <label className="label">
                          <span className="label-text">Nom complet</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={profile.name}
                          onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="flex  flex-col ">
                        <label className="label">
                          <span className="label-text">Email</span>
                        </label> 
                          <input
                            type="email"
                            className="input input-bordered  "
                            value={profile.email}
                            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                            required
                          />
                      </div>
                      </div>

                      <div className="flex flex-col ">
                        <label className="label">
                          <span className="label-text">Téléphone</span>
                        </label> 
                          <input
                            type="tel"
                            className="input input-bordered  "
                            value={profile.phone}
                            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                            required
                          />
                      </div>
                    </div>

                    <div className="-actions justify-end">
                      <button 
                        type="submit" 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </button>
                    </div>
                  </form> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
