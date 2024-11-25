import { Paper, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { api } from "~/utils/api";
import { handleUploadFile } from "~/utils/cloudinaryHelper";
import { isImgUrl } from "~/utils/utilsImage";
import BoxClickAble from "../Common/BoxClickAble";
import LoadingButton from "../Common/Button/LoadingButton";
import UploadAvatarButton from "../RegisterPage/UploadAvatarButton";

interface IProps {
  handleChooseCoverImg: (url: string | null) => void;
  isHideRemoveBtn?: boolean;
}

const folderName = "cover_image";

const SelectCoverDialog = (props: IProps) => {
  const { t } = useTranslation();
  const { isHideRemoveBtn, handleChooseCoverImg } = props;
  const { mutateAsync: signCloud } = api.user.signCloud.useMutation();

  const [tab, setTab] = useState(0);
  const [urlImg, setUrlImg] = useState("");
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeTab = (tabIndex: number) => {
    setTab(tabIndex);
  };

  const handleSubmitUrl = async () => {
    if (urlImg) {
      setIsLoading(true);
      const isUrlValid = await isImgUrl(urlImg);
      if (!isUrlValid) {
        toast.error(t("imgLinkInvalid"));
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      handleChooseCoverImg(urlImg);
    }
  };

  const handleChooseFileImg = (file: File) => {
    setImgFile(file);
  };

  const handleRemoveImg = () => {
    setImgFile(null);
    handleChooseCoverImg(null);
  };

  const handleUploadCoverFile = async () => {
    if (!imgFile) {
      return;
    }

    setIsLoading(true);
    const { timestamp, signature } = await signCloud({
      folderName: folderName,
    });
    const resp = await handleUploadFile(
      imgFile,
      signature,
      timestamp,
      folderName
    );

    handleChooseCoverImg(resp.url);
  };

  return (
    <Paper>
      <Stack
        direction="row"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          justifyContent: "space-between",
          p: 1,
          alignItems: "center",
        }}
      >
        <Tabs
          value={tab}
          onChange={(e, value) => handleChangeTab(Number(value))}
        >
          <Tab sx={{ p: 0 }} label={t("upload")} />
          <Tab sx={{ p: 0 }} label={t("link")} />
        </Tabs>

        {!isHideRemoveBtn && (
          <BoxClickAble
            variant="text"
            sx={{ opacity: 0.5 }}
            onClick={handleRemoveImg}
          >
            {t("remove")}
          </BoxClickAble>
        )}
      </Stack>

      {tab === 0 && (
        <Stack direction="column" p={1.25}>
          <UploadAvatarButton
            fileUpload={imgFile}
            handleClearAvatar={() => setImgFile(null)}
            handleUploadAvatar={(file) => {
              if (file && file[0]) {
                handleChooseFileImg(file[0]);
              }
            }}
            label={t("uploadFile")}
          />
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{
              maxWidth: "180px",
              mt: 1,
              maxHeight: "30px",
              alignSelf: "center",
            }}
            onClick={() => {
              void handleUploadCoverFile();
            }}
            title={t("submit")}
            loading={isLoading}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: "500",
              mt: 1,
              textAlign: "center",
            }}
          >
            {t("maxFileSize")}
          </Typography>
        </Stack>
      )}

      {tab === 1 && (
        <Stack direction="column" p={1.25}>
          <TextField
            variant="outlined"
            inputProps={{ style: { padding: "6px", paddingInline: "12px" } }}
            onBlur={(e) => setUrlImg(e.target.value)}
            placeholder={t("placeholderCoverImg")}
          />
          <LoadingButton
            variant="contained"
            color="primary"
            sx={{
              maxWidth: "180px",
              mt: 1,
              maxHeight: "30px",
              alignSelf: "center",
            }}
            onClick={() => void handleSubmitUrl()}
            title={t("submit")}
            loading={isLoading}
          />
        </Stack>
      )}
    </Paper>
  );
};

export default SelectCoverDialog;
