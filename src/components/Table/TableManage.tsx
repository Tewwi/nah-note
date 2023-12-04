import {
  Box,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import React from "react";
import type { IColumn, ISort, OrderType } from "~/interface/common";
import NoDataTable from "./TableNoData";
import TableRowLoading from "./TableRowLoading";

interface IProps<T> {
  data: T[] | undefined;
  page: number;
  orderBy: string | undefined;
  orderType: OrderType | undefined;
  onOrderChange: (params: ISort) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
  columns: IColumn[];
  renderRows: (item: T) => React.ReactNode;
  isLoading: boolean;
}

const TableManage = <T,>(props: IProps<T>) => {
  const {
    page,
    orderBy,
    orderType,
    onOrderChange,
    data,
    onPageChange,
    totalPage,
    columns,
    renderRows,
    isLoading,
  } = props;

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((headCell) => (
              <TableCell
                key={headCell.id}
                sortDirection={orderBy === headCell.id ? orderType : false}
                sx={{
                  minWidth: headCell.width || "100px",
                }}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? orderType : "asc"}
                  disabled={!headCell.sort}
                  onClick={() =>
                    onOrderChange({
                      orderBy: headCell.id,
                      orderType: orderType === "desc" ? "asc" : "desc",
                    })
                  }
                >
                  {headCell.label}
                  {/* {orderBy === headCell.id ? (
                    <Box component="span">
                      {orderType === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null} */}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!isLoading ? (
            data?.length === 0 ? (
              <NoDataTable />
            ) : (
              data?.map((one) => renderRows(one))
            )
          ) : (
            <TableRowLoading columnLength={columns.length} />
          )}
        </TableBody>
      </Table>

      <Divider sx={{ mt: "auto" }} style={{ margin: "10px 0px" }} />
      {data?.length !== 0 && (
        <Pagination
          page={page}
          onChange={(_e, page) => onPageChange(page)}
          count={totalPage}
          showFirstButton
          showLastButton
          color="primary"
          sx={{ mb: 2 }}
        />
      )}
    </Box>
  );
};

export default TableManage;
