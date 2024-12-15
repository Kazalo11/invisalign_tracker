import { Heading, Input, Text, VStack } from "@chakra-ui/react";
import { AuthRecord } from "pocketbase";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import "../index.css";
import { pb, useUserStore } from "../lib/pocketbase";

type LoginFormData = {
  email: string;
  password: string;
};
export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  async function login() {
    const { email, password } = formData;
    if (email && password) {
      await pb.collection("users").authWithPassword(email, password);
      navigate("/");
    } else {
      console.log("Can't sign in without a email and password");
    }
  }
  async function signOut() {
    pb.authStore.clear();
  }
  const handleChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const currentUser: AuthRecord = useUserStore().user;

  const navigate = useNavigate();

  if (currentUser) {
    navigate("/");
  }
  return (
    <form onSubmit={login}>
      <VStack>
        <Heading>Sign In</Heading>
        <Field label="email" required>
          <Input
            variant={"subtle"}
            placeholder="Email"
            type="email"
            name="email"
            onBlur={handleChange}
            required
          />
        </Field>
        <Field label="Enter your password" required>
          <Input
            variant={"subtle"}
            placeholder="Password"
            type="password"
            name="password"
            onBlur={handleChange}
            required
          />
        </Field>
        <Button type="submit" className="sign-up-btn">
          Sign In
        </Button>
        <Text>
          Don't have an account? <Link to="../signup">Sign Up</Link>
        </Text>
      </VStack>
    </form>
  );
}
