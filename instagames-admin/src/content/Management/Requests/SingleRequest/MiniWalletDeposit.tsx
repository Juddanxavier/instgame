import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { FormEvent, useEffect, useState } from 'react';

import { useUpdateWallet, useWallet } from '@/hooks/wallet/useWallet';

import { User } from '@/models/crypto_order';

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
      }
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.palette.warning.main} dashed 1px;
        height: 100%;
        color: ${theme.palette.warning.main};
        box-shadow: none;
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
`
);

export interface Wallet {
  balance: number;
  _id: string;
  user: User;
  created_at: Date;
  updated_at: Date;
  __v: number;
}

function MiniWalletDeposit({ user, request }) {
  const theme = useTheme();
  const walletHook = useWallet();
  const [myWallet, setMyWallet] = useState<Wallet>();
  const router = useRouter();

  const getUserWallet = async () => {
    if (user) {
      const res: any = await walletHook.mutateAsync({
        pathParams: { id: user },
      });
      if (res?.status === 'success') {
        setMyWallet(res.wallet);
      }
    }
  };

  useEffect(() => {
    getUserWallet();
  }, [user]);

  const updateWalletHook = useUpdateWallet();

  const updateWallet = async (updateData: {
    [k: string]: FormDataEntryValue;
  }) => {
    const res = await updateWalletHook.mutateAsync({
      body: { amount: updateData.amount, requestId: request._id },
      pathParams: {
        id: myWallet?._id,
      },
    });
    return res;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const updateData = Object.fromEntries(formData.entries());

    const res: any = await updateWallet(updateData);
    if (res.status === 'success') {
      setMyWallet(res.wallet);
      router.push('/management/requests');
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title='Wallet Information' />
      <Divider />
      <ListWrapper disablePadding>
        <ListItem
          sx={{
            color: `${theme.colors.primary.main}`,
            '&:hover': { color: `${theme.colors.primary.dark}` },
          }}
          button
        >
          <ListItemText
            primary={<>Balance : {myWallet?.balance.toFixed(2)}</>}
          />
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            color: `${theme.colors.primary.main}`,
            '&:hover': { color: `${theme.colors.primary.dark}` },
          }}
          button
        >
          <ListItemText primary={<>User : {myWallet?.user.name}</>} />
        </ListItem>
        <Divider />
        <ListSubheader>
          <Typography sx={{ py: 1.5 }} variant='h4' color='text.primary'>
            Add points in {myWallet?.user.name.split(' ')[0]}&apos;s wallet
          </Typography>
        </ListSubheader>
        <Divider />
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          autoComplete='off'
        >
          <TextField
            fullWidth
            required
            type='text'
            name='amount'
            margin='normal'
            label='Points'
            defaultValue='0'
          />

          <Button
            type='submit'
            fullWidth
            sx={{ my: 2.6, p: 1.4 }}
            variant='contained'
            color='primary'
          >
            Deposit Points
          </Button>
        </Box>
        <Divider />

        {/* <ListItem button>
          <ListItemAvatar>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: `${theme.colors.info.main}`,
                color: `${theme.palette.info.contrastText}`,
              }}
            >
              WD
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              variant: 'h5',
              color: `${theme.colors.alpha.black[100]}`,
            }}
            primary='Web Designers Lounge'
          />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemAvatar>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                background: `${theme.colors.alpha.black[100]}`,
                color: `${theme.colors.alpha.white[100]}`,
              }}
            >
              D
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              variant: 'h5',
              color: `${theme.colors.alpha.black[100]}`,
            }}
            primary='Writer’s Digest Daily'
          />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemAvatar>
            <Avatar
              sx={{ width: 38, height: 38 }}
              src='/static/images/logo/google.svg'
            />
          </ListItemAvatar>
          <ListItemText
            primaryTypographyProps={{
              variant: 'h5',
              color: `${theme.colors.alpha.black[100]}`,
            }}
            primary='Google Developers'
          />
        </ListItem> */}
      </ListWrapper>
      <CardActions sx={{ justifyContent: 'center' }}>
        <CardAddAction sx={{ p: 2 }}>
          <Typography align='center' fontSize={18}>
            Points can be deposited once per request.
            <br /> Please check the points before submitting.
          </Typography>
        </CardAddAction>
      </CardActions>
    </Card>
  );
}

MiniWalletDeposit.prototype = {
  user: PropTypes.string.isRequired,
  request: PropTypes.object.isRequired,
};
MiniWalletDeposit.defaultProps = {
  user: '',
};

export default MiniWalletDeposit;
