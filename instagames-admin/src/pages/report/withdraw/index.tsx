import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import RecentOrders from '@/content/Report/Withdraw/RecentOrders';
import SidebarLayout from '@/layouts/SidebarLayout';

function ApplicationsRequests() {
  return (
    <>
      <Head>
        <title>Instagame Admin | Withdrawal Report</title>
      </Head>
      {/* <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper> */}

      <Container maxWidth='lg'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ApplicationsRequests.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsRequests;
