import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import FormControlInput from "~/components/FormComponents/InputFormControl";
import { api } from "~/utils/api";

interface InfoChangePassword {
  password: string;
  confirmPass: string;
}

interface IProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

const ChangePasswordAdmin = (props: IProps) => {
  const { open, onClose, id } = props;
  const { t } = useTranslation();
  const { mutateAsync, isLoading } = api.user.changePasswordAdmin.useMutation();

  const {
    control,
    watch,
    formState: { isValid },
    handleSubmit,
  } = useForm<InfoChangePassword>({
    defaultValues: {
      password: "",
      confirmPass: "",
    },
  });

  const onSubmit = async (values: InfoChangePassword) => {
    try {
      await mutateAsync({ ...values, id: id });
      toast.success(t("success"));
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Stack gap={1}>
          <Typography variant="h5" my={2}>
            {t("changePassword")}
          </Typography>
          <FormControlInput
            control={control}
            label={t("newPassword")}
            name="password"
            sx={{ height: "35px" }}
            rules={{
              required: t("requiredError"),
              min: { value: 6, message: t("passwordError") },
            }}
            type="password"
          />

          <FormControlInput
            control={control}
            label={t("confirmNewPass")}
            name="confirmPass"
            sx={{ height: "35px" }}
            rules={{
              required: t("requiredError"),
              validate: (val) => {
                if (watch("password") !== val) {
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
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordAdmin;
