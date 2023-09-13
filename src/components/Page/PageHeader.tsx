import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import OutletRoundedIcon from "@mui/icons-material/OutletRounded";
import { Popover, Stack } from "@mui/material";
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

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<IPageForm, any>;
  setValue: UseFormSetValue<IPageForm>;
  emoji: string;
  coverPic: string | null;
}

const PageHeader = (props: IProps) => {
  const { control, setValue, emoji } = props;
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);

  const handleChooseEmoji = (emoji: EmojiClickData) => {
    setValue("emoji", emoji.unified);
    setAnchorElEmoji(null);
  };

  const handleOpenEmojiPopper = (ref: HTMLElement) => {
    setAnchorElEmoji(ref);
  };

  return (
    <Stack direction="column">
      {Boolean(emoji) && (
        <div onClick={(e) => handleOpenEmojiPopper(e.currentTarget)}>
          <Emoji unified={emoji} emojiStyle={EmojiStyle.TWITTER} size={60} />
        </div>
      )}

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
          PaperProps={{ sx: { boxShadow: "none" } }}
        >
          <EmojiPicker
            onEmojiClick={handleChooseEmoji}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.TWITTER}
            lazyLoadEmojis={true}
            theme={Theme.AUTO}
          />
        </Popover>

        <BoxClickAble sx={{ opacity: "0.7" }} startIcon={<InsertPhotoIcon />}>
          Add cover
        </BoxClickAble>
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
