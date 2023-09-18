import { Box, Container } from "@mui/material";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import ImageLoading from "~/components/Common/Image/ImageLoading";
import PageHeader from "~/components/Page/PageHeader";
import type { IPageForm } from "~/interface/IPage";
import { generateSSGHelper } from "~/server/utils";
import { api } from "~/utils/api";

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const token = getCookie("token", { req, res });
  const { id } = query;
  if (token) {
    const ssg = generateSSGHelper(token?.toString());
    if (id) {
      await ssg.page.getPageById.prefetch({ id: id.toString() });
    }

    return {
      props: {
        trpcState: ssg.dehydrate(),
      },
    };
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
  const { data, isLoading: getPageByIdLoading } = api.page.getPageById.useQuery(
    {
      id: id?.toString() || "",
    }
  );
  const { mutateAsync } = api.page.updatePageById.useMutation();
  const { control, setValue, watch, handleSubmit } = useForm<IPageForm>({
    defaultValues: { ...data },
  });
  const { fields } = useFieldArray({
    control,
    name: "blocks",
  });

  console.log(fields);

  const emoji = watch("emoji");
  const coverPic = watch("backgroundCover");

  const onSubmit = useCallback(
    async (data: IPageForm) => {
      const resp = await mutateAsync({ ...data, authorId: data.author.id });

      console.log("resp submit :", resp);
    },
    [mutateAsync]
  );

  useEffect(() => {
    const subscription = watch(() => void handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, onSubmit, watch]);

  return (
    <>
      <Head>
        <title>Nah | Page Detail</title>
      </Head>
      <Box>
        {data?.backgroundCover ? (
          <ImageLoading
            src={coverPic || data?.backgroundCover}
            alt="avatar"
            width={0}
            height={0}
            sizes="100vw"
            style={{ objectFit: "cover", height: "180px", width: "100%" }}
            loadingCustom={getPageByIdLoading}
          />
        ) : (
          <Box width="100%" height="120px"></Box>
        )}

        <Container maxWidth="md">
          <Box>
            <PageHeader
              control={control}
              setValue={setValue}
              emoji={emoji}
              coverPic={coverPic}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PageDetail;
