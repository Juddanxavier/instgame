import { ArrowBack, Clear } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { useUpdateRequest } from '@/hooks/request/useRequest';

import { WithdrawRequest } from '@/content/Report/Withdraw/RecentOrdersTable';

function SingeRequestPageHeader({ request }: { request: WithdrawRequest }) {
  const theme = useTheme();
  const router = useRouter();

  const updateRequestHook = useUpdateRequest();

  const updateRequest = async (id, status) => {
    const res: any = await updateRequestHook.mutateAsync({
      pathParams: {
        id,
      },
      body: {
        status,
      },
    });
    if (res?.status === 'success') {
      router?.back();
    }
  };

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <IconButton
          size='small'
          sx={{
            '&:hover': {
              color: theme.colors.alpha.trueWhite[100],
              backgroundColor: theme.palette.primary.main,
            },

            background: theme.colors.primary.lighter,
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBack />
        </IconButton>
      </Grid>
      <Grid item>
        <LoadingButton
          loading={updateRequestHook?.isLoading}
          onClick={() => {
            updateRequest(request?._id, 'rejected');
          }}
          sx={{ mt: { xs: 2, md: 0 } }}
          color='error'
          variant='contained'
          startIcon={<Clear fontSize='small' />}
        >
          Reject
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

SingeRequestPageHeader.propTypes = {
  request: PropTypes.object,
};
SingeRequestPageHeader.defaultProps = {
  request: {},
};

export default SingeRequestPageHeader;
