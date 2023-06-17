import { AccessAlarm, EmojiEvents, Percent, Remove } from '@mui/icons-material';
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
  InputAdornment,
  styled,
} from '@mui/material';
import { TextField, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import {
  useGetMyGameSetting,
  useUpdateGameSetting,
} from '@/hooks/game/useGame';

import Ratio from '~/svg/ratio.svg';

const OutlinedInputWrapper = styled(TextField)(({ theme }) => ({
  backgroundColor: `${theme.colors.alpha.white[100]}`,
  fontSize: 35,
  fontWeight: 0,
}));

const WalletHead = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState({
    deductionPercentage: 0,
    deductionRatio: 0,
    winningRatio: 0,
    gameOffTime: 0,
  });
  const [openError, setErrorOpen] = useState(false);
  const [openErrorMessage, setErrorMessage] = useState('');
  const [settingsChanged, setSettingsChanged] = useState<string[]>([]);
  const getMyGameSettingHook = useGetMyGameSetting();
  const updateGameSettingHook = useUpdateGameSetting();

  const getGameSettings = async () => {
    const res: any = await getMyGameSettingHook.mutateAsync();
    if (res.status === 'success') {
      setSettings(res.gameSetting);
    }
  };

  const updateWalletSetting = (data: {
    deductionPercentage?: number;
    deductionRatio?: number;
    winningRatio?: number;
    gameOffTime?: number;
  }) => {
    Object.keys(data).map(async (key: string) => {
      if (data[key] > 0) {
        const res: any = await updateGameSettingHook.mutateAsync({
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
    getGameSettings();
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
                  settingsChanged.includes('deductionPercentage')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.deductionPercentage}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    deductionPercentage: Number(value.target.value),
                  }));
                  setSettingsChanged((prev) => [
                    ...prev,
                    'deductionPercentage',
                  ]);
                }}
                // InputProps={{

                //   startAdornment: (
                //     <Typography variant='h2' pr={1}>
                //       %
                //     </Typography>
                //   ),
                // }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Remove fontSize='small' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Percent fontSize='small' />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Deduction Percentage</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('deductionPercentage')}
              onClick={() => {
                updateWalletSetting({
                  deductionPercentage: settings.deductionPercentage,
                });
                setSettingsChanged((prev) => [...prev, 'deductionPercentage']);
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
                  settingsChanged.includes('deductionRatio')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.deductionRatio}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    deductionRatio: Number(value.target.value),
                  }));
                  setSettingsChanged((prev) => [...prev, 'deductionRatio']);
                }}
                // InputProps={{

                //   startAdornment: (
                //     <Typography variant='h2' pr={1}>
                //       /
                //     </Typography>
                //   ),
                // }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Percent
                        sx={{ transform: 'rotate(45deg)' }}
                        fontSize='small'
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Ratio
                        color={theme.colors.alpha.trueWhite}
                        fontSize='medium'
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'> Divide Ratio</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('deductionRatio')}
              onClick={() => {
                updateWalletSetting({
                  deductionRatio: settings.deductionRatio,
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
                  settingsChanged.includes('winningRatio')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.winningRatio}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    winningRatio: Number(value.target.value),
                  }));
                  setSettingsChanged((prev) => [...prev, 'winningRatio']);
                }}
                // InputProps={{
                //   startAdornment: (
                //     <Typography variant='h2' pr={1}>
                //       <EmojiEvents />
                //     </Typography>
                //   ),
                // }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmojiEvents fontSize='medium' />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Ratio
                        color={theme.colors.alpha.trueWhite}
                        fontSize='medium'
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Winning Ratio</Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('winningRatio')}
              onClick={() => {
                updateWalletSetting({
                  winningRatio: settings?.winningRatio,
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
                  settingsChanged.includes('gameOffTime')
                    ? 'warning'
                    : 'success'
                }
                type='text'
                size='small'
                value={settings?.gameOffTime}
                onChange={(value) => {
                  setSettings((prev) => ({
                    ...prev,
                    gameOffTime: Number(value.target.value),
                  }));
                  setSettingsChanged((prev) => [...prev, 'gameOffTime']);
                }}
                InputProps={{
                  style: { fontSize: 35 },
                  startAdornment: (
                    <Typography variant='h2' pr={1}>
                      <AccessAlarm />
                    </Typography>
                  ),
                }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>
              Closing Time
              <span style={{ fontSize: 15 }}> - ( in Minutes )</span>
            </Typography>
          </Grid>
          <Grid item xs={3} direction='row'>
            <Button
              disabled={!settingsChanged.includes('gameOffTime')}
              onClick={() => {
                updateWalletSetting({
                  gameOffTime: settings?.gameOffTime,
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
  user: PropTypes.object.isRequired,
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
