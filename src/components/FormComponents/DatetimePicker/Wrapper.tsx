import React from "react";

const Wrapper = (props: React.PropsWithChildren) => {
  return (
    <div>
      {props.children}
      <style jsx global>
        {`
          .react-datepicker {
            border: 1px solid #dfe3e6;
            /* box-shadow: 0px 5px 15px #eceef0; */
          }

          .react-datepicker-popper {
            z-index: 9999;
          }

          .react-datepicker__header {
            background-color: white;
            border-bottom: none;
          }

          .react-datepicker__day--in-range {
            border-radius: 50%;
            margin: 0;
            padding: 0.166rem;
          }

          .react-datepicker__day-name,
          .react-datepicker__day,
          .react-datepicker__time-name {
            margin: 0;
            width: auto;
            padding: 0;
          }

          .react-datepicker__day--in-range:hover,
          .react-datepicker__day--in-range,
          .react-datepicker__day--in-range:active {
            border-radius: 50%;
          }

          .react-datepicker__day,
          .react-datepicker__quarter-text,
          .react-datepicker__year-text {
            border-radius: 50%;
            margin-top: 3px;
            margin-bottom: 3px;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .react-datepicker__day:hover,
          .react-datepicker__quarter-text:hover,
          .react-datepicker__year-text:hover {
            border-radius: 0;
            background-color: transparent !important;
          }

          .react-datepicker__day--in-range:not(
              .react-datepicker__day--range-end,
              .react-datepicker__day--range-start
            ) {
            background-color: rgba(0, 129, 241, 0.15) !important;
            color: #0091ff;
            border-radius: 0;
          }

          .react-datepicker__day--in-selecting-range:not(
              .react-datepicker__day--selecting-range-start
            ) {
            background-color: rgba(0, 129, 241, 0.15);
            color: #0091ff;
            border-radius: 0;
          }

          .react-datepicker__day--in-selecting-range:hover {
            color: #f1f3f5 !important;
          }

          .react-datepicker__day--keyboard-selected {
            border-radius: 0;
            background-color: transparent !important;
          }

          .react-datepicker__day--keyboard-selected p {
            border-radius: 50%;
            background-color: #0091ff;
          }

          .react-datepicker__day--keyboard-selected:hover {
            background-color: #0081f1;
          }

          .react-datepicker__day--range-end,
          .react-datepicker__day--range-start,
          .react-datepicker__day--selecting-range-start {
            background-color: transparent !important;
            position: relative;
            border-radius: 0;
          }

          .react-datepicker__day--range-end p,
          .react-datepicker__day--range-start p,
          .react-datepicker__day--selecting-range-start p {
            background-color: #0091ff !important;
            position: relative;
            border-radius: 50% !important;
          }

          .react-datepicker__day--range-start::after,
          .react-datepicker__day--selecting-range-start::after {
            content: "";
            position: absolute;
            height: 100%;
            width: 34px;
            background: linear-gradient(
              to right,
              transparent,
              rgba(0, 129, 241, 0.15)
            );
            right: 0;
            top: 0;
          }

          .react-datepicker__day--keyboard-selected.react-datepicker__day--range-start.react-datepicker__day--range-end::before,
          .react-datepicker__day--keyboard-selected.react-datepicker__day--range-end.react-datepicker__day--range-start::after {
            content: "";
            background: transparent;
          }

          .react-datepicker__day--range-end::before {
            content: "";
            position: absolute;
            height: 100%;
            width: 34px;
            background: linear-gradient(
              to left,
              transparent,
              rgba(0, 129, 241, 0.15)
            );
            left: 0;
            top: 0;
          }

          .react-datepicker__day--range {
            color: #f1f3f5;
          }

          .react-datepicker__day--in-selecting-range:hover {
            position: relative;
            background-color: transparent !important;
            border-radius: 50%;
          }

          .react-datepicker__day--in-selecting-range:hover::after {
            background: transparent !important;
          }

          .react-datepicker__day--in-selecting-range:hover p {
            background-color: #0091ff !important;
            position: relative;
            border-radius: 50% !important;
          }

          .react-datepicker__day--in-selecting-range:not(
              .react-datepicker__day--selecting-range-start
            ):hover::before {
            content: "";
            position: absolute;
            height: 100%;
            width: 34px;
            background: linear-gradient(
              to left,
              transparent,
              rgba(0, 129, 241, 0.15)
            ) !important;
            left: 0;
            top: 0;
          }

          /* Weekday contents */
          .react-datepicker__week {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            gap: 0px;
          }

          /* Weekday Header*/
          .react-datepicker__day-names {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            margin-top: 2px;
            margin-bottom: 2px;
          }

          /* Date selected */
          .react-datepicker__day--selected {
            background-color: transparent;
          }

          .react-datepicker__day--selected p {
            background-color: #0091ff !important;
            border-radius: 50% !important;
          }

          .react-datepicker__day--keyboard-selected {
            color: #11181c;
          }

          .react-datepicker__day--keyboard-selected p {
            background-color: inherit;
          }

          .react-datepicker__day--outside-month p {
            color: #c1c8cd;
          }

          /* Month Picker */
          .react-datepicker__month {
            margin: 0;
            display: flex;
            flex-direction: column;
          }

          .react-datepicker__monthPicker {
            padding: 0 16px 24px;
          }

          .react-datepicker__month-wrapper {
            display: flex;
            justify-content: center;
          }
          .react-datepicker__month-text {
            width: 46px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background-color: #e9f9ee;
            color: #30a46c;
          }

          .react-datepicker__month--selected {
            background-color: #0091ff;
            color: white;
          }

          .react-datepicker__month-text.react-datepicker__month--selected:hover {
            background-color: #0081f1;
          }

          .react-datepicker__month-text:hover,
          .react-datepicker__year-text:hover {
            background-color: #ddf3e4 !important;
            border-radius: 6px;
          }

          .react-datepicker__month .react-datepicker__month-text,
          .react-datepicker__month .react-datepicker__quarter-text {
            display: flex !important;
          }

          /* Year Picker */
          .react-datepicker__year {
            margin: 0;
            display: flex;
            flex-direction: column;
            padding: 0 12px 24px;
          }

          .react-datepicker__year-wrapper {
            display: flex;
            justify-content: center;
          }

          .react-datepicker__year-text {
            width: 46px !important;
            height: 36px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background-color: #e9f9ee;
            color: #30a46c;
          }

          .react-datepicker__year-text--selected {
            background-color: #0091ff;
            color: white;
          }

          .react-datepicker__year-text.react-datepicker__year--selected:hover {
            background-color: #0081f1;
          }

          .react-datepicker__year-text--in-range {
            border-radius: 0.3rem;
            background-color: #0091ff;
            color: #fff;
          }

          .react-datepicker__year-text--in-selecting-range:not(
              .react-datepicker__day--in-range,
              .react-datepicker__month-text--in-range,
              .react-datepicker__quarter-text--in-range,
              .react-datepicker__year-text--in-range
            ) {
            background-color: rgba(0, 129, 241, 0.15) !important;
            color: #0091ff;
          }
        `}
      </style>
    </div>
  );
};

export default Wrapper;
