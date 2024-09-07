import { FieldType, FormDataType } from "../@types/field";
import DynamicForm from "../components/DynamicForm";
import { useSignAttestation } from "../hooks/useSignAttestation";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

import config from "../config.json";

const formFields: FieldType[] = [
  {
    label: "Company Name",
    name: "company_name",
    type: "input",
    placeholder: "Input company name",
  },
  {
    label: "Employee Name",
    name: "employee_name",
    type: "autocomplete",
    placeholder: "Input employee name",
  },
  {
    label: "Job Title",
    name: "job_title",
    type: "input",
    placeholder: "Input job title",
  },
  {
    label: "Supervisor Name",
    name: "supervisor_name",
    type: "input",
    placeholder: "Input supervisor name",
  },
  {
    label: "Supervisor Position",
    name: "supervisor_position",
    type: "input",
    placeholder: "Input supervisor position",
  },
  {
    label: "Supervisor Contact Info",
    name: "supervisor_contact_info",
    type: "input",
    placeholder: "Input supervisor contact info",
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

const WorkExperience = () => {
  const { user } = useWeb3Auth();
  const { createExperienceAttestation } = useSignAttestation();

  const handleFormSubmit = (formDataType: FormDataType) => {
    console.log(formDataType);
    createExperienceAttestation({
      schemaId: config.schemaId.work,
      data: {
        company_name: formDataType["company_name"],
        employee_name: formDataType["employee_name"],
        job_title: formDataType["job_title"],
        supervisor_name: formDataType["supervisor_name"],
        supervisor_position: formDataType["supervisor_position"],
        supervisor_contact_info: formDataType["supervisor_contact_info"],
        start_date: formDataType["start_date"],
        end_date: formDataType["end_date"],
        signature: "0x1234",
      },
      attester: user?.swAddress as `0x${string}`,
      indexingValue: String(formDataType["employee_address"]),
      recipients: [String(formDataType["employee_address"])],
    });
  };

  return (
    <div className="w-full h-fit flex flex-col space-y-5">
      <div className="w-full bg-purple flex flex-col items-center justify-center py-5 rounded-b-2xl text-white">
        <p className="text-4xl">ATTEST</p>
        <p>Work Experience</p>
      </div>
      <DynamicForm fields={formFields} type="work" onSubmit={handleFormSubmit} />
    </div>
  );
};

export default WorkExperience;
