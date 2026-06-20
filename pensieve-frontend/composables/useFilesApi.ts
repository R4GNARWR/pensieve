const { postRequest } = useApi();

export const useLoadPhoto = async (photo: File) => {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    // TODO: Типизировать ответ
    const { data: response } = await postRequest<any>("/photo", {
      body: formData,
    });
    console.log(response);
    if (response.file) {
      return response.file;
    }
  } catch (e) {
    console.error("Photo upload failed:", e);
    throw new Error("Failed to upload photo");
  }
};
