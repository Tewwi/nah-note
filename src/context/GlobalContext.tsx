import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Context, IPagination } from "~/interface/context";

const GlobalContext = createContext<Context>({
  theme: "",
  language: "",
  pagination: {
    page: 1,
    cursor: undefined,
  },
  setTheme: () => {},
  setPagination: () => {},
});

export const AppProvider = (props: React.PropsWithChildren) => {
  const { i18n } = useTranslation();

  const [themeMode, setThemeMode] = useState("light");
  const [language, setLanguage] = useState("vi");
  const [pagination, setPagination] = useState<IPagination>({
    page: 1,
    cursor: undefined,
  });

  const handleSetTheme = (theme: string) => {
    setThemeMode(theme);
    localStorage.setItem("themeMode", theme);
  };

  const handleChangePage = (page: number, cursor?: string) => {
    setPagination({
      page: page,
      cursor: cursor,
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setThemeMode(localStorage.getItem("themeMode") || "light");
      setLanguage(localStorage.getItem("lng") || "vi");
      void i18n.changeLanguage(localStorage.getItem("lng") || "vi");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          theme: themeMode,
          language: language,
          pagination: pagination,
          setTheme: handleSetTheme,
          setPagination: handleChangePage,
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
};

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
