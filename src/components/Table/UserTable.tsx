import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import type { IColumn, ISort, OrderType } from "~/interface/common";
import { dateFormat } from "~/utils/common";
import TableManage from "./TableManage";
import type { UserWithPage } from "~/interface/IUser";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import DoNotDisturbOffIcon from "@mui/icons-material/DoNotDisturbOff";

interface IProps {
  data: UserWithPage[] | undefined;
  onOrderChange: (params: ISort) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
  isLoading: boolean;
  handleOpenEdit: (id: string) => void;
  handleOpenDelete: (id: string) => void;
  handleOpenBlockUserDialog: (id: string, status: boolean) => void;
}

const columns: IColumn[] = [
  {
    id: "userName",
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
    width: "130px",
  },
  {
    id: "total_page",
    label: "Total Page",
    sort: false,
    width: "130px",
  },
  {
    id: "action",
    label: "Action",
    sort: false,
  },
];

const UserTable = (props: IProps) => {
  const {
    data,
    totalPage,
    onPageChange,
    onOrderChange,
    isLoading,
    handleOpenEdit,
    handleOpenDelete,
    handleOpenBlockUserDialog,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { page, orderBy, orderType } = router.query;

  return (
    <>
      <TableManage<UserWithPage>
        page={Number(page) || 1}
        onPageChange={onPageChange}
        onOrderChange={onOrderChange}
        columns={columns}
        data={data}
        orderBy={orderBy?.toString()}
        orderType={orderType?.toString() as OrderType}
        totalPage={totalPage}
        isLoading={isLoading}
        renderRows={(one) => (
          <TableRow hover key={one.id}>
            <TableCell sx={{ width: "100%" }}>{one.userName}</TableCell>
            <TableCell sx={{ pr: 4.25 }}>{one.email}</TableCell>
            <TableCell>{moment(one.create_at).format(dateFormat)}</TableCell>
            <TableCell align="center" sx={{ pr: "50px" }}>
              {one.Page?.length || 1}
            </TableCell>
            <TableCell align="justify" sx={{ minWidth: "200px" }}>
              <Tooltip title={t("edit")}>
                <IconButton
                  onClick={() => void handleOpenEdit(one.id)}
                  color="success"
                  size="small"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("delete")}>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleOpenDelete(one.id)}
                >
                  <DeleteForeverIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={one.isBlock ? t("unblockUser") : t("blockUser")}>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() =>
                    handleOpenBlockUserDialog(one.id, !one.isBlock)
                  }
                >
                  {one.isBlock ? (
                    <DoNotDisturbOffIcon fontSize="small" />
                  ) : (
                    <DoNotDisturbOnIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )}
      />
    </>
  );
};

export default UserTable;
