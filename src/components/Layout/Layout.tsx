/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Collapse, IconButton, Stack, Toolbar } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { handleCheckHiddenLayout } from "~/utils/common";
import SideBar from "./SideBar/SideBar";
import PageInfoSection from "./SideBar/PageInfoSection";

const Layout = (props: React.PropsWithChildren) => {
  const router = useRouter();
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOpenSideBar(true);
    }
  }, []);

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
          <SideBar
            openSideBar={openSideBar}
            handleClose={() => setOpenSideBar(false)}
          />
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
                onClick={() => setOpenSideBar(true)}
              >
                <MenuIcon />
              </IconButton>
              <Stack sx={{ width: "fit-content" }}>
                <PageInfoSection />
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
