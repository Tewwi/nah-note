import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Divider, Drawer, IconButton, Stack, Typography } from "@mui/material";
import { api } from "~/utils/api";
import BoxClickAble from "../BoxClickAble";
import ImageLoading from "../Image/ImageLoading";
import UserPageList from "./userPageList";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

interface Props {
  openSideBar: boolean;
  handleClose: () => void;
}
 
const SideBar = (props: Props) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { data: userInfo, isLoading, isError, error } = api.user.getCurrUserDetail.useQuery();
  
  useEffect(() => {
    if(isError && error.message === 'jwt malformed') {
      void router.push('/auth/login')
    }
  }, [error, isError, router])

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
          width: "200px",
          boxSizing: "border-box",
        },
      }}
      sx={{
        width: "200px",
        flexShrink: 0,
        height: "100%",
      }}
    >
      <BoxClickAble sx={{ p: 1.25, height: "auto" }} component="div">
        <Stack direction="row" justifyContent="space-between" width="100%">
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
        <BoxClickAble
          sx={{
            justifyContent: "flex-start",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <SearchIcon fontSize="small" />
          <Typography variant="body2">{t("search")}</Typography>
        </BoxClickAble>
        <Divider />

        <BoxClickAble
          sx={{
            justifyContent: "flex-start",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <SettingsIcon fontSize="small" />
          <Typography variant="body2">{t("setting")}</Typography>
        </BoxClickAble>
        <Divider />

        <BoxClickAble
          sx={{
            justifyContent: "flex-start",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <AddIcon fontSize="small" />
          <Typography variant="body2">{t("newPage")}</Typography>
        </BoxClickAble>
      </Stack>
      <Divider />

      <UserPageList />
    </Drawer>
  );
};

export default SideBar;
