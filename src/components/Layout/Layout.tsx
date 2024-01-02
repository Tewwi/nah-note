/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Collapse, IconButton, Stack, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { handleCheckHiddenLayout } from "~/utils/common";
import SideBarByRole from "./SideBarByRole";
import PageInfoSection from "./SideBarUser/PageInfoSection";
import { getCookie } from "cookies-next";

const Layout = (props: React.PropsWithChildren) => {
  const router = useRouter();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const isShowAppBar = router.pathname === "/page/[id]";
  const token = getCookie("token");

  useEffect(() => {
    if (typeof window !== "undefined" && token) {
      setOpenSideBar(true);
    }
  }, [token]);

  if (handleCheckHiddenLayout(router.pathname)) {
    return <>{props.children}</>;
  }

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", color: "inherit" }}
      elevation={0}
    >
      <Stack direction="row">
        <Collapse
          orientation="horizontal"
          in={openSideBar}
          sx={{ height: "100vh" }}
        >
          {token ? (
            <SideBarByRole
              openSideBar={openSideBar}
              handleClose={() => setOpenSideBar(false)}
            />
          ) : null}
        </Collapse>

        <div style={{ flex: 1 }}>
          <Toolbar
            variant="dense"
            sx={{
              height: "40px",
              minHeight: "unset",
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            <Stack
              justifyContent={openSideBar ? "flex-end" : "space-between"}
              width="100%"
              direction="row"
              alignItems="center"
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{
                  mr: 2,
                  display: openSideBar ? "none" : "inline-flex",
                  color: (theme) => theme.palette.text.secondary,
                }}
                hidden={!token}
                onClick={() => setOpenSideBar(true)}
              >
                <MenuIcon />
              </IconButton>
              <Stack sx={{ width: "fit-content" }}>
                {isShowAppBar && <PageInfoSection />}
              </Stack>
            </Stack>
          </Toolbar>
          {props.children}
        </div>
      </Stack>
    </AppBar>
  );
};

export default Layout;
