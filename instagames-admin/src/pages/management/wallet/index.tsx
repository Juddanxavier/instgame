import { Container, Grid } from '@mui/material';
import { useAtom } from 'jotai';
import Head from 'next/head';

import { userAtom } from '@/store/user';

import WalletHead from '@/content/Management/Wallet/details/WalletHead';
import SidebarLayout from '@/layouts/SidebarLayout';

function ManagementUserProfile() {
  const [user, setUser] = useAtom(userAtom);

  return (
    <Container sx={{ mt: 3 }} maxWidth='lg'>
      <Head>
        <title>Instagame Admin | Wallet Settings</title>
      </Head>

      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        spacing={3}
      >
        <Grid item xs={12} md={24}>
          <WalletHead user={user} />
        </Grid>
        {/* <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid> */}
        {/* <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid>
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid> */}
      </Grid>

      {/* <Footer /> */}
    </Container>
  );
}

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
