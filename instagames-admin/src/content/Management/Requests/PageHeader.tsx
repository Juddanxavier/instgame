import { Grid, Typography } from '@mui/material';
import { useAtom } from 'jotai';

import { userAtom } from '@/store/user';

function PageHeader() {
  const [user, setUser] = useAtom(userAtom);
  // const user = {
  //   name: 'Catherine Pike',
  //   avatar: '/static/images/avatars/1.jpg',
  // };
  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <Typography variant='h3' component='h3' gutterBottom>
          Requests
        </Typography>
        {/* <Typography variant='subtitle2'>
          {user?.name}, these are your all requests
        </Typography> */}
      </Grid>
      <Grid item>
        {/* <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant='contained'
          startIcon={<AddTwoToneIcon fontSize='small' />}
        >
          Create Request
        </Button> */}
      </Grid>
    </Grid>
  );
}

export default PageHeader;
