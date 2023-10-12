import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import { Button, Popover } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import SelectCoverDialog from "~/components/Dialog/SelectCoverDialog";

interface IProps {
  handleChangeValue: (value: string, checkBoxValue?: boolean) => Promise<void>;
}

const ImageBlockLabelButton = (props: IProps) => {
  const { t } = useTranslation();
  const { handleChangeValue } = props;
  const [anchorElImg, setAnchorElImg] = useState<null | HTMLElement>(null);

  const handleChooseCoverImg = (url: string | null) => {
    if (url) {
      void handleChangeValue(url);
    }
  };

  return (
    <>
      <Button
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          gap: 1,
          bgcolor: (theme) => theme.palette.background.paper,
          width: "100%",
          maxWidth: "500px",
          borderRadius: "5px",
          alignItems: "center",
          cursor: "pointer",
          opacity: 0.7,
          justifyContent: "flex-start",
          color: (theme) => theme.palette.text.disabled,
        }}
        startIcon={<PhotoSizeSelectActualOutlinedIcon fontSize="medium" />}
        onClick={(e) => setAnchorElImg(e.currentTarget)}
      >
        {t("addImg")}
      </Button>

      <Popover
        open={Boolean(anchorElImg)}
        anchorEl={anchorElImg}
        onClose={() => setAnchorElImg(null)}
        elevation={0}
        PaperProps={{
          sx: { boxShadow: "none", border: "none", minWidth: "500px" },
        }}
      >
        <SelectCoverDialog
          handleChooseCoverImg={(url: string | null) => {
            void handleChooseCoverImg(url);
          }}
          isHideRemoveBtn={true}
        />
      </Popover>
    </>
  );
};

export default ImageBlockLabelButton;
