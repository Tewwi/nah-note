import {
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SimpleBar from "simplebar-react";
import type { IComment } from "~/interface/IComment";
import CommentItem from "./CommentItem";
import SendIcon from "@mui/icons-material/Send";
import { api } from "~/utils/api";
import toast from "react-hot-toast";

interface IProps {
  open: boolean;
  onClose: () => void;
  comments: IComment[];
  pageId: string;
  reloadData: () => Promise<void>;
  pageName: string;
  checkUserCanDelete: (authorId: string) => boolean;
}

const CommentDialog = (props: IProps) => {
  const {
    open,
    onClose,
    comments,
    pageId,
    reloadData,
    pageName,
    checkUserCanDelete,
  } = props;
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { mutateAsync, isLoading } = api.comment.createComment.useMutation();
  const { mutateAsync: deleteComment } =
    api.comment.deleteComment.useMutation();
  const [commentContent, setCommentContent] = useState("");

  const handleSubmitComment = async () => {
    if (commentContent) {
      await mutateAsync({
        content: commentContent,
        pageId: pageId,
      });
      setCommentContent("");
      toast.success(t("addSuccess"));
      void reloadData();
    }
  };

  const handleDeleteCmt = async (id: string) => {
    await deleteComment({ commentId: id, pageId: pageId });
    void reloadData();
    toast.success(t("addSuccess"));
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: isMobile ? "300px" : "500px",
          minHeight: "320px",
          p: 1,
        },
      }}
    >
      <Stack direction="column">
        <Typography
          variant="h5"
          sx={{ p: 1, maxWidth: { xs: "250px", lg: "400px" } }}
          noWrap
        >
          {`${t("commentOf")} "${pageName}"`}
        </Typography>
        <Divider />

        <SimpleBar style={{ maxHeight: "300px" }}>
          <Stack sx={{ minHeight: "280px", p: 1 }} direction="column" gap={1}>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                handleDeleteCmt={handleDeleteCmt}
                checkUserCanDelete={checkUserCanDelete}
              />
            ))}
          </Stack>
        </SimpleBar>

        <Stack direction="row" alignItems="center">
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("commentHolder")}
            value={commentContent}
            onChange={(e) => {
              setCommentContent(e.target.value);
            }}
          />
          <IconButton
            sx={{ p: "10px" }}
            aria-label="menu"
            onClick={() => void handleSubmitComment()}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={14} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default CommentDialog;
