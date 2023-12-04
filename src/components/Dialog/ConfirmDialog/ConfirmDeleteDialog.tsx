import {
  Dialog,
  DialogContent,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/Common/Button/LoadingButton";

interface Props {
  open: boolean;
  onClose: () => void;
  decs: string;
  handleSubmit: () => Promise<void>;
  title: string;
}

const ConfirmDeleteDialog = (props: Props) => {
  const { open, onClose, decs, handleSubmit, title } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);

    await handleSubmit();

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h5">{title}</Typography>

        <Typography variant="body1" sx={{ py: 2 }}>
          {decs}
        </Typography>

        <Stack width="100%" direction="row" gap={1}>
          <LoadingButton
            title={t("delete")}
            loading={loading}
            variant="contained"
            color="error"
            onClick={() => void onSubmit()}
            sx={{ flex: 1 }}
          />

          <Button variant="outlined" onClick={onClose} sx={{ flex: 1 }}>
            {t("cancel")}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
