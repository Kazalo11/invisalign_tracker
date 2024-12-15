import { Heading, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Field } from "../components/ui/field";
import "../index.css";
import { usePocket } from "../lib/PocketContext";
export type SignUpFormData = {
  email: string;
  password: string;
  name: string;
  passwordConfirm: string;
};
export default function SignUp() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const { register, login } = usePocket();

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      console.log("Can't submit due to validation");
      return;
    }
    try {
      await register(formData);
      const email = formData.email;
      const password = formData.password;
      await login(email, password);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  }

  const handleChange = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (data: SignUpFormData): Partial<SignUpFormData> => {
    const errors: Partial<SignUpFormData> = {};
    if (data.password != data.passwordConfirm) {
      errors.passwordConfirm = "Passwords don't match";
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        data.password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character.";
    }
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    return errors;
  };

  return (
    <form onSubmit={(e) => signUp(e)}>
      <VStack>
        <Heading>Sign Up</Heading>
        <Field
          label="Name"
          invalid={!!errors.name && errors.name.length > 0}
          helperText={errors.name}
          required
        >
          <Input
            variant={"subtle"}
            placeholder="Name"
            name="name"
            onBlur={handleChange}
            required
          />
        </Field>
        <Field
          label="Email"
          invalid={!!errors.email && errors.email.length > 0}
          helperText={errors.email}
          required
        >
          <Input
            variant={"subtle"}
            placeholder="Email"
            type="email"
            name="email"
            onBlur={handleChange}
            required
          />
        </Field>
        <Field
          label="Enter your password"
          invalid={!!errors.password && errors.password.length > 0}
          helperText={errors.password}
          required
        >
          <Input
            variant={"subtle"}
            placeholder="Password"
            type="password"
            name="password"
            onBlur={handleChange}
            required
          />
        </Field>
        <Field
          label="Confirm your password"
          invalid={
            !!errors.passwordConfirm && errors.passwordConfirm.length > 0
          }
          helperText={errors.passwordConfirm}
          required
        >
          <Input
            variant={"subtle"}
            placeholder="Confirm Password"
            type="password"
            name="passwordConfirm"
            onBlur={handleChange}
            required
          />
        </Field>
        <Button type="submit" className="sign-up-btn">
          Sign Up
        </Button>
        <Text>
          Already a user? <Link to="../login">Login</Link>
        </Text>
      </VStack>
    </form>
  );
}
