/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import BlockList from "~/components/PageComponent/BlockList";
import CoverImage from "~/components/PageComponent/CoverImage";
import PageHeader from "~/components/PageComponent/PageHeader";
import PageLoading from "~/components/PageComponent/PageLoading";
import type { IPageForm } from "~/interface/IPage";
import { api } from "~/utils/api";
import { handleUnauthorize } from "~/utils/constant";

const PageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { mutateAsync } = api.page.updatePageById.useMutation({
    onError: (err) => {
      if (err.data) {
        handleUnauthorize(err.data.code, router);
      }
    },
  });

  const { data, isLoading, refetch } = api.page.getPageById.useQuery(
    {
      id: id?.toString() || "",
    },
    {
      onError: (err) => {
        if (err.data) {
          handleUnauthorize(err.data.code, router);
        }
      },
    }
  );

  const { control, setValue, watch, handleSubmit, reset } = useForm<IPageForm>({
    mode: "onBlur",
    defaultValues: { ...data },
  });
  const currData = watch();

  const onSubmit = useCallback(
    async (submitData: IPageForm) => {
      console.log("submit", submitData);
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
        />

        <Container maxWidth="md" sx={{ pl: "60px" }}>
          <Box>
            <PageHeader
              control={control}
              emoji={currData.emoji}
              coverPic={currData.backgroundCover}
              handleChangeValue={handleChangeValue}
              id={id.toString()}
            />
          </Box>
          {id && <BlockList control={control} pageId={id.toString()} />}
        </Container>
      </Box>
    </>
  );
};

export default PageDetail;
