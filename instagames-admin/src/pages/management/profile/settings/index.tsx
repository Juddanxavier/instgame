import { Container, Grid, Tab, Tabs } from '@mui/material';
import { styled } from '@mui/material/styles';
import Head from 'next/head';
import { ChangeEvent, useState } from 'react';

import PageTitleWrapper from '@/components/PageTitleWrapper';

import ActivityTab from '@/content/Management/Users/settings/ActivityTab';
import EditProfileTab from '@/content/Management/Users/settings/EditProfileTab';
import NotificationsTab from '@/content/Management/Users/settings/NotificationsTab';
import PageHeader from '@/content/Management/Users/settings/PageHeader';
import SecurityTab from '@/content/Management/Users/settings/SecurityTab';
import SidebarLayout from '@/layouts/SidebarLayout';

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
`
);

function ManagementUserSettings() {
  const [currentTab, setCurrentTab] = useState<string>('activity');

  const tabs = [
    { value: 'activity', label: 'Activity' },
    { value: 'edit_profile', label: 'Edit Profile' },
    { value: 'notifications', label: 'Notifications' },
    { value: 'security', label: 'Passwords/Security' },
  ];

  const handleTabsChange = (_event: ChangeEvent<any>, value: string): void => {
    setCurrentTab(value);
  };

  return (
    <>
      <Head>
        <title>User Settings - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth='lg'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          spacing={3}
        >
          <Grid item xs={12}>
            <TabsWrapper
              onChange={handleTabsChange}
              value={currentTab}
              variant='scrollable'
              scrollButtons='auto'
              textColor='primary'
              indicatorColor='primary'
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === 'activity' && <ActivityTab />}
            {currentTab === 'edit_profile' && <EditProfileTab />}
            {currentTab === 'notifications' && <NotificationsTab />}
            {currentTab === 'security' && <SecurityTab />}
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ManagementUserSettings.getLayout = (page: any) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserSettings;
