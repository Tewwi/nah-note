/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AppBar, Collapse, Stack, Toolbar } from "@mui/material";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { handleCheckHiddenLayout } from "~/utils/common";
import PageInfoSection from "./SideBarUser/PageInfoSection";

const SideBarByRole = dynamic(() =>
  import("./SideBarByRole").then((module) => module.default)
);

const OpenSideBarButton = dynamic(
  () => import("./SideBarUser/OpenSideBarBtn").then((module) => module.default),
  { ssr: false }
);

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
              <OpenSideBarButton
                open={openSideBar}
                handleOpen={() => setOpenSideBar(true)}
              />
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
