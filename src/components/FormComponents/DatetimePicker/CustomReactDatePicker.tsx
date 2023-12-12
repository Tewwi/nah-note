/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  type TextFieldProps,
  Typography,
  useTheme,
} from "@mui/material";
import moment from "moment";
import { useRef, useState, useEffect, type MouseEvent } from "react";
import DatePicker, { type ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckIcon from "@mui/icons-material/Check";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
// import "./datetime.css";
import { grey } from "~/theme/colors";
import Wrapper from "./Wrapper";

const createArrayYear = (targetYear: number) => {
  const yearGap = 100;
  const startYear = targetYear - yearGap;

  return Array(yearGap + 10)
    .fill(0)
    .map((_, index) => startYear + index);
};

interface Props extends ReactDatePickerProps<never, boolean> {
  error?: boolean;
  helperText?: string;
  clearIcon?: boolean;
  inputProps?: TextFieldProps;
  isYearRange?: boolean;
}

const CustomReactDatePicker = (props: Props) => {
  const {
    // wrapperClassName,
    error,
    inputProps,
    isYearRange,
    helperText,
    ...rest
  } = props;
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openSelectYear, setOpenSelectYear] = useState(false);
  const [selectYearRange, setSelectYearRange] = useState(new Date());
  const ref = useRef<HTMLLIElement>(null);

  const handleClick = (_event: React.MouseEvent<SVGSVGElement>) => {
    if (openSelectYear) {
      handleClose();
      return;
    }

    setOpenSelectYear(true);
  };

  const handleClose = () => {
    setOpenSelectYear(false);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ block: "center" });
    }
  }, [ref, openSelectYear]);

  useEffect(() => {
    if (rest.endDate) {
      setOpen(false);
    }
  }, [rest.endDate]);

  return (
    <Wrapper>
      <DatePicker
        fixedHeight
        calendarStartDay={1}
        showPopperArrow={false}
        wrapperClassName="date-picker"
        open={open}
        customInput={
          <TextField
            variant="filled"
            type="text"
            helperText={helperText}
            inputProps={{
              autoComplete: "new-password",
            }}
            error={error}
            InputProps={{
              startAdornment: (
                <CalendarMonthIcon sx={{ width: "24px", flexShrink: 0 }} />
              ),
              endAdornment: (
                <>
                  {!rest.disabled && (rest.selected || rest.startDate) ? (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        rest.onChange(null, e);
                      }}
                    >
                      <CloseIcon className="svg-fill-all" fill={grey[1000]} />
                    </IconButton>
                  ) : (
                    <div style={{ width: "25px" }}></div>
                  )}
                  <ChevronLeftIcon
                    sx={{
                      rotate: "270deg",
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                    }}
                  />
                </>
              ),
            }}
            {...inputProps}
          />
        }
        formatWeekDay={(formattedDate) => (
          <Box
            sx={{
              px: "2px",
              mt: "4px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "success.main",
                bgcolor: "success.lighter",
                py: "8px",
                px: "13.5px",
                borderRadius: "6px",
              }}
            >
              {formattedDate.toString().substring(0, 2)}
            </Typography>
          </Box>
        )}
        renderCustomHeader={({
          date,
          changeYear,
          decreaseYear,
          increaseYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            px={1}
            py={0.5}
          >
            <IconButton
              size="small"
              onClick={() => {
                if (rest.showMonthYearPicker) {
                  decreaseYear();
                  return;
                }
                if (rest.showYearPicker) {
                  changeYear(
                    moment(isYearRange ? selectYearRange : date)
                      .subtract(rest.yearItemNumber || 12, "years")
                      .year()
                  );

                  if (isYearRange) {
                    setSelectYearRange(
                      moment(selectYearRange)
                        .subtract(rest.yearItemNumber || 12, "years")
                        .toDate()
                    );
                  }
                  return;
                }

                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
              sx={{ width: "32px", height: "32px", mr: 1 }}
            >
              <ChevronLeftIcon />
            </IconButton>

            <ClickAwayListener onClickAway={handleClose}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Typography variant="h6">
                  {rest.showMonthYearPicker
                    ? moment(date).format("YYYY")
                    : null}

                  {rest.showYearPicker
                    ? `${moment(isYearRange ? selectYearRange : date)
                        .subtract(6, "years")
                        .format("YYYY")} - ${moment(
                        isYearRange ? selectYearRange : date
                      )
                        .add(5, "years")
                        .format("YYYY")}`
                    : null}

                  {!rest.showMonthYearPicker && !rest.showYearPicker
                    ? moment(date).format("MMMM YYYY")
                    : null}
                </Typography>

                {!rest.showYearPicker && (
                  <ButtonBase
                    sx={{
                      width: "16px",
                      height: "16px",
                      rotate: "270deg",
                      borderRadius: "100px",
                    }}
                  >
                    <ChevronLeftIcon
                      onClick={(e: MouseEvent<SVGSVGElement>) => {
                        handleClick(e);
                      }}
                    />
                  </ButtonBase>
                )}

                <Box
                  sx={{
                    zIndex: 9999,
                    position: "absolute",
                    top: "56px",
                    bgcolor: "background.paper",
                    display: openSelectYear ? "block" : "none",
                    border: "1px solid",
                    borderRadius: "8px",
                    borderColor: "grey.500",
                  }}
                >
                  <SimpleBar
                    style={{
                      minHeight: "180px",
                      maxHeight: "180px",
                      overflow: "auto",
                      minWidth: "125px",
                    }}
                  >
                    {createArrayYear(moment().year()).map((year) => {
                      const currentYear = date.getFullYear();

                      return (
                        <MenuItem
                          key={year}
                          onClick={() => {
                            changeYear(year);
                            handleClose();
                          }}
                          ref={year === currentYear ? ref : null}
                          sx={{
                            py: "8px",
                            display: "flex",
                            justifyContent: "center",
                            borderRadius: "6px",
                            mt: "2px",
                            position: "relative",
                            "&:hover": { color: theme.palette.success["main"] },
                          }}
                        >
                          {year === currentYear && (
                            <CheckIcon
                              sx={{
                                position: "absolute",
                                left: "15px",
                              }}
                            />
                          )}
                          {year}
                        </MenuItem>
                      );
                    })}
                  </SimpleBar>
                </Box>
              </Box>
            </ClickAwayListener>

            <IconButton
              size="small"
              onClick={() => {
                if (rest.showMonthYearPicker) {
                  increaseYear();
                  return;
                }
                if (rest.showYearPicker) {
                  changeYear(
                    moment(isYearRange ? selectYearRange : date)
                      .add(rest.yearItemNumber || 12, "years")
                      .year()
                  );

                  if (isYearRange) {
                    setSelectYearRange(
                      moment(selectYearRange)
                        .add(rest.yearItemNumber || 12, "years")
                        .toDate()
                    );
                  }
                  return;
                }

                increaseMonth();
              }}
              disabled={nextMonthButtonDisabled}
              sx={{ width: "32px", height: "32px", ml: 1, rotate: "180deg" }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Stack>
        )}
        renderDayContents={(dayOfMonth: number) => (
          <ButtonBase
            component="p"
            sx={{
              typography: "body2",
              width: "34px",
              height: "34px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "50%",
              ":hover": {
                bgcolor: "grey.200",
              },
            }}
          >
            {dayOfMonth}
          </ButtonBase>
        )}
        {...rest}
        onChange={(date: any, e) => {
          if (rest.selectsRange) {
            rest.onChange(date, e);
            const isValid = date?.every((item: Date) => !!item);

            if (isValid) setOpen(false);
          } else {
            rest.onChange(date, e);
            setOpen(false);
          }
        }}
        onInputClick={() => setOpen(true)}
        onClickOutside={(e) => {
          if (openSelectYear) return;
          if (rest.onClickOutside) {
            rest.onClickOutside(e);
          }

          setOpen(false);
        }}
      />
    </Wrapper>
  );
};

export default CustomReactDatePicker;
