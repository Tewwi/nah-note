import { getCookie } from "cookies-next";
import { api } from "~/utils/api";

const useCurrUser = () => {
  const token = getCookie("token");

  const apiCurrUser = api.user.getCurrUserDetail.useQuery(
    {},
    {
      enabled: Boolean(token || token === "undefined"),
    }
  );

  return apiCurrUser;
};

export default useCurrUser;
