import { Button, type ButtonProps } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface Props extends Pick<ButtonProps, "color" | "sx" | "size"> {
  disabled?: boolean;
  multiple?: boolean;
  label?: string;
  onSelectUploadDocument: (files: File[] | null) => void;
  accept?: string;
}

const UploadButton = (props: Props) => {
  const {
    disabled,
    sx,
    multiple,
    label,
    size,
    onSelectUploadDocument,
    accept,
    ...rest
  } = props;

  return (
    <Button
      disabled={disabled}
      component="label"
      color="primary"
      size={size}
      sx={{
        minWidth: "98px",
        border: "1px dashed",
        ...sx,
      }}
      startIcon={
        <CloudUploadIcon
          className="svg-fill-all"
          style={{
            fill: "currentColor",
          }}
        />
      }
      {...rest}
    >
      {label}
      <input
        hidden
        accept={accept || "image/*,.pdf,.csv,.xlsx,.docx"}
        multiple={multiple}
        type="file"
        onChange={(e) =>
          onSelectUploadDocument(
            e.target.files ? Array.from(e.target.files) : null
          )
        }
      />
    </Button>
  );
};

export default UploadButton;
