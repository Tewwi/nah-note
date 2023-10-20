import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { debounce } from "lodash";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { api } from "~/utils/api";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import BoxClickAble from "~/components/Common/BoxClickAble";
import { useRouter } from "next/router";

interface IProps {
  open: boolean;
  onClose: () => void;
}

const SearchDialog = (props: IProps) => {
  const { open, onClose } = props;
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { mutateAsync, data, reset } = api.page.searchPageByQuery.useMutation();

  const handleSearchPages = debounce(async (query: string) => {
    await mutateAsync({ query: query });
  }, 300);

  const handleChangePage = (id: string) => {
    void router.push(`/page/${id}`);
    onClose();
  };

  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          minWidth: isMobile ? "300px" : "500px",
          height: "320px",
          p: 1,
        },
      }}
      TransitionProps={{
        onExit: () => {
          reset();
        },
      }}
    >
      <Stack direction="row" alignItems="center">
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search Google Maps"
          onChange={(e) => {
            void handleSearchPages(e.target.value);
          }}
        />
      </Stack>
      <Divider />

      <SimpleBar>
        <Stack>
          {data?.map((item) => {
            return (
              <BoxClickAble
                key={item.id}
                sx={{ p: 2, justifyContent: "flex-start", width: "100%" }}
                onClick={() => handleChangePage(item.id)}
              >
                <Stack gap={2} direction="row" alignItems="center">
                  {item.emoji ? (
                    <Emoji
                      unified={item.emoji}
                      emojiStyle={EmojiStyle.TWITTER}
                      size={16}
                    />
                  ) : (
                    <FeedOutlinedIcon
                      sx={{ width: "16px" }}
                      fontSize="medium"
                    />
                  )}

                  <Typography textAlign="start" noWrap variant="body2">
                    {item.title}
                  </Typography>
                </Stack>
              </BoxClickAble>
            );
          })}
        </Stack>
      </SimpleBar>
    </Dialog>
  );
};

export default SearchDialog;
