import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  CircularProgress,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "../Common/BoxClickAble";
import { SortableItemContext } from "../../context/BlockDnDProvider";
import MenuChangeType from "./MenuChangeType";
import type { blockTypeList } from "~/interface/IBlock";
import type { Block as IBlock } from "@prisma/client";

interface Props {
  handleDeleteBlock: (id: string) => Promise<void>;
  handleChangeType: (type: blockTypeList) => Promise<void>;
  blockData: IBlock;
  isHiddenDeleteBtn: boolean;
  disable: boolean;
}

const Draghandler = (props: Props) => {
  const {
    handleDeleteBlock,
    handleChangeType,
    blockData,
    isHiddenDeleteBtn,
    disable,
  } = props;
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPopper = (ref: HTMLElement) => {
    if (!disable) {
      setAnchorEl(ref);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    await handleDeleteBlock(blockData.id);

    setIsLoading(false);
    setAnchorEl(null);
  };

  const onChangeType = (type: blockTypeList) => {
    void handleChangeType(type);
    setAnchorEl(null);
  };

  return (
    <>
      <div
        onClick={(e) => {
          handleOpenPopper(e.currentTarget);
        }}
      >
        <IconButton
          sx={{ cursor: "grab", color: (theme) => theme.palette.text.primary }}
          {...attributes}
          {...listeners}
          ref={ref}
          size="small"
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        elevation={5}
        PaperProps={{
          sx: {
            borderColor: (theme) => theme.palette.secondary.contrastText,
            borderRadius: "3px",
          },
        }}
      >
        <Stack direction="column">
          <BoxClickAble
            onClick={() => {
              void onDelete();
            }}
            disabled={isLoading}
            sx={{
              display: isHiddenDeleteBtn ? "none" : "inline-flex",
            }}
          >
            {isLoading && (
              <CircularProgress
                size="16px"
                sx={{ color: (theme) => theme.palette.text.primary, mr: 1 }}
              />
            )}
            <Typography variant="caption">{t("deleteBlock")}</Typography>
          </BoxClickAble>
          <Tooltip
            placement="right-end"
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  marginLeft: "1px !important",
                  p: 0,
                  bgcolor: "inherit",
                },
                bgcolor: "transparent",
              },
            }}
            title={
              <MenuChangeType
                currType={blockData.type as blockTypeList}
                handleChangeType={onChangeType}
              />
            }
          >
            <div>
              <BoxClickAble
                endIcon={<KeyboardArrowRightIcon fontSize="small" />}
              >
                <Typography variant="caption">{t("changeType")}</Typography>
              </BoxClickAble>
            </div>
          </Tooltip>
        </Stack>
      </Popover>
    </>
  );
};

export default Draghandler;
