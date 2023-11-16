import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import style from "./index.module.css";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import Head from "next/head";
import { useRouter } from "next/router";
import { blue } from "~/theme/colors";
import Image from "next/image";
import { homepageImgUrl } from "~/utils/constant";
import { useTranslation } from "react-i18next";

const DashboardPage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>NahNote | Dashboard</title>
      </Head>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: (theme) => theme.palette.common.white,
        }}
      >
        <div
          className={style.hero_area}
          style={{ minHeight: "300px", textAlign: "center" }}
        >
          <Stack
            sx={{ m: "auto", color: (theme) => theme.palette.common.white }}
          >
            <Typography variant="h1" sx={{ margin: "auto" }}>
              NahNote
            </Typography>
            <Button
              variant="text"
              sx={{
                color: (theme) => theme.palette.common.white,
                ":hover": {
                  backgroundColor: "transparent",
                  color: blue[700],
                },
              }}
              endIcon={<KeyboardDoubleArrowRightIcon />}
              onClick={() => void router.push("/auth/login")}
            >
              <Typography
                variant="h6"
                sx={{
                  ":hover": {
                    color: blue[700],
                  },
                }}
              >
                {t("startNow")}
              </Typography>
            </Button>
          </Stack>
          <svg
            className={style.waves}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g className={style.parallax}>
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255,255,255,0.7"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(255,255,255,0.5)"
              />
              <use
                xlinkHref="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(255,255,255,0.3)"
              />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
        <Stack direction={"column"} sx={{ flex: 1, width: "100%" }}>
          <Typography
            variant="h5"
            className={style.typing_demo}
            sx={{ m: "auto", color: "black" }}
          >
            {t("homePageText")}
          </Typography>
          <Stack margin="auto">
            <Image
              src={homepageImgUrl}
              width={700}
              height={270}
              alt="Homepage img"
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default DashboardPage;
