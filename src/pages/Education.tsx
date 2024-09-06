import { FieldType, FormDataType } from "../@types/field";
import DynamicForm from "../components/DynamicForm";
import { useSignAttestation } from "../hooks/useSignAttestation";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

import config from "../../public/config.json";

const formFields: FieldType[] = [
  {
    label: "University Name",
    name: "university_name",
    type: "input",
    placeholder: "Input university name",
  },
  {
    label: "Degree Title",
    name: "degree_title",
    type: "input",
    placeholder: "Input degree title/field of study",
  },
  {
    label: "Student Name",
    name: "student_name",
    type: "input",
    placeholder: "Input student name",
  },
  {
    label: "Student ID",
    name: "student_id",
    type: "input",
    placeholder: "Input student id",
  },
  {
    label: "Grade",
    name: "grade",
    type: "input",
    placeholder: "Input grade (eg '3.5 CGPA')",
  },
  {
    label: "Start Date",
    name: "start_date",
    type: "date",
  },
  {
    label: "End Date",
    name: "end_date",
    type: "date",
  },
];

const Education = () => {
  const { user } = useWeb3Auth();
  const { createAttestation } = useSignAttestation();

  const handleFormSubmit = (formDataType: FormDataType) => {
    console.log(formDataType);
    createAttestation({
      schemaId: config.schemaId.education,
      data: formDataType,
      indexingValue: user?.address as string,
    });
  };

  return (
    <div className="w-full h-fit flex flex-col space-y-5">
      <div className="w-full bg-purple flex flex-col items-center justify-center py-5 rounded-b-2xl text-white">
        <p className="text-4xl">ATTEST</p>
        <p>EDUCATION</p>
      </div>
      <DynamicForm fields={formFields} type="education" onSubmit={handleFormSubmit} />
    </div>
  );
};

export default Education;
