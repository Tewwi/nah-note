import { Box, Container, Typography } from "@mui/material";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { textContent } from "~/TextContent/text";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import InputField from "~/components/FormComponents/InputField";
import UploadAvatarButton from "~/components/RegisterPage/UploadAvatarButton";
import type { IErrorCatch } from "~/interface/common";
import { blue } from "~/theme/colors";
import { api } from "~/utils/api";
import { handleUploadFile } from "~/utils/cloudinaryHelper";
import { regex } from "~/utils/constant";

interface IRegisterParams {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  avatar?: File;
}

const RegisterPage = () => {
  const router = useRouter();
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IRegisterParams>({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: register } = api.user.register.useMutation();
  const { mutateAsync: signCloud } = api.user.signCloud.useMutation();
  const fileUpload = watch("avatar") || null;
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: IRegisterParams) => {
    try {
      setLoading(true);
      let url: string | null = null;

      if (values.avatar) {
        const { timestamp, signature } = await signCloud({
          folderName: "avatar",
        });
        const resp = await handleUploadFile(
          values.avatar,
          signature,
          timestamp,
          "avatar"
        );

        url = resp.url;
      }

      await register({
        email: values.email,
        password: values.password,
        userName: values.userName,
        avatar: url,
      });
      toast.success(textContent.registerSuccess);
      void router.push({ pathname: "login" });
    } catch (e) {
      const error = e as IErrorCatch;
      toast.error(error.message);
      setLoading(false);
      return;
    }
  };

  const handleUploadAvatar = (files: File[] | null) => {
    if (files) {
      const file = files[0];

      if (file?.size && file?.size > 82374) {
        setError("avatar", { message: "File too large" });
        return;
      }
      setValue("avatar", file);
    }
  };

  return (
    <>
      <Head>
        <title>Nah | Register</title>
      </Head>
      <Container sx={{ display: "flex", minHeight: "100vh" }}>
        <Box
          sx={{
            margin: "auto",
            gap: "8px",
            width: "350px",
            display: "flex",
            flexDirection: "column",
            m: "auto",
          }}
        >
          <Typography m="auto" variant="h2" mb={1}>
            Register
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
            <Typography variant="body1">User Name</Typography>
            <InputField
              control={control}
              name="userName"
              rules={{
                required: textContent.requiredError,
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
                min: { value: 6, message: textContent.passwordError },
              }}
            />
          </Box>

          <Box>
            <Typography variant="body1">Confirm Password</Typography>
            <InputField
              control={control}
              name="confirmPassword"
              type="password"
              rules={{
                required: textContent.requiredError,
                validate: (val) => {
                  if (watch("password") !== val) {
                    return textContent.confirmPasswordError;
                  }
                },
              }}
            />
          </Box>

          <UploadAvatarButton
            fileUpload={fileUpload}
            handleClearAvatar={() => {
              setValue("avatar", undefined);
            }}
            errorsMessage={errors.avatar?.message}
            handleUploadAvatar={handleUploadAvatar}
          />

          <LoadingButton
            variant="contained"
            sx={{ fontSize: "1rem" }}
            onClick={() => {
              void handleSubmit(onSubmit)();
            }}
            title="Register"
            loading={loading}
          />
          <Link
            style={{
              textDecoration: "underline",
              color: blue[700],
              alignSelf: "flex-end",
            }}
            href={"/auth/login"}
          >
            {textContent.goLoginPage}
          </Link>
        </Box>
      </Container>
    </>
  );
};

export default RegisterPage;
