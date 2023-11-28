import { includes } from "lodash";

export const publicsPage = ["auth", "dashboard"];

export const handleCheckHiddenLayout = (routerName: string) => {
  return publicsPage.some((item) => includes(routerName, item));
};

export const dateFormat = "DD-MM-YYYY";
