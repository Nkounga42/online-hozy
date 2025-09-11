import { useRef } from "react";
import { FieldEditor } from "./FieldEditor";
import { useDrop } from "react-dnd";
import type { FieldType, FormField, PageEditorProps } from "../../shared/form-types";

 

export default function PageEditor({
  pageIndex,
  page,
  onInsertFieldAt,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onAddFieldAfter,
}: PageEditorProps) {
  const dropContainerRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, dropRef] = useDrop(() => ({
    accept: "FIELD_TYPE",
    drop: (item: { type: FieldType }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const container = dropContainerRef.current;
      if (!container) return;

      const children = Array.from(container.children);
      const fieldElements = children.filter((el) =>
        el.hasAttribute("data-field-id")
      );

      let closestIndex = page.fields.length;
      for (let i = 0; i < fieldElements.length; i++) {
        const el = fieldElements[i] as HTMLElement;
        const rect = el.getBoundingClientRect();
        const middleY = rect.top + rect.height / 2;

        if (clientOffset.y < middleY) {
          closestIndex = i;
          break;
        }
      }

      onInsertFieldAt(item.type, closestIndex, pageIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="space-y-4" ref={(el) => { dropRef(el); dropContainerRef.current = el; }}>
      {/* <h2>{page.title}</h2> */}
      {page.fields.map((field ) => {
        
        return (
          <FieldEditor
            key={field.id}
            field={field}
            onUpdate={(updatedField: FormField) => onUpdateField(field.id, updatedField)}
            onDelete={() => onDeleteField(field.id)}
            onDuplicate={() => onDuplicateField(field.id)}
            onAddFieldAfter={onAddFieldAfter}
          />
        );
      })}
      {page.fields.length === 0 && (
        <div className={`card border-dashed border-base-300 text-center py-8 ${isOver ? "bg-base-200" : "bg-base-100"}`}>
          <div className="card-body">
            <h2 className="text-xl font-semibold mb-2">Glissez un champ ici</h2>
            <p className="text-base-content/70">Ajoutez un champ en le glissant depuis la gauche.</p>
          </div>
        </div>
      )}
    </div>
  );
}
