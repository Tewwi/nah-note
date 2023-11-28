import {
  Box,
  Button,
  Divider,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import type { User } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import type { OrderType } from "~/interface/common";
import { dateFormat } from "~/utils/common";

interface IProps {
  users: User[];
  page: number;
  orderBy: string;
  orderType: OrderType;
  onOrderChange: (orderBy: string, orderType: string) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
}

const columns = [
  {
    id: "name",
    label: "User Name",
    sort: true,
  },
  {
    id: "email",
    label: "Email",
    sort: false,
  },
  {
    id: "create_at",
    label: "Create At",
    sort: true,
  },
  {
    id: "total_page",
    label: "Total Page",
    sort: true,
  },
  {
    id: "action",
    label: "Action",
    sort: false,
  },
] as const;

const UserTable = (props: IProps) => {
  const {
    page,
    orderBy,
    orderType,
    onOrderChange,
    users,
    onPageChange,
    totalPage,
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
                align={headCell.id !== "name" ? "center" : "inherit"}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? orderType : "asc"}
                  disabled={headCell.sort}
                  onClick={() =>
                    onOrderChange(
                      headCell.id,
                      orderType === "desc" ? "asc" : "desc"
                    )
                  }
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span">
                      {orderType === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((one) => (
            <TableRow hover key={one.id}>
              <TableCell sx={{ width: "100%" }}>{one.userName}</TableCell>
              <TableCell align="center" sx={{ pr: 4.25 }}>
                {one.email}
              </TableCell>
              <TableCell align="center">
                {dayjs(one.create_at).format(dateFormat)}
              </TableCell>
              <TableCell align="justify" sx={{ minWidth: "200px" }}>
                <Button
                  color="primary"
                  size="medium"
                  variant="contained"
                  style={{ marginRight: 5, marginTop: 3 }}
                >
                  Edit
                </Button>
                <Button
                  color="primary"
                  size="medium"
                  variant="contained"
                  style={{ marginTop: 3 }}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ mt: "auto" }} />
      <Pagination
        page={page}
        onChange={(_e, page) => onPageChange(page)}
        count={totalPage}
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default UserTable;
