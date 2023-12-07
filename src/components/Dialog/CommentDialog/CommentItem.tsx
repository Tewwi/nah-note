import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import Image from "next/image";
import type { IComment } from "~/interface/IComment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import { Role } from "~/utils/constant";
import { grey } from "~/theme/colors";

interface IProps {
  comment: IComment;
  handleDeleteCmt: (id: string) => Promise<void>;
  checkUserCanDelete: (authorId: string, role: number) => boolean;
}

const CommentItem = (props: IProps) => {
  const { content, author, id } = props.comment;
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    await props.handleDeleteCmt(id);

    setLoading(false);
  };

  return (
    <Stack direction="row" gap={1}>
      <Image
        height={25}
        width={25}
        alt="img-avatar"
        src={author.avatar}
        style={{ borderRadius: "20px" }}
      />
      <Stack direction="column" gap={1} flex={1}>
        <Stack direction="row" gap={1.5}>
          <Typography variant="body2" fontWeight="600" flexWrap="wrap">
            {author.userName}
          </Typography>
          {author.role === Role.ADMIN.value && (
            <Typography
              variant="caption"
              sx={{
                paddingInline: 0.5,
                backgroundColor: grey[400],
                borderRadius: "10px",
                color: (theme) => theme.palette.common.black,
              }}
            >
              {Role.ADMIN.name}
            </Typography>
          )}
        </Stack>
        <Typography variant="body2">{content}</Typography>
      </Stack>
      {props.checkUserCanDelete(author.id, author.role) && (
        <IconButton
          sx={{ p: "10px" }}
          aria-label="menu"
          onClick={() => void onDelete()}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={14} />
          ) : (
            <DeleteForeverIcon fontSize="small" />
          )}
        </IconButton>
      )}
    </Stack>
  );
};

export default CommentItem;
