import type { Space } from "~/types/Space";

export const useGetSpaces = async () => {
  const {fetchRequest} = useApi();
  const spaceStore = useSpaceStore();
  const userStore = useUserStore();
  const userId = userStore.user?.id;
  if (!userId) return;

  try {
    const {data: spaces} = await fetchRequest<Space[]>("/space");
    if (userStore.user?.id !== userId) return;

    if (spaces?.length) {
      spaceStore.spaces = spaces;
      spaceStore.selectedSpaceId = spaces[0].id;
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
