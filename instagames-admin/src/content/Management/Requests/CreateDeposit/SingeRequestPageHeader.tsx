import { ArrowBack, Clear } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Grid, useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { useDepositRequest } from '@/hooks/request/useRequest';

import { requestImageFilesAtom, requestUserDetailsAtom } from '@/store/request';

import { ImageType } from './RequestImage';

function SingeRequestPageHeader() {
  const theme = useTheme();
  const router = useRouter();
  const [requestUserDetails, setRequestUserDetails] = useAtom(
    requestUserDetailsAtom
  );
  const [requestImage, setRequestImageFiles] = useAtom(requestImageFilesAtom);

  const createDepositeRequestHook = useDepositRequest();

  const createRequest = async (files: ImageType[] | null | undefined) => {
    const res: any = await createDepositeRequestHook.mutateAsync({
      body: files,
      query: {
        user: requestUserDetails?._id,
      },
    });
    if (res?.status === 'success') {
      setTimeout(() => {
        // setFiles(null);
        // handleClose(true);
        router?.push(`/management/requests/${res?.requests[0]?._id}`);
        setRequestUserDetails(null);
        setRequestImageFiles(null);
      }, 500);
    }
  };

  useEffect(() => {
    return;
  }, [requestUserDetails, requestImage]);

  return (
    <Grid container justifyContent='space-between' alignItems='center'>
      <Grid item xs>
        <IconButton
          size='small'
          sx={{
            '&:hover': {
              color: theme.colors.alpha.trueWhite[100],
              backgroundColor: theme.palette.primary.main,
            },

            background: theme.colors.primary.lighter,
            color: theme.palette.primary.main,
          }}
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBack />
        </IconButton>
      </Grid>
      <Grid item>
        <Grid container spacing={2}>
          <Grid item>
            <LoadingButton
              loading={createDepositeRequestHook?.isLoading}
              onClick={() => {
                createRequest(requestImage);
              }}
              disabled={!(requestUserDetails && requestImage)}
              sx={{ mt: { xs: 2, md: 0 } }}
              color='primary'
              variant='contained'
            >
              Raise Deposit Request
            </LoadingButton>
          </Grid>
          <Grid item>
            <LoadingButton
              loading={createDepositeRequestHook?.isLoading}
              onClick={() => {
                setRequestImageFiles(null);
                setRequestUserDetails(null);
                router?.back();
              }}
              sx={{ mt: { xs: 2, md: 0 } }}
              color='error'
              variant='contained'
              startIcon={<Clear fontSize='small' />}
            >
              Cancel
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

SingeRequestPageHeader.propTypes = {};
SingeRequestPageHeader.defaultProps = {};

export default SingeRequestPageHeader;
