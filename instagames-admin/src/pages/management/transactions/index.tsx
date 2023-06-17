import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import PageTitleWrapper from '@/components/PageTitleWrapper';

import PageHeader from '@/content/Management/Transactions/PageHeader';
import RecentOrders from '@/content/Management/Transactions/RecentOrders';

import SidebarLayout from '../../../layouts/SidebarLayout/index';

function ApplicationsTransactions() {
  return (
    <>
      <Head>
        <title>Instagame Admin | Transactions</title>
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
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ApplicationsTransactions.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default ApplicationsTransactions;
