import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import GameSettingsHead from '@/content/Play/Setting/details/GameSettingsHead';
import SidebarLayout from '@/layouts/SidebarLayout';

function ManagementUserProfile() {
  const user = {
    savedCards: 7,
    name: 'Catherine Pike',
    coverImg: '/static/images/placeholders/covers/5.jpg',
    avatar: '/static/images/avatars/4.jpg',
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage",
    jobtitle: 'Web Developer',
    location: 'Barcelona, Spain',
    followers: '465',
  };

  return (
    <Container sx={{ mt: 3 }} maxWidth='lg'>
      <Head>
        <title>Instagame Admin | Game Settings</title>
      </Head>

      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        spacing={3}
      >
        <Grid item xs={12} md={24}>
          <GameSettingsHead user={user} />
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
