import React, { useState, useEffect } from 'react';
import { useUser } from '../services/userService';
import { toast } from 'sonner';
import { 
  User, 
  Settings, 
  Save, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  Palette,
  Bell,
  Shield,
  Trash2
} from 'lucide-react';
import profileService from '../services/profileService';
import themeService from '../services/themeService';
import ThemeSelector from '../components/ui/ThemeSelector';

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
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: user?.displayName || '',
    email: user?.email || '',
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


  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await profileService.updateProfile({
        name: profile.name,
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
      await profileService.changePassword({
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword
      });

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
      await profileService.updateSettings(settings);
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
      await profileService.deleteAccount();
      toast.success('Compte supprimé avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la suppression du compte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-base-content mb-2">Mon Profil</h1>
            <p className="text-base-content/70">Gérez vos informations personnelles et paramètres</p>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs tabs-boxed mb-8">
            <button 
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profil
            </button>
            <button 
              className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </button>
            <button 
              className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Shield className="w-4 h-4 mr-2" />
              Sécurité
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-6">
                  <User className="w-5 h-5" />
                  Informations personnelles
                </h2>
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
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

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <div className="input-group">
                        <span className="bg-base-300">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          className="input input-bordered flex-1"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
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
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Notifications */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Notifications par email</span>
                        <input 
                          type="checkbox" 
                          className="toggle toggle-primary"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
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
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Palette className="w-5 h-5" />
                    Thème de l'application
                  </h2>
                  
                  <div className="space-y-4">
                    <ThemeSelector />
                  </div>
                </div>
              </div>

              {/* Form Settings */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Settings className="w-5 h-5" />
                    Paramètres des formulaires
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Sauvegarde automatique</span>
                      </label>
                      <input 
                        type="checkbox" 
                        className="toggle toggle-primary"
                        checked={settings.autoSave}
                        onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
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

                  <div className="card-actions justify-end mt-6">
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
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title mb-6">
                    <Lock className="w-5 h-5" />
                    Changer le mot de passe
                  </h2>
                  
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="form-control">
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
                          className="btn btn-square btn-outline"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
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
                          className="btn btn-square btn-outline"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="form-control">
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
                          className="btn btn-square btn-outline"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="card-actions justify-end">
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
              <div className="card bg-error/10 border border-error/20 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title text-error mb-6">
                    <Trash2 className="w-5 h-5" />
                    Zone dangereuse
                  </h2>
                  
                  <div className="alert alert-error mb-4">
                    <div>
                      <h3 className="font-bold">Supprimer le compte</h3>
                      <div className="text-xs">Cette action est irréversible. Tous vos formulaires et données seront supprimés.</div>
                    </div>
                  </div>

                  <div className="card-actions justify-end">
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
      </div>
    </div>
  );
};

export default Profile;
