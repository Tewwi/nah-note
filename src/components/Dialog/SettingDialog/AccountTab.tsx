import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import FormControlInput from "~/components/FormComponents/InputFormControl";
import { api } from "~/utils/api";
import AvatarInput from "./AvatarInput";

const inputBreakPoint = {
  label: { xs: 12, sm: 12, md: 5, lg: 3, xl: 2 },
  field: { xs: 12, sm: 12, md: 7, lg: 9, xl: 10 },
};

interface IUserInfo {
  email: string;
  userName: string;
}

const AccountTab = () => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { data: userInfo, refetch } = api.user.getCurrUserDetail.useQuery();
  const { mutateAsync: updateUser, isLoading } =
    api.user.updateUser.useMutation();
  const {
    control,
    formState: { isDirty },
    handleSubmit,
  } = useForm<IUserInfo>({
    defaultValues: { ...userInfo },
  });

  const onSubmit = async (data: IUserInfo) => {
    if (userInfo) {
      await updateUser({
        id: userInfo.id,
        avatar: userInfo.avatar,
        email: data.email,
        userName: data.userName,
      });

      await refetch();
    }
  };

  const handleChangeAvatar = async (url: string) => {
    if (userInfo) {
      await updateUser({
        ...userInfo,
        avatar: url,
      });

      await refetch();
    }
  };

  return (
    <Box p={2} minWidth={isMobile ? "unset" : "500px"}>
      <Typography variant="h5" sx={{ pb: 1 }}>
        {t("myProfile")}
      </Typography>

      <Divider />
      <Stack py={2} direction="row" gap={1.5} alignItems="flex-start">
        <AvatarInput
          url={userInfo?.avatar || ""}
          handleChangeAvatar={handleChangeAvatar}
        />
        <Stack direction="column" alignItems="flex-start" gap={0.5}>
          <Typography variant="body2">{t("userName")} :</Typography>
          <Typography variant="body2">{userInfo?.userName}</Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        sx={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          p: 0.5,
        }}
      >
        <Typography variant="h6">{t("accInfo")}</Typography>
        <LoadingButton
          variant="text"
          color="primary"
          title={t("save")}
          size="small"
          loading={isLoading}
          disabled={!isDirty}
          onClick={() => void handleSubmit(onSubmit)()}
        />
      </Stack>
      <Divider />

      <Stack pt={2} gap={1} direction="column">
        <FormControlInput
          layoutBreakpoint={inputBreakPoint}
          control={control}
          label="Email"
          name="email"
          sx={{ height: "35px" }}
        />

        <FormControlInput
          layoutBreakpoint={inputBreakPoint}
          control={control}
          label={t("userName")}
          name="userName"
          sx={{ height: "35px" }}
        />
      </Stack>
    </Box>
  );
};

export default AccountTab;
