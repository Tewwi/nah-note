import { useRouter } from "next/router";
import { useEffect } from "react";
import { api } from "~/utils/api";
import SideBarLoading from "./SideBarLoading";
import SideBarUser from "./SideBarUser/SideBarUser";

interface IProps {
  openSideBar: boolean;
  handleClose: () => void;
}

const SideBarByRole = (props: IProps) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const { isError, error, isInitialLoading } =
    api.user.getCurrUserDetail.useQuery();

  useEffect(() => {
    if (isError && error.message === "jwt malformed") {
      void router.push("/dashboard");
    }
  }, [error, isError, router]);

  if (isInitialLoading) {
    return <SideBarLoading openSideBar={openSideBar} />;
  }

  return (
    <>
      <SideBarUser openSideBar={openSideBar} handleClose={handleClose} />
    </>
  );
};

export default SideBarByRole;
