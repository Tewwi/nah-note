import { Divider, Drawer, Skeleton, Stack } from "@mui/material";
import React from "react";

interface Props {
  openSideBar: boolean;
}

const SideBarLoading = (props: Props) => {
  const { openSideBar } = props;

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
      <Stack gap={1} mt={6}>
        {Array(5)
          .fill(null)
          .map((_e, index) => (
            <div key={index}>
              <Skeleton
                sx={{
                  width: "230px",
                  height: "42px",
                }}
                animation="wave"
              />
              <Divider />
            </div>
          ))}
      </Stack>
    </Drawer>
  );
};

export default SideBarLoading;
