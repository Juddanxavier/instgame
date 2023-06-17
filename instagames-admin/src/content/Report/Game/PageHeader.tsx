import { Grid, TextField, Typography } from '@mui/material';
import dayjs from 'dayjs';

function PageHeader() {
  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item>
        <Typography variant='h3' component='h3' gutterBottom>
          Report
        </Typography>
        {/* <Typography variant='subtitle2'>
          {user.name}, these are your all requests
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
        <TextField
          id='date'
          label='From'
          type='date'
          defaultValue={dayjs().format('YYY-MM-DD')}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          id='date'
          label='To'
          type='date'
          defaultValue={dayjs().format('YYY-MM-DD')}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default PageHeader;
