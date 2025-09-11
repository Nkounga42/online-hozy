import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bottom-0 left-0 right-0 full fixed flex items-between justify-between p-4 py-2 bg-base-200/30 backdrop-blur-xl text-base-content border-t border-base-300">
      <div className="flex items-center space-x-2">
        <Link to="/" className="font-bold text-primary">Hozy Form Builder</Link>
        <span className="text-sm opacity-70">© 2025  Tous droits
            réservés.</span>
      </div>

      <div className="flex items-center space-x-4 text-sm">
        <a href="/about" className="link link-hover">À propos</a>
        <a href="/privacy" className="link link-hover">Confidentialité</a>
        <a href="/terms" className="link link-hover">Conditions</a>
        <a href="/contact" className="link link-hover">Contact</a>
      </div>
    </footer>
  );
}
