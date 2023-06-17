import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import Feed from '@/content/Play/Game/details/Feed';
import PopularTags from '@/content/Play/Game/details/PopularTags';
import RecentActivity from '@/content/Play/Game/details/RecentActivity';
import SidebarLayout from '@/layouts/SidebarLayout';

function ManagementUserProfile() {
  return (
    <>
      <Head>
        <title>Instagame Admin | Game</title>
      </Head>
      <Container sx={{ mt: 3 }} maxWidth='lg'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          spacing={3}
        >
          {/* <Grid item xs={12} md={8}>
            <ProfileCover user={user} />
          </Grid> */}
          <Grid item xs={12} md={8}>
            <RecentActivity />
          </Grid>
          <Grid item xs={12} md={8}>
            <Feed />
          </Grid>
          <Grid item xs={12} md={4}>
            <PopularTags />
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ManagementUserProfile.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ManagementUserProfile;
