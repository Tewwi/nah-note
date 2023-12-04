import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import type { IColumn, ISort, OrderType } from "~/interface/common";
import { dateFormat } from "~/utils/common";
import TableManage from "./TableManage";

type PageWithAuthor = Prisma.PageGetPayload<{
  include: {
    author: true;
    comment: true;
  };
}>;

interface IProps {
  data: PageWithAuthor[] | undefined;
  onOrderChange: (params: ISort) => void;
  onPageChange: (page: number) => void;
  totalPage: number;
  isLoading: boolean;
  handleOpenDelete: (id: string) => void;
}

const columns: IColumn[] = [
  {
    id: "title",
    label: "Title",
    sort: true,
  },
  {
    id: "author",
    label: "Author",
    sort: false,
  },
  {
    id: "createDate",
    label: "Create At",
    sort: true,
    width: "130px",
  },
  {
    id: "comment",
    label: "Comment",
    sort: false,
    width: "130px",
  },
  {
    id: "action",
    label: "Action",
    sort: false,
  },
];

const PageTable = (props: IProps) => {
  const {
    data,
    totalPage,
    onPageChange,
    onOrderChange,
    isLoading,
    handleOpenDelete,
  } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const { page, orderBy, orderType } = router.query;

  return (
    <>
      <TableManage<PageWithAuthor>
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
            <TableCell sx={{ width: "100%" }}>{one.title}</TableCell>
            <TableCell sx={{ pr: 4.25 }}>{one.author.userName}</TableCell>
            <TableCell>{dayjs(one.createDate).format(dateFormat)}</TableCell>
            <TableCell align="center" sx={{ pr: "50px" }}>
              {one.comment.length}
            </TableCell>
            <TableCell align="justify" sx={{ minWidth: "200px" }}>
              <Tooltip title={t("view")}>
                <IconButton
                  onClick={() => void router.push(`/page/${one.id}`)}
                  color="success"
                  size="small"
                >
                  <VisibilityIcon fontSize="small" />
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
            </TableCell>
          </TableRow>
        )}
      />
    </>
  );
};

export default PageTable;
