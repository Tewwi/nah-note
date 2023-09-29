/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container } from "@mui/material";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/require-await
}) => {
  const token = getCookie("token", { req, res });
  if (token) {
    return { props: {} };
  }

  return {
    redirect: {
      destination: "/auth/login",
      permanent: true,
    },
  };
};

const PageDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { mutateAsync } = api.page.updatePageById.useMutation();
  const { data, isLoading, refetch } = api.page.getPageById.useQuery({
    id: id?.toString() || "",
  });
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
    value: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: () => any
  ) => {
    setValue(name, value);
    await handleSubmit(onSubmit)();
    if (callback) {
      callback();
    }
  };

  const handleReloadData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  useEffect(() => {
    if (id === "undefined") {
      void router.replace("/404");
    }

    if(!data) {
      void handleReloadData();
    }

    if (data) {
      reset({ ...data });
    }
  }, [data, id, reset]);

  if(isLoading) {
    return <PageLoading />
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

        <Container maxWidth="md">
          <Box>
            <PageHeader
              control={control}
              emoji={currData.emoji}
              coverPic={currData.backgroundCover}
              handleChangeValue={handleChangeValue}
            />
          </Box>
          {id && <BlockList control={control} pageId={id.toString()} />}
        </Container>
      </Box>
    </>
  );
};

export default PageDetail;
