/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import React, { memo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { env } from "~/env.mjs";
import { Box, useTheme, type SxProps } from "@mui/material";
import { grey } from "~/theme/colors";

interface Props {
  value: string;
  handleChangeValue: (value: string) => Promise<void>;
  styleCustom?: SxProps;
}

const TinyEditor = (props: Props) => {
  const { value, handleChangeValue, styleCustom } = props;
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
        ...styleCustom,
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
            "link",
            "lists",
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
            "undo redo | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | outdent indent | " +
            "removeformat",
          content_style:
            "body { font-family:SVN-Sofia Pro Medium; font-size:14px }",
          inline: true,
          placeholder: "This is place ho ho ho",
          fix_list_elements: true,
          force_br_newlines: true,
          force_p_newlines: false,
          init_instance_callback: function () {
            const freeTiny = document.querySelector(
              ".tox .tox-notification--in"
            ) as any;
            if (freeTiny) {
              freeTiny.style.display = "none";
            }
          },
        }}
        onBlur={(_e, editor) => {
          const text = editor.getContent();
          void handleChangeValue(text);
        }}
      />
    </Box>
  );
};

export default memo(TinyEditor);
