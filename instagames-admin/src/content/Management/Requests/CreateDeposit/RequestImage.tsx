import { yupResolver } from '@hookform/resolvers/yup';
import { Clear } from '@mui/icons-material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
} from '@mui/material';
import { Avatar } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { IKImage } from 'imagekitio-react';
import { useAtom } from 'jotai';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

import { useUploadImage } from '@/hooks/image/useImage';

import { requestImageFilesAtom } from '@/store/request';

import ViewImage from '../ViewImage';

const uri = 'https://ik.imagekit.io/mindia';

const AvatarAddWrapper = styled(Avatar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: theme.spacing(8),
  height: theme.spacing(8),
}));

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.palette.primary.main} dashed 1px;
        height: 100%;
        color: ${theme.palette.primary.main};
        box-shadow: none;
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.palette.grey[900]};
        }
`
);

export interface VersionInfo {
  id: string;
  name: string;
}
export interface ImageType {
  fileId: string;
  name: string;
  size: number;
  versionInfo: VersionInfo;
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  thumbnailUrl: string;
  AITags?: any;
}
function RequestImage() {
  const [openCreateAccount, setOpenCreateAccount] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const imageHooke = useUploadImage();
  const [requestImage, setRequestImageFiles] = useAtom(requestImageFilesAtom);

  const handleClick = () => {
    fileInput?.current?.click();
  };

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const addUser = Yup.object().shape({
    role: Yup.string().required('Required').nullable(),
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string().email('Invalid').required('Required'),
    phone: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    referenceUid: Yup.string()
      .required('Required')
      .length(7)
      .matches(/^(SO|SA|BO|AG|SAG|CU)[a-zA-Z0-9]{5}/, 'Invalid'),
  });

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addUser),
  });

  const handleCreateAccountClickOpen = (image) => {
    setOpenCreateAccount(true);
  };

  const handleCreateAccountCloseAndNext = (value) => {
    Promise.all([setOpenCreateAccount(false)]);
  };
  return (
    <Card>
      <CardHeader
        title='Request Image'
        action={
          <IconButton
            disabled={!requestImage}
            color='error'
            onClick={() => {
              setRequestImageFiles(null);
            }}
          >
            <Clear />
          </IconButton>
        }
      />
      <Divider />
      <Box p={2}>
        <Grid
          container
          spacing={0}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          {requestImage?.length ? (
            <div
              style={{
                width: '100%',
                position: 'relative',
              }}
            >
              <IKImage
                onClick={() =>
                  handleCreateAccountClickOpen(requestImage[0]?.url)
                }
                urlEndpoint={uri}
                src={requestImage[0]?.url}
                height={500}
              />
            </div>
          ) : (
            <div style={{ width: 'auto' }}>
              <Tooltip arrow title='Click to add a new image'>
                <CardAddAction
                  onClick={async () => {
                    handleClick();
                  }}
                >
                  <CardActionArea>
                    <CardContent>
                      {imageHooke.isLoading ? (
                        <CircularProgress color='warning' size={20} />
                      ) : (
                        <AvatarAddWrapper>
                          <AddTwoToneIcon fontSize='large' />
                        </AvatarAddWrapper>
                      )}
                    </CardContent>
                  </CardActionArea>
                </CardAddAction>
              </Tooltip>
              <input
                {...register('images', { required: true })}
                type='file'
                ref={fileInput}
                style={{ display: 'none' }}
                multiple
                onChange={async (input) => {
                  const files = Array.from(
                    input.target.files as ArrayLike<File>
                  );

                  const promises = files.map(async (file) => {
                    const processedFiles = new Promise((resolve, reject) => {
                      resolve(convertBase64(file));
                    });
                    return processedFiles;
                  });
                  const base64Files = await Promise.all(promises);

                  const res: ImageType[] = (await imageHooke.mutateAsync({
                    image: base64Files,
                  })) as unknown as ImageType[];

                  setRequestImageFiles(res);
                }}
              />
              <Box sx={{ height: 10 }}></Box>
              <Typography>Upload Request Image</Typography>
            </div>
          )}
          {requestImage?.length && (
            <ViewImage
              open={openCreateAccount}
              onClose={handleCreateAccountCloseAndNext}
              image={requestImage[0]?.url || ''}
              height='700'
            />
          )}
        </Grid>
      </Box>
    </Card>
  );
}

RequestImage.propTypes = {};

RequestImage.defaultProps = {};

export default RequestImage;
