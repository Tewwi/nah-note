import { Badge, Stack, Typography } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { api } from "~/utils/api";
import { Role, handleUnauthorize } from "~/utils/constant";
import Image from "next/image";
import CommentIcon from "@mui/icons-material/Comment";
import { useTranslation } from "react-i18next";
import CommentDialog from "~/components/Dialog/CommentDialog/CommentDialog";

const PageInfoSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = router.query;
  const { data, refetch } = api.page.getPageById.useQuery(
    {
      id: id?.toString() || "",
    },
    {
      onError: (err) =>
        handleUnauthorize(getTRPCErrorFromUnknown(err).code, router),
    }
  );
  const { data: userInfo } = api.user.getCurrUserDetail.useQuery();

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
