import {
  Button,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Image from "next/image";
import { env } from "~/env.mjs";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const PremiumDialog = (props: IProps) => {
  const { open, onClose } = props;
  const { t } = useTranslation();

  const handlePayment = () => {
    window.location.replace(env.NEXT_PUBLIC_CLOUDINARY_API_PAYMENT_URL);
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { minHeight: "320px" },
      }}
    >
      <DialogContent>
        <Stack gap={1.5}>
          <Typography variant="h4" sx={{ alignSelf: "center" }}>
            {t("premiumTitle")}
          </Typography>
          <Image
            src={
              "https://res.cloudinary.com/dqlcjscsz/image/upload/v1704878128/store/2al0tmt5syhDOHxOphSY5vHDUd7_dypsei.svg"
            }
            alt="premium_image"
            height={250}
            width={300}
            style={{ alignSelf: "center" }}
          />
          <Typography variant="body1">{t("premiumBenefitDesc")}</Typography>
          <List dense={true}>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary={t("premiumBenefit_1")} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary={t("premiumBenefit_2")} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary={t("premiumBenefit_3")} />
            </ListItem>
          </List>

          <Button variant="contained" onClick={handlePayment}>
            {t("premiumBtn")}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumDialog;
