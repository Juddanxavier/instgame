import { Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';

import { userAtom } from '@/store/user';

function PageHeader() {
  const [user, setUser] = useAtom(userAtom);

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <Typography variant='h3' component='h3' gutterBottom>
          Customers
        </Typography>
        {/* <Typography variant='subtitle2'>
          {user?.name}, these are all users.
        </Typography> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
