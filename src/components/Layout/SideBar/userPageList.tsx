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
import SidebarListAction from "./SidebarListAction";

const UserPageList = () => {
  const { data, refetch } = api.page.getPageByCurrUser.useQuery(
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

  const handleReloadData = async () => {
    await refetch();
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
              sx={{ p: 0.5, height: "unset", maxHeight: "30px" }}
            >
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                width="100%"
                gap="10px"
                pl={2}
                onClick={() => handleChangePage(item.id)}
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
                <Typography textAlign="start" noWrap fontSize="13px">
                  {item.title}
                </Typography>
              </Stack>
              <SidebarListAction
                handleReloadData={handleReloadData}
                id={item.id}
              />
            </BoxClickAble>
          );
        })}
      </Collapse>
    </>
  );
};

export default UserPageList;
