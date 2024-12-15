import { AuthRecord } from "pocketbase";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { pb, useUserStore } from "../lib/pocketbase";

export type LoginFormData = {
  email: string;
  password: string;
  name: string;
  passwordConfirm: string;
};
export default function LoginPage() {
  const currentUser: AuthRecord = useUserStore().user;

  const navigate = useNavigate();

  async function signOut() {
    pb.authStore.clear();
  }

  async function signUp(email: string, name: string, password: string) {
    try {
      const data: FormData = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      await pb.collection("users").create(data);
      await login(email, password);
    } catch (err) {
      console.error(err);
    }
  }
  if (currentUser) {
    navigate("/");
  }
  return <LoginForm />;
}
