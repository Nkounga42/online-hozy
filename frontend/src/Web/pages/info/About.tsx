import Footer from "../../components/ui/Footer";

 

const About = () => {
  return (
    <main className="max-w-4xl mx-auto p-6 flex gap-10  ">
      {/* Zone principale */}
      <div className="w-4/6  space-y-5">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-1">À propos de Hozy Forms Builder</h1>
          <p className="text-sm text-base-content/70">Notre mission et notre vision</p>
          <div className="divider"></div>
        </header>

        <section className="mb-6">
          <p className="text-base-content/70">
            <strong>Hozy Forms Builder</strong> est une plateforme moderne et intuitive qui
            permet à chacun de créer, gérer et partager des formulaires
            personnalisés (enquêtes, questionnaires, sondages, etc.) sans
            connaissances techniques particulières.
          </p>
        </section>

        <article className="prose prose-sm sm:prose lg:prose-lg">
          <section className="mb-8" id="mission">
            <h3 className="mb-3 font-semibold">1. Notre mission</h3>
            <p className="text-base-content/70">
              Simplifier la collecte de données en mettant à disposition un
              outil puissant, rapide et accessible à tous, des étudiants aux
              entreprises.
            </p>
          </section>

          <section className="mb-8" id="vision">
            <h3 className="mb-3 font-semibold">2. Notre vision</h3>
            <p className="text-base-content/70">
              Faire de Hozy Forms Builder une référence mondiale dans la
              création de formulaires, en offrant une expérience fluide et
              sécurisée.
            </p>
          </section>

          <section className="mb-8" id="valeurs">
            <h3 className="mb-3 font-semibold">3. Nos valeurs</h3>
            <ul className="list-disc space-y-2 text-base-content/70">
              <li><strong>Accessibilité :</strong> un outil simple d’utilisation.</li>
              <li><strong>Innovation :</strong> des fonctionnalités modernes et évolutives.</li>
              <li><strong>Confiance :</strong> respect des données et de la vie privée.</li>
              <li><strong>Performance :</strong> rapidité et fiabilité au quotidien.</li>
            </ul>
          </section>

          <section className="mb-8" id="equipe">
            <h3 className="mb-3 font-semibold">4. Notre équipe</h3>
            <p className="text-base-content/70">
              Une équipe passionnée de développeurs, designers et experts en
              data qui travaillent ensemble pour offrir la meilleure expérience
              possible.
            </p>
          </section>

          <section className="mb-8" id="contact">
            <h3 className="mb-3 font-semibold">5. Contact</h3>
            <p className="text-base-content/70">
              Pour toute question ou suggestion, vous pouvez nous contacter via
              l’interface de l’application ou par email à{" "}
              <a href="mailto:support@hozyforms.com" className="text-primary hover:underline">
                support@hozyforms.com
              </a>.
            </p>
          </section>
        </article>

        <footer className="mt-8 text-sm text-gray-500 text-center">
          <p className="text-base-content/70">
            © {new Date().getFullYear()} Hozy Forms Builder. Tous droits réservés.
          </p>
        </footer>
      </div>

      {/* Sidebar sticky */}
      <div>
        <div className="mb-6  sticky top-10 flex flex-col space-y-6 w-[280px]">
          <nav>
            <h2 className="text-lg font-medium mb-2">Sommaire</h2>
            <ol className="list-decimal list-inside text-sm text-primary space-y-1">
              <li><a className="hover:underline" href="#mission">Notre mission</a></li>
              <li><a className="hover:underline" href="#vision">Notre vision</a></li>
              <li><a className="hover:underline" href="#valeurs">Nos valeurs</a></li>
              <li><a className="hover:underline" href="#equipe">Notre équipe</a></li>
              <li><a className="hover:underline" href="#contact">Contact</a></li>
            </ol>
          </nav> 
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default About;
