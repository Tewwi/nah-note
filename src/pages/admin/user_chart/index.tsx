import React, { useState } from "react";
import Head from "next/head";
import {
  CircularProgress,
  Container,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { api } from "~/utils/api";
import { Line } from "react-chartjs-2";
import { options } from "~/components/Chart/option";

const UserChart = () => {
  const { t } = useTranslation();
  const [selectYear, setSelectYear] = useState(moment().year());
  const { data: chartData, isLoading } =
    api.user.getChartData.useQuery(selectYear);
  const { data: years } = api.user.getAllYearData.useQuery();

  const data = {
    labels: chartData?.map((item) => t(`month_${item.month}`)) || [],
    datasets: [
      {
        label: t("chartUserEle"),
        data: chartData?.map((item) => item.count) || [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <>
      <Head>
        <title>Nah | User Listing</title>
      </Head>
      <Container maxWidth="md">
        <Typography variant="h3" my={2}>
          {t("chartUser")}
        </Typography>

        <Stack direction="row" gap={1} mb={2}>
          <Typography variant="h5" my={2}>
            {t("chartUserTitle")}
          </Typography>

          <Select
            value={selectYear}
            onChange={(e) => setSelectYear(Number(e.target.value))}
            input={<OutlinedInput />}
            inputProps={{ "aria-label": "Without label" }}
            sx={{
              "& .MuiSelect-select": {
                padding: 1,
                pl: "14px",
                pr: "32px",
              },
              maxHeight: "40px",
              alignSelf: "center",
            }}
          >
            {years?.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </Stack>
        {isLoading ? (
          <Stack sx={{ width: "100%", minHeight: "500px" }}>
            <CircularProgress sx={{ margin: "auto" }} />
          </Stack>
        ) : (
          <>
            <Line data={data} options={options} />
          </>
        )}
      </Container>
    </>
  );
};

export default UserChart;
