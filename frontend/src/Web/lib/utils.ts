import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FieldType } from "../shared/form-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFieldTypeLabel(type: FieldType): string {
  const labels = {
    text: "Texte court",
    textarea: "Texte long",
    email: "Adresse e-mail",
    number: "Nombre",
    select: "Liste déroulante",
    radio: "Choix unique",
    checkbox: "Cases à cocher",
    date: "Date",
    file: "Téléversement de fichier",
  };
  return labels[type];
}


export function needsOptions(type: FieldType): boolean {
  return ["select", "radio", "checkbox"].includes(type);
}
