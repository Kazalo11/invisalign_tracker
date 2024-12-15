import PocketBase, { AuthRecord } from "pocketbase";
import { create } from 'zustand';

const pb = new PocketBase("http://127.0.0.1:8090");

type AuthState = {
	user: AuthRecord,
	updateUser: (newUser: AuthRecord) => void
}



export const useStore = create<AuthState>()((set) => ({
	user: pb.authStore.record,
	updateUser: (newUser: AuthRecord) => set({user: newUser})
}))

pb.authStore.onChange((auth) => {
	console.log('authStore changed', auth);
	useStore((state) => state.updateUser(pb.authStore.record) )
})