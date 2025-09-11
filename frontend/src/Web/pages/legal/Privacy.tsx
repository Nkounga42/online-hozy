import Footer from "../../components/ui/Footer";

 
const Privacy = ({
  country = "[votre pays]",
  lastUpdated = "29 août 2025",
}) => {
  return (
    <main className="max-w-4xl mx-auto p-6 flex gap-10">
      {/* CONTENU PRINCIPAL */}
      <div className="w-full space-y-5">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-1">
            Politique de Confidentialité
          </h1>
          <p className="text-sm text-base-content/70">Hozy Forms Builder</p>
          <p className="text-sm text-base-content/50 mt-3">
            Date de dernière mise à jour :{" "}
            <i>
              <strong>{lastUpdated}</strong>
            </i>
          </p>
          <div className="divider"></div>
        </header>

        <article className="prose prose-sm sm:prose lg:prose-lg">
          <section id="introduction" className="mb-8">
            <h3 className="mb-3 font-semibold">1. Introduction</h3>
            <p className="text-base-content/70">
              La présente Politique de Confidentialité explique comment{" "}
              <strong>Hozy Forms Builder</strong> collecte, utilise et protège
              vos données personnelles lorsque vous utilisez notre application.
            </p>
          </section>

          <section id="donnees-collectees" className="mb-8">
            <h3 className="mb-3 font-semibold">2. Données collectées</h3>
            <ul className="list-disc space-y-2 text-base-content/70">
              <li>Informations de compte (nom, email, mot de passe chiffré)</li>
              <li>Contenus créés dans vos formulaires</li>
              <li>Informations techniques (adresse IP, navigateur, cookies)</li>
            </ul>
          </section>

          <section id="utilisation" className="mb-8">
            <h3 className="mb-3 font-semibold">3. Utilisation des données</h3>
            <p className="text-base-content/70">
              Nous utilisons vos données uniquement pour :
            </p>
            <ul className="list-disc space-y-2 text-base-content/70">
              <li>Fournir et améliorer le service</li>
              <li>Sécuriser vos comptes et formulaires</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section id="partage" className="mb-8">
            <h3 className="mb-3 font-semibold">4. Partage des données</h3>
            <p className="text-base-content/70">
              Nous ne vendons pas vos données. Elles peuvent être partagées avec
              :
            </p>
            <ul className="list-disc space-y-2 text-base-content/70">
              <li>Nos prestataires techniques (hébergement, sécurité)</li>
              <li>
                Les autorités légales si la loi l’exige ({country} et
                réglementation internationale applicable)
              </li>
            </ul>
          </section>

          <section id="duree" className="mb-8">
            <h3 className="mb-3 font-semibold">5. Durée de conservation</h3>
            <p className="text-base-content/70">
              Vos données sont conservées uniquement le temps nécessaire à
              l’utilisation du service ou pour respecter les obligations
              légales.
            </p>
          </section>

          <section id="droits" className="mb-8">
            <h3 className="mb-3 font-semibold">6. Vos droits</h3>
            <p className="text-base-content/70">
              Conformément à la réglementation (ex. RGPD), vous disposez des
              droits suivants :
            </p>
            <ul className="list-disc space-y-2 text-base-content/70">
              <li>Droit d’accès, de rectification et de suppression</li>
              <li>Droit d’opposition et de limitation du traitement</li>
              <li>Droit à la portabilité de vos données</li>
            </ul>
          </section>

          <section id="securite" className="mb-8">
            <h3 className="mb-3 font-semibold">7. Sécurité</h3>
            <p className="text-base-content/70">
              Nous mettons en œuvre des mesures techniques et organisationnelles
              appropriées pour protéger vos données (chiffrement, sauvegardes,
              contrôle d’accès).
            </p>
          </section>

          <section id="modifications" className="mb-8">
            <h3 className="mb-3 font-semibold">8. Modifications</h3>
            <p className="text-base-content/70">
              Cette Politique peut être modifiée à tout moment. Les
              utilisateurs seront informés des changements.
            </p>
          </section>

          <section id="contact" className="mb-8">
            <h3 className="mb-3 font-semibold">9. Contact</h3>
            <p className="text-base-content/70">
              Pour toute question relative à cette Politique de Confidentialité,
              vous pouvez nous contacter directement via l’application.
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

      {/* NAVIGATION LATÉRALE + PUB */}
      <div>
        <div className="mb-6 sticky top-10 flex flex-col  w-[280px]">
          <nav>
            <h2 className="text-lg font-medium mb-2">Sommaire</h2>
            <ol className="list-decimal list-inside text-sm text-primary space-y-1">
              <li>
                <a href="#introduction" className="hover:underline">
                  Introduction
                </a>
              </li>
              <li>
                <a href="#donnees-collectees" className="hover:underline">
                  Données collectées
                </a>
              </li>
              <li>
                <a href="#utilisation" className="hover:underline">
                  Utilisation des données
                </a>
              </li>
              <li>
                <a href="#partage" className="hover:underline">
                  Partage des données
                </a>
              </li>
              <li>
                <a href="#duree" className="hover:underline">
                  Durée de conservation
                </a>
              </li>
              <li>
                <a href="#droits" className="hover:underline">
                  Vos droits
                </a>
              </li>
              <li>
                <a href="#securite" className="hover:underline">
                  Sécurité
                </a>
              </li>
              <li>
                <a href="#modifications" className="hover:underline">
                  Modifications
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ol>
          </nav> 
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Privacy;
