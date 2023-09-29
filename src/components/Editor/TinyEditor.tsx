import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { env } from "~/env.mjs";
import { Box, useTheme } from "@mui/material";
import { grey } from "~/theme/colors";

interface Props {
  value: string;
  handleChangeValue: (value: string) => Promise<void>;
}

const TinyEditor = (props: Props) => {
  const { value, handleChangeValue } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        "& .mce-content-body": {
          display: "flex",
          height: "100%",
          padding: "10px",
          ":before": {
            paddingInline: "8px",
            color: `${grey[900]} !important`,
          },
          cursor: "text",
        },
        "& .mce-edit-focus": {
          outline: "none",
          background: theme.palette.background.paper,
          padding: "10px",
          borderRadius: "5px",
        },
        "& p": {
          margin: "unset",
          display: "flex",
        },
        flex: 1,
        height: "100%",
      }}
    >
      <Editor
        apiKey={env.NEXT_PUBLIC_TINY_API_KEY}
        initialValue={value}
        init={{
          height: 100,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "insertdatetime",
            "media",
            "table",
            "code",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat",
          content_style:
            "body { font-family:SVN-Sofia Pro Medium; font-size:14px }",
          inline: true,
          placeholder: "This is place ho ho ho",
        }}
        onBlur={(e, editor) => {
          const text = editor.getContent();
          void handleChangeValue(text);
        }}
      />
    </Box>
  );
};

export default TinyEditor;
