import Head from "next/head";
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import InputField from "~/components/FormComponents/InputField";
import { api } from "~/utils/api";
import { textContent } from "~/TextContent/text";
import { useForm } from "react-hook-form";
import { regex } from "~/utils/constant";
import Link from "next/link";
import { blue } from "~/theme/colors";
import type { IErrorCatch } from "~/interface/common";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import { setCookie } from "cookies-next";

interface ILoginParams {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { control, handleSubmit } = useForm<ILoginParams>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: login, isLoading } = api.user.login.useMutation();

  const onSubmit = async (values: ILoginParams) => {
    try {
      const temp = await login({
        email: values.email,
        password: values.password,
      });
      setCookie("token", temp.token, { maxAge: 60 * 6 * 24 });
    } catch (e) {
      const error = e as IErrorCatch;
      toast.error(error.message);
      return;
    }

    toast.success(textContent.loginSuccess);
    void router.push("/");
  };

  return (
    <>
      <Head>
        <title>Nah | Login</title>
      </Head>
      <Container sx={{ display: "flex", minHeight: "100vh" }}>
        <Box
          sx={{
            margin: "auto",
            gap: "8px",
            width: "350px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography m="auto" variant="h2" mb={1}>
            Login
          </Typography>

          <Box>
            <Typography variant="body1">Email</Typography>
            <InputField
              control={control}
              name="email"
              rules={{
                required: textContent.requiredError,
                pattern: {
                  value: regex.email,
                  message: textContent.emailError,
                },
              }}
            />
          </Box>

          <Box>
            <Typography variant="body1">Password</Typography>
            <InputField
              control={control}
              name="password"
              type="password"
              rules={{
                required: textContent.requiredError,
                min: 6,
              }}
            />
          </Box>

          <LoadingButton
            variant="contained"
            sx={{ fontSize: "1rem" }}
            onClick={() => {
              void handleSubmit(onSubmit)();
            }}
            title="Login"
            loading={isLoading}
          />
          <Link
            style={{
              textDecoration: "underline",
              color: blue[700],
              alignSelf: "flex-end",
            }}
            href={"/auth/register"}
          >
            {textContent.goRegisterPage}
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
