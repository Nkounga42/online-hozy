
import { Megaphone } from "lucide-react";
import Footer from "../../components/ui/Footer";
import { useNavigate } from "react-router-dom";

/**
 * Conditions Générales d'Utilisation (CGU) - Hozy Forms Builder
 * Composant React prêt à être intégré dans votre application.
 * Utilise Tailwind CSS pour le style (aucune importation nécessaire si Tailwind est déjà configuré).
 * Props:
 *  - country: nom du pays pour la loi applicable (string)
 *  - jurisdiction: juridiction pour les litiges (string)
 *  - lastUpdated: date de dernière mise à jour (string)
 */

const Terms = ({
  country = "Republique du Congo",
  jurisdiction = "juridictions de droit commun (ordre judiciaire)",
  lastUpdated = "29 août 2025",
}) => {
  return (
    <main className="max-w-4xl mx-auto p-6 flex gap-10  ">
      <div className="w-full space-y-5">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-1">
            Conditions Générales d’Utilisation (CGU)
          </h1>
          <p className="text-sm text-base-content/70 ">Hozy Forms Builder</p>
          <p className="text-sm text-base-content/50 mt-3">
            Date de dernière mise à jour : <i><strong>{lastUpdated}</strong></i>
          </p>
           <div className="divider"></div>
        </header>

        <section className="mb-6">
          <p className="text-base-content/70">
            Bienvenue sur <strong>Hozy Forms Builder</strong> (ci-après «
            l’Application »). En utilisant notre service, vous acceptez les
            présentes Conditions Générales d’Utilisation. Merci de les lire
            attentivement.
          </p>
        </section>

        <article className="prose prose-sm sm:prose lg:prose-lg">
          <section className="mb-8" id="objet">
            <h3 className="mb-3 font-semibold">1. Objet</h3>
            <p className="text-base-content/70">
              Hozy Forms Builder est une plateforme en ligne permettant aux
              utilisateurs de créer, gérer et partager des formulaires
              personnalisés (sondages, enquêtes, questionnaires, etc.).
            </p>
          </section>

          <section className="mb-8" id="acceptation">
            <h3 className="mb-3 font-semibold">2. Acceptation des Conditions</h3>
            <p className="text-base-content/70">
              En accédant et utilisant Hozy Forms Builder, vous acceptez d’être
              lié par ces Conditions Générales. Si vous n’acceptez pas tout ou
              partie de ces conditions, veuillez ne pas utiliser l’Application.
            </p>
          </section>

          <section className="mb-8" id="inscription">
            <h3 className="mb-3 font-semibold">3. Inscription et compte utilisateur</h3>
            <ul>
              <li>
                Pour utiliser Hozy Forms Builder, vous devez créer un compte
                utilisateur valide.
              </li>
              <li>
                Vous êtes responsable de la confidentialité de vos identifiants
                de connexion.
              </li>
              <li>
                Toute activité réalisée via votre compte est sous votre
                responsabilité.
              </li>
            </ul>
          </section>

          <section className="mb-8" id="utilisation">
            <h3 className="mb-3 font-semibold">4. Utilisation de l’Application</h3>
            <p className="text-base-content/70">
              Vous vous engagez à utiliser Hozy Forms Builder dans le respect
              des lois en vigueur et des droits des tiers. Vous vous interdisez
              notamment de transmettre des contenus illégaux, diffamatoires,
              offensants, violents, racistes ou portant atteinte à la vie
              privée.
            </p>
            <p className="text-warning bg-warning/10 mt-4 p-2 text-sm rounded-box">
              ⚠️ Hozy Forms Builder ne saurait être tenu responsable des données
              que vous collectez via vos formulaires.
            </p>
          </section>

          <section className="mb-8" id="propriete">
            <h3 className="mb-3 font-semibold">5. Propriété intellectuelle</h3>
            <ul>
              <li>
                Hozy Forms Builder est propriétaire de tous les droits liés à
                l’Application, incluant le code, la charte graphique et les
                fonctionnalités.
              </li>
              <li>
                Vous restez propriétaire des contenus (questions, données,
                formulaires) que vous créez sur notre plateforme.
              </li>
              <li>
                En utilisant l’Application, vous nous accordez une licence non
                exclusive afin de stocker et afficher ces contenus uniquement
                dans le cadre du fonctionnement du service.
              </li>
            </ul>
          </section>

          <section className="mb-8" id="donnees">
            <h3 className="mb-3 font-semibold">6. Données personnelles</h3>
            <p className="text-base-content/70">
              Hozy Forms Builder collecte et traite vos données conformément à
              sa Politique de confidentialité. Vous êtes responsable des données
              que vous collectez via vos formulaires et devez informer vos
              répondants selon la réglementation applicable (ex. RGPD).
            </p>
          </section>

          <section className="mb-8" id="responsabilite">
            <h3 className="mb-3 font-semibold">7. Responsabilité</h3>
            <ul className="list-disc space-y-3 text-base-content/70">
              <li>
                Hozy Forms Builder ne garantit pas que l’Application sera
                exempte d’erreurs ou disponible en permanence.
              </li>
              <li>
                Nous déclinons toute responsabilité en cas de perte de données,
                d’erreurs techniques ou d’utilisation frauduleuse.
              </li>
              <li>
                Vous êtes seul responsable des formulaires créés et des données
                collectées via la plateforme.
              </li>
            </ul>
          </section>

          <section className="mb-8" id="suspension">
            <h3 className="mb-3 font-semibold">8. Suspension et suppression de compte</h3>
            <p className="text-base-content/70">
              Nous nous réservons le droit de suspendre ou de supprimer votre
              compte en cas de non-respect des présentes Conditions ou
              d’utilisation abusive de l’Application.
            </p>
          </section>

          <section className="mb-8" id="modification">
            <h3 className="mb-3 font-semibold">9. Modification des Conditions</h3>
            <p className="text-base-content/70">
              Hozy Forms Builder peut modifier ces Conditions Générales à tout
              moment. Les modifications seront communiquées aux utilisateurs et
              la poursuite de l’utilisation vaut acceptation des nouvelles
              conditions.
            </p>
          </section>

          <section className="mb-8" id="loi">
            <h3 className="mb-3 font-semibold">10. Loi applicable et juridiction</h3>
            <p className="text-base-content/70">
              Ces Conditions sont soumises au droit en vigueur dans{" "}
              <strong>{country}</strong>. Tout litige relatif à leur
              interprétation ou exécution sera soumis aux  <strong>{jurisdiction}</strong>.
            </p>
          </section>

          <section className="mb-8" id="contact" >
            <h3 className="mb-3 font-semibold">Contact</h3>
            <p className="text-base-content/70">
              Pour toute question concernant ces Conditions, n’hésitez pas à
              nous contacter via l’interface de l’Application.
            </p>
          </section>
        </article>

        <footer className="mt-8 text-sm text-gray-500 text-center">
          <p className="text-base-content/70">
            © {new Date().getFullYear()} Hozy Forms Builder. Tous droits
            réservés.
          </p>
        </footer>
      </div>
        <div>
      <div className="mb-6 sticky top-10 flex flex-col w-[280px]">

        <nav >
          <h2 className="text-lg font-medium mb-2">Sommaire</h2>
          <ol className="list-decimal list-inside text-sm text-primary space-y-1">
            <li>
              <a className="hover:underline" href="#objet">Objet</a>
            </li>
            <li>
              <a className="hover:underline" href="#acceptation">Acceptation des Conditions</a>
            </li>
            <li>
              <a className="hover:underline" href="#inscription">Inscription et compte utilisateur</a>
            </li>
            <li>
              <a className="hover:underline" href="#utilisation">Utilisation de l’Application</a>
            </li>
            <li>
              <a className="hover:underline" href="#propriete">Propriété intellectuelle</a>
            </li>
            <li>
              <a className="hover:underline" href="#donnees">Données personnelles</a>
            </li>
            <li>
              <a className="hover:underline" href="#responsabilite">Responsabilité</a>
            </li>
            <li>
              <a className="hover:underline" href="#suspension">Suspension et suppression de compte</a>
            </li>
            <li>
              <a className="hover:underline" href="#modification">Modification des Conditions</a>
            </li>
            <li>
              <a className="hover:underline" href="#loi">Loi applicable et juridiction</a>
            </li>
          </ol>
        </nav>
        <PubliciteCard />
        </div>
      </div>
      <Footer />
    </main>
  );
};

const PubliciteCard = () => {
  const navigate = useNavigate();
  return (
    <div className=" mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg overflow-hidden p-4 mt-10  space-y-4">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <Megaphone className="w-4 h-4 text-yellow-300" />
        <h2 className="text-xl font-bold">Hozy Forms Builder</h2>
      </div>

      {/* Texte promo */}
      <p className="text-gray-100 leading-relaxed text-xs ">
        Créez, gérez et partagez vos formulaires en toute simplicité 🚀. 
        Collectez vos données rapidement avec une interface moderne et intuitive.
      </p>

      {/* Boutons */}
      <div className="flex gap-3 mt-4">
        <div className="px-4 py-2 text-xs bg-yellow-400 text-black font-semibold rounded-xl cursor-pointer hover:bg-yellow-300 transition">
          Essayer Gratuitement
        </div>
        <div onClick={() => navigate("/about")} className="px-4 py-2 text-xs border border-white/30 bg-white/10 text-white rounded-xl cursor-pointer hover:bg-white/20 transition">
          En savoir plus
        </div>
      </div>
    </div>
  );
};
 
export default Terms; 