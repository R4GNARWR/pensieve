export const useLoadPhoto = async (photo: File) => {
  const { postRequest } = useApi();
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
  } catch (error) {
    console.error("Photo upload failed:", error);
    throw error;
  }
};
