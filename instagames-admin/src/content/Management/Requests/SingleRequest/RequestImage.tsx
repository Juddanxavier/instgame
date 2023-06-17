import { Box, Card, CardHeader, Divider, Grid } from '@mui/material';
import { IKImage } from 'imagekitio-react';
import PropTypes from 'prop-types';
import { useState } from 'react';

import ViewImage from '../ViewImage';

const uri = 'https://ik.imagekit.io/mindia';
function RequestImage({ image }) {
  const [openCreateAccount, setOpenCreateAccount] = useState(false);

  const handleCreateAccountClickOpen = (image) => {
    setOpenCreateAccount(true);
  };

  const handleCreateAccountCloseAndNext = (value) => {
    Promise.all([setOpenCreateAccount(false)]);
  };
  return (
    <Card>
      <CardHeader title='Request Image' />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          <div
            style={{
              width: '100%',
              position: 'relative',
            }}
          >
            <IKImage
              onClick={() => handleCreateAccountClickOpen(image)}
              urlEndpoint={uri}
              src={image}
              height={500}
            />
          </div>
          <ViewImage
            open={openCreateAccount}
            onClose={handleCreateAccountCloseAndNext}
            image={image}
            height='700'
          />
          {/* {feed.map((_feed) => (
            <Grid key={_feed.name} item xs={12} sm={6} lg={4}>
              <Box p={3} display='flex' alignItems='flex-start'>
                <Avatar src={_feed.avatar} />
                <Box pl={2}>
                  <Typography gutterBottom variant='subtitle2'>
                    {_feed.company}
                  </Typography>
                  <Typography variant='h4' gutterBottom>
                    {_feed.name}
                  </Typography>
                  <Typography color='text.primary' sx={{ pb: 2 }}>
                    {_feed.jobtitle}
                  </Typography>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<AddTwoToneIcon />}
                  >
                    Follow
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))} */}
        </Grid>
      </Box>
    </Card>
  );
}

RequestImage.propTypes = {
  image: PropTypes.string.isRequired,
};

RequestImage.defaultProps = {
  image: '',
};

export default RequestImage;
