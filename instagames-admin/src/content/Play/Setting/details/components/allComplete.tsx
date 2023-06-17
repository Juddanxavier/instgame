import { ThumbUp } from '@mui/icons-material';
import { Box, Dialog, DialogTitle, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import PropTypes from 'prop-types';

import { userAtom } from '@/store/user';

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog fullWidth={true} maxWidth='xs' onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingY: 5,
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Add User</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            {newCreatedUser ? newCreatedUser?.name : ''}&apos;s account is
            created.
          </Typography>
        </Box>
        <ThumbUp fontSize='large'></ThumbUp>
      </DialogTitle>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default SimpleDialog;
