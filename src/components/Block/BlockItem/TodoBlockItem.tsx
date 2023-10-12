import { Checkbox, Stack } from "@mui/material";
import type { Block } from "@prisma/client";
import { debounce } from "lodash";
import { type ChangeEvent, useState, useCallback } from "react";
import TinyEditor from "~/components/Editor/TinyEditor";

interface IProps {
  handleChangeValue: (value: string, checkBoxValue?: boolean) => Promise<void>;
  blockData: Block;
}

const TodoBlockItem = (props: IProps) => {
  const { blockData, handleChangeValue } = props;
  const [checkboxValue, setCheckboxValue] = useState(
    Boolean(blockData.todo_checked)
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleToggleCheckbox = useCallback(
    debounce(
      async (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        await handleChangeValue(blockData.content, checked);
      },
      1000
    ),
    [blockData]
  );

  return (
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
      />
      <TinyEditor
        value={blockData.content}
        handleChangeValue={handleChangeValue}
        styleCustom={{
          textDecoration: checkboxValue ? "line-through" : "unset",
          opacity: checkboxValue ? 0.7 : 1,
        }}
      />
    </Stack>
  );
};

export default TodoBlockItem;
