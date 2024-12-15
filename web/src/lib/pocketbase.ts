import PocketBase, { AuthRecord } from "pocketbase";
import { create } from 'zustand';

export const pb = new PocketBase(`${import.meta.env.VITE_PB_HOST}:${import.meta.env.VITE_PB_PORT}`);

type AuthState = {
	user: AuthRecord,
	updateUser: (newUser: AuthRecord) => void
}


export const useUserStore = create<AuthState>()((set) => ({
	user: pb.authStore.record,
	updateUser: (newUser: AuthRecord) => set({user: newUser})
}))


pb.authStore.onChange((auth) => {
	console.log('authStore changed', auth);
	useUserStore((state) => state.updateUser(pb.authStore.record) )
})