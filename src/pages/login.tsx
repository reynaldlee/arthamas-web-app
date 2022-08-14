import { trpc } from "@/utils/trpc";
import { Button, FormHelperText, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { setCookie } from "nookies";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, error, isError } = trpc.useMutation(["auth.login"]);

  const [fields, setFields] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setFields((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    login(
      {
        username: fields.username,
        password: fields.password,
      },
      {
        onSuccess: (result) => {
          setCookie(null, "session", result.accessToken, {
            maxAge: 24 * 60 * 60,
            path: "/",
          });
          router.push("/");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          name="username"
          label="Username"
          value={fields.username}
          onChange={handleChange}
        ></TextField>
        <TextField
          name="password"
          label="Password"
          type="password"
          value={fields.password}
          onChange={handleChange}
        ></TextField>
        <FormHelperText error={isError}>{error?.message}</FormHelperText>
        <Button type="submit" variant="contained">
          Login
        </Button>
      </Box>
    </form>
  );
}
