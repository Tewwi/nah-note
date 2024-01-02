import { getTRPCErrorFromUnknown } from "@trpc/server";
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
      onSettled(data, error) {
        if (!data && getTRPCErrorFromUnknown(error)) {
          handleUnauthorize("UNAUTHORIZED", () => void router.push("/"));
        }
      },
      enabled: false,
    }
  );

  return apiPageDetail;
};

export default useGetPageDetail;
