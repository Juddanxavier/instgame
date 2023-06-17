import { ErrorOutline } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Button,
  DialogActions,
  DialogContent,
  Slide,
  styled,
  Typography,
} from '@mui/material';
import { Card, CardContent } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { TransitionProps } from '@mui/material/transitions';
import PropTypes from 'prop-types';
import { forwardRef, ReactElement, Ref } from 'react';

import { useDeleteUser } from '@/hooks/user/useUser';

import { User } from '@/store/user';

// import { AgentFieldStatus } from '@/models/agentStatus';

const DialogWrapper = styled(Dialog)(() => ({}));

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction='down' ref={ref} {...props} />;
});

type UserDelete = User | undefined;

interface CustomerDeleteDialogueProps {
  open: boolean;
  user: User | undefined;
  handleClose: (user: UserDelete, value: boolean) => void;
  onSuccess: (value: boolean) => void;
}

const CustomerDeleteDialogue = ({
  open,
  user,
  handleClose,
  onSuccess,
}: CustomerDeleteDialogueProps) => {
  const deleteUserHook = useDeleteUser();

  const deleteUser = async (id) => {
    const res: any = await deleteUserHook.mutateAsync({
      pathParams: {
        id,
      },
    });
    if (res?.status === 'success') {
      handleClose(undefined, false);
      onSuccess(true);
    }
  };

  return (
    <DialogWrapper
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth='xs'
      fullWidth
      scroll='paper'
      onClose={() => handleClose(undefined, false)}
    >
      <DialogTitle>
        <Grid container spacing={1}>
          <Grid item sx={{ display: 'flex', alignItems: 'end' }}>
            <ErrorOutline color='error' />
          </Grid>
          <Grid item xs sx={{ display: 'flex', alignItems: 'end' }}>
            <Typography variant='h4'>Confirm - Delete Inventory</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Card
          sx={{
            background: '#FFF',
            borderRadius: 1,
            boxShadow: '0px 2px 5px 0px rgb(58 53 65 / 10%)',
          }}
        >
          {/* <CardHeader title={<>{getStatusLabel(user?.status)}</>} /> */}
          <CardContent>
            <Grid container>
              {/* <Grid item marginRight={2}>
                <Image
                  src={user?. || '/images/noattribute.png'}
                  alt=''
                  width={70}
                  height={70}
                />
              </Grid> */}
              <Grid item xs>
                <Typography
                  fontSize={18}
                  fontWeight={700}
                  lineHeight={2}
                  sx={{ color: '#242C51' }}
                >
                  {user?.name}
                </Typography>
                <Grid container direction='row'>
                  {/* <Image src='/Vector.png' alt='' width='16.8' height='13.59' /> */}

                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    lineHeight={1}
                    sx={{ color: ' #8795AF' }}
                  >
                    {user?.type}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item xs>
                <Typography
                  fontSize={18}
                  fontWeight={700}
                  lineHeight={2}
                  sx={{ color: '#242C51', textAlign: 'end' }}
                >
                  {user?.contact?.contactValue}
                </Typography>

                <Typography
                  fontSize={14}
                  fontWeight={500}
                  lineHeight={1}
                  sx={{ color: ' #8795AF', textAlign: 'end' }}
                >
                  phone
                </Typography>
              </Grid>
            </Grid>
          </CardContent>

          <CardContent
            sx={{
              background: '#F8F9FB',
              borderRadius: 1,
              m: 1,
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: '#8795AF' }}
                >
                  Wallet Amount
                </Typography>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  sx={{ color: '#242C51' }}
                >
                  {user?.wallet?.balance}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: '#8795AF' }}
                ></Typography>
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  sx={{ color: '#242C51' }}
                >
                  {/* {user?.subAttributes} */}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <DialogActions
          sx={{
            mt: 3,
          }}
        >
          <Grid container spacing={2} justifyContent='flex-end'>
            <Grid item>
              <Button
                color='error'
                onClick={() => handleClose(undefined, false)}
                sx={{ minWidth: 100 }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <LoadingButton
                loading={deleteUserHook?.isLoading}
                color='error'
                variant='contained'
                sx={{ minWidth: 100 }}
                onClick={() => {
                  deleteUser(user?._id);
                }}
              >
                Delete
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
      </DialogContent>
    </DialogWrapper>
  );
};

CustomerDeleteDialogue.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CustomerDeleteDialogue;
