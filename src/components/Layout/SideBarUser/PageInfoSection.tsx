import CommentIcon from "@mui/icons-material/Comment";
import { Badge, Stack, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CommentDialog from "~/components/Dialog/CommentDialog/CommentDialog";
import useCurrUser from "~/hook/useCurrUser";
import useGetPageDetail from "~/hook/useGetPageDetail";
import { Role } from "~/utils/constant";

const PageInfoSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const { data, refetch } = useGetPageDetail(id?.toString() || "");
  const { data: userInfo } = useCurrUser();

  const [open, setOpen] = useState(false);

  const checkUserCanDelete = (commentAuthorId: string, authorRole: number) => {
    if (userInfo?.id === commentAuthorId) {
      return true;
    }

    if (authorRole === Role.ADMIN.value) {
      return false;
    }

    if (userInfo?.role === Role.ADMIN.value) {
      return true;
    }

    return userInfo?.id === data?.authorId;
  };

  const refetchData = async () => {
    await refetch();
  };

  if (!id || !data) {
    return <></>;
  }

  return (
    <Stack direction="row" alignItems={"center"} gap={1}>
      <Stack
        direction="row"
        sx={{ cursor: "pointer", alignItems: "center", gap: 0.5 }}
        onClick={() => setOpen(true)}
      >
        <Badge badgeContent={data.comment.length || 0} color="primary">
          <CommentIcon fontSize="small" />
        </Badge>
        <Typography variant="body2">{t("comment")}</Typography>
      </Stack>

      <Typography
        sx={{
          ml: 1,
        }}
        variant="body2"
      >
        {data.author.userName}
      </Typography>
      <Image
        height={25}
        width={25}
        alt="img-avatar"
        src={data.author.avatar}
        style={{ borderRadius: "20px" }}
      />

      <CommentDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        comments={data.comment}
        pageId={data.id}
        reloadData={refetchData}
        pageName={data.title || ""}
        checkUserCanDelete={checkUserCanDelete}
      />
    </Stack>
  );
};

export default PageInfoSection;
