import { Checkbox, Stack, Typography } from "@mui/material";
import type { Block } from "@prisma/client";
import { debounce } from "lodash";
import moment from "moment";
import { useCallback, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import TinyEditor from "~/components/Editor/TinyEditor";
import { dateTimeFormat } from "~/utils/common";

interface IProps {
  handleChangeValue: (
    value: string,
    checkBoxValue?: boolean,
    updateDate?: Date
  ) => Promise<void>;
  blockData: Block;
  disable: boolean;
}

const TodoBlockItem = (props: IProps) => {
  const { t } = useTranslation();
  const { blockData, handleChangeValue, disable } = props;

  const [checkboxValue, setCheckboxValue] = useState(
    Boolean(blockData.todo_checked)
  );

  const isShowDate = blockData.updateDate && checkboxValue;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleToggleCheckbox = useCallback(
    debounce(
      async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const date = moment().toDate();
        await handleChangeValue(blockData.content, checked, date);
      },
      1000
    ),
    [blockData]
  );

  return (
    <Stack>
      <Stack direction="row" flex={1}>
        <Checkbox
          value={checkboxValue}
          defaultChecked={checkboxValue}
          onChange={(e, checked) => {
            setCheckboxValue(checked);
            void handleToggleCheckbox(e, checked);
          }}
          size="small"
          sx={{
            ":hover": {
              backgroundColor: "transparent",
            },
          }}
          disabled={disable}
        />
        <TinyEditor
          value={blockData.content}
          handleChangeValue={handleChangeValue}
          styleCustom={{
            textDecoration: checkboxValue ? "line-through" : "unset",
            opacity: checkboxValue ? 0.7 : 1,
          }}
          disable={disable}
        />
        {isShowDate ? (
          <Typography
            variant="caption"
            sx={{
              fontStyle: "italic",
              alignSelf: "center",
              ml: 2,
              opacity: 0.4,
            }}
          >
            {` - ${t("lastUpdate")} ${moment(blockData.updateDate).format(
              dateTimeFormat
            )}`}
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
};

export default TodoBlockItem;
