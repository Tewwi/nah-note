export interface IPagination {
  page: number;
  cursor: string | undefined;
}

export interface Context {
  theme: string;
  language: string;
  pagination: IPagination;
  setTheme: (theme: string) => void;
  setPagination: (page: number, cursor?: string) => void;
}
