
import {useState  , useEffect } from 'react';
import type { User } from '../../models/DataModels';

// Type pour les valeurs de réponse
type AnswerValue = string | number | boolean | string[];






export default function FormAnswers({ form }) {
  const [userLabels, setUserLabels] = useState<Record<string, string>>({});

  // Mapping fieldId -> label
  const fieldLabels: Record<string, string> = {};
  form.pages.forEach((page) => {
    page.fields.forEach((field) => {
      fieldLabels[field.id] = field.label;
    });
  });

  // Récupérer tous les utilisateurs pour construire userLabels
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://online-hozy.onrender.com/api/users"); // change l'URL selon ton backend
        const users: User[] = await res.json();
        const map: Record<string, string> = {};
        users.forEach((u) => {
          map[u.id] = u.name;
        });
        setUserLabels(map);
      } catch (err) {
        console.error("Erreur lors de la récupération des utilisateurs", err);
      }
    };

    fetchUsers();
  }, []);

  // Regrouper les réponses par utilisateur
  const grouped: Record<string, typeof form.submissions> = {};
  form.submissions.forEach((sub) => {
    const user = sub.userId ?? "Anonyme";
    if (!grouped[user]) grouped[user] = [];
    grouped[user].push(sub);
  });
const uniqueIPs = Array.from(new Set(form.views.map(v => v.ip)));


  return (
    <div className="h-screen p-4 overflow-auto">
      <h1 className="text-xl font-bold mb-2">Vues:</h1>
      <ul className="mb-6">
        <h1 className="text-xl font-bold mb-2">
          Vues uniques ({uniqueIPs.length})
        </h1>
      </ul>
      <h1 className="text-xl font-bold mb-2">Réponses</h1>
      <ul>
        {Object.entries(grouped).map(([userId, submissions]) => (
          <li key={userId} className="mb-6 border-b pb-4">
            <h2 className="font-semibold">
              Utilisateur : {userLabels[userId] ?? (userId === "Anonyme" ? "Anonyme" : userId)}
            </h2>
            <ul className="mt-2">
              {submissions.map((s, idx) => (
                <li key={idx} className="mb-3">
                  <div>⏰ {new Date(s.timestamp).toLocaleString()}</div>
                  <ul className="pl-4 list-disc">
                    {Object.entries(s.answers).map(([fieldId, value] : [string, AnswerValue]) => (
                      <li key={fieldId}>
                        <strong>{fieldLabels[fieldId] ?? fieldId}</strong> : {value}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

