/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./en";
import { vi } from "./vi";

const resources = {
  en: {
    translation: en,
  },
  vi: {
    translation: vi,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
