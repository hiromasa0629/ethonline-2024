import { FieldType, FormDataType } from "../@types/field";
import DynamicForm from "../components/DynamicForm";
import { useSignAttestation } from "../hooks/useSignAttestation";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

import config from "../../public/config.json";

const formFields: FieldType[] = [
  {
    label: "Endorsee Name",
    name: "endorsee_name",
    type: "input",
    placeholder: "Input endorsee full name",
  },
  {
    label: "Endorsee Name",
    name: "endorser_name",
    type: "input",
    placeholder: "Input endorser full name",
  },
  {
    label: "Endorsee Name",
    name: "endorser_position",
    type: "input",
    placeholder: "Input endorser position",
  },
  {
    label: "Endorsee Name",
    name: "endorser_text",
    type: "textarea",
    placeholder: "Input endorsing message",
  },
];

const Endorsement = () => {
  const { user } = useWeb3Auth();
  const { createAttestation } = useSignAttestation();

  const handleFormSubmit = (formDataType: FormDataType) => {
    console.log(formDataType);
    createAttestation({
      schemaId: config.schemaId.endorsement,
      data: formDataType,
      indexingValue: user?.address as string,
    });
  };

  return (
    <div className="w-full h-fit flex flex-col space-y-5">
      <div className="w-full bg-purple flex justify-center py-5 rounded-b-2xl">
        <p className="text-4xl text-white">ENDORSEMENT</p>
      </div>
      <DynamicForm fields={formFields} type="endorse" onSubmit={handleFormSubmit} />
    </div>
  );
};

export default Endorsement;
