import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import OutletRoundedIcon from "@mui/icons-material/OutletRounded";
import { Popover, Stack, useTheme } from "@mui/material";
import EmojiPicker, {
  EmojiStyle,
  Theme,
  type EmojiClickData,
  Emoji,
} from "emoji-picker-react";
import { useState } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import type { IPageForm } from "~/interface/IPage";
import BoxClickAble from "../Common/BoxClickAble";
import InputTransparent from "../FormComponents/InputTransparent";
import SelectCoverDialog from "../Dialog/SelectCoverDialog";
import { useTranslation } from "react-i18next";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<IPageForm, any>;
  setValue: UseFormSetValue<IPageForm>;
  emoji: string | null | undefined;
  coverPic: string | null;
}

const PageHeader = (props: IProps) => {
  const { control, setValue, emoji, coverPic } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorElCoverImg, setAnchorElCoverImg] = useState<null | HTMLElement>(
    null
  );
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);

  const handleChooseEmoji = (emoji: EmojiClickData) => {
    setValue("emoji", emoji.unified);
    setAnchorElEmoji(null);
  };

  const handleOpenEmojiPopper = (ref: HTMLElement) => {
    setAnchorElEmoji(ref);
  };

  const handleChooseCoverImg = (url: string) => {
    setValue("backgroundCover", url);
    setAnchorElCoverImg(null);
  };

  const handleOpenCoverImgPopper = (ref: HTMLElement) => {
    setAnchorElCoverImg(ref);
  };

  return (
    <Stack direction="column" mt="-42px">
      {emoji ? (
        <Stack
          sx={{ width: "fit-content", cursor: "pointer" }}
          onClick={(e) => handleOpenEmojiPopper(e.currentTarget)}
        >
          <Emoji unified={emoji} emojiStyle={EmojiStyle.TWITTER} size={60} />
        </Stack>
      ) : null}

      <Stack direction="row" sx={{ gap: "10px", position: "relative", mt: 1 }}>
        <BoxClickAble
          sx={{ opacity: "0.7", display: emoji ? "none" : "flex" }}
          startIcon={<OutletRoundedIcon />}
          onClick={(e) => handleOpenEmojiPopper(e.currentTarget)}
        >
          Add icon
        </BoxClickAble>

        <Popover
          open={Boolean(anchorElEmoji)}
          anchorEl={anchorElEmoji}
          onClose={() => setAnchorElEmoji(null)}
          elevation={0}
          PaperProps={{ sx: { boxShadow: "none", border: "none" } }}
        >
          <EmojiPicker
            onEmojiClick={handleChooseEmoji}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.TWITTER}
            lazyLoadEmojis={true}
            theme={
              theme.palette.mode.toString() === "light"
                ? Theme.LIGHT
                : Theme.DARK
            }
          />
        </Popover>

        <BoxClickAble
          onClick={(e) => handleOpenCoverImgPopper(e.currentTarget)}
          sx={{ opacity: "0.7" }}
          startIcon={<InsertPhotoIcon />}
        >
          {!coverPic ? t("addCoverButton") : t("editCoverButton")}
        </BoxClickAble>

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
      </Stack>

      <InputTransparent
        control={control}
        name="title"
        placeholder="Untitled"
        inputProps={{
          style: { fontSize: "32px" },
        }}
      />
    </Stack>
  );
};

export default PageHeader;
