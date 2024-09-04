import { useEffect, useState } from "react";
import { useSignSchema } from "./hooks/useSignSchema";
import { useWeb3Auth } from "./hooks/useWeb3Auth";
import Login from "./pages/Login";
import AppRouter from "./router/AppRouter";

function App() {
  const { user, handleLogIn, handleLogOut, isLoggedIn, isLoading: isLoginLoading } = useWeb3Auth();
  const { createSchema } = useSignSchema();

  return <>{isLoggedIn ? <AppRouter /> : <Login />}</>;
}

export default App;
