/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Box, useTheme, type SxProps } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { env } from "~/env.mjs";
import { grey } from "~/theme/colors";

interface Props {
  value: string;
  handleChangeValue: (value: string) => Promise<void>;
  styleCustom?: SxProps;
  disable: boolean;
}

const TinyEditor = (props: Props) => {
  const { value, handleChangeValue, styleCustom, disable } = props;
  const theme = useTheme();
  const { t } = useTranslation();

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
        "& .tox-notifications-container": {
          display: "none !important",
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
          placeholder: t("editorHolder"),
          fix_list_elements: true,
          force_br_newlines: true,
          init_instance_callback: function () {
            const freeTiny = document.querySelector(".tox-tinymce-aux") as any;
            if (freeTiny) {
              freeTiny.style.display = "none";
            }
          },
        }}
        onBlur={(_e, editor) => {
          const text = editor.getContent();
          void handleChangeValue(text);
        }}
        disabled={disable}
      />
    </Box>
  );
};

export default memo(TinyEditor);
