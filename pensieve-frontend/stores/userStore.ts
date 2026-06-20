import type { User } from "~/types/User";
export const useUserStore = defineStore('user', () => {
    const user : Ref<User | null> = ref(null);
  
    return { user }
  })