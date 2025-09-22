import { useEffect, useState } from "react";
import { X, Search, ArrowLeft, ArrowRight } from "lucide-react";
import FolderCard from "../components/ui/forldercard";
import FormCard from "../components/ui/formcard";
import { Link, useNavigate } from "react-router-dom";

import { Group, Form } from "../models/DataModels";
import { CreateProject } from "../components/form-builder/CreateProject";
import Footer from "../components/ui/Footer";
import Header from "../components/ui/Header";
import { API_CONFIG } from '../services/config';
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [allForms, setAllForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);


  const [createProject, setCreateProject] = useState(false);
  const [displayMode, setDisplayMode] = useState<
    "all" | "groups" | "ungrouped"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const formsPerPage = 30;  


  // Fonction pour obtenir le token d'authentification
  const getAuthToken = (): string | null => {
    return localStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN) || sessionStorage.getItem(API_CONFIG.TOKEN_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
  };

  // DELETE form
  const handleDeleteForm = async (formId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      await fetch(`${API_CONFIG.BASE_URL}/api/forms/${formId}`, {
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
      });
      setAllForms((prev) => prev.filter((f) => f.id !== formId));
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          forms: g.forms.filter((f) => f.id !== formId),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // RENAME form
  const handleRenameForm = async (formId: number, newTitle: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/forms/${formId}/rename`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ title: newTitle }),
        }
      );


      const updatedForm = await res.json();
      setAllForms((prev) =>
        prev.map((f) => (f.id === formId ? updatedForm : f))
      );
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          forms: g.forms.map((f) => (f.id === formId ? updatedForm : f)),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // DUPLICATE form
  const handleDuplicateForm = async (formId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/forms/${formId}/duplicate`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        }
      );
      const newForm = await res.json();
      setAllForms((prev) => [...prev, newForm]);
      setGroups((prev) =>
        prev.map((g) =>
          g.id === newForm.groupId ? { ...g, forms: [...g.forms, newForm] } : g
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // EXPORT form (JSON)
const handleExportForm = async (formId: number) => {
  const token = getAuthToken();
  if (!token) {
    toast.error("Vous devez être connecté pour effectuer cette action");
    navigate('/login');
    return;
  }

  const res = await fetch(
    `${API_CONFIG.BASE_URL}/api/forms/${formId}/export`,
    {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
    }
  );

  if (!res.ok) {
    console.error("Erreur export:", res.status);
    return;
  }

  // 📌 Récupérer le nom du fichier depuis l'entête
  const contentDisposition = res.headers.get("Content-Disposition");
  let filename = `form-${formId}.json`;

  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
};

  // SHARE form
const handleShareForm = async (formId: number) => {
  try { 

    const token = getAuthToken();
    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action");
      navigate('/login');
      return;
    }

    const res = await fetch(`${API_CONFIG.BASE_URL}/api/forms/${formId}/share`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!res.ok) throw new Error("Impossible de partager le formulaire");

    const data = await res.json();
    console.log(data)
    
    // Vérifier si l'API Clipboard est disponible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(data.shareUrl);
      toast.success("URL de partage copiée dans le presse-papiers");
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
      const textArea = document.createElement('textarea');
      textArea.value = data.shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
        toast.success("URL de partage copiée dans le presse-papiers");
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
        toast.error("Impossible de copier l'URL. Voici le lien : " + data.shareUrl);
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (err: unknown) {
    console.error(err);
    const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
    toast.error("Erreur lors du partage du formulaire : " + errorMessage);
  }
};


  // DELETE group
  const handleDeleteGroup = async (groupId: number) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      await fetch(`${API_CONFIG.BASE_URL}/api/groups/${groupId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
      setAllForms((prev) => prev.filter((f) => f.groupId !== groupId));
    } catch (err) {
      console.error(err);
    }
  };

  // Renommer un groupe
  const handleRenameGroup = async (groupId: number, newTitle: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/groups/${groupId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) throw new Error("Erreur lors du renommage du groupe");
      const updatedGroup = await res.json();
      setGroups((prev) =>
        prev.map((g) => (g.id === groupId ? updatedGroup : g))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Dupliquer un groupe
  const handleDuplicateGroup = async (groupId: number) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Vous devez être connecté pour effectuer cette action");
        navigate('/login');
        return;
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/groups`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          title: group.title + " (Copie)",
          description: group.description,
        }),
      });
      if (!res.ok) throw new Error("Erreur lors de la duplication du groupe");
      const newGroup = await res.json();
      setGroups((prev) => [...prev, newGroup]);
    } catch (err) {
      console.error(err);
    }
  };

  // EXPORT group
  const handleExportGroup = async (groupId: number) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action");
      navigate('/login');
      return;
    }

    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/groups/${groupId}/export`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `group-${groupId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // SHARE group
  const handleShareGroup = async (groupId: number) => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Vous devez être connecté pour effectuer cette action");
      navigate('/login');
      return;
    }

    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/groups/${groupId}/share`,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      }
    );
    const data = await res.json();
    navigator.clipboard.writeText(data.shareUrl);
    toast.success("Lien copié : " + data.shareUrl);
  };

  useEffect(() => { 
    const fetchForms = async (page = 1, limit = formsPerPage) => {
      try {
        setLoading(true);
        
        const token = getAuthToken();
        if (!token) {
          toast.error("Vous devez être connecté pour voir vos formulaires");
          navigate('/login');
          return;
        }

        const res = await fetch(
          `${API_CONFIG.BASE_URL}/api/forms?page=${page}&limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erreur lors de la récupération des formulaires");

        const data = await res.json();
        setAllForms(data.forms);

        const groupMap: Record<number, Group> = {};
        data.forms.forEach((form: Form) => {
          if (form.groupId !== 0) {
            if (!groupMap[form.groupId]) {
              groupMap[form.groupId] = {
                id: form.groupId,
                title: `Groupe ${form.groupId}`,
                description: "",
                forms: [],
              };
            }
            groupMap[form.groupId].forms.push(form);
          }
        });

        setGroups(Object.values(groupMap));
        setTotalPages(data.totalPages || 1);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms(currentPage);
  }, [currentPage]);

  const groupsWithForms = groups
    .filter((g) => g != null && g.id != null)
    .map((g) => ({
      ...g,
      forms: allForms.filter(
        (f) =>
          f.groupId === g.id &&
          (searchTerm === "" ||
            f.title.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }));

  const ungrouped = allForms.filter(
    (f) =>
      f.groupId === 0 &&
      (searchTerm === "" ||
        f.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSearch = (term: string) => {
    if (!term.trim()) return; 
    setSearchTerm(term);
  };

  // const handleDeleteForm = (formId: number) => {
  //   projects.deleteForm(formId);
  //   setGroups(projects.getAllGroups());
  //   setAllForms(projects.getAllForms());
  // };

  // const handleRenameForm = (formId: number, newTitle: string) => {
  //   projects.updateForm(formId, { title: newTitle });
  //   setGroups(projects.getAllGroups());
  //   setAllForms(projects.getAllForms());
  // };

  // const handleDuplicateForm = (formId: number) => {
  //   const form = projects.readForm(formId);
  //   if (!form) return;

  //   const duplicate = projects.createForm(
  //     form.groupId,
  //     form.theme,
  //     form.title + " (Copie)",
  //     form.description
  //   );

  //   form.pages.forEach((p) => {
  //     const newPage = new Page(p.order, p.title);
  //     p.fields.forEach((f) =>
  //       newPage.addField(new Field(f.id + "-copy", f.type, f.label, f.required))
  //     );
  //     duplicate.addPage(newPage);
  //   });

  //   setGroups(projects.getAllGroups());
  //   setAllForms(projects.getAllForms());
  // };

  // const handleExportForm = (formId: number) => {
  //   const form = projects.readForm(formId);
  //   if (!form) return;
  //   const blob = new Blob([JSON.stringify(form, null, 2)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${form.title}.json`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleShareForm = (formId: number) => {
  //   const form = projects.readForm(formId);
  //   if (!form) return;
  //   const shareUrl = `${window.location.origin}/forms/${form.id}`;
  //   navigator.clipboard.writeText(shareUrl);
  //   alert("Lien copié : " + shareUrl);
  // };

  // const handleRenameGroup = (groupId: number, newTitle: string) => {
  //   projects.updateGroup(groupId, { title: newTitle });
  //   setGroups(projects.getAllGroups());
  // };

  // const handleDeleteGroup = (groupId: number) => {
  //   projects.deleteGroup(groupId);
  //   setGroups(projects.getAllGroups());
  //   setAllForms(projects.getAllForms());
  //   if (selectedGroup?.id === groupId) setSelectedGroup(null);
  // };

  // const handleDuplicateGroup = (groupId: number) => {
  //   const group = projects.readGroup(groupId);
  //   if (!group) return;

  //   const duplicate = projects.createGroup(
  //     group.title + " (Copie)",
  //     group.description
  //   );

  //   const groupForms = projects
  //     .getAllForms()
  //     .filter((f) => f.groupId === groupId);
  //   groupForms.forEach((f) => {
  //     const newForm = projects.createForm(
  //       duplicate.id,
  //       f.theme,
  //       f.title,
  //       f.description
  //     );
  //     f.pages.forEach((p) => {
  //       const newPage = new Page(p.order, p.title);
  //       p.fields.forEach((fld) =>
  //         newPage.addField(
  //           new Field(fld.id + "-copy", fld.type, fld.label, fld.required)
  //         )
  //       );
  //       newForm.addPage(newPage);
  //     });
  //   });

  //   setGroups(projects.getAllGroups());
  //   setAllForms(projects.getAllForms());
  // };

  // const handleExportGroup = (groupId: number) => {
  //   const group = projects.readGroup(groupId);
  //   if (!group) return;
  //   const forms = projects.getAllForms().filter((f) => f.groupId === groupId);
  //   const exportData = { group, forms };
  //   const blob = new Blob([JSON.stringify(exportData, null, 2)], {
  //     type: "application/json",
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${group.title}.json`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleShareGroup = (groupId: number) => {
  //   const group = projects.readGroup(groupId);
  //   if (!group) return;
  //   const shareUrl = `${window.location.origin}/groups/${group.id}`;
  //   navigator.clipboard.writeText(shareUrl);
  //   alert("Lien copié : " + shareUrl);
  // };

  // Afficher un loader pendant la vérification de l'authentification
  // if (userLoading) {
  //   return (
  //     <div className="flex-1 flex justify-center items-center min-h-screen">
  //       <div className="flex gap-2 items-center">
  //         <span className="loading loading-spinner text-primary"></span>
  //         Vérification de l'authentification...
  //       </div>
  //     </div>
  //   );
  // }

  // Le composant est déjà protégé par ProtectedRoute, pas besoin de vérification supplémentaire

  return (
    <>
          <Header/>
      <div className="bg-base-200 p-10 flex flex-col items-center justify-star"
        style={{ minHeight: "calc( 100vh - 64px )" }}
      >
        <div className=" w-4xl md: px-10 space-y-6">
          {/* Barre de recherche */}
          <div className="relative mb-3">
            <h1 className="text-3xl font-bold mb-4 text-primary">
              Projets
            </h1>
            <div className="flex items-center border border-base-content/10 rounded-lg px-3 py-2 bg-base-100 hover:shadow-md">
              <Search className="w-4 h-4 text-base/70 mr-2" />
              <input
                type="text"
                placeholder="Rechercher un formulaire"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
                className="w-full outline-none"
              />
            </div>
          </div>

          
          <div className="flex justify-between flex-1">
            <div className="flex gap-2 mb-4 flex-wrap w-3/4">
              <button
                className={`btn btn-sm ${
                  displayMode === "all" ? "btn-primary" : ""
                }`}
                onClick={() => setDisplayMode("all")}
              >
                Tout afficher
              </button>
              <button
                className={`btn btn-sm ${
                  displayMode === "groups" ? "btn-primary" : ""
                }`}
                onClick={() => setDisplayMode("groups")}
              >
                Groupes seulement
              </button>
              <button
                className={`btn btn-sm ${
                  displayMode === "ungrouped" ? "btn-primary" : ""
                }`}
                onClick={() => setDisplayMode("ungrouped")}
              >
                Formulaires seuls
              </button>
            </div>

            <div className="space-x-2 w-1/4 flex justify-end">
              <button
                className="btn btn-sm"
                onClick={() => console.log("import")}
              >
                Importer
              </button>
              <Link
                to="#Create-Project"
                className="btn btn-sm btn-neutral"
                onClick={() => setCreateProject(true)}
              >
                Nouveau
              </Link>
            </div>
          </div>

          {/* Résultats */}
            {loading ? (
              <div className="flex-1 flex justify-center items-center md:min-h-[50vh] w-full h-full">
                <div className="flex gap-2 items-center -mt-29">
                  <span className="loading loading-spinner text-primary  "></span>
                  Chargement
                  </div>
              </div>
            ) : (
              <>
                {/* Vérifier s'il n'y a aucun projet */}
                {allForms.length === 0 && groups.length === 0 ? (
                  <div className="flex-1 flex flex-col justify-center items-center md:min-h-[50vh] w-full h-full text-center">
                    <div className="max-w-md mx-auto">
                      <div className="mb-6">
                        <svg 
                          className="w-24 h-24 mx-auto text-base-content/30 mb-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-base-content mb-2">
                        Aucun projet trouvé
                      </h3>
                      <p className="text-base-content/70 mb-6">
                        Vous n'avez pas encore créé de formulaires. Commencez par créer votre premier projet !
                      </p>
                      <button
                        className="btn btn-primary"
                        onClick={() => setCreateProject(true)}
                      >
                        Créer mon premier formulaire
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="md:flex-wrap md:flex lg:grid grid-cols-5 gap-4 min-h-[55vh] md:min-h-[50vh]">
                    <>
                      {displayMode !== "groups" &&
                        ungrouped
                          .filter((f) => f.groupId === 0)
                          .map((form) => (
                            <FormCard
                              key={form.id}
                              form={form}
                              isChildren={false}
                              onRename={(newTitle) =>
                                handleRenameForm(form.id, newTitle)
                              }
                              onDelete={() => handleDeleteForm(form.id)}
                              onDuplicate={() => handleDuplicateForm(form.id)}
                              onExport={() => handleExportForm(form.id)}
                              onShare={() => handleShareForm(form.id)}
                              href={`/form/builder/edit/${form.id}`}
                            />
                          ))}

                      {displayMode !== "ungrouped" &&
                        groupsWithForms
                          .filter((g) => g && g.id != null && g.forms.length > 0)
                          .map((group) => (
                            <FolderCard
                              key={group.id}
                              selectedFolder={() => setSelectedGroup(group)}
                              title={group.title}
                              description={group.description}
                              formList={group.forms}
                              formCount={group.forms.length}
                              onDelete={() => handleDeleteGroup(group.id)}
                              onRename={(newTitle) =>
                                handleRenameGroup(group.id, newTitle)
                              }
                              onDuplicate={() => handleDuplicateGroup(group.id)}
                              onExport={() => handleExportGroup(group.id)}
                              onShare={() => handleShareGroup(group.id)}
                            />
                          ))}

                      {/* Formulaires sans groupe (groupId = 0) */}
                    </>
                  </div>
                )}
              </>
            )}

          { totalPages > 1 && (<div className="flex justify-center mt-6 space-x-2">
            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Précédent
            </button>

            {(() => {
              const maxButtons = 5; // nombre max de pages à afficher
              let start = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
              let end = start + maxButtons - 1;

              if (end > totalPages) {
                end = totalPages;
                start = Math.max(end - maxButtons + 1, 1);
              }

              const pageNumbers = [];
              for (let i = start; i <= end; i++) pageNumbers.push(i);
              return pageNumbers.map((page) => (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    currentPage === page ? "btn-primary" : ""
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ));
            })()}

            <button
              className="btn btn-sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>)}
        </div>

        {/* Modal de groupe */}
        {selectedGroup && (
          <>
            <div
              className="fixed inset-0 bg-base-200/50 backdrop-blur-xl  z-50"
              onClick={() => setSelectedGroup(null)}
            ></div>
            <div className="fixed inset-0  p-6 rounded-2xl z-50 min-h-[90vh] pointer-events -none overflow-hidden">
              <div className=" mx-auto max-w-4xl mt-20 flex flex-col  justify-between min-h-[80vh]">
                <div className="flex justify-between mb-10  ">
                  <h3 className="text-2xl font-bold text-center">
                    {selectedGroup.title} - Formulaires
                  </h3>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="btn btn-sm btn-circle"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 grid grid-cols-4 grid-rows-2 gap-4  h-full">
                  {/* {currentForms.map((form) => (
                    <FormCard
                      key={form.id}
                      form={form}
                      // isChildren={true }
                      onRename={(newTitle) => {
                        setGroups((prev) =>
                          prev.map((g) =>
                            g.id === selectedGroup.id
                              ? { ...g, title: newTitle }
                              : g
                          )
                        );

                        // 2️⃣ mettre à jour le manager central
                        projects.updateGroup(selectedGroup.id, {
                          title: newTitle,
                        });
                      }}
                      onDelete={() => handleDeleteForm(form.id)}
                      onDuplicate={() => handleDuplicateForm(form.id)}
                      onExport={() => handleExportForm(form.id)}
                      onShare={() => handleShareForm(form.id)}
                      href={`/form/preview/${form.id}`}
                    />
                  ))} */}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6  ">
                    <button
                      className="btn btn-sm"
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ArrowLeft /> Précédent
                    </button>

                    <span className="px-3">
                      Page {currentPage} / {totalPages}
                    </span>

                    <button
                      className="btn btn-sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(p + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      Suivant <ArrowRight />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {createProject && (
        <CreateProject callBack={() => setCreateProject(false)} />
      )}
      <Footer />
    </>
  );
}
