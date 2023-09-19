/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, Skeleton } from "@mui/material";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ImageLoading from "~/components/Common/Image/ImageLoading";
import PageHeader from "~/components/Page/PageHeader";
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
  const { fields } = useFieldArray({
    control,
    name: "blocks",
  });

  console.log("fields", fields);
  const currData = watch();

  const onSubmit = useCallback(
    async (submitData: IPageForm) => {
      console.log("submit", data);
      if (!data) {
        console.log("refetch data page", currData);
        await refetch();
      }

      await mutateAsync({
        ...submitData,
        authorId: data?.author.id || currData.author.id,
        id: id?.toString(),
      });
    },
    [mutateAsync, id]
  );

  const handleChangeValue = async (
    name: keyof IPageForm,
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback?: () => any
  ) => {
    setValue(name, value);
    await handleSubmit(onSubmit)();
    if (callback) {
      callback();
    }
  };

  useEffect(() => {
    if (data) {
      reset({ ...data });
    }
  }, [data, id, reset]);

  return (
    <>
      <Head>
        <title>Nah | Page Detail</title>
      </Head>
      <Box>
        {data?.backgroundCover ? (
          <ImageLoading
            src={currData.backgroundCover || data?.backgroundCover}
            alt="avatar"
            width={0}
            height={180}
            sizes="100vw"
            style={{ objectFit: "cover", width: "100%" }}
            loadingCustom={!data.backgroundCover}
          />
        ) : (
          <Box width="100%" height="180px">
            {isLoading && (
              <Skeleton
                sx={{
                  width: "100%",
                  height: "100%",
                }}
                animation="wave"
              />
            )}
          </Box>
        )}

        <Container maxWidth="md">
          <Box>
            <PageHeader
              control={control}
              emoji={currData.emoji}
              coverPic={currData.backgroundCover}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              handleChangeValue={handleChangeValue}
              loading={isLoading}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PageDetail;
