import { Box, Container, Typography } from "@mui/material";
import { setCookie } from "cookies-next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import InputField from "~/components/FormComponents/InputField";
import type { IErrorCatch } from "~/interface/common";
import { blue } from "~/theme/colors";
import { paletteLight } from "~/theme/palette";
import { api } from "~/utils/api";
import { regex } from "~/utils/constant";

interface ILoginParams {
  email: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<ILoginParams>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    mutateAsync: login,
    isLoading,
    isSuccess,
  } = api.user.login.useMutation();

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

    toast.success(t("loginSuccess"));
    void router.push("/", undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>Nah | Login</title>
      </Head>
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: paletteLight.background.default,
          color: paletteLight.common.black,
        }}
      >
        <Container
          sx={{
            display: "flex",
            minHeight: "100vh",
          }}
        >
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
              {t("login")}
            </Typography>

            <Box>
              <Typography variant="body1">Email</Typography>
              <InputField
                control={control}
                name="email"
                rules={{
                  required: t("requiredError"),
                  pattern: {
                    value: regex.email,
                    message: t("emailError"),
                  },
                }}
                inputProps={{ style: { color: paletteLight.common.black } }}
              />
            </Box>

            <Box>
              <Typography variant="body1">{t("password")}</Typography>
              <InputField
                control={control}
                name="password"
                type="password"
                rules={{
                  required: t("requiredError"),
                  min: 6,
                }}
                inputProps={{ style: { color: paletteLight.common.black } }}
              />
            </Box>

            <LoadingButton
              variant="contained"
              sx={{ fontSize: "1rem" }}
              onClick={() => {
                void handleSubmit(onSubmit)();
              }}
              title="Login"
              loading={isLoading || isSuccess}
            />
            <Link
              style={{
                textDecoration: "underline",
                color: blue[700],
                alignSelf: "flex-end",
              }}
              href={"/auth/register"}
            >
              {t("goRegisterPage")}
            </Link>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default LoginPage;
