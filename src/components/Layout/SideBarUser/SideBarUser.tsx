import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import {
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import useCrudPage from "~/hook/useCrudPage";
import { api } from "~/utils/api";
import BoxClickAble from "../../Common/BoxClickAble";
import ImageLoading from "../../Common/Image/ImageLoading";
import SearchButton from "./SearchButton";
import SettingButton from "./SettingButton";
import UserPageShareList from "./UserPageShareList";
import UserPageList from "./userPageList";

interface Props {
  openSideBar: boolean;
  handleClose: () => void;
}

const SideBarUser = (props: Props) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const { handleCreateNewPage, createPageLoading } = useCrudPage();
  const { t } = useTranslation();
  const { data: userInfo, isLoading } = api.user.getCurrUserDetail.useQuery();

  const [openList, setOpenList] = useState(false);
  const [openListShare, setOpenListShare] = useState(false);

  const handleNewPageBtn = async () => {
    if (!userInfo) {
      return;
    }

    await handleCreateNewPage({ authorId: userInfo.id });
  };

  const handleLogout = () => {
    deleteCookie("token");
    router.reload();
  };

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
              <SearchButton />
              <Divider />

              <SettingButton />
              <Divider />

              <BoxClickAble
                sx={{
                  justifyContent: "flex-start",
                  gap: "10px",
                  alignItems: "center",
                }}
                onClick={() => void handleNewPageBtn()}
                disabled={createPageLoading}
              >
                {createPageLoading ? (
                  <CircularProgress
                    size="16px"
                    sx={{ color: (theme) => theme.palette.text.primary }}
                  />
                ) : (
                  <AddIcon fontSize="small" />
                )}
                <Typography variant="body2">{t("newPage")}</Typography>
              </BoxClickAble>
            </Stack>
            <Divider />

            <UserPageShareList
              openList={openListShare}
              setOpenList={setOpenListShare}
            />
            <Divider />

            <UserPageList openList={openList} setOpenList={setOpenList} />
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

export default SideBarUser;