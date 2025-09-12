class ThemeService {
  private static instance: ThemeService;
  private currentTheme: string = 'corporate';

  // Thèmes DaisyUI disponibles (couleurs primaires extraites des définitions oklch officielles)
  private availableThemes = [
    { name: 'corporate', label: 'Corporate (Défaut)', primary: '#6366f1' },
    { name: 'light', label: 'Light', primary: '#570df8' }, // oklch(45% 0.24 277.023)
    { name: 'dark', label: 'Dark', primary: '#661ae6' }, // oklch(58% 0.233 277.117)
    { name: 'winter', label: 'Winter', primary: '#047aed' }, // oklch(56.86% 0.255 257.57)
    { name: 'lemonade', label: 'Lemonade', primary: '#519903' }, // oklch(82% 0.119 306.383)
    { name: 'custom', label: 'Personnalisé', primary: '#6366f1' }
  ];

  private constructor() {
    this.loadTheme();
  }

  public static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  // Charger le thème depuis le localStorage
  private loadTheme(): void {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme && this.availableThemes.find(t => t.name === savedTheme)) {
      this.currentTheme = savedTheme;
    }
    this.applyTheme(this.currentTheme);
  }

  
  private applyTheme(themeName: string): void {
    
    const themeMapping: { [key: string]: string } = {
      'corporate': 'corporate',
      'light': 'light', 
      'dark': 'dark',
      'winter': 'winter',
      'lemonade': 'lemonade',
      'custom': 'custom'
    };

    const cssThemeName = themeMapping[themeName] || themeName;
    
    document.documentElement.setAttribute('data-theme', cssThemeName);
    document.body.setAttribute('data-theme', cssThemeName);
    
    // Debug: vérifier que l'attribut est bien appliqué
    console.log('Theme applied:', cssThemeName, document.documentElement.getAttribute('data-theme'));
  }

  // Changer le thème
  public setTheme(themeName: string): void {
    const theme = this.availableThemes.find(t => t.name === themeName);
    if (theme) {
      this.currentTheme = themeName;
      this.applyTheme(themeName);
      localStorage.setItem('app-theme', themeName);
      
      // Émettre un événement pour notifier les composants du changement
      window.dispatchEvent(new CustomEvent('theme-changed', { 
        detail: { theme: themeName } 
      }));
    } else {
      console.warn('Theme not found:', themeName, 'Available themes:', this.availableThemes.map(t => t.name));
    }
  }

  // Obtenir le thème actuel
  public getCurrentTheme(): string {
    return this.currentTheme;
  }

  // Obtenir tous les thèmes disponibles
  public getAvailableThemes() {
    return this.availableThemes;
  }

  // Obtenir les informations du thème actuel
  public getCurrentThemeInfo() {
    return this.availableThemes.find(t => t.name === this.currentTheme);
  }

  // Convertir une couleur hex en format oklch
  private hexToOklch(hex: string): string {
    // Supprimer le # si présent
    hex = hex.replace('#', '');
    
    // Convertir hex en RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Conversion RGB vers Lab (D65 illuminant)
    const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    const rLin = toLinear(r);
    const gLin = toLinear(g);
    const bLin = toLinear(b);
    
    // RGB vers XYZ (sRGB D65)
    const x = 0.4124564 * rLin + 0.3575761 * gLin + 0.1804375 * bLin;
    const y = 0.2126729 * rLin + 0.7151522 * gLin + 0.0721750 * bLin;
    const z = 0.0193339 * rLin + 0.1191920 * gLin + 0.9503041 * bLin;
    
    // XYZ vers Lab
    const fx = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
    const fy = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
    const fz = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);
    
    const L = 116 * fy - 16;
    const a = 500 * (fx - fy);
    const b_lab = 200 * (fy - fz);
    
    // Lab vers LCH
    const C = Math.sqrt(a * a + b_lab * b_lab);
    let H = Math.atan2(b_lab, a) * 180 / Math.PI;
    if (H < 0) H += 360;
    
    // Ajuster pour DaisyUI oklch format
    const lightness = Math.max(0, Math.min(100, Math.round(L)));
    const chroma = Math.max(0, Math.round(C) / 100);
    const hue = Math.round(H);
    
    return `oklch(${lightness}% ${chroma.toFixed(3)} ${hue})`;
  }

  // Créer un thème personnalisé (couleur primaire)
  public createCustomTheme(primaryColor: string): void {
    // Créer des variables CSS personnalisées
    const style = document.createElement('style');
    style.id = 'custom-theme';
    
    // Supprimer l'ancien style personnalisé s'il existe
    const existingStyle = document.getElementById('custom-theme');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Convertir la couleur hex en oklch
    const oklchColor = this.hexToOklch(primaryColor);
    
    // Debug: afficher la conversion
    console.log('Converting color:', primaryColor, 'to oklch:', oklchColor);
    
    const customCSS = `
      [data-theme="custom"] {
        --color-primary: ${oklchColor} !important;
        --color-primary-content: oklch(100% 0 0) !important;
      }
      
      :root[data-theme="custom"] {
        --color-primary: ${oklchColor} !important;
        --color-primary-content: oklch(100% 0 0) !important;
      }
      
      html[data-theme="custom"] {
        --color-primary: ${oklchColor} !important;
        --color-primary-content: oklch(100% 0 0) !important;
      }
      
      body[data-theme="custom"] {
        --color-primary: ${oklchColor} !important;
        --color-primary-content: oklch(100% 0 0) !important;
      }
      
      /* Force override pour tous les éléments utilisant primary */
      [data-theme="custom"] .btn-primary {
        background-color: ${primaryColor} !important;
        border-color: ${primaryColor} !important;
      }
      
      [data-theme="custom"] .bg-primary {
        background-color: ${primaryColor} !important;
      }
      
      [data-theme="custom"] .text-primary {
        color: ${primaryColor} !important;
      }
    `;
    
    style.textContent = customCSS;
    document.head.appendChild(style);

    // Mettre à jour la couleur du thème personnalisé existant
    const customTheme = this.availableThemes.find(t => t.name === 'custom');
    if (customTheme) {
      customTheme.primary = primaryColor;
    }

    this.setTheme('custom');
  }

  // Réinitialiser au thème par défaut
  public resetToDefault(): void {
    this.setTheme('corporate');
  }
}

export default ThemeService.getInstance();
