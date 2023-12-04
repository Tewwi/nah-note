import { Dialog, DialogContent, Stack, Typography } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { debounce } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";
import FormControlAutocomplete from "~/components/FormComponents/FormControlAutocomplete";
import FormControlInput from "~/components/FormComponents/InputFormControl";
import { type IAdminCreatePage } from "~/interface/IPage";
import type { UserWithPage } from "~/interface/IUser";
import { api } from "~/utils/api";

interface IProps {
  open: boolean;
  onClose: () => void;
  refetchData: () => Promise<void>;
}

const CreatePageDialog = (props: IProps) => {
  const { open, onClose, refetchData } = props;
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<IAdminCreatePage>({
    defaultValues: {
      author: null,
    },
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { mutateAsync, isLoading } = api.page.createNewPage.useMutation();
  const { data: userList, isLoading: getUserLoading } =
    api.user.getAllUser.useQuery({
      page: 1,
      cursor: null,
      query: searchQuery,
    });

  const handleSearchUser = debounce((value: string) => {
    setSearchQuery(value);
  }, 300);

  const onSubmit = async (values: IAdminCreatePage) => {
    try {
      if (values?.author) {
        await mutateAsync({
          title: values.title || "",
          authorId: values.author.id,
        });
        toast.success(t("success"));
        onClose();
        void refetchData();
      }
    } catch (error) {
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onExited: () => reset(),
      }}
    >
      <DialogContent sx={{ minWidth: "450px" }}>
        <Stack gap={2}>
          <Typography variant="h5" sx={{ pb: 1 }}>
            {t("addPage")}
          </Typography>

          <FormControlAutocomplete<UserWithPage>
            control={control}
            name="author"
            getOptionLabel={(item) => item.userName}
            label={t("author")}
            options={userList?.data || []}
            multiple={false}
            rules={{
              required: t("requiredError"),
            }}
            textFieldProps={{
              onChange: (e) => {
                handleSearchUser(e.target.value);
              },
            }}
            loading={getUserLoading}
          />

          <FormControlInput
            control={control}
            label={t("title")}
            name="title"
            rules={{
              required: t("requiredError"),
            }}
            sx={{
              maxHeight: "150px",
            }}
          />

          <LoadingButton
            title={t("submit")}
            loading={isLoading}
            onClick={() => {
              void handleSubmit(onSubmit)();
            }}
            variant="contained"
          />
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageDialog;
