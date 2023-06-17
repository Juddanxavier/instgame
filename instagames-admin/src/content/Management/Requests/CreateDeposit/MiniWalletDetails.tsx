import { Close } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  Divider,
  Grid,
  List,
  ListItem,
  ListSubheader,
  styled,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { useWallet } from '@/hooks/wallet/useWallet';

import { requestUserDetailsAtom } from '@/store/request';
import { User } from '@/store/user';

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
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

function MiniWalletDetails({ user }: { user: User }) {
  const walletHook = useWallet();
  const [myWallet, setMyWallet] = useState<Wallet>();
  const [requestUserDetails, setRequestUserDetails] = useAtom(
    requestUserDetailsAtom
  );

  const getUserWallet = async () => {
    if (user?._id) {
      const res: any = await walletHook.mutateAsync({
        pathParams: { id: user?._id },
      });
      if (res?.status === 'success') {
        setMyWallet(res.wallet);
      }
    }
  };

  useEffect(() => {
    getUserWallet();
  }, [user]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Wallet Information'
        action={
          requestUserDetails ? (
            <IconButton
              disabled={!requestUserDetails}
              color='error'
              onClick={() => {
                setRequestUserDetails(null);
              }}
            >
              <Close />
            </IconButton>
          ) : (
            ''
          )
        }
      />
      <Divider />
      <ListWrapper disablePadding>
        <ListItem>
          <Grid container>
            <Grid item xs>
              Wallet Balance
            </Grid>
            <Grid item xs>
              {myWallet?.balance.toFixed(2)}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              User Name
            </Grid>
            <Grid item xs>
              {user?.name}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListSubheader>
          <Typography sx={{ py: 1.5 }} variant='h4' color='text.primary'>
            Bank Details
          </Typography>
        </ListSubheader>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              Bank Name
            </Grid>
            <Grid item xs>
              {user?.bank?.bankName}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              Bank Acc No.
            </Grid>
            <Grid item xs>
              {user?.bank?.accNo}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              Bank IFSC
            </Grid>
            <Grid item xs>
              {user?.bank?.ifsc}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
        <ListSubheader>
          <Typography sx={{ py: 1.5 }} variant='h4' color='text.primary'>
            Contact Details
          </Typography>
        </ListSubheader>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              Phone Number
            </Grid>
            <Grid item xs>
              {user?.contact?.contactValue}
            </Grid>
          </Grid>
        </ListItem>
        <Divider />
      </ListWrapper>
    </Card>
  );
}

MiniWalletDetails.prototype = {
  user: PropTypes.object.isRequired,
};
MiniWalletDetails.defaultProps = {
  user: {},
};

export default MiniWalletDetails;
