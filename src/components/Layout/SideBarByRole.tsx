import React, { useEffect } from "react";
import { api } from "~/utils/api";
import { Role } from "~/utils/constant";
import SideBarAdmin from "./SideBarAdmin/SideBarAdmin";
import SideBarUser from "./SideBarUser/SideBarUser";
import { useRouter } from "next/router";
import SideBarLoading from "./SideBarLoading";

interface IProps {
  openSideBar: boolean;
  handleClose: () => void;
}

const SideBarByRole = (props: IProps) => {
  const { openSideBar, handleClose } = props;
  const router = useRouter();
  const {
    data: userInfo,
    isError,
    error,
    isInitialLoading,
  } = api.user.getCurrUserDetail.useQuery();

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
      {userInfo?.role === Role.ADMIN.value ? (
        <SideBarAdmin openSideBar={openSideBar} handleClose={handleClose} />
      ) : (
        <SideBarUser openSideBar={openSideBar} handleClose={handleClose} />
      )}
    </>
  );
};

export default SideBarByRole;
