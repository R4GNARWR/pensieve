import type { Memory } from "~/types/Memory";
const { postRequest, getRequest } = useApi();

export const useCreateMemory = async (
  memory: Omit<Memory, "id">,
  spaceId: number
) => {
  return await postRequest<Memory>("/memory", {
    body: { ...memory, spaceId },
  });
};

export const useGetMemories = async (
  spaceId: number,
  year: number = new Date().getFullYear()
) => {
  const params = {};
  if (spaceId) Object.assign(params, { spaceId: spaceId });
  if (year) Object.assign(params, { year: year });
  return await getRequest<Record<string, Memory[]>>(`/memory`, { params });
};
