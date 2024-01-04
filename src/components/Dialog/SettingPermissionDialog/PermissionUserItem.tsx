import {
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import type { User } from "@prisma/client";
import React, { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import RemoveIcon from "@mui/icons-material/Remove";

interface IProps {
  data: User;
  handleAddUser: (id: string) => Promise<void>;
  hidden: boolean;
  isEdit?: boolean;
}

const PermissionUserItem = (props: IProps) => {
  const { data, handleAddUser, hidden, isEdit = false } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleClickAdd = async () => {
    setIsLoading(true);

    await handleAddUser(data.id);
    setIsLoading(false);
  };

  const renderIcons = useMemo(() => {
    if (isLoading) {
      return (
        <CircularProgress
          size="16px"
          sx={{ color: (theme) => theme.palette.text.primary }}
        />
      );
    }

    if (isEdit) {
      return <RemoveIcon fontSize="small" color="error" />;
    }

    return <AddIcon fontSize="small" />;
  }, [isEdit, isLoading]);

  if (hidden) {
    return <></>;
  }

  return (
    <>
      <Stack
        direction="row"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" gap={1} alignItems="center">
          <Image src={data.avatar} width={35} height={35} alt="" />
          <Stack>
            <Typography variant="body2" fontWeight={600}>
              {data.userName}
            </Typography>
            <Typography variant="body2">{data.email}</Typography>
          </Stack>
        </Stack>
        <IconButton
          onClick={() => void handleClickAdd()}
          disabled={isLoading}
          size="small"
        >
          {renderIcons}
        </IconButton>
      </Stack>
      <Divider />
    </>
  );
};

export default PermissionUserItem;
