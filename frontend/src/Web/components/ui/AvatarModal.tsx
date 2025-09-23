import React, { useState, useRef } from 'react';
import { X, Upload, User, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  onAvatarSelect,
  currentAvatar
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatars prédéfinis
  const defaultAvatars = [
    'https://i.pinimg.com/1200x/57/c2/47/57c2478055a7806f2bb54ce93d4db47a.jpg',
    'https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg',
    'https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg',
    'https://i.pinimg.com/736x/3f/94/70/3f9470b34a8e3f526dbdb022f9f19cf7.jpg',
    'https://i.pinimg.com/736x/a8/57/00/a85700f3c614f6313750b9d8196c08f5.jpg',
    'https://i.pinimg.com/736x/c0/27/be/c027bec07c2dc08b9df60921dfd539bd.jpg',
    'https://i.pinimg.com/736x/5f/52/f9/5f52f902f7a4b73bc92884f4c66a8e7a.jpg',
    'https://i.pinimg.com/736x/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.jpg',
    'https://i.pinimg.com/736x/68/5c/c7/685cc7f4df78c4ba04729b9f2160ff37.jpg',
    'https://i.pinimg.com/736x/b2/17/b4/b217b4a5e14efdcb686a0c39146d1ee2.jpg',
    'https://i.pinimg.com/736x/46/f0/54/46f054c15b3cd94b7cc8074b19c8c2d0.jpg',
    'https://i.pinimg.com/736x/41/5e/fc/415efcda39955748de741b60e3b8b816.jpg'
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 5MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setSelectedAvatar(result);
      setIsUploading(false);
      toast.success('Image téléchargée avec succès');
    };

    reader.onerror = () => {
      setIsUploading(false);
      toast.error('Erreur lors du téléchargement de l\'image');
    };

    reader.readAsDataURL(file);
  };

  const handleAvatarClick = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleSave = () => {
    if (!selectedAvatar) {
      toast.error('Veuillez sélectionner un avatar');
      return;
    }
    
    onAvatarSelect(selectedAvatar);
    onClose();
    toast.success('Avatar mis à jour avec succès');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="w-5 h-5" />
            Choisir un avatar
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Avatar actuel */}
          {selectedAvatar && (
            <div className="mb-6 text-center">
              <h3 className="text-sm font-medium mb-3">Aperçu</h3>
              <div className="flex justify-center">
                <img
                  src={selectedAvatar}
                  alt="Avatar sélectionné"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
              </div>
            </div>
          )}

          {/* Upload personnalisé */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Télécharger une image personnalisée
            </h3>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className={`btn btn-outline ${isUploading ? 'loading' : ''}`}
                disabled={isUploading}
              >
                {!isUploading && <Upload className="w-4 h-4 mr-2" />}
                {isUploading ? 'Téléchargement...' : 'Choisir une image'}
              </button>
              <p className="text-xs text-base-content/60 mt-2">
                JPG, PNG, GIF jusqu'à 5MB
              </p>
            </div>
          </div>

          {/* Avatars prédéfinis */}
          <div>
            <h3 className="text-sm font-medium mb-3">Avatars prédéfinis</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {defaultAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarClick(avatar)}
                  className={`relative group transition-all duration-200 ${
                    selectedAvatar === avatar
                      ? 'ring-4 ring-primary ring-offset-2 ring-offset-base-100'
                      : 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 hover:ring-offset-base-100'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary-content" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-base-300">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!selectedAvatar}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
