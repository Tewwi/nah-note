import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Collapse, Stack, Typography } from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { api } from "~/utils/api";
import BoxClickAble from "../../Common/BoxClickAble";

const UserPageList = () => {
  const { data } = api.page.getPageByCurrUser.useQuery(
    { page: 1 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const router = useRouter();
  const listPage = useMemo(() => data?.resp, [data]);
  const [openList, setOpenList] = useState(false);

  const handleTogglePages = () => {
    setOpenList(!openList);
  };

  const handleChangePage = (id: string) => {
    void router.push(`/page/${id}`);
  };

  return (
    <>
      <BoxClickAble
        sx={{ justifyContent: "flex-start", gap: "10px", alignItems: "center" }}
        onClick={handleTogglePages}
      >
        {openList ? (
          <KeyboardArrowUpIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
        Pages
      </BoxClickAble>
      <Collapse orientation="vertical" in={openList}>
        {listPage?.map((item) => {
          return (
            <BoxClickAble
              key={item.id}
              fullWidth
              sx={{ p: 0.5, height: "unset" }}
              onClick={() => handleChangePage(item.id)}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                height="100%"
                gap="10px"
                pl={2}
              >
                <Stack>
                  {item.children.length ? <KeyboardArrowDownIcon /> : null}

                  {item.emoji ? (
                    <Emoji
                      unified={item.emoji}
                      emojiStyle={EmojiStyle.TWITTER}
                      size={14}
                    />
                  ) : (
                    <FeedOutlinedIcon sx={{ width: "14px" }} fontSize="small" />
                  )}
                </Stack>
                <Typography noWrap fontSize="13px">
                  {item.title}
                </Typography>
              </Stack>
            </BoxClickAble>
          );
        })}
      </Collapse>
    </>
  );
};

export default UserPageList;
