import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

interface IProps {
  columnLength: number;
}

const TableRowLoading = (props: IProps) => {
  const { columnLength } = props;

  return (
    <>
      {Array(5)
        .fill(null)
        .map((item, i) => {
          return (
            <TableRow key={i}>
              {Array(columnLength)
                .fill(null)
                .map((_i, index) => {
                  return (
                    <TableCell key={index}>
                      <Skeleton
                        sx={{
                          width: "100%",
                          height: "100%",
                        }}
                        animation="wave"
                      />
                    </TableCell>
                  );
                })}
            </TableRow>
          );
        })}
    </>
  );
};

export default TableRowLoading;
