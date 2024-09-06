import { useState } from "react";
import { FieldType, FormDataType } from "../@types/field";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DynamicFormProps {
  fields: FieldType[];
  type: "endorse" | "education" | "work";
  onSubmit: (FormDataType: FormDataType) => void;
}

const DynamicForm = ({ fields, type, onSubmit }: DynamicFormProps) => {
  const [formDataType, setFormData] = useState<FormDataType>(
    fields.reduce((acc: FormDataType, field: FieldType) => {
      acc[field.name] = field.type === "date" ? new Date().toISOString().split("T")[0] : "";
      return acc;
    }, {})
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === "endorse") {
      formDataType["date_of_endorsement"] = new Date().toISOString().split("T")[0];
    }
    formDataType["signature"] = "0x123";
    onSubmit(formDataType);
  };

  const handleInputChange = (name: string, value: string | Date) => {
    const stringValue = value instanceof Date ? value.toISOString().split("T")[0] : value; // Converts Date to 'YYYY-MM-DD' format
    setFormData((prev) => ({
      ...prev,
      [name]: stringValue,
    }));
  };

  return (
    <div className="w-full flex justify-center">
      <form
        className="w-[85%] py-5 px-4 flex flex-col items-center bg-white border border-black/20 rounded-2xl"
        onSubmit={handleSubmit}
      >
        {fields.map((field, index) => (
          <div className="w-full flex flex-col mb-6 font-poppins" key={index}>
            <label className="font-poppins" htmlFor={field.label}>
              {field.label}
            </label>
            {field.type === "input" ? (
              <input
                className="w-full border border-black/80 focus:border-yellow rounded-lg px-2 py-1"
                id={field.label}
                name={field.name}
                placeholder={field.placeholder}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            ) : field.type === "textarea" ? (
              <textarea
                className="w-full border border-black/80 focus:border-yellow rounded-lg px-2 py-1"
                id={field.label}
                name={field.name}
                placeholder={field.placeholder}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
              />
            ) : field.type === "date" ? (
              <DatePicker
                className="w-full border border-black/80 focus:border-yellow rounded-lg px-2 py-1"
                selected={new Date(formDataType[field.name])}
                onChange={(date: Date | null) => {
                  if (date) handleInputChange(field.name, date);
                }}
                dateFormat="yyyy-MM-dd"
              />
            ) : null}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-purple rounded-xl text-center text-white py-2 mb-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
