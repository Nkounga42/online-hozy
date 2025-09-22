import React, { useState } from "react";
import Footer from "../../components/ui/Footer";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu pourrais envoyer le formulaire à ton API backend ou un service type EmailJS
    console.log("Formulaire soumis :", form);
    setSubmitted(true);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 flex gap-10">
      {/* CONTENU PRINCIPAL */}
      <div className="w-3/5 space-y-5">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold mb-1">Contactez-nous</h1>
          <p className="text-sm ">
            Vous avez une question, une suggestion ou besoin d’assistance ?
            Notre équipe est à votre disposition pour vous aider.
          </p>
          <div className="divider"></div>
        </header>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl "
          >
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="textarea textarea-bordered w-full"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Envoyer
            </button>
          </form>
        ) : (
          <div className="alert alert-success shadow-lg">
            <div>
              <span>Merci ! Votre message a bien été envoyé.</span>
            </div>
          </div>
        )}

         
      </div>

      {/* NAVIGATION LATÉRALE + INFOS CONTACT */}
      <aside className="w-2/5">
        <div className="mb-6 sticky top-10 flex flex-col space-y-6">
          <nav>
            <h2 className="text-lg font-medium mb-2">Autres Pages</h2>
            <ul className="list-disc list-inside text-sm text-primary space-y-1">
              <li>
                <a href="/cgu" className="hover:underline">
                  Conditions Générales
                </a>
              </li>
              <li>
                <a href="/confidentialite" className="hover:underline">
                  Confidentialité
                </a>
              </li>
            </ul>
          </nav>

          <div className="">
            <div className="bg-base-200/30 rounded-xl shadow p-3  space-y-4">
              <h2 className="text-lg font-semibold mb-3">
                Informations de contact
              </h2>

              <div>
                <h3 className="text-sm font-medium ">
                  Support technique
                </h3>
                <p className="text-base-content/70 text-sm">support@hozyforms.com</p>
              </div>

              <div>
                <h3 className="text-sm font-medium ">
                  Partenariats
                </h3>
                <p className="text-base-content/70 text-sm">partnership@hozyforms.com</p>
              </div>

              <div>
                <h3 className="text-sm font-medium ">
                  Service client
                </h3>
                <p className="text-base-content/70 text-sm">+242 06 000 1111</p>
                <p className="text-base-content/70 text-sm">contact@hozyforms.com</p>
              </div>

              <div>
                <h3 className="text-sm font-medium ">
                  Adresse
                </h3>
                <p className="text-base-content/70 text-sm">Hozy Forms Builder</p>
                <p className="text-base-content/70 text-sm">123, Avenue de l’Innovation</p>
                <p className="text-base-content/70 text-sm">Pointe-Noire, République du Congo</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <Footer />
    </main>
  );
};

export default Contact;
