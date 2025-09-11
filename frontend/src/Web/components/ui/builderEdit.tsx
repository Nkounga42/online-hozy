import { FieldEditor, FieldTypeSelector } from "../form-builder";
import PageEditor from "../form-builder/PageEditor";
import { FormNavigator } from "../form-builder/FormNavigator";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import type { FieldType, BuilderEditProps } from "../../shared/form-types";


const BuilderEdit = ({
  addPage,
  goToPage,
  setShowFormDetails,
  insertFieldAt,
  dropRef,
  addFieldAfter,
  duplicateField,
  deleteField,
  activePage,
  updateField,
  form,
  updateFormDetails,
  addField,
  activePageIndex,
  showFormDetails,
  dropContainerRef,
  setFormWithHistory,
  showNavigator,
  showFieldTypeSelector,
}: BuilderEditProps) => {
  return (
    <>
      <div className="flex w-full">
        {showFieldTypeSelector && (
          <div className="min-w-[300px] overflow-y-auto bg-base-200 border-r border-base-content/10 ">
            <FieldTypeSelector onSelectType={addField} />
          </div>
          )}
        <div
          className="w-3/5 space-y-6 overflow-y-auto flex justify-center w-full"
          style={{ height: "calc(100vh - 3rem)" }}
        >
        <div className="min-w-3xl my-6">

          <div className="bg-base-200/30 border rounded-box border-base-300 mt-4 mb-6 p-6">
            <div className="  space-y-4">
              <div>
                <div className="flex items-start justify-between mb-2 ">
                  <div>
                    <h2 className="card-title">{form.title && form.title}</h2>
                    <p> {form.description}</p>
                  </div>
                  <button
                    className="btn btn-soft btn-sm m"
                    onClick={() => setShowFormDetails((prev) => !prev)}
                  >
                    {showFormDetails
                      ? "Masquer les détails"
                      : "Modifier les détails"}
                  </button>
                </div>
                {showFormDetails && (
                  <>
                    <div className=" my-3">
                      <label className="label" htmlFor="form-title">
                        Détails du formulaire
                      </label>
                      <input
                        id="form-title"
                        className="input input-bordered w-full"
                        value={form.title}
                        onChange={(e) =>
                          updateFormDetails({ title: e.target.value })
                        }
                        placeholder="Enter form title"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="label" htmlFor="form-description">
                        Description (optional)
                      </label>
                      <textarea
                        id="form-description"
                        className="textarea textarea-bordered w-full"
                        value={form.description || ""}
                        onChange={(e) =>
                          updateFormDetails({
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Enter form description"
                      />
                    </div>
                    <div className={`space-x-2 flex `}>
                      <div
                        className="h-10 w-10 rounded-full flex"
                        style={{ backgroundColor: form.theme }}
                      >
                        <input
                          type="color"
                          className="w-10 h-10 opacity-0"
                          value={form.theme}
                          onChange={(e) =>
                            updateFormDetails({ theme: e.target.value })
                          }
                        />
                      </div>

                      <label className="label" htmlFor="form-background-color">
                        Couleur de fond
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            ref={(el) => {
              dropRef(el);
              dropContainerRef.current = el;
            }}
            className="space-y-4 mt-5"
          >
            <div className=""> {activePage.title} </div>
            {activePage.fields.map((field) => (
              <FieldEditor
                key={field.id}
                field={field}
                onUpdate={(updates) =>
                  updateField(field.id, { ...field, ...updates })
                }
                onDelete={() => deleteField(field.id)}
                onDuplicate={() => duplicateField(field.id)}
                onAddFieldAfter={(fieldId: string, type: FieldType) =>
                  addFieldAfter(fieldId, type)
                }
              />
            ))}
            {activePage.fields.length === 0 && (
              <PageEditor
                pageIndex={activePageIndex}
                page={activePage}
                onInsertFieldAt={insertFieldAt}
                onUpdateField={updateField}
                onDeleteField={deleteField}
                onDuplicateField={duplicateField}
                onAddFieldAfter={addFieldAfter}
              />
            )}
          </div>

        </div>
        </div>
        {showNavigator && (
          <div className="min-w-[300px] overflow-y-auto bg-base-200 border-l border-base-content/10 ">
            <div className="p-4 space-y-2 relative">
              <h3 className="text-lg font-bold mb-2">
                Structure du formulaire
              </h3>

              <div className="flex gap-2 my-4 justify-between">
                <p className="join-item">Page{form.pages.length > 1 && "s"} </p>

                <button className="btn btn-sm btn-soft" onClick={addPage}>
                  <Plus className="h-4 w-4" /> Nouvelle page
                </button>
              </div>

              <FormNavigator
                pages={form.pages}
                activePageIndex={activePageIndex}
                onReorder={(pageIndex, newFields) => {
                  setFormWithHistory((prev) => {
                    const newPages = [...prev.pages];
                    newPages[pageIndex] = {
                      ...newPages[pageIndex],
                      fields: newFields,
                    };
                    return { ...prev, pages: newPages };
                  });
                }}
                setActivePageIndex={goToPage}
              />
            </div>
          </div>
        )}
      </div>

      <div className="join absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xs bg-base-content/10 rounded-lg">
        <button
          className="btn btn-sm btn-ghost join-item"
          disabled={activePageIndex === 0}
          onClick={() => goToPage(activePageIndex - 1)}
        >
          <ArrowLeft />
        </button>
        <div
          className="join-item px-3 flex justify-center items-center tooltip-secondary tooltip"
          data-tip={form.pages[activePageIndex].title}
        >
          {activePageIndex + 1}{" "}
        </div>
        <button
          className="btn btn-sm btn-ghost join-item"
          disabled={activePageIndex === form.pages.length - 1}
          onClick={() => goToPage(activePageIndex + 1)}
        >
          <ArrowRight />
        </button>
      </div>
    </>
  );
};

export default BuilderEdit;
