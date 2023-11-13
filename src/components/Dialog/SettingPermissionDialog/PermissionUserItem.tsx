import { CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import type { User } from "@prisma/client";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";

interface IProps {
  data: User;
  handleAddUser: (id: string) => Promise<void>;
  hidden: boolean;
}

const PermissionUserItem = (props: IProps) => {
  const { data, handleAddUser, hidden } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleClickAdd = async () => {
    setIsLoading(true);

    await handleAddUser(data.id);
    setIsLoading(false);
  };

  if (hidden) {
    return <></>;
  }

  return (
    <Stack
      direction="row"
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack direction="row" gap={1} alignItems="center">
        <Image src={data.avatar} width={35} height={35} alt="" />
        <Typography variant="body2">{data.userName}</Typography>
      </Stack>
      <IconButton
        onClick={() => void handleClickAdd()}
        disabled={isLoading}
        size="small"
      >
        {isLoading ? (
          <CircularProgress
            size="16px"
            sx={{ color: (theme) => theme.palette.text.primary }}
          />
        ) : (
          <AddIcon fontSize="small" />
        )}
      </IconButton>
    </Stack>
  );
};

export default PermissionUserItem;
