import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  styled,
} from '@mui/material';
import { TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  useGetMyWalletSetting,
  useUpdateMyWalletSetting,
} from '@/hooks/wallet/useWallet';

const OutlinedInputWrapper = styled(TextField)(({ theme }) => ({
  backgroundColor: `${theme.colors.alpha.white[100]}`,
  fontSize: 35,
  fontWeight: 0,
}));

const WalletHead = () => {
  const [settings, setSettings] = useState({
    minimumAccountBalance: '0',
    userDefaultBalance: '0',
    minimumWithdrawAmount: '0',
    maximumWithdrawAmount: '0',
  });
  const [openError, setErrorOpen] = useState(false);
  const [openErrorMessage, setErrorMessage] = useState('');
  const [settingsChanged, setSettingsChanged] = useState<string[]>([]);
  const getSettingHook = useGetMyWalletSetting();
  const updateSettingHook = useUpdateMyWalletSetting();
  const [error, setError] = useState<any>({});

  const getWalletSettings = async () => {
    const res: any = await getSettingHook.mutateAsync();
    if (res.status === 'success') {
      setSettings(res.walletSetting);
    }
  };

  const updateWalletSetting = async (data) => {
    Object.keys(data).map(async (key: string) => {
      if (data[key] > 0) {
        const res: any = await updateSettingHook.mutateAsync({
          body: data,
        });

        if (res.status === 'success') {
          const does = settingsChanged.includes(Object.keys(data)[0]);
          does &&
            setSettingsChanged((prev) =>
              prev.filter((setting) => setting !== Object.keys(data)[0])
            );
          setErrorMessage('Settings updated');
          setErrorOpen(true);
        }
      } else {
        setErrorMessage("Please don't use Negative values");
        setErrorOpen(true);
      }
    });
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  useEffect(() => {
    getWalletSettings();
  }, []);

  return (
    <Card>
      <Box px={4} py={4}>
        <Grid item container lg={9} spacing={3}>
          <Grid item xs={3}>
            <FormControl>
              <OutlinedInputWrapper
                focused
                color={
                  settingsChanged.includes('userDefaultBalance')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.userDefaultBalance}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    userDefaultBalance: value.target.value,
                  }));
                  setSettingsChanged((prev) => [...prev, 'userDefaultBalance']);
                }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: <Typography variant='h2' px={1}></Typography>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>New account default balance</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('userDefaultBalance')}
              onClick={() => {
                updateWalletSetting({
                  userDefaultBalance: settings.userDefaultBalance,
                });
                setSettingsChanged((prev) => [...prev, 'userDefaultBalance']);
              }}
              variant='contained'
              size='large'
            >
              <Typography variant='h4'>Save</Typography>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <OutlinedInputWrapper
                focused
                color={
                  settingsChanged.includes('minimumWithdrawAmount')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.minimumWithdrawAmount}
                onChange={(value) => {
                  if (
                    Number(value.target.value) >
                    Number(settings?.maximumWithdrawAmount)
                  ) {
                    setError((prev) => ({
                      ...prev,
                      maximumWithdrawAmount: {
                        error: true,
                        message:
                          'Maximum Withdraw should be equal to or more that Minimum Withdraw points.',
                      },
                    }));
                  } else {
                    setError((prev) =>
                      Object.keys(prev)
                        .filter((key) => key !== 'maximumWithdrawAmount')
                        .reduce((p, curr) => ({ ...p, [curr]: prev[curr] }), {})
                    );
                  }

                  setSettings((prev) => ({
                    ...prev,
                    minimumWithdrawAmount: value.target.value,
                  }));
                  setSettingsChanged((prev) => [
                    ...prev,
                    'minimumWithdrawAmount',
                  ]);
                }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: <Typography variant='h2' px={1}></Typography>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Minimum withdraw points</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={
                !settingsChanged.includes('minimumWithdrawAmount') ||
                Object.keys(error).includes('maximumWithdrawAmount')
              }
              onClick={() => {
                updateWalletSetting({
                  minimumWithdrawAmount: settings.minimumWithdrawAmount,
                });
              }}
              variant='contained'
              size='large'
            >
              <Typography variant='h4'>Save</Typography>
            </Button>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <OutlinedInputWrapper
                focused
                color={
                  (Number(settings?.maximumWithdrawAmount) <
                  Number(settings?.minimumWithdrawAmount)
                    ? 'error'
                    : 'success') ||
                  (settingsChanged.includes('maximumWithdrawAmount')
                    ? 'warning'
                    : 'success')
                }
                type='text'
                size='small'
                value={settings?.maximumWithdrawAmount}
                onChange={(value) => {
                  if (
                    Number(value.target.value) <
                    Number(settings?.minimumWithdrawAmount)
                  ) {
                    setError((prev) => ({
                      ...prev,
                      maximumWithdrawAmount: {
                        error: true,
                        message:
                          'Maximum Withdraw should be equal to or more that Minimum Withdraw points.',
                      },
                    }));
                  } else {
                    setError((prev) =>
                      Object.keys(prev)
                        .filter((key) => key !== 'maximumWithdrawAmount')
                        .reduce((p, curr) => ({ ...p, [curr]: prev[curr] }), {})
                    );
                    setSettingsChanged((prev) => [
                      ...prev,
                      'maximumWithdrawAmount',
                    ]);
                  }
                  setSettings((prev) => ({
                    ...prev,
                    maximumWithdrawAmount: value.target.value,
                  }));
                }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: <Typography variant='h2' px={1}></Typography>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Maximum Withdraw amount</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={
                !settingsChanged.includes('maximumWithdrawAmount') ||
                Object.keys(error).includes('maximumWithdrawAmount')
              }
              onClick={() => {
                updateWalletSetting({
                  maximumWithdrawAmount: settings.maximumWithdrawAmount,
                });
              }}
              variant='contained'
              size='large'
            >
              <Typography variant='h4'>Save</Typography>
            </Button>
          </Grid>
          <Grid xs={12}>
            <Typography color='error'>
              {error?.maximumWithdrawAmount?.message}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <FormControl>
              <OutlinedInputWrapper
                focused
                color={
                  settingsChanged.includes('minimumAccountBalance')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.minimumAccountBalance}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    minimumAccountBalance: value.target.value,
                  }));
                  setSettingsChanged((prev) => [
                    ...prev,
                    'minimumAccountBalance',
                  ]);
                }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: <Typography variant='h2' px={1}></Typography>,
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Minimum account balance</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('minimumAccountBalance')}
              onClick={() => {
                updateWalletSetting({
                  minimumAccountBalance: settings.minimumAccountBalance,
                });
              }}
              variant='contained'
              size='large'
            >
              <Typography variant='h4'>Save</Typography>
            </Button>
          </Grid>
        </Grid>
      </Box>
      <AnnounceResultPop
        onClose={handleErrorClose}
        open={openError}
        message={openErrorMessage}
      />
    </Card>
  );
};

WalletHead.propTypes = {
  user: PropTypes.object,
};
WalletHead.defaultTypes = {
  user: {},
};

export default WalletHead;

function AnnounceResultPop(props) {
  const { onClose, gameStatus, open, message } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{message}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2 }}>
        <Button
          variant='contained'
          size='small'
          color={gameStatus ? 'error' : 'primary'}
          onClick={() => handleClose()}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
