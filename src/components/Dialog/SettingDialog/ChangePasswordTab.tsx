import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import FormControlInput from "~/components/FormComponents/InputFormControl";
import { api } from "~/utils/api";

const inputBreakPoint = {
  label: { xs: 12, sm: 12, md: 5, lg: 5, xl: 4 },
  field: { xs: 12, sm: 12, md: 7, lg: 7, xl: 8 },
};

interface IChangePassword {
  oldPass: string;
  newPass: string;
  confirmPass: string;
}

interface IProps {
  onClose: () => void;
}

const ChangePasswordTab = (props: IProps) => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = api.auth.changePassword.useMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
    watch,
  } = useForm<IChangePassword>({
    defaultValues: {
      oldPass: "",
      newPass: "",
      confirmPass: "",
    },
  });

  const onSubmit = async (values: IChangePassword) => {
    try {
      await mutateAsync({
        newPassword: values.newPass,
        oldPassword: values.oldPass,
      });
      props.onClose();
      toast.success(t("changePasswordSuccess"));
    } catch (error) {
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
  };

  return (
    <Box p={2} minWidth={isMobile ? "unset" : "500px"}>
      <Typography variant="h5">{t("changePassword")}</Typography>
      <Divider sx={{ my: 1 }} />
      <Stack pt={2} gap={1} direction="column">
        <FormControlInput
          layoutBreakpoint={inputBreakPoint}
          control={control}
          label={t("password")}
          name="oldPass"
          sx={{ height: "35px" }}
          rules={{
            required: t("requiredError"),
          }}
          type="password"
        />

        <FormControlInput
          layoutBreakpoint={inputBreakPoint}
          control={control}
          label={t("newPassword")}
          name="newPass"
          sx={{ height: "35px" }}
          rules={{
            required: t("requiredError"),
            min: { value: 6, message: t("passwordError") },
          }}
          type="password"
        />

        <FormControlInput
          layoutBreakpoint={inputBreakPoint}
          control={control}
          label={t("confirmNewPass")}
          name="confirmPass"
          sx={{ height: "35px" }}
          rules={{
            required: t("requiredError"),
            validate: (val) => {
              if (watch("newPass") !== val) {
                return t("confirmPasswordError");
              }
            },
          }}
          type="password"
        />

        <LoadingButton
          color="primary"
          title={t("changePassword")}
          size="small"
          loading={isLoading}
          disabled={!isValid}
          onClick={() => void handleSubmit(onSubmit)()}
        />
      </Stack>
    </Box>
  );
};

export default ChangePasswordTab;
