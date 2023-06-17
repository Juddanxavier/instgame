import { Container, Grid } from '@mui/material';
import _ from 'lodash';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useRequest } from '@/hooks/request/useRequest';

import PageTitleWrapper from '@/components/PageTitleWrapper';

import MiniWalletDeposit from '@/content/Management/Requests/SingleRequest/MiniWalletDeposit';
import MiniWalletDetails from '@/content/Management/Requests/SingleRequest/MiniWalletDetails';
import MiniWalletWithdraw from '@/content/Management/Requests/SingleRequest/MiniWalletWithdraw';
import RequestImage from '@/content/Management/Requests/SingleRequest/RequestImage';
import SingeRequestPageHeader from '@/content/Management/Requests/SingleRequest/SingeRequestPageHeader';
import { WithdrawRequest } from '@/content/Report/Withdraw/RecentOrdersTable';
import SidebarLayout from '@/layouts/SidebarLayout';

function ApplicationRequest() {
  const router = useRouter();
  const { request } = router.query;
  const [requestData, setRequestData] = useState<WithdrawRequest>();

  if (!request) {
    router.back();
  }
  const singleRequestHook = useRequest();

  const getRequestDetails = async (id) => {
    const res: any = await singleRequestHook.mutateAsync({
      pathParams: {
        id,
      },
    });
    if (res?.status === 'success') {
      setRequestData(res.request);
    }
  };

  useEffect(() => {
    if (request) {
      getRequestDetails(request);
    }
  }, []);

  return (
    <>
      <Head>
        <title>
          {_.upperFirst(_.toLower(requestData?.type))} Request -{' '}
          {requestData?.user.name}
        </title>
      </Head>
      <PageTitleWrapper>
        <SingeRequestPageHeader request={requestData} />
      </PageTitleWrapper>
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
          </Grid>
          <Grid item xs={12} md={4}>
            <RecentActivity />
          </Grid> */}
          {requestData?.image ? (
            <Grid item xs={12} md={7}>
              <RequestImage image={requestData?.image.url} />
            </Grid>
          ) : (
            <Grid item xs={12} md={5}>
              <MiniWalletDetails request={requestData} />
            </Grid>
          )}
          {requestData?.type === 'withdraw' ? (
            <Grid item xs={12} md={5}>
              <MiniWalletWithdraw
                user={requestData?.user._id}
                request={requestData}
              />
            </Grid>
          ) : (
            <Grid item xs={12} md={5}>
              <MiniWalletDeposit
                user={requestData?.user._id}
                request={requestData}
              />
            </Grid>
          )}

          {/* <Grid item xs={12} md={7}>
            <MyCards />
          </Grid>
          <Grid item xs={12} md={5}>
            <Addresses />
          </Grid> */}
        </Grid>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

ApplicationRequest.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ApplicationRequest;
