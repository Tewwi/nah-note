import MenuIcon from "@mui/icons-material/Menu";
import { Button, IconButton } from "@mui/material";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface IProps {
  open: boolean;
  handleOpen: () => void;
}

const OpenSideBarButton = (props: IProps) => {
  const { open, handleOpen } = props;

  const router = useRouter();
  const { t } = useTranslation();
  const token = getCookie("token");

  return (
    <>
      {token ? (
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            mr: 2,
            display: open ? "none" : "inline-flex",
            color: (theme) => theme.palette.text.secondary,
          }}
          onClick={handleOpen}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <Button
          variant="text"
          size="small"
          onClick={() => void router.push("/auth/login")}
        >
          {t("login")}
        </Button>
      )}
    </>
  );
};

export default OpenSideBarButton;
