/* eslint-disable @typescript-eslint/no-explicit-any */
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import OutletRoundedIcon from "@mui/icons-material/OutletRounded";
import { Popover, Stack, useTheme } from "@mui/material";
import EmojiPicker, {
  Emoji,
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from "emoji-picker-react";
import { useState } from "react";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { IPageForm } from "~/interface/IPage";
import { api } from "~/utils/api";
import BoxClickAble from "../Common/BoxClickAble";
import SelectCoverDialog from "../Dialog/SelectCoverDialog";
import InputTransparent from "../FormComponents/InputTransparent";

interface IProps {
  control: Control<IPageForm, any>;
  emoji: string | null | undefined;
  coverPic: string | null;
  id: string;
  handleChangeValue: (name: keyof IPageForm, value: string | null) => void;
}

const PageHeader = (props: IProps) => {
  const { control, emoji, coverPic, handleChangeValue, id } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const [anchorElCoverImg, setAnchorElCoverImg] = useState<null | HTMLElement>(
    null
  );
  const [anchorElEmoji, setAnchorElEmoji] = useState<null | HTMLElement>(null);

  const utils = api.useContext();

  const handleChangeItemSideBar = (value: string, key: keyof IPageForm) => {
    const itemData = utils.page.getPageByCurrUser.getData({ page: 1 });
    if (itemData) {
      utils.page.getPageByCurrUser.setData({ page: 1 }, (old) => {
        if (old) {
          return {
            ...old,
            resp: old.resp.map((item) => {
              if (item.id === id) {
                return { ...item, [key]: value };
              }

              return item;
            }),
          };
        }

        return { ...itemData };
      });
    }
  };

  const handleChooseEmoji = (newEmoji: EmojiClickData) => {
    handleChangeItemSideBar(newEmoji.unified, "emoji");
    handleChangeValue("emoji", newEmoji.unified);
    setAnchorElEmoji(null);
  };

  const handleOpenEmojiPopper = (ref: HTMLElement) => {
    setAnchorElEmoji(ref);
  };

  const handleChooseCoverImg = (url: string | null) => {
    handleChangeValue("backgroundCover", url);
    setAnchorElCoverImg(null);
  };

  const handleOpenCoverImgPopper = (ref: HTMLElement) => {
    setAnchorElCoverImg(ref);
  };

  const handleUpdateTitle = (value: string) => {
    handleChangeItemSideBar(value, "title");
    handleChangeValue("title", value);
  };

  return (
    <Stack direction="column" mt={emoji ? "-42px" : "0px"}>
      {emoji ? (
        <Stack
          sx={{ width: "fit-content", cursor: "pointer", zIndex: 2 }}
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
          PaperProps={{
            sx: {
              boxShadow: "none",
              border: "none",
              minHeight: "450px",
              minWidth: "350px",
            },
          }}
        >
          <EmojiPicker
            onEmojiClick={(e) => {
              void handleChooseEmoji(e);
            }}
            autoFocusSearch={false}
            emojiStyle={EmojiStyle.TWITTER}
            theme={
              theme.palette.mode.toString() === "light"
                ? Theme.LIGHT
                : Theme.DARK
            }
            lazyLoadEmojis
          />
        </Popover>

        <BoxClickAble
          onClick={(e) => handleOpenCoverImgPopper(e.currentTarget)}
          sx={{ opacity: "0.7", display: coverPic ? "none" : "inline-flex" }}
          startIcon={<InsertPhotoIcon />}
        >
          {t("addCoverButton")}
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
        onBlur={(e) => void handleUpdateTitle(e.target.value)}
      />
    </Stack>
  );
};

export default PageHeader;
