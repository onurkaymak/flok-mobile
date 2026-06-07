import { useState } from "react";
import SignInForm from "../components/auth/SignInForm";
import SignUpForm from "../components/auth/SignUpForm";

export default function AuthScreen() {
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleFormHandler = () => {
    setShowSignUp((prev) => !prev);
  };

  return !showSignUp ? (
    <SignInForm onCreateAccountButton={toggleFormHandler} />
  ) : (
    <SignUpForm onCreateAccount={toggleFormHandler} />
  );
}
