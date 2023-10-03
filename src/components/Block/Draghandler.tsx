import React, { useContext, useState } from "react";
import { SortableItemContext } from "./BlockDnDProcider";
import { IconButton, Popover, Stack } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import BoxClickAble from "../Common/BoxClickAble";
import { useTranslation } from "react-i18next";

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
          size='small'
        >
          <DragIndicatorIcon fontSize="small" />
        </IconButton>
      </div>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        elevation={0}
        PaperProps={{ sx: { boxShadow: "none", border: "none" } }}
      >
        <Stack direction="row">
          <BoxClickAble onClick={handleDelete}>{t("deleteBlock")}</BoxClickAble>
        </Stack>
      </Popover>
    </>
  );
};

export default Draghandler;
