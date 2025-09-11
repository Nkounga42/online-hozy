import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { FormField, Form } from "../../shared/form-types";
import { ChevronDown, ChevronRight, GripVertical } from "lucide-react";

const ItemType = "FIELD";

interface FormNavigatorProps {
  pages: Form["pages"];
  activePageIndex: number;
  onReorder: (pageIndex: number, newFields: FormField[]) => void;
  setActivePageIndex: (index: number) => void;
}

interface FieldItemProps {
  field: FormField;
  index: number;
  moveField: (from: number, to: number) => void;
  onClick: (id: string) => void;
}

function FieldItem({ field, index, moveField, onClick }: FieldItemProps) {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }) {
      if (!ref.current || item.index === index) return;
      moveField(item.index, index);
      item.index = index;
    },
  });

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-primary/20 hover:text-primary cursor-pointer transition"
      onClick={() => onClick(field.id)}
    > <GripVertical className="w-4 h-4" />
      {field.icon && <field.icon className="w-4 h-4 opacity-70" />}
      <span className="truncate">{field.label || "Sans titre"}</span>
    </li>
  );
}

export function FormNavigator({
  pages,
  activePageIndex,
  onReorder,
  setActivePageIndex,
}: FormNavigatorProps) {
  const handleScrollTo = (fieldId: string) => {
    const el = document.getElementById(fieldId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const moveField = (pageIndex: number, from: number, to: number) => {
    const updated = [...pages[pageIndex].fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    onReorder(pageIndex, updated);
  };

  return (
    <div
      className="overflow-y-auto space-y-2"
      style={{ height: "calc(100vh - 10.5rem)" }}
    >
      <ul className="space-y-2">
        {pages.map((page, pageIndex) => {
          const isActive = pageIndex === activePageIndex;

          return (
            <li
              key={pageIndex}
              className="bg-base-100 border border-base-200 rounded-box overflow-hidden"
            >
              <details
                open={isActive}
                onToggle={(e) => {
                  const el = e.currentTarget as HTMLDetailsElement;
                  if (el.open) setActivePageIndex(pageIndex);
                }}
              >
                <summary className="flex items-center justify-between px-4 py-2 font-semibold text-base-content hover:bg-primary/10 hover:text-primary  rounded-t-box cursor-pointer">
                  <span>{page.title || `Page ${pageIndex + 1}`}</span>
                  {isActive ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </summary>

                <ul className="pl-2 pr-2 py-2 space-y-1">
                  {page.fields.map((field, index) => (
                    <FieldItem
                      key={field.id}
                      field={field}
                      index={index}
                      moveField={(from, to) => moveField(pageIndex, from, to)}
                      onClick={handleScrollTo}
                    />
                  ))}
                  {page.fields.length === 0 && (
                    <li className="text-sm text-base-content/60 italic px-3">
                      Aucun champ
                    </li>
                  )}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
