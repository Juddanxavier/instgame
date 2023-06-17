import { Container, Grid } from '@mui/material';
import { useAtom } from 'jotai';
import Head from 'next/head';

import PageTitleWrapper from '@/components/PageTitleWrapper';

import { requestUserDetailsAtom } from '@/store/request';

import MiniWalletDetails from '@/content/Management/Requests/CreateDeposit/MiniWalletDetails';
import RequestImage from '@/content/Management/Requests/CreateDeposit/RequestImage';
import SearchCustomer from '@/content/Management/Requests/CreateDeposit/SearchCustomer';
import SingeRequestPageHeader from '@/content/Management/Requests/CreateDeposit/SingeRequestPageHeader';
import SidebarLayout from '@/layouts/SidebarLayout';

function DepositRequest() {
  const [requestUserDetails, setRequestUserDetails] = useAtom(
    requestUserDetailsAtom
  );

  return (
    <>
      <Head>
        <title>Admin | Create Request</title>
      </Head>
      <PageTitleWrapper>
        <SingeRequestPageHeader />
      </PageTitleWrapper>
      <Container sx={{ mt: 3 }} maxWidth='lg'>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          spacing={3}
        >
          <Grid item xs={12} md={7}>
            <RequestImage />
          </Grid>
          {requestUserDetails ? (
            <Grid item xs={12} md={5}>
              <MiniWalletDetails user={requestUserDetails} />
            </Grid>
          ) : (
            <Grid item xs={12} md={5}>
              <SearchCustomer />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}

DepositRequest.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default DepositRequest;
