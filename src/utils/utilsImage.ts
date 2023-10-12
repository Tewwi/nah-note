export const isImgUrl = (url: string) => {
  const img = new Image();
  img.src = url;

  return new Promise<boolean>((resolve) => {
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
  });
};
