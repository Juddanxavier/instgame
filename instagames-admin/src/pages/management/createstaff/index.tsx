import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import PageTitleWrapper from '@/components/PageTitleWrapper';

import CreateStaff from '@/content/Management/Staff/CreateUser';
import PageHeader from '@/content/Management/Staff/CreateUser/PageHeader';
import SidebarLayout from '@/layouts/SidebarLayout';

function ApplicationsUsers() {
  return (
    <>
      <Head>
        <title>Instagame Admin | Create Staff</title>
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
            <CreateStaff />
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ApplicationsUsers.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ApplicationsUsers;
