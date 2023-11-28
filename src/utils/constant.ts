import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import type { NextRouter } from "next/router";
import toast from "react-hot-toast";
import i18n from "~/i18/config";
import type {
  ILayoutGridBreakpoints,
  ISettingSelectItem,
} from "~/interface/common";

export const defaultAvatar =
  "https://res.cloudinary.com/dqlcjscsz/image/upload/v1690958315/blog/default-avatar_v6uu8y.jpg";

export const horizontalLayout: ILayoutGridBreakpoints = {
  label: { xs: 12, sm: 12, md: 5, lg: 4, xl: 4 },
  field: { xs: 12, sm: 12, md: 7, lg: 8, xl: 8 },
};

export const regex = {
  email:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d){8,}$/,
  imgLinkVerify: /\.(jpeg|jpg|gif|png)$/,
  blockTypeTag:
    /((<(h[1-3]|ul|li|ol|p)[^>]*?>|<\/(h[1-3]|ul|li|ol|p)>)|(^<(h[1-3]|ul|li|ol|p)[^>]*?>, <\/(h[1-3]|ul|li|ol|p)>))/g,
};

export const themeOptions: ISettingSelectItem[] = [
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "light",
    label: "Light",
  },
];

export const languageOptions: ISettingSelectItem[] = [
  {
    value: "en",
    label: i18n.t("en"),
  },
  {
    value: "vi",
    label: i18n.t("vi"),
  },
];

export const handleUnauthorize = (
  errKey: TRPC_ERROR_CODE_KEY,
  router: NextRouter
) => {
  if (errKey === "UNAUTHORIZED") {
    toast.error(i18n.t("unauthorized"));
    void router.push("/");
  }
};

export const homepageImgUrl =
  "https://res.cloudinary.com/dqlcjscsz/image/upload/v1700119190/store/bgNahtion_kg6q6e.svg";

export const Role = {
  ADMIN: {
    value: 0,
    name: "Admin",
  },
  USER: {
    value: 1,
    name: "User",
  },
};
