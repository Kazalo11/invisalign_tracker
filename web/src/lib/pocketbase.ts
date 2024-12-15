import PocketBase, { AuthRecord } from "pocketbase";
import { create } from 'zustand';

export const pb = new PocketBase("http://127.0.0.1:8090");

type AuthState = {
	user: AuthRecord,
	updateUser: (newUser: AuthRecord) => void
}



export const useUserStore = create<AuthState>()((set) => ({
	user: pb.authStore.record,
	updateUser: (newUser: AuthRecord) => set({user: newUser})
}))


pb.authStore.onChange(() => {
	useUserStore((state) => state.updateUser(pb.authStore.record) )
})