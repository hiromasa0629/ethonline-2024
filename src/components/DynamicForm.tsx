import { useEffect, useState } from "react";
import { FieldType, FormDataType } from "../@types/field";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User } from "../@types/user";
import { useFirestore } from "../hooks/useFirestore";

interface DynamicFormProps {
  fields: FieldType[];
  type: "endorse" | "education" | "work";
  isLoading: boolean;
  onSubmit: (FormDataType: FormDataType) => void;
}

const DynamicForm = ({ fields, type, isLoading, onSubmit }: DynamicFormProps) => {
  const [formDataType, setFormData] = useState<FormDataType>(
    fields.reduce((acc: FormDataType, field: FieldType) => {
      acc[field.name] = field.type === "date" ? new Date().toISOString().split("T")[0] : "";
      return acc;
    }, {})
  );
  const { findTalents } = useFirestore();
  const [allTalents, setAllTalents] = useState<User[]>([]);
  const [autocompleteInput, setAutocompleteInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      const talents = await findTalents();
      // setAllTalents(talents.filter((v) => v.name !== user?.name));
      setAllTalents(talents);
    };
    getUsers();
  }, []);

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
    if (name === "endorsee_name" || name === "employee_name" || name === "student_name") {
      setAutocompleteInput(stringValue);
      if (stringValue) {
        const filtered = allTalents.filter((v) =>
          v.name.toLowerCase().includes(stringValue.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: stringValue,
      }));
    }
  };

  const handleSuggestionClick = (suggestion: string, address: string) => {
    setAutocompleteInput(suggestion);
    setShowSuggestions(false);
    setFormData((prev) => ({
      ...prev,
      ["endorsee_name"]: suggestion,
      ["endorsee_address"]: address,
      ["student_name"]: suggestion,
      ["student_address"]: address,
      ["employee_name"]: suggestion,
      ["employee_address"]: address,
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
                className="w-full border border-black/80 focus:border-yellow rounded-lg px-2 py-1 h-[300px]"
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
            ) : field.type === "autocomplete" ? (
              <div className="relative">
                <input
                  className="w-full border border-black/80 focus:border-yellow rounded-lg px-2 py-1"
                  id={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  value={autocompleteInput}
                />
                {showSuggestions && (
                  <ul className="absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.length ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <li
                          key={index}
                          className="p-2 hover:bg-purple-100 cursor-pointer"
                          onClick={() =>
                            handleSuggestionClick(suggestion.name, suggestion.swAddress)
                          }
                        >
                          {suggestion.name}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No suggestions available</li>
                    )}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-purple rounded-xl text-center text-white py-2 mb-4"
          disabled={isLoading}
        >
          {isLoading ? "loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
