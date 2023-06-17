import { Casino, PeopleAlt } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  DialogActions,
  DialogContentText,
  Divider,
  styled,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { useGetAllBets, useGetMyGameSetting } from '@/hooks/game/useGame';

import { Game, gameAtom, gameTimerAtom } from '@/store/game';

import gameService from '@/utils/game';
import socketService from '@/utils/socket';

const MINUTE_MS = 2000;

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(5)};
      height: ${theme.spacing(5)};
`
);

const switchStyle = {
  borderRadius: 2,
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'green',
  },
  '& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track': {
    backgroundColor: 'lightgreen',
  },
  '&:hover .MuiSwitch-switchBase': {
    color: '#fff',
  },
};

const useStyles = makeStyles((theme) => ({
  switch_track: {
    backgroundColor: '#fff',
    '&.MuiSwitch-thumb': {
      backgroundColor: '#fff',
    },
  },
  switch_base: {
    color: '#f50057',
    '&.Mui-disabled': {
      color: '#e886a9',
    },
    '&.Mui-checked': {
      color: '#95cc97',
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#292030',
    },
  },
  switch_primary: {
    '& .Mui-checked': {
      color: '#4CAF50',
    },
    '& .Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#4CAF50',
    },
    '& .MuiButtonBase-root + .Mui-checked': {
      backgroundColor: '#fff',
      '& .MuiSwitch-thumb': {},
    },
  },
}));

function RecentActivity() {
  const classes = useStyles();
  const theme = useTheme();
  const [game, setGame] = useAtom(gameAtom);
  const [open, setOpen] = useState(false);
  const [openError, setErrorOpen] = useState(false);
  const [betsTotalAmount, setBetsTotalAmount] = useState(0);
  const [gameTimer, setGameTimer] = useAtom(gameTimerAtom);
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const [settings, setSettings] = useState({
    deductionPercentage: 0,
    deductionRatio: 0,
    winningRatio: 0,
    gameOffTime: 0,
  });
  const getAllBetsHook = useGetAllBets();
  const getMyGameSettingHook = useGetMyGameSetting();

  const handleClickOpen = () => {
    if (
      (game?.gameId && game?.gameStatus) ||
      (!game?.gameId && !game?.gameStatus)
    ) {
      setOpen(true);
    } else {
      handleErrorOpen();
    }
  };

  const getGameSettings = async () => {
    const res: any = await getMyGameSettingHook.mutateAsync();
    if (res.status === 'success') {
      setSettings(res.gameSetting);
    }
  };

  const getAllBets = async () => {
    const res: any = await getAllBetsHook.mutateAsync();
    if (res?.status === 'success') {
      setBetsTotalAmount(res?.grandTotal);
      setGame(
        (prev) =>
          ({
            ...prev,
            allBetListSet: res?.allBetListSet,
            grandTotal: res?.grandTotal,
          } as Game)
      );
    }
  };

  const handleTrackResult = () => {
    if (socketService.socket)
      gameService.trackResult(socketService.socket, (data) => {
        if (data) {
          setGame({
            gameStatus: false,
            gameId: '',
            gameId2: '',
            allBetListSet: [],
            grandTotal: 0,
            offTime: null,
          });
        }
      });
  };

  const handleGameStart = () => {
    if (socketService.socket)
      gameService.onStartGame(socketService.socket, (data) => {
        setGame((prev) => ({ ...prev, ...data }));
      });
  };
  const handleGameStopped = () => {
    if (socketService.socket)
      gameService.onStartEnd(socketService.socket, () => {
        return;
      });
  };
  const handleGameStatus = () => {
    if (socketService.socket)
      gameService.onGameStatus(socketService.socket, (data) => {
        setGame((prev) => ({ ...prev, ...data }));
      });
  };

  const handleClose = (value) => {
    setOpen(false);

    if (socketService.socket) {
      if (value === true) {
        gameService.gameOn(socketService.socket);
      } else if (value === false) {
        gameService.gameOff(socketService.socket);
      }
      setTimeout(() => {
        if (socketService.socket) {
          gameService.getGameStatus(socketService.socket);
        }
      }, 500);
    } else {
      console.log('not connected');
    }
  };
  const handleErrorClose = () => {
    setErrorOpen(false);
  };
  const handleErrorOpen = () => {
    setErrorOpen(true);
  };

  useEffect(() => {
    if (socketService.socket) {
      handleGameStart();
      handleGameStopped();
      handleGameStatus();
      handleTrackResult();
    }
    getGameSettings();
    const intervalStatus = setInterval(() => {
      if (socketService.socket) {
        gameService.getGameStatus(socketService.socket);
      }
    }, 2000);

    const interval = setInterval(() => {
      getAllBets();
    }, MINUTE_MS);
  }, [socketService.socket]);

  return (
    <Card
      sx={{
        color: game?.gameStatus
          ? theme.palette.success.dark
          : theme.palette.error.dark,
      }}
    >
      <CardHeader
        sx={{ backgroundColor: '#232a2ef2' }}
        title={
          <Grid container>
            <Grid item xs={6}>
              <Typography variant='h4'>
                Game id: <br />
                <b>{game?.gameId2}</b>
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h2'>
                {game?.offTime ? (
                  <MyTimer
                    expiryTimestamp={dayjs(game?.offTime).add(
                      settings?.gameOffTime || 1,
                      'minute'
                    )}
                  />
                ) : game?.gameStatus ? (
                  'Game on'
                ) : (
                  'Game Off'
                )}
              </Typography>
            </Grid>
          </Grid>
        }
        action={
          <>
            <Switch
              checked={game?.gameStatus}
              onChange={handleClickOpen}
              {...label}
            />
          </>
        }
      />
      <Divider />
      <Box px={2} py={4} display='flex' alignItems='flex-start'>
        <AvatarPrimary>
          <Casino />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography
            variant='h3'
            sx={{
              color: game?.gameStatus
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            }}
          >
            Game
          </Typography>

          <Box pt={2} display='flex'>
            <Box pr={8}>
              <Typography
                gutterBottom
                variant='caption'
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Total Bet Placed
              </Typography>
              <Typography variant='h2'>
                {!game?.grandTotal ? '0' : `${betsTotalAmount}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <AvatarPrimary>
          <PeopleAlt />
        </AvatarPrimary>
        <Box pl={2} flex={1}>
          <Typography
            variant='h3'
            sx={{
              color: game?.gameStatus
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            }}
          >
            Users
          </Typography>

          <Box pt={2} display='flex'>
            <Box pr={8}>
              <Typography
                gutterBottom
                variant='caption'
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Active
              </Typography>
              <Typography variant='h2'>
                {!game?.gameStatus ? '0' : '0'}
              </Typography>
            </Box>
            <Box>
              <Typography
                gutterBottom
                variant='caption'
                sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
              >
                Inactive
              </Typography>
              <Typography variant='h2'>
                {!game?.gameStatus ? '0' : '0'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <VerifyDialog
        gameStatus={game?.gameStatus as boolean}
        open={open}
        onClose={handleClose}
      />
      <ErrorPop open={openError} onClose={handleErrorClose} />
      <Divider />
    </Card>
  );
}

export default RecentActivity;

function VerifyDialog(props) {
  const { onClose, gameStatus, open } = props;

  const handleClose = () => {
    onClose(undefined);
  };

  const handleGameStatsChange = async (value) => {
    onClose(value);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Please verify</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          Do you want to {gameStatus ? 'end' : 'start'} the game?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 2 }}>
        <Button variant='outlined' size='small' onClick={() => handleClose()}>
          Cancel
        </Button>
        <Button
          variant='contained'
          size='small'
          color={gameStatus ? 'error' : 'primary'}
          onClick={() => handleGameStatsChange(!gameStatus)}
        >
          {gameStatus ? 'End' : 'Start'} Game
        </Button>
      </DialogActions>
    </Dialog>
  );
}

VerifyDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  gameStatus: PropTypes.bool.isRequired,
};

import { useTimer } from 'react-timer-hook';

function MyTimer({ expiryTimestamp }: any) {
  const [gameTimer, setGameTimer] = useAtom(gameTimerAtom);
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setGameTimer(null),
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <div>
        <span>{minutes}</span>:<span>{seconds}</span>
      </div>
    </div>
  );
}

function ErrorPop(props) {
  const { onClose, gameStatus, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Error Cannot start new game</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-slide-description'>
          Please announce result for previous game
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

VerifyDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  gameStatus: PropTypes.bool.isRequired,
};
