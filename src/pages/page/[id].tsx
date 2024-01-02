/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Box, Container } from "@mui/material";
import { getTRPCErrorFromUnknown } from "@trpc/server";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import BlockList from "~/components/PageComponent/BlockList";
import CoverImage from "~/components/PageComponent/CoverImage";
import PageHeader from "~/components/PageComponent/PageHeader";
import PageLoading from "~/components/PageComponent/PageLoading";
import useCurrUser from "~/hook/useCurrUser";
import useGetPageDetail from "~/hook/useGetPageDetail";
import type { IPageForm } from "~/interface/IPage";
import { api } from "~/utils/api";
import { Role, handleUnauthorize } from "~/utils/constant";

const PageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { mutateAsync } = api.page.updatePageById.useMutation({
    onSettled(data, error) {
      if (!data && getTRPCErrorFromUnknown(error)) {
        handleUnauthorize("UNAUTHORIZED", () => void router.push("/"));
      }
    },
  });
  const { data: currUserInfo } = useCurrUser();
  const { data, isLoading, refetch } = useGetPageDetail(id?.toString() || "");

  const { control, setValue, watch, handleSubmit, reset } = useForm<IPageForm>({
    mode: "onBlur",
    defaultValues: { ...data },
  });
  const currData = watch();

  const isAuthor = useMemo(() => {
    if (!currUserInfo) {
      return false;
    }

    if (currUserInfo.role === Role.ADMIN.value) {
      return true;
    }

    return currUserInfo.id === data?.authorId;
  }, [currUserInfo?.id, data?.authorId]);

  const onSubmit = useCallback(
    async (submitData: IPageForm) => {
      await mutateAsync({
        ...submitData,
        id: id?.toString(),
      });

      await refetch();
    },
    [mutateAsync, id]
  );

  const handleChangeValue = async (
    name: keyof IPageForm,
    value: string | null
  ) => {
    setValue(name, value);
    await handleSubmit(onSubmit)();
  };

  const handleReloadData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    if (id === "undefined") {
      void router.replace("/");
    }

    if (!data) {
      void handleReloadData();
    }

    if (data) {
      reset({ ...data });
    }
  }, [data, id, reset]);

  if (isLoading || !id) {
    return <PageLoading />;
  }

  return (
    <>
      <Head>
        <title>Nah | Page Detail</title>
      </Head>
      <Box sx={{ paddingBottom: 6 }}>
        <CoverImage
          handleChangeValue={handleChangeValue}
          url={currData.backgroundCover}
          disable={!isAuthor}
        />

        <Container maxWidth="md" sx={{ pl: "60px" }}>
          <Box>
            <PageHeader
              control={control}
              emoji={currData.emoji}
              coverPic={currData.backgroundCover}
              handleChangeValue={handleChangeValue}
              id={id.toString()}
              disabled={!isAuthor}
            />
          </Box>
          {id && (
            <BlockList
              control={control}
              disable={!isAuthor}
              pageId={id.toString()}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default PageDetail;
