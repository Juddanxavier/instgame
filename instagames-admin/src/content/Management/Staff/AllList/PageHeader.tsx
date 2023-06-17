import { Add } from '@mui/icons-material';
import { Button, Grid, Typography } from '@mui/material';
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
          Staff Members
        </Typography>
      </Grid>
      <Grid item>
        <Button
          onClick={() => {
            router?.push('/management/createstaff');
          }}
          variant='contained'
        >
          <Add />
          Create User
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
