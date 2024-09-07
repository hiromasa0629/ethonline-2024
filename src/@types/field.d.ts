export type FieldType = {
  name: string;
  label: string;
  type: "input" | "textarea" | "date" | "autocomplete";
  placeholder?: string;
};

export type FormDataType = { [key: string]: string | Date };
