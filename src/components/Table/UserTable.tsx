import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import type { User } from "@prisma/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import type { IColumn, ISort, OrderType } from "~/interface/common";
import { dateFormat } from "~/utils/common";
import TableManage from "./TableManage";
import { useState } from "react";
import CreateOrUpdateDialog from "../Dialog/UserListingDialog/CreateOrUpdateDialog";
import { api } from "~/utils/api";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import toast from "react-hot-toast";

interface IProps {
  data: User[] | undefined;
  onOrderChange: (params: ISort) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
  isLoading: boolean;
  refetchData: () => void;
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
    refetchData,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { mutateAsync, data: userDetail } =
    api.user.getUserDetailById.useMutation();

  const { page, orderBy, orderType } = router.query;
  const [editId, setEditId] = useState<string>();

  const handleClose = () => {
    setEditId(undefined);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      await mutateAsync(id);
      setEditId(id);
    } catch (error) {
      toast.error(getTRPCErrorFromUnknown(error).message);
    }
  };

  return (
    <>
      <TableManage<User>
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
            <TableCell align="center" sx={{ pr: 4.25 }}>
              {one.email}
            </TableCell>
            <TableCell>{dayjs(one.create_at).format(dateFormat)}</TableCell>
            <TableCell>{totalPage}</TableCell>
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
                <IconButton color="error" size="small">
                  <DeleteForeverIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        )}
      />

      {editId && userDetail && (
        <CreateOrUpdateDialog
          open={Boolean(editId)}
          id={editId}
          onClose={handleClose}
          type="edit"
          data={userDetail}
          refetchData={refetchData}
        />
      )}
    </>
  );
};

export default UserTable;
