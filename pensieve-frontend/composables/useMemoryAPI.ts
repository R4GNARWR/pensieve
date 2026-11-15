import type { Memory } from "~/types/Memory";

export const useCreateMemory = async (
  memory: Omit<Memory, "id">,
  spaceId: number
) => {
  const { postRequest } = useApi();
  return await postRequest<Memory>("/memory", {
    body: { ...memory, spaceId },
  });
};

export const useGetMemories = async (
  spaceId: number,
  year: number = new Date().getFullYear()
) => {
  const { getRequest } = useApi();
  const params = {};
  if (spaceId) Object.assign(params, { spaceId: spaceId });
  if (year) Object.assign(params, { year: year });
  return await getRequest<Record<string, Memory[]>>(`/memory`, { params, lazy: false });
};
