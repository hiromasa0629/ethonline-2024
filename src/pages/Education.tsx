import { FieldType, FormDataType } from "../@types/field";
import DynamicForm from "../components/DynamicForm";
import { useSignAttestation } from "../hooks/useSignAttestation";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

import config from "../config.json";
import { useState } from "react";
import PostAttestationMsg from "../components/PostAttestationMsg";

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
    type: "autocomplete",
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
  const { createCertificateAttestation } = useSignAttestation();
  const [attested, setAttested] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formDataType: FormDataType) => {
    setIsLoading(true);
    await createCertificateAttestation({
      schemaId: config.schemaId.education,
      // data: await signEducation({
      //   university_name: formDataType["university_name"] as string,
      //   degree_title: formDataType["degree_title"] as string,
      //   student_name: formDataType["student_name"] as string,
      //   student_id: formDataType["student_id"] as string,
      //   grade: formDataType["grade"] as string,
      //   start_date: formDataType["start_date"] as string,
      //   end_date: formDataType["end_date"] as string,
      // }),
      data: {
        university_name: formDataType["university_name"] as string,
        degree_title: formDataType["degree_title"] as string,
        student_name: formDataType["student_name"] as string,
        student_id: formDataType["student_id"] as string,
        grade: formDataType["grade"] as string,
        start_date: formDataType["start_date"] as string,
        end_date: formDataType["end_date"] as string,
        signature: "0x1234",
      },
      attester: user?.swAddress as `0x${string}`,
      indexingValue: String(formDataType["student_address"]),
      recipients: [String(formDataType["student_address"])],
    })
      .then(() => {
        setAttested(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="relative w-full h-fit flex flex-col space-y-5">
      <div className="w-full bg-purple flex flex-col items-center justify-center py-5 rounded-b-2xl text-white">
        <p className="text-4xl">ATTEST</p>
        <p>EDUCATION</p>
      </div>
      <DynamicForm
        fields={formFields}
        type="education"
        isLoading={isLoading}
        onSubmit={handleFormSubmit}
      />
      {attested && <PostAttestationMsg />}
    </div>
  );
};

export default Education;
