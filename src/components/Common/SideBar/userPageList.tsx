import React, { useMemo, useState } from "react";
import { api } from "~/utils/api";
import BoxClickAble from "../BoxClickAble";
import { Collapse, Stack, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useRouter } from "next/router";

const UserPageList = () => {
  const { data } = api.page.getPageByCurrUser.useInfiniteQuery(
    { page: 1 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const router = useRouter();
  const listPage = useMemo(() => data?.pages[0]?.resp, [data]);
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
                ml={2}
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
                    <FeedOutlinedIcon fontSize="small" />
                  )}
                </Stack>
                <Typography fontSize="13px">{item.title}</Typography>
              </Stack>
            </BoxClickAble>
          );
        })}
      </Collapse>
    </>
  );
};

export default UserPageList;
