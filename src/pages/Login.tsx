import { useWeb3Auth } from "../hooks/useWeb3Auth";
import books from "../assets/books.png";
import proof from "../assets/proof.png";

const Login = () => {
  const { handleLogIn } = useWeb3Auth();

  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center bg-app-white">
        <div>
          <img src={proof} />
        </div>
        <div>
          <img src={books} />
        </div>
        <div>
          <button
            onClick={handleLogIn}
            className="bg-app-green px-6 py-3 rounded-full text-app-white text-2xl"
          >
            Log In
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
