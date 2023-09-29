import { Box, Container, Skeleton, Stack } from "@mui/material";
import React from "react";

const PageLoading = () => {
  return (
    <Box sx={{ paddingBottom: 6 }}>
      <Box width="100%" height="180px">
        <Skeleton
          sx={{
            width: "100%",
            height: "100%",
          }}
          animation="wave"
        />
        <Container maxWidth="md">
          <Stack direction="column">
            <Skeleton
              sx={{
                width: "60px",
                height: "80px",
                mb: "10px",
              }}
              animation="wave"
            />

            <Skeleton
              sx={{
                width: "300px",
                height: "40px",
                mb: "10px",
              }}
              animation="wave"
            />

            <Skeleton
              sx={{
                width: "200px",
                height: "100%",
                mb: "10px",
              }}
              animation="wave"
            />

            <Skeleton
              sx={{
                width: "200px",
                height: "100%",
                mb: "10px",
              }}
              animation="wave"
            />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default PageLoading;
