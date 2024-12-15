import { AuthRecord } from "pocketbase";
import { useState } from "react";
import { pb, useUserStore } from "../lib/pocketbase";

export default function LoginPage() {
  const currentUser: AuthRecord = useUserStore().user;

  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [name, setName] = useState<string | undefined>();

  async function login() {
    if (email && password) {
      await pb.collection("users").authWithPassword(email, password);
    } else {
      console.log("Can't sign in without a email and password");
    }
  }

  async function signOut() {
    pb.authStore.clear();
  }

  async function signUp() {
    try {
      const data = {
        email,
        password,
        passwordConfirm: password,
        name,
      };
      const createdUser: RecordModel = await pb
        .collection("users")
        .create(data);
      await login();
    } catch (err) {
      console.error(err);
    }
  }
}
