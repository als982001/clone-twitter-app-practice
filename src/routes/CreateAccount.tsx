import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "../firebase";
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../Components/AuthComponents";
import GithubButton from "../Components/GithubButton";

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "name") {
      setName(value);
    }

    if (name === "password") {
      setPassword(value);
    }

    if (name === "email") {
      setEmail(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || !name || !email || !password) {
      setError("모든 칸 다 채우세요.");
      return;
    }

    try {
      setIsLoading(true);

      // create an account
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // set the name of the user
      await updateProfile(credentials.user, { displayName: name });

      // redirect to the home page
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Join into 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error && <Error>{error}</Error>}
      <Switcher>
        Already has an account? <Link to="/login">Log in &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
