import ContactPageIcon from "@mui/icons-material/ContactPage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import { Collapse, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import BoxClickAble from "../../Common/BoxClickAble";

interface IProps {
  openList: boolean;
  setOpenList: (value: boolean) => void;
}

const AdminSection = (props: IProps) => {
  const { t } = useTranslation();
  const { openList, setOpenList } = props;
  const router = useRouter();

  const handleTogglePages = () => {
    setOpenList(!openList);
  };

  const handleChangePage = (id: string) => {
    void router.push(`/admin/${id}`);
  };

  return (
    <div style={{ width: "100%" }}>
      <BoxClickAble
        sx={{
          justifyContent: "flex-start",
          gap: "10px",
          alignItems: "center",
          width: "100%",
        }}
        onClick={handleTogglePages}
      >
        {openList ? (
          <KeyboardArrowUpIcon fontSize="small" />
        ) : (
          <ExpandMoreIcon fontSize="small" />
        )}
        {t("Admin")}
      </BoxClickAble>
      <Collapse orientation="vertical" in={openList}>
        <Stack direction="column">
          <BoxClickAble
            sx={{
              justifyContent: "flex-start",
              gap: "10px",
              alignItems: "center",
            }}
            onClick={() => handleChangePage("user_listing")}
          >
            <ContactPageIcon fontSize="small" />
            <Typography variant="body2">{t("userListing")}</Typography>
          </BoxClickAble>

          <BoxClickAble
            sx={{
              justifyContent: "flex-start",
              gap: "10px",
              alignItems: "center",
            }}
            onClick={() => handleChangePage("user_chart")}
          >
            <ShowChartIcon fontSize="small" />
            <Typography variant="body2">{t("chartUser")}</Typography>
          </BoxClickAble>

          <BoxClickAble
            sx={{
              justifyContent: "flex-start",
              gap: "10px",
              alignItems: "center",
            }}
            onClick={() => handleChangePage("page_chart")}
          >
            <ShowChartIcon fontSize="small" />
            <Typography variant="body2">{t("chartPage")}</Typography>
          </BoxClickAble>
        </Stack>
      </Collapse>
    </div>
  );
};

export default AdminSection;
