import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";

const resources = {
  en: {
    translation: en,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});
