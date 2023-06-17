/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EmojiEvents, Percent, Remove } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  styled,
  SwitchProps,
  TextField,
  Typography,
} from '@mui/material';
import { DialogContent, useTheme } from '@mui/material';
import Switch from '@mui/material/Switch';
import { TypographyProps } from '@mui/system';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';

import { useGetMyGameSetting } from '@/hooks/game/useGame';

import { gameAtom } from '@/store/game';
import { userAtom } from '@/store/user';

import gameService from '@/utils/game';
import socketService from '@/utils/socket';

import Ratio from '~/svg/ratio.svg';

interface BetNumberContainerType extends TypographyProps {
  active: boolean;
}

const BetNumberContainer = styled(Typography)<BetNumberContainerType>(
  ({ theme, active }) => ({
    fontSize: 35,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: active ? theme.palette.primary.main : theme.palette.grey[700],
  })
);

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked ': {
      transform: `translateX(${100 - 26}px)`,

      '& .MuiSwitch-thumb': {
        backgroundColor: '#141c23',
        opacity: 1,
        color: '#141c23',
        border: 0,
      },
      '& + .MuiSwitch-track': {
        backgroundColor: '#44a574',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#44a574',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function Feed() {
  const theme = useTheme();
  const [user, setUser] = useAtom(userAtom);
  const [game, setGame] = useAtom(gameAtom);
  const deduction = useRef<HTMLInputElement>(null);
  const ratio = useRef<HTMLInputElement>(null);
  const winningRatio = useRef<HTMLInputElement>(null);
  const winningNumberInput = useRef<HTMLInputElement>(null);

  const announceResultEnum = ['Manual', 'Automatic'];
  const [announceResult, setAnnounceResult] = useState<string>('Automatic');
  const [announceResultCheck, setAnnounceResultCheck] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>();
  const [selectedWinningAmount, setSelectedWinningAmount] = useState<number>(0);
  const [openError, setErrorOpen] = useState(false);
  const [openErrorMessage, setErrorMessage] = useState('');
  const [declareResultLoading, setDeclareResultLoading] =
    useState<boolean>(false);
  const [settings, setSettings] = useState({
    deductionPercentage: 0,
    deductionRatio: 0,
    winningRatio: 0,
    gameOffTime: 0,
  });

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const handleError = (text: string) => {
    setErrorOpen(true);
    setErrorMessage(text);
  };

  const verify = new Promise((rs, rj) => {
    if (
      announceResult === 'Automatic' &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      game?.allBetListSet?.length! > 0 &&
      !game?.gameStatus
      // (deduction.current as HTMLInputElement)?.value &&
      // (ratio.current as HTMLInputElement)?.value
    ) {
      rs(true);
    } else if (
      announceResult === 'Manual' &&
      (winningNumberInput.current as HTMLInputElement)?.value
    ) {
      rs(true);
    } else {
      rj(false);
    }
  });

  const declareResult = () => {
    const result = new Promise((rs, rej) => {
      const outPut = Number(
        Math.round(
          ((game?.grandTotal! -
            (game?.grandTotal! *
              Number(
                (deduction.current as HTMLInputElement)?.value ||
                  settings?.deductionPercentage
              )) /
              100) /
            Number((ratio.current as HTMLInputElement)?.value) +
            'e2') as unknown as number
        ) + 'e-2'
      );

      if (typeof outPut === 'number') {
        rs(outPut);
      } else {
        rej(0);
      }
    }).then((outPut) => {
      setSelectedWinningAmount(outPut as number);
      setSelectedValue(
        Number((winningNumberInput.current as HTMLInputElement)?.value)
      );

      setTimeout(() => {
        setOpen(true);
        setDeclareResultLoading(false);
      }, 300);
    });
  };

  const getMyGameSettingHook = useGetMyGameSetting();

  const getGameSettings = async () => {
    const res: any = await getMyGameSettingHook.mutateAsync();
    if (res.status === 'success') {
      setSettings(res.gameSetting);
    }
  };

  useEffect(() => {
    getGameSettings();

    if (
      !game?.offTime &&
      game?.gameId &&
      !game?.gameStatus &&
      !game?.grandTotal
    ) {
      const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      const randomIndex = Math.floor(Math.random() * array.length);

      const item = array[randomIndex];
      if (socketService.socket) {
        gameService.declareResult(socketService.socket, item, 0, 0);
      }
    }
  }, [game?.offTime]);

  const calculate = async () => {
    announceResult === 'Automatic'
      ? verify
          .then(async () => {
            setDeclareResultLoading(true);
            const result = Number(
              Math.round(
                ((game?.grandTotal! -
                  (game?.grandTotal! *
                    Number(
                      (deduction.current as HTMLInputElement)?.value ||
                        settings?.deductionPercentage
                    )) /
                    100) /
                  Number(
                    (ratio.current as HTMLInputElement)?.value ||
                      settings?.deductionRatio
                  ) +
                  'e2') as unknown as number
              ) + 'e-2'
            );

            const lessThanResult = game?.allBetListSet?.filter(
              (bet) => bet?.totalBet < result
            );

            if (lessThanResult?.length) {
              const winningBet = lessThanResult
                ?.filter((bet) => bet?.totalBet)
                .sort(function (a, b) {
                  return b?.totalBet - a?.totalBet;
                })[0];

              const withinResult =
                lessThanResult?.filter(
                  (bet) => bet?.totalBet === winningBet?.totalBet
                ) || [];

              const closest: number = withinResult.reduce((prev, curr) => {
                return (
                  Math.abs(curr.totalBet - result) < Math.abs(prev - result)
                    ? curr.totalBet
                    : prev
                ) as number;
              }, withinResult[0]?.totalBet) as number;

              let count = 0;

              for (const element of withinResult.map(
                (result) => result?.totalBet
              )) {
                if (element === closest) {
                  count += 1;
                }
              }

              if (count) {
                const winningNumber = withinResult
                  ?.filter((bet) => bet?.totalBet === closest)
                  ?.map((bet) => bet?.number)[
                  Math.floor(
                    Math.random() *
                      withinResult?.map((bet) => bet?.number).length
                  )
                ];

                return {
                  result,
                  winningNumber: winningNumber === 10 ? 0 : winningNumber,
                };
              } else {
                const winningNumber = withinResult.reduce(
                  (prev, curr) =>
                    curr.totalBet === closest ? curr.number : prev,
                  game?.allBetListSet[0].number
                ) as number;

                return {
                  result,
                  winningNumber: winningNumber === 10 ? 0 : winningNumber,
                };
              }
            } else {
              throw 'Please switch to manual.';
            }
          })
          .then(({ result, winningNumber }) => {
            setSelectedValue(winningNumber);
            setSelectedWinningAmount(result);
            setTimeout(() => {
              setOpen(true);
              setDeclareResultLoading(false);
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
            if (!error) {
              declareResult();
            } else {
              setDeclareResultLoading(false);
              handleError(error);
            }
          })
      : (winningNumberInput.current as HTMLInputElement)?.value &&
        Number((winningNumberInput.current as HTMLInputElement)?.value) >= 0 &&
        Number((winningNumberInput.current as HTMLInputElement)?.value) <= 9
      ? declareResult()
      : handleError('Invalid Winning number');
  };

  return (
    <Card>
      <CardHeader title='Announce Result' />
      <Divider />
      <Box p={2}>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} lg={12}>
            <Box p={3} display='flex' alignItems='flex-start'>
              <Grid xs={12} container spacing={8}>
                <Grid item xs>
                  <BetNumberContainer
                    onClick={() => {
                      if (!game?.gameStatus && game?.gameId) {
                        setAnnounceResult(announceResultEnum[0]);
                        setAnnounceResultCheck(false);
                      }
                    }}
                    active={
                      (!game?.gameStatus &&
                        game?.gameId &&
                        announceResultEnum[0] == announceResult) as boolean
                    }
                  >
                    {announceResultEnum[0]}
                  </BetNumberContainer>
                </Grid>
                <Grid
                  item
                  xs
                  justifyContent='center'
                  alignItems='center'
                  display='flex'
                >
                  <IOSSwitch
                    disabled={Boolean(game?.gameStatus) || !game?.gameId}
                    sx={{ m: 1, width: 100 }}
                    onClick={(event) => {
                      if (!game?.gameStatus && game?.gameId) {
                        if ((event.target as HTMLInputElement).checked) {
                          setAnnounceResult(announceResultEnum[1]);
                          setAnnounceResultCheck(true);
                        } else {
                          setAnnounceResult(announceResultEnum[0]);
                          setAnnounceResultCheck(false);
                        }
                      }
                    }}
                    checked={announceResultCheck}
                  />
                </Grid>

                <Grid item xs>
                  <BetNumberContainer
                    onClick={() => {
                      if (!game?.gameStatus && game?.gameId) {
                        setAnnounceResult(announceResultEnum[1]);
                        setAnnounceResultCheck(true);
                      }
                    }}
                    active={
                      (!game?.gameStatus &&
                        game?.gameId &&
                        announceResultEnum[1] == announceResult) as boolean
                    }
                  >
                    {announceResultEnum[1]}
                  </BetNumberContainer>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {user?.type === 'superadmin' && (
            <Grid item xs={12} sm={6} lg={4}>
              <Box p={3} display='flex' alignItems='flex-start'>
                <TextField
                  fullWidth
                  disabled={Boolean(game?.gameStatus) || !game?.gameId}
                  inputRef={deduction}
                  // disabled={createUserHook.isLoading}
                  // error={Boolean(errors.phone)}
                  name='deduction'
                  label='Deduction Percentage'
                  value={settings?.deductionPercentage}
                  onChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      deductionPercentage: Number(value.target.value),
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Remove />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Percent fontSize='small' />
                      </InputAdornment>
                    ),
                  }}
                  // helperText={
                  //   errors.phone ? `Password is ${errors.phone?.message}` : null
                  // }
                />
              </Box>
            </Grid>
          )}
          {user?.type === 'superadmin' && (
            <Grid item xs={12} sm={6} lg={4}>
              <Box p={3} display='flex' alignItems='flex-start'>
                <TextField
                  fullWidth
                  disabled={Boolean(game?.gameStatus) || !game?.gameId}
                  inputRef={ratio}
                  value={settings?.deductionRatio}
                  onChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      deductionRatio: Number(value.target.value),
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Percent sx={{ transform: 'rotate(45deg)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Ratio color={theme.colors.alpha.trueWhite} />
                      </InputAdornment>
                    ),
                  }}
                  // disabled={createUserHook.isLoading}
                  // error={Boolean(errors.phone)}
                  name='ratio'
                  label='Divide Ratio'

                  // helperText={
                  //   errors.phone ? `Password is ${errors.phone?.message}` : null
                  // }
                />
              </Box>
            </Grid>
          )}
          {user?.type === 'superadmin' && (
            <Grid item xs={12} sm={6} lg={4}>
              <Box p={3} display='flex' alignItems='flex-start'>
                <TextField
                  fullWidth
                  disabled={Boolean(game?.gameStatus) || !game?.gameId}
                  inputRef={winningRatio}
                  value={settings?.winningRatio}
                  onChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      winningRatio: Number(value.target.value),
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <EmojiEvents />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Ratio color={theme.colors.alpha.trueWhite} />
                      </InputAdornment>
                    ),
                  }}
                  // disabled={createUserHook.isLoading}
                  // error={Boolean(errors.phone)}
                  name='winningRatio'
                  label='Winning Ratio'

                  // helperText={
                  //   errors.phone ? `Password is ${errors.phone?.message}` : null
                  // }
                />
              </Box>
            </Grid>
          )}

          {announceResult === 'Manual' && (
            <Grid item xs={12} container justifyContent='center'>
              <Grid xs={12} item sm={6}>
                <Box p={3}>
                  <TextField
                    fullWidth
                    disabled={Boolean(game?.gameStatus) || !game?.gameId}
                    inputRef={winningNumberInput}
                    onChange={(event) => {
                      if (!event.target.value) {
                        setSelectedValue(undefined);
                      }
                    }}
                    // disabled={createUserHook.isLoading}
                    // error={Boolean(errors.phone)}
                    name='winningNumber'
                    label='Winning Number'
                    sx={{ mb: 3 }}
                    // helperText={
                    //   errors.phone ? `Password is ${errors.phone?.message}` : null
                    // }
                  />
                  <LoadingButton
                    loading={declareResultLoading}
                    disabled={Boolean(game?.gameStatus) || !game?.gameId}
                    onClick={calculate}
                    fullWidth
                    variant='contained'
                    size='large'
                  >
                    Declare Result
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          )}
          {announceResult === 'Automatic' && (
            <Grid item xs={12} container justifyContent='center'>
              <Grid xs={12} item sm={6}>
                <Box p={3}>
                  <LoadingButton
                    loading={declareResultLoading}
                    disabled={Boolean(game?.gameStatus) || !game?.gameId}
                    onClick={calculate}
                    fullWidth
                    variant='contained'
                    size='large'
                  >
                    Declare Result
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
      <DeclareResult
        selectedNumber={selectedValue}
        amount={selectedWinningAmount}
        open={Boolean(
          selectedValue !== undefined &&
            selectedValue >= 0 &&
            selectedValue <= 9 &&
            open
        )}
        onClose={handleClose}
        winningRatio={Number(
          winningRatio?.current?.value || settings.winningRatio
        )}
      />
      <AnnounceResultPop
        onClose={handleErrorClose}
        open={openError}
        message={openErrorMessage}
      />
    </Card>
  );
}

export default Feed;

function DeclareResult(props) {
  const { onClose, selectedNumber, amount, open, winningRatio } = props;

  const handleClose = () => {
    onClose();
  };

  const onSubmit = () => {
    if (socketService.socket) {
      gameService.declareResult(
        socketService.socket,
        selectedNumber === 0 ? 10 : selectedNumber,
        amount,
        winningRatio
      );
      handleClose();
    }
  };

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          justifyContent: 'space-around',
          paddingY: 5,
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Winning Number Is</Typography>
          <Typography variant='h1' sx={{ paddingY: 0 }}>
            {selectedNumber}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogActions sx={{ paddingX: 4, paddingY: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant='contained' onClick={onSubmit} type='button'>
          Declare Result
        </Button>
      </DialogActions>
    </Dialog>
  );
}

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
