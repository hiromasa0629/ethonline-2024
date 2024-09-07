import { FieldType, FormDataType } from "../@types/field";
import DynamicForm from "../components/DynamicForm";
import { useSignAttestation } from "../hooks/useSignAttestation";
import { useWeb3Auth } from "../hooks/useWeb3Auth";

import config from "../config.json";

const formFields: FieldType[] = [
  {
    label: "Endorsee Name",
    name: "endorsee_name",
    type: "autocomplete",
    placeholder: "Input endorsee full name",
  },
  {
    label: "Endorser Position",
    name: "endorser_position",
    type: "input",
    placeholder: "Input endorser position",
  },
  {
    label: "Details",
    name: "endorser_text",
    type: "textarea",
    placeholder: "Input endorsing message",
  },
];

const Endorsement = () => {
  const { user } = useWeb3Auth();
  const { createEndorsementAttestation } = useSignAttestation();

  const handleFormSubmit = (formDataType: FormDataType) => {
    console.log(formDataType);
    createEndorsementAttestation({
      schemaId: config.schemaId.endorsement,
      data: {
        endorsee_name: formDataType["endorsee_name"],
        endorser_name: user?.name ?? "",
        endorser_position: formDataType["endorser_position"],
        endorser_text: formDataType["endorser_text"],
        date_of_endorsement: new Date().toISOString(),
        signature: "0x1234",
      },
      attester: user?.swAddress as `0x${string}`,
      indexingValue: String(formDataType["endorsee_address"]),
      recipients: [String(formDataType["endorsee_address"])],
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
