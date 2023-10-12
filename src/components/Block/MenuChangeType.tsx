import { Paper, Stack, Typography } from "@mui/material";
import { blockTypes } from "~/utils/utilsBlock";
import BoxClickAble from "../Common/BoxClickAble";
import Image from "next/image";
import type { blockTypeList } from "~/interface/IBlock";
import CheckIcon from "@mui/icons-material/Check";

interface IProps {
  handleChangeType: (type: blockTypeList) => void;
  currType: blockTypeList;
}

const MenuChangeType = (props: IProps) => {
  const { handleChangeType, currType } = props;

  return (
    <Paper>
      <Stack
        sx={{
          borderRadius: "8px",
          border: (theme) =>
            `1px solid ${theme.palette.secondary.contrastText}`,
        }}
        direction="column"
      >
        {Object.values(blockTypes).map((option) => {
          return (
            <BoxClickAble
              sx={{
                justifyContent: "space-between",
              }}
              key={option.type}
              onClick={() => void handleChangeType(option.type)}
            >
              <Stack
                sx={{
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  gap: 1,
                }}
              >
                <Image
                  src={option.img}
                  width={20}
                  height={20}
                  alt={option.type}
                  style={{ backgroundColor: "white", borderRadius: "2px" }}
                />
                <Typography variant="caption">{option.label}</Typography>
              </Stack>
              {currType === option.type && (
                <CheckIcon
                  sx={{ alignSelf: "center", marginLeft: 2, fontSize: "1em" }}
                />
              )}
            </BoxClickAble>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default MenuChangeType;
