// ** React Imports
// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import MuiTab, { TabProps } from '@mui/material/Tab';
import { Container } from '@mui/system';
// ** Icons Imports
// ** Third Party Styles Imports
import Head from 'next/head';
import { SyntheticEvent, useState } from 'react';

import TabAccount from '@/content/Management/Users/Single';
// ** Demo Tabs Imports
import SidebarLayout from '@/layouts/SidebarLayout';

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100,
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67,
  },
}));

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const AccountSettings = () => {
  // ** State
  const [value, setValue] = useState<string>('account');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Instagames Admin | Profile</title>
      </Head>
      <Container maxWidth='lg' sx={{ mt: 3 }}>
        <Card>
          <TabAccount />
        </Card>
      </Container>
    </>
  );
};

AccountSettings.getLayout = (page: any) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default AccountSettings;
