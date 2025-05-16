export async function downloadFileFromUrl(url: string, filename: string) {
  try {
    return await fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        return new File([blob], filename);
      });
  } catch (error) {
    console.error("Error downloading image:", error);
    return null;
  }
}