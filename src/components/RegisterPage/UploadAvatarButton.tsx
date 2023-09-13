import React from "react";
import { Box, FormHelperText, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { red } from "~/theme/colors";
import UploadButton from "../Common/Button/UploadButton";

interface Props {
  fileUpload: File | null;
  handleUploadAvatar: (files: File[] | null) => void;
  handleClearAvatar: () => void;
  errorsMessage?: string;
}

const UploadAvatarButton = (props: Props) => {
  const { fileUpload, handleUploadAvatar, errorsMessage, handleClearAvatar } =
    props;

  return (
    <>
      {fileUpload ? (
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              bgcolor: "grey.200",
              flexDirection: "row",
              padding: "6px 6px 6px 10px",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography noWrap variant="body2" mr="8px" maxWidth="350px">
              {fileUpload.name}
            </Typography>

            <IconButton size="small" onClick={handleClearAvatar}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <UploadButton
          onSelectUploadDocument={handleUploadAvatar}
          label="Upload avatar"
          accept="image/*"
        />
      )}

      {errorsMessage && (
        <FormHelperText sx={{ color: red[800] }}>
          {errorsMessage}
        </FormHelperText>
      )}
    </>
  );
};

export default UploadAvatarButton;
