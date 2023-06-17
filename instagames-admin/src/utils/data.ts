export interface FileNode {
  id: string;
  href: string;
  name: string;
  subMenu?: FileNode[];
}

export const root: FileNode = {
  id: 'home',
  href: '/home',
  name: 'Home',
  subMenu: [
    { id: 'programming', href: '/programming', name: 'programming' },
    { id: 'devops', href: '/devops', name: 'DevOps' },
    {
      id: 'languages',
      href: '/languages',
      name: 'Languages',
      subMenu: [
        {
          id: 'javascript',
          href: '/javascript',
          name: 'Javascript',
        },
        {
          id: 'python',
          href: '/python',
          name: 'Python',
          subMenu: [
            {
              id: '2.7',
              href: '/2.7',
              name: '2.7',
            },
            {
              id: '3+',
              href: '/3+',
              name: '3+',
            },
          ],
        },
        {
          id: 'go`',
          href: '/go`',
          name: 'Go',
        },
        {
          id: 'rust',
          href: '/rust',
          name: 'Rust',
        },
      ],
    },
    { id: 'testing', href: '/testing', name: 'Testing' },
  ],
};
