import { Replay } from '@mui/icons-material';
import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  styled,
  useTheme,
} from '@mui/material';
import { Button } from '@mui/material';
import { useAtom } from 'jotai';

import { useGetAllBets } from '@/hooks/game/useGame';

import { Game, gameAtom } from '@/store/game';

const ListWrapper = styled(List)(
  () => `
      .MuiListItem-root {
        border-radius: 0;
        margin: 0;
      }
`
);

function PopularTags() {
  const theme = useTheme();
  const [game, setGame] = useAtom(gameAtom);
  const getAllBetsHook = useGetAllBets();

  const getAllBets = async () => {
    const res: any = await getAllBetsHook.mutateAsync();
    if (res?.status === 'success') {
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

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title='Bet on each number'
        action={
          <Button onClick={getAllBets}>
            <Replay></Replay>
          </Button>
        }
      />
      <Divider />
      <ListWrapper disablePadding>
        {game?.allBetListSet?.map((bet) => (
          <>
            <ListItem
              key={bet.number}
              sx={{
                color: `${theme.colors.primary.main}`,
                '&:hover': { color: `${theme.colors.primary.dark}` },
              }}
              button
            >
              <ListItemText primary={bet.number === 10 ? '0' : bet.number} />
              <ListItemText primary={bet.totalBet} />
            </ListItem>
            <Divider />
          </>
        ))}
      </ListWrapper>
    </Card>
  );
}

export default PopularTags;
