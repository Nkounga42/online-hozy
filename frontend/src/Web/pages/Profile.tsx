import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../services/userService';
import { toast } from 'sonner';
import { API_CONFIG, getAuthToken } from '../services/config';
import {
  User,
  Settings,
  Save,
  Eye,
  EyeOff,
  Palette,
  Bell,
  Shield,
  Trash2,
  Upload,
  FileText,
  Users,
  LogOut,
  RefreshCw,
  Check
} from 'lucide-react';
import themeService from '../services/themeService';
import ThemeSelector from '../components/ui/ThemeSelector';
import Header from '../components/ui/Header';
import AvatarModal from '../components/ui/AvatarModal';

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

interface FormResponse {
  id: string;
  formId: string;
  formTitle: string;
  respondentName?: string;
  respondentEmail?: string;
  submittedAt: string;
  responses: Record<string, string | number | boolean | string[]>;
  isRead: boolean;
}

const Profile = () => {
  const { user, updateUserProfile, changePassword, deleteAccount, updateUserPreferences, logout } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

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

  const [notifications, setNotifications] = useState<FormResponse[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);


  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));

      // Charger les statistiques utilisateur
      loadUserStats();
      
      // Charger les notifications initiales
      loadNotifications(false);
    }
  }, [user]);

  // Vérification périodique des nouvelles notifications
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      loadNotifications(true); // Avec toast pour les nouvelles notifications
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [user, notifications]);

  const loadUserStats = async () => {
    setStatsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('Aucun token d\'authentification trouvé');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_USER_STATS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const statsData = await response.json();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast.error('Impossible de charger les statistiques');

      // Garder des valeurs par défaut en cas d'erreur
      setStats({
        totalForms: 0,
        totalResponses: 0,
        totalViews: 0,
        formsThisMonth: 0,
        responsesThisMonth: 0,
        averageResponseRate: 0,
        mostPopularForm: 'Aucun',
        joinDate: 'Inconnu'
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile({
        displayName: profile.name,
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

  const handleLogout = async () => {
    if (!confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      return;
    }

    setLoading(true);

    try {
      await logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    setLoading(true);
    try {
      await updateUserProfile({ photoURL: avatarUrl });
      toast.success('Avatar mis à jour avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'avatar');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async (showToast = false) => {
    setNotificationsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        console.warn('Aucun token d\'authentification trouvé');
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/forms/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const notificationsData = await response.json();
      
      // Vérifier s'il y a de nouvelles notifications
      if (showToast && notifications.length > 0) {
        const newNotifications = notificationsData.filter(newNotif => 
          !notifications.some(existingNotif => existingNotif.id === newNotif.id)
        );
        
        if (newNotifications.length > 0) {
          newNotifications.forEach(notification => {
            toast.success(`Nouvelle réponse reçue pour "${notification.formTitle}"`, {
              duration: 5000,
              action: {
                label: 'Voir',
                onClick: () => setActiveTab('notifications')
              }
            });
          });
        }
      }
      
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      if (showToast) {
        toast.error('Impossible de charger les notifications');
      }
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await fetch(`${API_CONFIG.BASE_URL}/api/forms/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Header backurl="/" backtext="Retour" />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 bg-base-300 py-10 rounded-xl">
            <div className="">
              <div className=" flex">
                <div className="flex flex-col w-1/4 flex items-center justify-center">
                  <div className="flex flex-col relative">
                    <img
                      src={user?.photoURL || 'https://i.pinimg.com/1200x/69/63/da/6963da5ff0668dbe37478781117eef16.jpg'} alt={user?.displayName || user?.email || ''}
                      className="w-35 h-35 hover:border-5 transition-all duration-00 border-primary rounded-full" />
                    <button 
                      className="btn btn-primary btn-circle  absolute bottom-3 scale-110 left-5/6 -translate-x-1/2"
                      onClick={() => setIsAvatarModalOpen(true)}
                      title="Changer l'avatar"
                    >
                      <Upload className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-center items-start flex-col">
                  <div className="flex flex-col font-bold text-4xl">
                    {profile.name}
                  </div>

                  <div className="flex flex-col ">
                    {profile.email}
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">Mon Profil</h1>
            <p className="text-base-content/70">Gérez vos informations personnelles et paramètres</p>
          </div>
          



          <div className="tabs tabs-boxed border-b border-base-content/30 mb-8">
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
            <button
              className={`tab ${activeTab === 'notifications' ? 'tab-active border-b border-primary text-primary' : ''}`}
              onClick={() => {
                setActiveTab('notifications');
                if (notifications.length === 0) {
                  loadNotifications();
                }
              }}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {notifications.filter(n => !n.isRead).length > 0 && (
                <span className="badge badge-primary badge-sm ml-2">
                  {notifications.filter(n => !n.isRead).length}
                </span>
              )}
            </button>
          </div>
            <div className=" ">


              {activeTab === 'profile' && (
                <div className="space-y-8">
                  {/* Statistiques */}
                  {statsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <span className="ml-3 text-lg">Chargement des statistiques...</span>
                    </div>
                  ) : (
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
                  )}

                  {/* Bouton d'actualisation */}
                  <div className="flex justify-center">
                    <button
                      onClick={loadUserStats}
                      className={`btn btn-outline btn-sm ${statsLoading ? 'loading' : ''}`}
                      disabled={statsLoading}
                    >
                      {!statsLoading && <RefreshCw className="w-4 h-4 mr-2" />}
                      Actualiser les statistiques
                    </button>
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
                <div className="space-y-15">
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
                  <form onSubmit={handleProfileUpdate} className="space-y-4 mb-20" >
                    <h1 className="text-2xl font-bold">Informations personnelles  </h1>
                    <div className="flex  flex-col gap-6">
                      <div className="flex   flex-col">
                        <label className="label">
                          <span className="label-text">Nom complet</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered w-full"
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
                          className="input input-bordered  w-full "
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
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

                  <div className="mt-10">
                    <div className="">
                      <h2 className="flex gap-3 mb-4 font-bold text-2xl">
                        Changer le mot de passe
                      </h2>

                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div className="">
                          <label className="label">
                            <span className="label-text">Mot de passe actuel</span>
                          </label>
                          <div className="input-group relative">
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              className="input input-bordered flex-1 w-full"
                              value={profile.currentPassword}
                              onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
                              required
                            />
                            <button
                              type="button"
                              className=" p-2 absolute right-2 top-1/2 -translate-y-1/2"
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
                          <div className="input-group relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className="input input-bordered flex-1 w-full"
                              value={profile.newPassword}
                              onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
                              required
                            />
                            <button
                              className="p-2 absolute right-2 top-1/2 -translate-y-1/2"
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
                          <div className="input-group relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="input input-bordered flex-1 w-full"
                              value={profile.confirmPassword}
                              onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              required
                            />
                            <button
                              className="p-2 absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex mt-10 justify-end">
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

                  {/* Logout Section */}
                  <div className="mt-20 bg-base-300 border border-base-content/10 rounded-lg flex justify-between p-4 items-center">
                    <div className=' '>
                      <h3 className="font-bold">
                        Déconnexion
                      </h3>
                      <div className="text-sm text-base-content/70 mt-1">
                        Vous déconnecter de votre session actuelle
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleLogout}
                        className={`btn  ${loading ? 'loading' : ''}`}
                        disabled={loading}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="mt-5 text-error bg-error/10 border border-error/20 gap-3 flex  rounded-lg justify-between p-4 items-center">
                    <div>
                      <h3 className="font-bold">Supprimer le compte</h3>
                      <div className="text-xs mt-1">Cette action est irréversible. Tous vos formulaires et données seront supprimés.</div>
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
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <button
                      onClick={() => loadNotifications(false)}
                      className={`btn btn-outline btn-sm ${notificationsLoading ? 'loading' : ''}`}
                      disabled={notificationsLoading}
                    >
                      {!notificationsLoading && <RefreshCw className="w-4 h-4 mr-2" />}
                      Actualiser
                    </button>
                  </div>

                  {notificationsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <span className="loading loading-spinner loading-lg text-primary"></span>
                      <span className="ml-3 text-lg">Chargement des notifications...</span>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                      <h3 className="text-lg font-medium text-base-content/70 mb-2">Aucune notification</h3>
                      <p className="text-base-content/50">Vous n'avez reçu aucune réponse à vos formulaires pour le moment.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                            notification.isRead 
                              ? 'bg-base-100 border-base-300' 
                              : 'bg-primary/5 border-primary/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{notification.formTitle}</h3>
                                {!notification.isRead && (
                                  <span className="badge badge-primary badge-sm">Nouveau</span>
                                )}
                              </div>
                              
                              <div className="text-sm text-base-content/70 mb-3">
                                <div className="flex items-center gap-4">
                                  {notification.respondentName && (
                                    <span>👤 {notification.respondentName}</span>
                                  )}
                                  {notification.respondentEmail && (
                                    <span>📧 {notification.respondentEmail}</span>
                                  )}
                                  <span>🕒 {new Date(notification.submittedAt).toLocaleString('fr-FR')}</span>
                                </div>
                              </div>

                              <div className="bg-base-200 rounded-lg p-3">
                                <h4 className="font-medium mb-2">Réponses :</h4>
                                <div className="space-y-1">
                                  {Object.entries(notification.responses).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                      <span className="font-medium capitalize">{key}:</span>{' '}
                                      <span className="text-base-content/80">
                                        {Array.isArray(value) ? value.join(', ') : String(value)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="btn btn-ghost btn-sm ml-4"
                                title="Marquer comme lu"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

        </div>
      </div>

      {/* Modal de sélection d'avatar */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onAvatarSelect={handleAvatarSelect}
        currentAvatar={user?.photoURL || undefined}
      />
    </div>
  );
};

export default Profile;
