import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  CircularProgress,
  Collapse,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "~/context/GlobalContext";
import { api } from "~/utils/api";
import BoxClickAble from "../../Common/BoxClickAble";
import SidebarListAction from "./SidebarListAction";

interface IProps {
  openList: boolean;
  setOpenList: (value: boolean) => void;
}

const UserPageList = (props: IProps) => {
  const { t } = useTranslation();
  const { openList, setOpenList } = props;
  const router = useRouter();
  const theme = useTheme();
  const { pagination } = useGlobalContext();
  const { data, refetch, isLoading } = api.page.getPageByCurrUser.useQuery({
    ...pagination,
  });

  const listPage = useMemo(() => data?.resp, [data]);

  const handleTogglePages = () => {
    setOpenList(!openList);
  };

  const handleChangePage = (id: string) => {
    void router.push(`/page/${id}`);
  };

  const handleReloadData = async () => {
    await refetch({});
  };

  return (
    <div style={{ width: "100%", flex: 1 }}>
      <BoxClickAble
        sx={{
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
        onClick={handleTogglePages}
      >
        {openList ? (
          <KeyboardArrowUpIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
        {t("pages")}
      </BoxClickAble>
      <Collapse orientation="vertical" in={openList}>
        <Stack direction="column">
          {isLoading && (
            <Stack minHeight="60px">
              <CircularProgress size={18} sx={{ m: "auto" }} />
            </Stack>
          )}

          {listPage?.map((item) => {
            return (
              <BoxClickAble
                key={item.id}
                fullWidth
                sx={{
                  p: 0.5,
                  height: "unset",
                  maxHeight: "30px",
                  bgcolor:
                    router.query.id === item.id
                      ? theme.palette.action.hover
                      : "transparent",
                }}
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
                      <FeedOutlinedIcon
                        sx={{ width: "14px" }}
                        fontSize="small"
                      />
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
        </Stack>
      </Collapse>
    </div>
  );
};

export default UserPageList;
