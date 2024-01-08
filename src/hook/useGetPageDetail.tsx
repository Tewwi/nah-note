import { getTRPCErrorFromUnknown } from "@trpc/server";
import type { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";

const useGetPageDetail = (id: string) => {
  const router = useRouter();
  const apiPageDetail = api.page.getPageById.useQuery(
    {
      id: id,
    },
    {
      retry(_failureCount, error) {
        if (getTRPCErrorFromUnknown(error).message === "UNAUTHORIZED") {
          handleUnauthorize(
            error?.message as TRPC_ERROR_CODE_KEY,
            () => void router.push("/")
          );

          return false;
        }

        return true;
      },
      enabled: false,
    }
  );

  return apiPageDetail;
};

export default useGetPageDetail;
