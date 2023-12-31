import { Grid, Typography } from '@mui/material';

function PageHeader() {
  const user = {
    name: 'Catherine Pike',
    avatar: '/static/images/avatars/1.jpg',
  };
  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <Typography variant='h3' component='h3' gutterBottom>
          Users
        </Typography>
        <Typography variant='subtitle2'>
          {user.name}, these are all users.
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
