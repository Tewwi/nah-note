import React, { useState } from "react";
import Image from "next/image";
import { Backdrop, Popover } from "@mui/material";
import { useTranslation } from "react-i18next";
import SelectCoverDialog from "../SelectCoverDialog";

interface IProps {
  url: string;
  handleChangeAvatar: (url: string) => Promise<void>;
}

const AvatarInput = (props: IProps) => {
  const { t } = useTranslation();

  const [isHover, setIsHover] = useState(false);
  const [anchorElImg, setAnchorElImg] = useState<null | HTMLElement>(null);

  const handleClosePopover = () => {
    setAnchorElImg(null);
    setIsHover(false);
  };

  return (
    <div
      style={{
        position: "relative",
        cursor: "pointer",
        borderRadius: "3px",
        display: "flex",
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <Image
        style={{ borderRadius: "3px" }}
        height={80}
        width={80}
        src={props.url}
        alt="avatar"
      />
      <Backdrop
        sx={{
          position: "absolute",
          textAlign: "center",
        }}
        open={isHover}
        onClick={(e) => {
          setIsHover(false);
          setAnchorElImg(e.currentTarget);
        }}
      >
        {t("changeAva")}
      </Backdrop>

      <Popover
        open={Boolean(anchorElImg)}
        anchorEl={anchorElImg}
        onClose={handleClosePopover}
        elevation={0}
        PaperProps={{
          sx: { boxShadow: "none", border: "none" },
        }}
      >
        <SelectCoverDialog
          handleChooseCoverImg={(url: string | null) => {
            if (url) {
              void props.handleChangeAvatar(url);
            }

            handleClosePopover();
          }}
          isHideRemoveBtn={true}
        />
      </Popover>
    </div>
  );
};

export default AvatarInput;
