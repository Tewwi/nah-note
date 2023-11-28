import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import { api } from "~/utils/api";
import BoxClickAble from "../../Common/BoxClickAble";
import ImageLoading from "../../Common/Image/ImageLoading";
import SettingButton from "../SideBarUser/SettingButton";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { Role } from "~/utils/constant";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";

interface Props {
  openSideBar: boolean;
  handleClose: () => void;
}

const SideBarAdmin = (props: Props) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const {
    data: userInfo,
    isLoading,
    isError,
    error,
  } = api.user.getCurrUserDetail.useQuery();

  const handleLogout = () => {
    deleteCookie("token");
    router.reload();
  };

  useEffect(() => {
    if (userInfo?.role !== Role.ADMIN.value) {
      void router.push("/");
    }

    if (isError && error.message === "jwt malformed") {
      void router.push("/dashboard");
    }
  }, [error, isError, router, userInfo?.role]);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={openSideBar}
      PaperProps={{
        sx: {
          borderRadius: "unset",
          bgcolor: (theme) => theme.palette.background.paper,
          maxWidth: "300px",
          width: "230px",
          boxSizing: "border-box",
        },
      }}
      sx={{
        width: "230px",
        flexShrink: 0,
        height: "100%",
      }}
    >
      <SimpleBar style={{ maxHeight: "92%" }}>
        <Stack flex={1} sx={{ maxHeight: "100%", overflow: "auto" }}>
          <Stack height="100%">
            <BoxClickAble sx={{ p: 1.25, height: "auto" }} component="div">
              <Stack
                direction="row"
                justifyContent="space-between"
                width="100%"
              >
                <Stack direction="row">
                  <ImageLoading
                    src={userInfo?.avatar || ""}
                    alt="avatar"
                    width={35}
                    height={35}
                    style={{ alignSelf: "center" }}
                    loadingCustom={isLoading}
                  />
                  <Typography
                    variant="body2"
                    flexWrap="wrap"
                    sx={{ alignSelf: "center", ml: 1 }}
                  >
                    {userInfo?.userName}
                  </Typography>
                </Stack>

                <IconButton
                  onClick={handleClose}
                  sx={{ color: (theme) => theme.palette.text.secondary }}
                >
                  {openSideBar ? <MenuOpenIcon /> : <MenuIcon />}
                </IconButton>
              </Stack>
            </BoxClickAble>

            <Stack direction="column">
              <SettingButton />
              <Divider />

              <BoxClickAble
                sx={{
                  justifyContent: "flex-start",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <ContactPageIcon fontSize="small" />
                <Typography variant="body2">{t("userListing")}</Typography>
              </BoxClickAble>

              <BoxClickAble
                sx={{
                  justifyContent: "flex-start",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <LibraryBooksIcon fontSize="small" />
                <Typography variant="body2">{t("pageListing")}</Typography>
              </BoxClickAble>
            </Stack>
            <Divider />
          </Stack>
        </Stack>
      </SimpleBar>

      <BoxClickAble
        sx={{
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          flex: 0,
        }}
        onClick={handleLogout}
      >
        <LogoutIcon color="error" />
        <Typography
          sx={{ color: (theme) => theme.palette.error.main }}
          variant="body2"
        >
          {t("logout")}
        </Typography>
      </BoxClickAble>
    </Drawer>
  );
};

export default SideBarAdmin;
