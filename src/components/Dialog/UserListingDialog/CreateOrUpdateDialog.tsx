import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import FormControlInput from "~/components/FormComponents/InputFormControl";
import { defaultUserInfo, type IUserInfo } from "~/interface/IUser";
import { api } from "~/utils/api";
import ChangePasswordAdmin from "./ChangePasswordAdmin";
import { useEffect, useState } from "react";

interface IProps {
  type: string;
  open: boolean;
  onClose: () => void;
  id?: string;
  data?: IUserInfo;
  refetchData: () => void;
}

const CreateOrUpdateDialog = (props: IProps) => {
  const { type, open, onClose, id, data, refetchData } = props;
  const { t } = useTranslation();
  const { mutateAsync: updateUser, isLoading } =
    api.user.updateUser.useMutation();
  const { mutateAsync: register, isLoading: registerLoading } =
    api.auth.register.useMutation();

  const [openDialog, setOpenDialog] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IUserInfo>({
    defaultValues: data ? data : defaultUserInfo,
  });

  const onSubmit = async (values: IUserInfo) => {
    if (!isDirty) {
      onClose();
      return;
    }

    if (id) {
      await updateUser({
        id: id,
        ...values,
      });
    } else {
      if (values.password !== undefined) {
        await register({
          avatar: null,
          email: values.email,
          userName: values.userName,
          password: values.password,
        });
      }
    }

    onClose();
    refetchData();
    toast.success(t("success"));
  };

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onExited: () => {
          reset(defaultUserInfo);
        },
      }}
    >
      <DialogContent>
        <Stack gap={1}>
          <Typography variant="h5" sx={{ pb: 1 }}>
            {type === "edit" ? t("editUser") : t("addUser")}
          </Typography>

          <Stack pt={2} gap={1} direction="column" minWidth="320px">
            <FormControlInput
              control={control}
              label="Email"
              name="email"
              rules={{
                required: t("requiredError"),
              }}
            />

            <FormControlInput
              control={control}
              label={t("userName")}
              name="userName"
              rules={{
                required: t("requiredError"),
              }}
            />

            {id ? (
              <Button
                variant="text"
                sx={{
                  maxWidth: "200px",
                  alignSelf: "flex-end",
                }}
                onClick={() => setOpenDialog(true)}
              >
                {t("changePassword")}
              </Button>
            ) : (
              <FormControlInput
                control={control}
                label={t("password")}
                name="password"
                type="password"
                rules={{
                  minLength: { value: 6, message: t("passwordError") },
                  required: t("requiredError"),
                }}
              />
            )}
          </Stack>

          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => {
              void handleSubmit(onSubmit)();
            }}
            loading={isLoading || registerLoading}
            title={t("submit")}
            sx={{ mt: 2 }}
          />
        </Stack>
      </DialogContent>

      {id ? (
        <ChangePasswordAdmin
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          id={id}
        />
      ) : null}
    </Dialog>
  );
};

export default CreateOrUpdateDialog;
