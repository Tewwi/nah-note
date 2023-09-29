import { Box, Button, Popover, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { IPageForm } from "~/interface/IPage";
import ImageLoading from "../Common/Image/ImageLoading";
import SelectCoverDialog from "../Dialog/SelectCoverDialog";

interface Props {
  url: string | null | undefined;
  handleChangeValue: (
    name: keyof IPageForm,
    value: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: () => any
  ) => void;
}

const CoverImage = (props: Props) => {
  const { url, handleChangeValue } = props;
  const { t } = useTranslation();
  const [isHover, setIsHover] = useState(false);
  const [anchorElCoverImg, setAnchorElCoverImg] = useState<null | HTMLElement>(
    null
  );

  const handleChooseCoverImg = (url: string | null) => {
    handleChangeValue("backgroundCover", url);
    setAnchorElCoverImg(null);
  };

  if (!url) {
    return <Box width="100%" height="180px"></Box>;
  }

  return (
    <Box
      sx={{ position: "relative" }}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setAnchorElCoverImg(null);
      }}
    >
      <ImageLoading
        src={url}
        alt="avatar"
        width={0}
        height={180}
        sizes="100vw"
        style={{ objectFit: "cover", width: "100%" }}
        loadingCustom={!url}
      />

      <Button
        variant="contained"
        sx={{
          position: "absolute",
          right: "20px",
          bottom: "15px",
          bgcolor: (theme) => theme.palette.background.default,
          color: (theme) => theme.palette.text.primary,
          px: 1,
          display: isHover ? "inline-flex" : "none",
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
        onClick={(e) => setAnchorElCoverImg(e.currentTarget)}
      >
        <Typography variant="caption">{t("editCoverButton")}</Typography>
      </Button>

      <Popover
        open={Boolean(anchorElCoverImg)}
        anchorEl={anchorElCoverImg}
        onClose={() => setAnchorElCoverImg(null)}
        elevation={0}
        PaperProps={{
          sx: { boxShadow: "none", border: "none", minWidth: "500px" },
        }}
      >
        <SelectCoverDialog handleChooseCoverImg={handleChooseCoverImg} />
      </Popover>
    </Box>
  );
};

export default CoverImage;
