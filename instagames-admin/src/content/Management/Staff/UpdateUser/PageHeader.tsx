import { Clear } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';

import { userAtom } from '@/store/user';

function PageHeader() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <Typography variant='h3' component='h3' gutterBottom>
          Update Staff
        </Typography>
      </Grid>
      <Grid item>
        <LoadingButton
          // loading={updateRequestHook?.isLoading}
          onClick={() => {
            router?.back();
          }}
          sx={{ mt: { xs: 2, md: 0 } }}
          color='error'
          variant='contained'
          startIcon={<Clear fontSize='small' />}
        >
          Cancel
        </LoadingButton>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
