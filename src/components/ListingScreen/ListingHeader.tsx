import SearchIcon from "@mui/icons-material/Search";
import { Button, IconButton, InputBase, Stack } from "@mui/material";
import type { DebouncedFunc } from "lodash";
import { grey } from "~/theme/colors";

interface IProps {
  handleSearch: DebouncedFunc<(value: string) => Promise<void>>;
  placeHolder: string;
  onClickBtn: () => void;
  defaultValue: string;
  btnText: string;
}

const ListingHeader = (props: IProps) => {
  const { handleSearch, placeHolder, onClickBtn, defaultValue, btnText } =
    props;

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack
        direction="row"
        sx={{
          width: "300px",
          border: "1px solid",
          borderColor: grey[500],
          borderRadius: "8px",
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="menu">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeHolder}
          onChange={(e) => {
            void handleSearch(e.target.value);
          }}
          defaultValue={defaultValue}
        />
      </Stack>
      <Button variant="contained" onClick={onClickBtn}>
        {btnText}
      </Button>
    </Stack>
  );
};

export default ListingHeader;
