import type { Space } from "~/types/Space";
const { getRequest, postRequest } = useApi();

export const useGetSpaces = async () => {
  const spaceStore = useSpaceStore();
  try {
    const { data: spaceResponse, error } = await getRequest<Space[]>("/space", {
      lazy: true,
    });

    if (error.value) {
      console.error("Authorization error:", error.value);
    }

    if (spaceResponse.value?.data?.length) {
      spaceStore.spaces = spaceResponse.value.data;
      spaceStore.selectedSpaceId = spaceStore.spaces[0].id;
    }
  } catch (error) {
    console.error("Request failed:", error);
  }
};

export const useCreateSpace = async (name: string) => {
  postRequest("/space", { body: { name } }).then(() => {});
};

export const useAddUserToSpace = async (spaceId: number, userId: number) => {
  try {
    await postRequest("/space/add", { body: { spaceId, userId } });
  } catch (error: any) {
    const message = error.data?.error?.message;
    if (message) alert(message);
  }
};
