import type { ILayoutGridBreakpoints } from "~/interface/common";

export const defaultAvatar =
  "https://res.cloudinary.com/dqlcjscsz/image/upload/v1690958315/blog/default-avatar_v6uu8y.jpg";

export const horizontalLayout: ILayoutGridBreakpoints = {
  label: { xs: 12, sm: 12, md: 5, lg: 4.8, xl: 4 },
  field: { xs: 12, sm: 12, md: 7, lg: 7.2, xl: 8 },
};

export const regex = {
  email:
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d){8,}$/,
  imgLinkVerify: /\.(jpeg|jpg|gif|png)$/,
  blockTypeTag:
    /((<(h[1-3]|ul|li|ol|p)[^>]*?>|<\/(h[1-3]|ul|li|ol|p)>)|(^<(h[1-3]|ul|li|ol|p)[^>]*?>, <\/(h[1-3]|ul|li|ol|p)>))/g,
};
