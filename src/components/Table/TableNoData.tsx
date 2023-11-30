import { Box, TableRow, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { notFoundImg } from "~/utils/constant";

const NoDataTable = () => {
  const { t } = useTranslation();

  return (
    <TableRow sx={{ position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          flexDirection: "column",
          top: "40px",
          right: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          src={notFoundImg}
          width={120}
          height={120}
          alt={"not found img"}
        />
        <Typography textAlign="center" variant="h6" mt="30px">
          {t("noData")}
        </Typography>
        <Typography
          textAlign="center"
          variant="body1"
          mt="5px"
          color="textSecondary"
        >
          {t("noDataDecs")}
        </Typography>
      </Box>
    </TableRow>
  );
};

export default NoDataTable;
