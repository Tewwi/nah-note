import { CircularProgress, Container, Stack, Typography } from "@mui/material";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { options } from "~/components/Chart/option";
import CustomReactDateRangePicker from "~/components/FormComponents/DatetimePicker/CustomReactDateRangePicker";
import { api } from "~/utils/api";
import { dateDisplayFormat, dateFormat } from "~/utils/common";

const PageChart = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { start_date, end_date } = router.query;

  const startDate = useMemo(() => {
    return start_date
      ? moment(start_date.toString(), dateFormat).toDate()
      : moment().subtract(30, "days").toDate();
  }, [start_date]);

  const endDate = useMemo(() => {
    return end_date
      ? moment(end_date.toString(), dateFormat).toDate()
      : moment().toDate();
  }, [end_date]);

  const { data: chartData, isLoading } = api.page.getChartData.useQuery({
    start: startDate,
    end: endDate,
  });

  const data = {
    labels: chartData?.map((item) => t(`${item.date}`)) || [],
    datasets: [
      {
        label: t("chartPageEle"),
        data: chartData?.map((item) => item.count) || [],
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const onChangeDateFilter = (startDate: Date | null, endDate: Date | null) => {
    const startDateStr = startDate ? moment(startDate).format(dateFormat) : "";
    const endDateStr = endDate ? moment(endDate).format(dateFormat) : "";

    router.query.start_date = startDateStr;
    router.query.end_date = endDateStr;

    void router.replace(router);
  };

  return (
    <>
      <Head>
        <title>Nah | User Listing</title>
      </Head>
      <Container maxWidth="md">
        <Typography variant="h3" my={2}>
          {t("chartPage")}
        </Typography>

        <Typography variant="body1" my={2}>
          {`${t("chartPageTitle")} ${moment(startDate).format(
            dateDisplayFormat
          )} - ${moment(endDate).format(dateDisplayFormat)}`}
        </Typography>
        <Stack direction="row" gap={1} mb={2}>
          <CustomReactDateRangePicker
            clearSearchParamsOutside
            onChangeDate={onChangeDateFilter}
          />
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

export default PageChart;
