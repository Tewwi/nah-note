import { useRouter } from "next/router";
import { useEffect } from "react";
import useCurrUser from "~/hook/useCurrUser";
import SideBarLoading from "./SideBarLoading";
import SideBarUser from "./SideBarUser/SideBarUser";

interface IProps {
  openSideBar: boolean;
  handleClose: () => void;
}

const SideBarByRole = (props: IProps) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const { isError, error, isInitialLoading } = useCurrUser();

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
