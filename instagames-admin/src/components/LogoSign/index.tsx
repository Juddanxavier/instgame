import { Grid } from '@mui/material';
import { useRouter } from 'next/router';

function Logo() {
  const router = useRouter();
  return (
    <Grid
      onClick={() => {
        router?.push('/');
      }}
      container
      spacing={2}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Grid item>
        <img height={100} alt='logo' src='/images/logo.png' />
      </Grid>
      {/* <Grid item>
        <Typography color='white' fontSize={20}>
          Insta Games
        </Typography>
      </Grid> */}
    </Grid>
  );
}

export default Logo;
