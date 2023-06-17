import { AttachMoney } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  FormControlLabel,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Radio,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import RadioGroup from '@mui/material/RadioGroup';
import { Container } from '@mui/system';
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

function MiniWalletWithdraw({ user, request }) {
  const theme = useTheme();
  const walletHook = useWallet();
  const [myWallet, setMyWallet] = useState<Wallet>();
  const router = useRouter();
  const [mode, setMode] = useState<string | null>();

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
      body: {
        amount: -request.amount,
        mode: updateData.mode,
        requestId: request._id,
      },
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
      setMode(null);
      setMyWallet(res.wallet);
      router.back();
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
            Withdraw points from {myWallet?.user.name.split(' ')[0]}&apos;s
            wallet
          </Typography>
        </ListSubheader>
        <Divider />
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          autoComplete='off'
        >
          <Container sx={{ justifyContent: 'center', textAlign: 'center' }}>
            <Typography variant='caption'>
              Please select transaction mode
            </Typography>
            <RadioGroup
              row
              aria-labelledby='transaction-type-label'
              name='mode'
              onChange={(data) => {
                setMode(data?.target.value);
              }}
              sx={{ marginY: 2, justifyContent: 'center' }}
            >
              <FormControlLabel
                value='online'
                control={<Radio />}
                label='Online'
              />
              <FormControlLabel value='upi' control={<Radio />} label='UPI' />
              <FormControlLabel value='cash' control={<Radio />} label='Cash' />
            </RadioGroup>
            <TextField
              fullWidth
              required
              type='number'
              name='amount'
              margin='normal'
              label='Points'
              disabled
              defaultValue={request?.amount}
              inputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />

            <LoadingButton
              type='submit'
              disabled={!mode}
              loading={updateWalletHook?.isLoading}
              fullWidth
              sx={{ my: 2.6, p: 1.4 }}
              variant='contained'
              color='primary'
            >
              Withdraw Points
            </LoadingButton>
          </Container>
        </Box>
        <Divider />
      </ListWrapper>
      <CardActions sx={{ justifyContent: 'center' }}>
        <CardAddAction sx={{ p: 2 }}>
          <Typography align='center' fontSize={18}>
            Points can be deposited once per request.
            <br /> Please check the Points before submitting.
          </Typography>
        </CardAddAction>
      </CardActions>
    </Card>
  );
}

MiniWalletWithdraw.prototype = {
  user: PropTypes.string.isRequired,
  request: PropTypes.object.isRequired,
};
MiniWalletWithdraw.defaultProps = {
  user: '',
};

export default MiniWalletWithdraw;
