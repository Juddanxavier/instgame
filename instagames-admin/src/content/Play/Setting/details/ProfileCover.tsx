import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Box, Button, Card, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { AvatarPrimary } from './RecentActivity';

const Input = styled('input')({
  display: 'none',
});

const AvatarWrapper = styled(Card)(
  ({ theme }) => `

    position: relative;
    overflow: visible;
    display: inline-block;
    margin-top: -${theme.spacing(9)};
    margin-left: ${theme.spacing(2)};

    .MuiAvatar-root {
      width: ${theme.spacing(16)};
      height: ${theme.spacing(16)};
    }
`
);

const ButtonUploadWrapper = styled(Box)(
  ({ theme }) => `
    position: absolute;
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    bottom: -${theme.spacing(1)};
    right: -${theme.spacing(1)};

    .MuiIconButton-root {
      border-radius: 100%;
      background: ${theme.colors.primary.main};
      color: ${theme.palette.primary.contrastText};
      box-shadow: ${theme.colors.shadows.primary};
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      padding: 0;
  
      &:hover {
        background: ${theme.colors.primary.dark};
      }
    }
`
);

const CardCover = styled(Card)(
  ({ theme }) => `
    position: relative;

    .MuiCardMedia-root {
      height: ${theme.spacing(26)};
    }
`
);

const CardCoverAction = styled(Box)(
  ({ theme }) => `
    position: absolute;
    right: ${theme.spacing(2)};
    bottom: ${theme.spacing(2)};
`
);

const ProfileCover = ({ user }: any) => {
  return (
    <>
      <Box display='flex' mb={3}>
        {/* <Tooltip arrow placement='top' title='Go back'>
          <IconButton color='primary' sx={{ p: 2, mr: 2 }}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip> */}
        <Box>
          {/* <Typography variant='subtitle2'>
            This is a profile page. Easy to modify, always blazing fast
          </Typography> */}
        </Box>
      </Box>
      <Card>
        {/* <CardMedia image={user.coverImg} />
        <CardCoverAction>
          <Input accept='image/*' id='change-cover' multiple type='file' />
          <Typography variant='subtitle2'>Total balance</Typography>
          <Typography variant='h1' component='h1' gutterBottom>
            3,45,34,556
          </Typography>
          <label htmlFor='change-cover'>
            <Button
              startIcon={<UploadTwoToneIcon />}
              variant='contained'
              component='span'
            >
              Change cover
            </Button>
          </label>
        </CardCoverAction> */}
        <Box px={2} py={4} display='flex' alignItems='flex-start'>
          <AvatarPrimary>
            <AccountBalanceWalletIcon />
          </AvatarPrimary>
          <Box
            pl={2}
            flex={1}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {/* <Typography variant='h3'>Orders</Typography> */}
            <Box>
              <Typography variant='subtitle2'>Total balance</Typography>
              <Typography variant='h1' component='h1' gutterBottom>
                3,45,34,556
              </Typography>
            </Box>

            {/* <Box pt={2} display='flex'>
            <Box pr={8}>
              <Typography
                gutterBottom
                variant='caption'
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total
              </Typography>
              <Typography variant='h2'>485</Typography>
            </Box>
            <Box>
              <Typography
                gutterBottom
                variant='caption'
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Failed
              </Typography>
              <Typography variant='h2'>8</Typography>
            </Box>
          </Box> */}
            <Button sx={{ margin: 1 }} variant='contained'>
              Add Balance
            </Button>
          </Box>
        </Box>
      </Card>
      {/* <AvatarWrapper>
        <Avatar variant='rounded' alt={user.name} src={user.avatar} />
        <ButtonUploadWrapper>
          <Input
            accept='image/*'
            id='icon-button-file'
            name='icon-button-file'
            type='file'
          />
          <label htmlFor='icon-button-file'>
            <IconButton component='span' color='primary'>
              <UploadTwoToneIcon />
            </IconButton>
          </label>
        </ButtonUploadWrapper>
      </AvatarWrapper> */}
      {/* <Box py={2} pl={2} mb={3}>
        <Typography gutterBottom variant='h4'>
          {user.name}
        </Typography>
        <Typography variant='subtitle2'>{user.description}</Typography>
        <Typography sx={{ py: 2 }} variant='subtitle2' color='text.primary'>
          {user.jobtitle} | {user.location} | {user.followers} followers
        </Typography>
        <Box
          display={{ xs: 'block', md: 'flex' }}
          alignItems='center'
          justifyContent='space-between'
        >
          <Box>
            <Button size='small' variant='contained'>
              Follow
            </Button>
            <Button size='small' sx={{ mx: 1 }} variant='outlined'>
              View website
            </Button>
            <IconButton color='primary' sx={{ p: 0.5 }}>
              <MoreHorizTwoToneIcon />
            </IconButton>
          </Box>
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            size='small'
            variant='text'
            endIcon={<ArrowForwardTwoToneIcon />}
          >
            See all {user.followers} connections
          </Button>
        </Box>
      </Box> */}
    </>
  );
};

ProfileCover.propTypes = {
  user: PropTypes.object.isRequired,
};

export default ProfileCover;
