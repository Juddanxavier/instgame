import {
  Card,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListSubheader,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Grid } from '@mui/material';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

import { useGetAllUsers } from '@/hooks/user/useUser';

import { requestUserDetailsAtom } from '@/store/request';

import { User } from '@/models/crypto_order';

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

function SearchCustomer() {
  const theme = useTheme();
  const [query, setQuery] = useState({});
  const [users, setUsers] = useState<any>([]);
  const getAllUsersHook = useGetAllUsers();
  const [requestUserDetails, setRequestUserDetails] = useAtom(
    requestUserDetailsAtom
  );

  const getAllUsers = async () => {
    const res: any = await getAllUsersHook.mutateAsync({
      query: {
        type: ['customer'],
        role: 'user',
        ...query,
      },
    });
    if (res.status === 'success') {
      setUsers(res.users);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [query]);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title='Search Customer' />
      <Divider />
      <ListWrapper disablePadding>
        <ListItem
          sx={{
            color: `${theme.colors.primary.main}`,
            '&:hover': { color: `${theme.colors.primary.dark}` },
          }}
        >
          <TextField
            onChange={(event) =>
              setQuery((prev) => ({
                ...prev,
                keyword: event.target.value,
              }))
            }
            fullWidth
            label='Search'
          />
        </ListItem>

        <Divider />
        <ListSubheader>
          <Typography sx={{ py: 1.5 }} variant='h4' color='text.primary'>
            Customer List
          </Typography>
        </ListSubheader>
        <Divider />
        <ListItem>
          <Grid container>
            <Grid item xs>
              User Name
            </Grid>
            <Grid item xs>
              Phone Number
            </Grid>
          </Grid>
        </ListItem>
        {users?.map((user) => (
          <div key={user?._id}>
            <Divider />
            <ListItem
              button
              onClick={() => {
                setRequestUserDetails(user);
              }}
            >
              <Grid container>
                <Grid item xs>
                  {user?.name}
                </Grid>
                <Grid item xs>
                  {user?.contact?.contactValue}
                </Grid>
              </Grid>
            </ListItem>
          </div>
        ))}
      </ListWrapper>
    </Card>
  );
}

SearchCustomer.prototype = {};
SearchCustomer.defaultProps = {};

export default SearchCustomer;
