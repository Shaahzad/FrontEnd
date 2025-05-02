import {create} from 'zustand';


export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

interface StoreState {
  users: User[];
  setusers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updatedUser: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const useUserStore = create<StoreState>((set) => ({
  users: [],
  setusers: (users) => set({ users }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (_id, updatedUser) =>
    set((state) => ({
      users: state.users.map((user) =>
        user._id === _id ? { ...user, ...updatedUser } : user
      ),
    })),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user._id !== id),
    })),
}));

export default useUserStore;