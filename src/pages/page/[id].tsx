import { Box, Container } from "@mui/material";
import { getCookie } from "cookies-next";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
  const { data } = api.page.getPageById.useQuery({ id: id?.toString() || "" });
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

  const onSubmit = (data: IPageForm) => console.log("submit data", data);

  useEffect(() => {
    const subscription = watch(() => void handleSubmit(onSubmit)());
    return () => subscription.unsubscribe();
  }, [handleSubmit, watch]);

  return (
    <Box>
      {data?.backgroundCover ? (
        <Image
          src={data.backgroundCover}
          alt="avatar"
          layout="fill"
          objectFit="contain"
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
  );
};

export default PageDetail;
