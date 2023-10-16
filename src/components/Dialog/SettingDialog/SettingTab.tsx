import { Box, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import SettingSelect from "~/components/FormComponents/SettingSelect";
import { useThemeContext } from "~/theme/ThemeConfig";
import { languageOptions, themeOptions } from "~/utils/constant";

const SettingTab = () => {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { t, i18n } = useTranslation();
  const { theme, setTheme, language } = useThemeContext();

  const handleChangeTheme = (theme: string) => {
    setTheme(theme);
  };

  const handleChangeLanguage = (lng: string) => {
    void i18n.changeLanguage(lng);
    localStorage.setItem("lng", lng);
  };

  return (
    <Box p={2} minWidth={isMobile ? "unset" : "500px"}>
      <Typography variant="h5">{t("mySetting")}</Typography>
      <Divider sx={{ my: 1 }} />

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">{t("theme")}</Typography>
        <SettingSelect
          items={themeOptions}
          onValueChange={(value) => {
            handleChangeTheme(value);
          }}
          defaultValue={theme}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="body2">{t("lng")}</Typography>
        <SettingSelect
          items={languageOptions}
          onValueChange={(value) => {
            handleChangeLanguage(value);
          }}
          defaultValue={language}
        />
      </Stack>
    </Box>
  );
};

export default SettingTab;
