import { Heading, Input } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { pb } from "../lib/pocketbase";
import { LoginFormData } from "../pages/LoginPage";
import { Button } from "./ui/button";
import { Field } from "./ui/field";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const navigate = useNavigate();

  async function signUp() {
    try {

      await pb.collection("users").create(formData);
      await login();
    } catch (err) {
      console.error(err);
    }
  async function login() {
    const email = formData.email;
    const password = formData.password;
    if (email && password) {
      await pb.collection("users").authWithPassword(email, password);
      navigate("/");
    } else {
      console.log("Can't sign in without a email and password");
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
    <form onSubmit={() => login()}>
      <Heading>Login</Heading>
      <Field label="Name" required>
        <Input
          variant={"subtle"}
          placeholder="Name"
          name="name"
          onBlur={handleChange}
          required
        />
      </Field>
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
      <Field label="Confirm your password" required>
        <Input
          variant={"subtle"}
          placeholder="Confirm Password"
          type="password"
          name="passwordConfirm"
          onBlur={handleChange}
          required
        />
      </Field>
      <Button>Sign Up</Button>
    </form>
  );
}
