export const useSpaceContext = async () => {
    const userStore = useUserStore();
    const spaceStore = useSpaceStore();
    const nuxtApp = useNuxtApp();
    const loadSpaces = () => nuxtApp.runWithContext(useGetSpaces);

    watch(
        () => userStore.user?.id,
        (userId) => {
            spaceStore.spaces = [];
            spaceStore.selectedSpaceId = null;
            if (userId) void loadSpaces();
        },
        {flush: "post"}
    );

    if (userStore.user?.id && !spaceStore.selectedSpaceId) {
        await loadSpaces();
    }
};
