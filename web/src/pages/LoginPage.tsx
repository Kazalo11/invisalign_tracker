import { Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import "../index.css";
import { usePocket } from "../lib/PocketContext";

type LoginFormData = {
  email: string;
  password: string;
};
export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const { login, user } = usePocket();

  const [errors, setErrors] = useState<string>();

  if (user) {
    window.location.href = "/";
  }

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { email, password } = formData;
    try {
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setErrors("Email or password is incorrect");
    }
  }

  const handleChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form onSubmit={(e) => signIn(e)}>
      <VStack>
        <Heading>Sign In</Heading>
        <Field label="Email" required>
          <Input
            variant={"subtle"}
            placeholder="Email"
            type="email"
            name="email"
            onBlur={handleChange}
            required
          />
        </Field>
        <Field label="Enter your password" helperText={errors} required>
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
