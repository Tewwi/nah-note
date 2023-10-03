import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { api } from "~/utils/api";

interface ICreateNewPage {
  authorId: string;
  title?: string | null;
  parentId?: string | null;
}

const useCrudPage = () => {
  const router = useRouter();
  const {
    mutateAsync: createNewPageApi,
    error,
    isLoading: createPageLoading,
  } = api.page.createNewPage.useMutation();

  const handleCreateNewPage = async (params: ICreateNewPage) => {
    try {
      const resp = await createNewPageApi(params);
      void router.push(`/page/${resp.id}`);
    } catch (e) {
      console.log(e);
      toast.error(error?.message || "");
    }
  };

  return {
    handleCreateNewPage: handleCreateNewPage,
    createPageLoading: createPageLoading,
  };
};

export default useCrudPage;
