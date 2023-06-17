import { useAtom } from 'jotai';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { useGetMyUser } from '@/hooks/user/useUser';

import { userAtom } from '@/store/user';

import routesRequireAuth from '@/utils/routesRequireAuth.json';

export interface MenuType {
  path: string;
  title: string;
}

type SidebarContext = {
  sidebarToggle: any;
  getMenu: () => MenuType[];
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SidebarContext = createContext<SidebarContext>(
  {} as SidebarContext
);

type Props = {
  children: ReactNode;
};

export function SidebarProvider({ children }: Props) {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };
  const [sideContent, setSideContent] = useState<any>(routesRequireAuth);
  const [user, setUser] = useAtom(userAtom);

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  const getMenu = (): MenuType[] => {
    if (user) {
      return sideContent.filter((route) =>
        route.access.includes(user?.role)
      ) as unknown as MenuType[];
    }
    return sideContent.filter((route) =>
      route.access.includes('staff')
    ) as unknown as MenuType[];
  };

  const getMyUserHook = useGetMyUser();

  const getMyUserData = async () => {
    const res: any = await getMyUserHook.mutateAsync();
    if (res?.status === 'success') {
      setUser(res?.userData?.user);
    }
  };

  useEffect(() => {
    getMyUserData();
  }, []);

  return (
    <SidebarContext.Provider
      value={{ sidebarToggle, getMenu, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
