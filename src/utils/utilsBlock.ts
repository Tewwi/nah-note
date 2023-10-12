import type { Block } from "@prisma/client";
import type { blockTypeList } from "~/interface/IBlock";
import { regex } from "./constant";

export const blockTypes = {
  text: {
    type: "text",
    label: "Text",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/text_img_ker0rx.png",
  },
  heading_1: {
    type: "heading_1",
    label: "Heading 1",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/h1_img_dawafn.png",
  },
  heading_2: {
    type: "heading_2",
    label: "Heading 2",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574922/store/h2_img_ozp1xx.png",
  },
  heading_3: {
    type: "heading_3",
    label: "Heading 3",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/h3_img_pdgtmv.png",
  },
  todo_list: {
    type: "todo_list",
    label: "Todo list",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/to-do_img_jeia9z.png",
  },
  bulled_list: {
    type: "bulled_list",
    label: "Bullet list",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/bulleted-list_img_pyotu2.png",
  },
  numbered_list: {
    type: "numbered_list",
    label: "Numbered list",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1696574805/store/numbered-list_img_b9ygvn.png",
  },
  image: {
    type: "image",
    label: "Image",
    img: "https://res.cloudinary.com/dqlcjscsz/image/upload/v1697018341/store/image-gallery_e69qvw.png",
  },
} as const;

export const removeSpecCharter = (str: string) => {
  const regex = new RegExp(/(&nbsp;|\/n)/g);
  return str.replaceAll(regex, "").trim();
};

export const createBlockItemByType = (type: blockTypeList, value: string) => {
  const content = value.length ? removeSpecCharter(value) : "&nbsp;";

  switch (type) {
    case "text":
      return `<p>${content}</p>`;
    case "heading_1":
      return `<h1>${content}</h1>`;
    case "heading_2":
      return `<h2>${content}</h2>`;
    case "heading_3":
      return `<h3>${content}</h3>`;
    case "bulled_list":
      return `<ul>${content}</ul>`;
    case "numbered_list":
      return `<ol>${content}</ol>`;
    case "image":
      return "";

    default:
      return value;
  }
};

export const handleChangeContentByType = (blockData: Block) => {
  if (blockData.type === "image") {
    return "";
  }

  return blockData.content.replaceAll(regex.blockTypeTag, "").trim();
};
