import type { Space } from "~/types/Space";

export const useGetSpaces = async () => {
  const { getRequest } = useApi();
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
  const { postRequest } = useApi();
  postRequest("/space", { body: { name } }).then(() => {});
};

export const useAddUserToSpace = async (spaceId: number, email: string) => {
  const { postRequest } = useApi();
  return postRequest("/space/add", {body: {spaceId, email}});
};
