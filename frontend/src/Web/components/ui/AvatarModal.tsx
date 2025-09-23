import React, { useState, useRef } from 'react';
import { X, Upload, User, Check } from 'lucide-react';
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
    'https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg',
    'https://i.pinimg.com/1200x/ee/92/9e/ee929e0bbe3aab099de19cad53b8589a.jpg',
    'https://i.pinimg.com/1200x/af/6d/89/af6d89aea587cf7b19fbdb8922983631.jpg',
    'https://i.pinimg.com/1200x/ab/1f/af/ab1fafdb38572e90b0cb13549c524965.jpg',
    'https://i.pinimg.com/1200x/e0/b4/5c/e0b45c584ce2d990e15b958cc60471cf.jpg',
    'https://i.pinimg.com/736x/34/b0/80/34b08036352cb1a2385671f8db1db23f.jpg',
    'https://i.pinimg.com/1200x/97/51/f6/9751f62506b0f108e9f3df3f24e6950b.jpg',
    'https://i.pinimg.com/1200x/16/cb/98/16cb98b59156cd1da3cb0bb988ac91b3.jpg',
    'https://i.pinimg.com/1200x/e5/f8/17/e5f817e58c1be041906e2b89ce8bc75c.jpg',
    'https://i.pinimg.com/1200x/92/c1/9c/92c19cb9e5302f2cad856f36493ab0a3.jpg',
    'https://i.pinimg.com/736x/2a/6f/2c/2a6f2c8c9aed14591d6517ad9e0a6adc.jpg',
    'https://i.pinimg.com/736x/5f/19/b7/5f19b796b97cc55061f415d2f249a579.jpg',
    'https://i.pinimg.com/736x/37/80/17/378017b2b5497a9cecbc60901d0f3b06.jpg',
    'https://i.pinimg.com/736x/a9/e3/d3/a9e3d34d6419d602efbfc5096299d136.jpg',
    'https://i.pinimg.com/1200x/2b/b3/47/2bb347678b51172db494de27d01b6797.jpg',
    'https://i.pinimg.com/736x/b6/e2/7e/b6e27e93832698d85b160bc7b9c434ff.jpg',
    'https://i.pinimg.com/736x/74/30/8b/74308b96b6c46cd88a1ee40d6778aec2.jpg',
    'https://i.pinimg.com/736x/19/48/5a/19485a911750d17fe3d9ed9b6ee810af.jpg',
    'https://i.pinimg.com/736x/c0/bf/22/c0bf22c5c2df84884a1d8fae36e85aac.jpg',
    'https://i.pinimg.com/736x/2f/e9/b3/2fe9b3d1684e81b0502d8d51ef890d86.jpg',
    'https://i.pinimg.com/736x/08/a8/12/08a812efb88e5eb40a7f397bb778db8d.jpg',
    'https://i.pinimg.com/736x/cf/3b/00/cf3b00ba150c6bd6ee96e79e3662210c.jpg',
    'https://i.pinimg.com/736x/37/4d/89/374d891ba14182e656f641a80d8b0466.jpg',

  ];

  // Fonction pour compresser l'image
  const compressImage = (file: File, maxWidth: number = 300, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions en gardant le ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width = (width * maxWidth) / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner un fichier image valide');
      return;
    }

    // Vérifier la taille du fichier (max 10MB pour le fichier original)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La taille du fichier ne doit pas dépasser 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Compresser l'image
      const compressedImage = await compressImage(file, 300, 0.8);

      // Vérifier la taille de l'image compressée (en base64)
      const sizeInBytes = (compressedImage.length * 3) / 4;
      if (sizeInBytes > 500 * 1024) { // 500KB max pour l'image compressée
        // Si encore trop grande, compresser davantage
        const moreCompressed = await compressImage(file, 200, 0.6);
        setSelectedAvatar(moreCompressed);
      } else {
        setSelectedAvatar(compressedImage);
      }

      setIsUploading(false);
      toast.success('Image téléchargée et optimisée avec succès');
    } catch (error) {
      setIsUploading(false);
      toast.error('Erreur lors du traitement de l\'image');
      console.error('Erreur de compression:', error);
    }
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
    // toast.success('Avatar mis à jour avec succès');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-base-200/50 backdrop-blur-xl bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden border border-base-300">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-base-300">
          <h2 className="text-xl font-bold flex items-center gap-2">
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
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

          {/* Avatars prédéfinis et upload */}
          <div>
            <h3 className="text-md font-medium mb-5 flex items-center gap-2">
              Choisir un avatar
            </h3>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3   ">
              <button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="relative group transition-all w-16 h-16 duration-200 rounded-full border-2 border-dashed border-base-300 hover:border-primary flex items-center justify-center bg-base-200 hover:bg-base-300"
              >
                {isUploading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Upload className="w-6 h-6 text-base-content/60" />
                )}
              </button>
              
              {defaultAvatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => handleAvatarClick(avatar)}
                  className={`relative group transition-all w-16  duration-200 rounded-full ${selectedAvatar === avatar
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
                        <Check className="w-4 h-4 text-primary-content" />
                      </div>
                    </div>
                  )}
                </button>
              ))}

            </div>

            <p className="text-xs text-base-content/60 mt-10 text-center">
              Sélectionnez un avatar prédéfini ou téléchargez votre propre image (JPG, PNG, GIF jusqu'à 10MB)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-3 border-t border-base-300">
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
