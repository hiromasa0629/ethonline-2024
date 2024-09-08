import { useNavigate } from "react-router-dom";

const PostAttestationMsg = () => {
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/50 flex items-center justify-center">
      <div className="flex flex-col w-4/5 p-5 items-center justify-center rounded-xl bg-white">
        <p>Attestation successful!</p>
        <button
          className="w-full py-3 font-poppins text-white bg-purple"
          onClick={() => navigate("/")}
        >
          Return to home
        </button>
      </div>
    </div>
  );
};

export default PostAttestationMsg;
