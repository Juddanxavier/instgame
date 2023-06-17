// import { Box, Container, Divider, Grid, useTheme } from '@mui/material';
// import Head from 'next/head';

// import Performance from '@/content/Dashboards/Tasks/Performance';
// import TasksAnalytics from '@/content/Dashboards/Tasks/TasksAnalytics';
// import SidebarLayout from '@/layouts/SidebarLayout';
// import { NextPageWithLayout } from '@/pages/_app';

// interface Props {
//   userAgent?: string;
// }

// const DashboardTasks: NextPageWithLayout = () => {
//   const theme = useTheme();

//   return (
//     <>
//       <Head>
//         <title>Tasks Dashboard</title>
//       </Head>
//       {/* <PageTitleWrapper>
//         <PageHeader />
//       </PageTitleWrapper> */}
//       <Container maxWidth='lg'>
//         <>
//           <Grid item xs={12}>
//             <Divider />
//             <Box
//               p={4}
//               sx={{
//                 background: `${theme.colors.alpha.black[5]}`,
//               }}
//             >
//               <Grid container spacing={4}>
//                 <Grid item xs={12} md={8}>
//                   <TasksAnalytics />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                   <Performance />
//                 </Grid>
//               </Grid>
//             </Box>
//           </Grid>
//         </>
//       </Container>
//     </>
//   );
// };

// DashboardTasks.getLayout = (page: any) => <SidebarLayout>{page}</SidebarLayout>;

// export default DashboardTasks;

import { Container, Grid } from '@mui/material';
import Head from 'next/head';

import RecentOrders from '@/content/Management/Requests/RecentOrders';
import SidebarLayout from '@/layouts/SidebarLayout';

function ApplicationsRequests() {
  return (
    <>
      <Head>
        <title>Instagame Admin | Requests</title>
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
