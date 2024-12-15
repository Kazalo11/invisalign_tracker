import { AuthRecord } from "pocketbase";
import { useState } from "react";
import { useUserStore } from "../lib/pocketbase";

export default function LoginPage() {
  const currentUser: AuthRecord = useUserStore().user;

  const [username, setUsername] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
}
