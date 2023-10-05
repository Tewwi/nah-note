import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { IconButton, Popover, Stack, Tooltip, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import BoxClickAble from "../Common/BoxClickAble";
import { SortableItemContext } from "./BlockDnDProvider";
import MenuChangeType from "./MenuChangeType";

interface Props {
  handleDeleteBlock: () => void;
}

const Draghandler = (props: Props) => {
  const { handleDeleteBlock } = props;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenPopper = (ref: HTMLElement) => {
    setAnchorEl(ref);
  };

  const handleDelete = () => {
    handleDeleteBlock();
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
          <BoxClickAble onClick={handleDelete}>
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
                borderRadius: "3px",
                bgcolor: "transparent",
              },
            }}
            title={<MenuChangeType />}
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
