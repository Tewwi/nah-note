import { api } from "~/utils/api";

const useCurrUser = () => {
  const apiCurrUser = api.user.getCurrUserDetail.useQuery(undefined, {
    enabled: false,
  });

  return apiCurrUser;
};

export default useCurrUser;
