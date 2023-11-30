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
import { useState } from "react";

interface IProps {
  type: string;
  open: boolean;
  onClose: () => void;
  id: string;
  data?: IUserInfo;
  refetchData: () => void;
}

const CreateOrUpdateDialog = (props: IProps) => {
  const { type, open, onClose, id, data, refetchData } = props;
  const { t } = useTranslation();
  const { mutateAsync: updateUser, isLoading } =
    api.user.updateUser.useMutation();
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

    await updateUser({
      id: id,
      ...values,
    });

    onClose();
    refetchData();
    toast.success(t("success"));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onExited: () => {
          reset();
        },
      }}
    >
      <DialogContent>
        <Stack gap={1}>
          <Typography variant="h5" sx={{ pb: 1 }}>
            {type === "edit" ? t("editUser") : t("addUser")}
          </Typography>

          <Stack pt={2} gap={1} direction="column">
            <FormControlInput
              control={control}
              label="Email"
              name="email"
              sx={{ height: "35px" }}
            />

            <FormControlInput
              control={control}
              label={t("userName")}
              name="userName"
              sx={{ height: "35px" }}
            />
          </Stack>

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

          <LoadingButton
            variant="contained"
            color="primary"
            onClick={() => {
              void handleSubmit(onSubmit)();
            }}
            loading={isLoading}
            title={t("submit")}
          />
        </Stack>
      </DialogContent>

      <ChangePasswordAdmin
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        id={id}
      />
    </Dialog>
  );
};

export default CreateOrUpdateDialog;
