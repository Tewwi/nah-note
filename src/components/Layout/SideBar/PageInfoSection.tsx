import { Stack, Typography } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import { useRouter } from "next/router";
import React from "react";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";
import Image from "next/image";

const PageInfoSection = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = api.page.getPageById.useQuery(
    {
      id: id?.toString() || "",
    },
    {
      onError: (err) =>
        handleUnauthorize(getTRPCErrorFromUnknown(err).code, router),
    }
  );

  if (!data) {
    return <></>;
  }

  return (
    <Stack direction="row" alignItems={"center"} gap={1}>
      <Typography variant="body2">{data.author.userName}</Typography>
      <Image
        height={25}
        width={25}
        alt="img-avatar"
        src={data.author.avatar}
        style={{ borderRadius: "20px" }}
      />
    </Stack>
  );
};

export default PageInfoSection;
