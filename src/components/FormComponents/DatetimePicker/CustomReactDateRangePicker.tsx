import { useCallback } from "react";
import CustomReactDatePicker from "./CustomReactDatePicker";
import { useRouter } from "next/router";
import moment from "moment";
import { isArray } from "lodash";
import { dateFormat } from "~/utils/common";

interface Props {
  clearSearchParamsOutside?: boolean;
  onChangeDate: (startDate: Date | null, endDate: Date | null) => void;
}

const CustomReactDateRangePicker = (props: Props) => {
  const { clearSearchParamsOutside, onChangeDate } = props;
  const router = useRouter();

  const convertDate = (type: string) => {
    const date = router.query[`${type}`]?.toString();

    return date ? moment(date, dateFormat).toDate() : null;
  };

  const clearSearchParams = useCallback(() => {
    if (!clearSearchParamsOutside) {
      return;
    }

    if (router.query.start_date && !router.query.end_date) {
      router.query.start_date = "";
      router.query.end_date = "";

      void router.replace(router);
    }
  }, [clearSearchParamsOutside, router]);

  return (
    <CustomReactDatePicker
      selectsRange
      inputProps={{
        size: "small",
        sx: {
          minWidth: "300px",
          "& .MuiInputBase-root": {
            backgroundColor: (theme) => theme.palette.action.focus,
            ":hover": {
              backgroundColor: (theme) => theme.palette.action.focus,
            },
          },
        },
      }}
      dateFormat={"yyyy/MM/dd"}
      startDate={convertDate("start_date")}
      endDate={convertDate("end_date")}
      onChange={(dates) => {
        if (!dates) {
          onChangeDate(null, null);
          return;
        }

        if (isArray(dates)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const [startDate, endDate] = dates;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          onChangeDate(startDate, endDate);
        }
      }}
      onClickOutside={() => clearSearchParams()}
    />
  );
};

export default CustomReactDateRangePicker;
