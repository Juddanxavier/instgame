import { atom } from 'jotai';

import { ImageType } from '@/content/Management/Requests/CreateDeposit/RequestImage';

import { User } from './user';

export const requestImageFilesAtom = atom<ImageType[] | null>(null);
export const requestUserDetailsAtom = atom<User | null>(null);
