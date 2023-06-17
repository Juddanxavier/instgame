import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material'
import { useAtom } from 'jotai'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import { userAtom } from '@/@core/store/user'
import { Grid } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { lighten, styled, useTheme } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone'
import Image from 'next/image'
import { Key, useRef, useState, ChangeEvent } from 'react'
import { useUploadImage } from '@/@core/hooks/image/useImage'
import { useDepositRequest } from '@/@core/hooks/wallet/useWallet'
import { ThumbUp } from '@mui/icons-material'

const AvatarAddWrapper = styled(Avatar)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.common.white,
  width: theme.spacing(8),
  height: theme.spacing(8)
}))

const CardLogo = styled('img')(
  ({ theme }) => `
      border: 1px solid ${theme.palette.grey[900]};
      border-radius: 10px;
      padding: ${theme.spacing(1)};
      margin-right: ${theme.spacing(2)};
      background: ${theme.palette.common.white};
`
)

const ImageWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  width: 'auto',
  height: '200px',
  position: 'relative'
}))

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
)

const IconButtonError = styled(IconButton)(
  ({ theme }) => `
     background: ${theme.palette.error.light};
     color: ${theme.palette.error.main};
     padding: ${theme.spacing(0.5)};

     &:hover {
      background: ${lighten(theme.palette.error.light, 0.4)};
     }
`
)

const CardCc = styled(Card)(
  ({ theme }) => `
     border: 1px solid ${theme.palette.primary.main};
     background: ${theme.palette.grey[900]};
     box-shadow: none;
`
)
interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget
}

function AddMoney(props: { onClose: any; open: any }) {
  const { onClose, open } = props
  const fileInput = useRef<HTMLInputElement>(null)
  const imageHooke = useUploadImage()

  const handleClick = () => {
    fileInput?.current?.click()
  }

  const convertBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const depositRequestHook = useDepositRequest()
  const [newCreatedUser, setNewCreatedUser] = useAtom(userAtom)
  const [files, setFiles] = useState<string[] | null>()
  const [image, setImage] = useState<unknown[] | null>()

  const handleClose = (value: boolean) => {
    onClose(value)
  }

  const addUser = Yup.object().shape({
    role: Yup.string().required('Required').nullable(),
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
    email: Yup.string().email('Invalid').required('Required'),
    phone: Yup.string().matches(
      /^(\+\d{1,2}\s?)?1?-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/m,
      'Invalid Phone Number'
    ),
    referenceUid: Yup.string()
      .required('Required')
      .length(7)
      .matches(/^(SO|SA|BO|AG|SAG|CU)[a-zA-Z0-9]{5}/, 'Invalid')
  })

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(addUser)
  })
  depositRequestHook.isLoading

  const createRequest = async (files: string[] | null | undefined) => {
    const res: any = await depositRequestHook.mutateAsync(files)
    if (res?.status === 'success') {
      setTimeout(() => {
        setFiles(null)
        handleClose(true)
      }, 500)
    }
  }

  console.log(files)

  return (
    <Dialog fullWidth={true} maxWidth='xs' open={open}>
      <DialogTitle
        sx={{
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography style={{ fontSize: 20 }}>Upload Payment Screenshot</Typography>
          <Typography variant='subtitle1' sx={{ paddingY: 0 }}>
            please upload successful payment screenshot to add in wallet.
          </Typography>
        </Box>

        <Grid item xs={12} sm={12} sx={{ py: 5, position: 'sticky' }}>
          <div style={{ width: 'auto', height: '100px' }}>
            <Tooltip arrow title='Click to add a new card'>
              <CardAddAction
                onClick={async () => {
                  handleClick()
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
          </div>
        </Grid>
        <Typography style={{ fontSize: 20 }} sx={{ pb: 2 }}>
          Total requests - {files?.length ?? 0}
        </Typography>
        {/* <Typography>{JSON.stringify(image)}</Typography>
        <Typography>{JSON.stringify(imageHooke.error)}</Typography>
        <Typography>{JSON.stringify(imageHooke.isError)}</Typography> */}
        {/* <Typography>{JSON.stringify(imageHooke.error)}</Typography> */}
      </DialogTitle>

      <DialogContent
        sx={{
          minHeight: 300,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {files?.map((file: any, index: Key | null | undefined) => (
            <Grid key={index} item xs={4} sm={4}>
              <ImageWrapper onClick={() => {}}>
                <Image src={file.thumbnailUrl} layout='fill' alt={file} />
              </ImageWrapper>
            </Grid>
          ))}

          <input
            {...register('images', { required: true })}
            type='file'
            ref={fileInput}
            style={{ display: 'none' }}
            multiple
            onChange={async input => {
              const files = Array.from(input.target.files as ArrayLike<File>)

              const promises = files.map(async file => {
                const processedFiles = new Promise((resolve, reject) => {
                  resolve(convertBase64(file))
                })
                return processedFiles
              })

              const base64Files = await Promise.all(promises)
              setImage(base64Files)
              const res: string[] = (await imageHooke.mutateAsync({ image: base64Files })) as string[]

              setFiles(res)
            }}
          />
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button sx={{ my: 4 }} onClick={() => handleClose(false)}>
          Cancel
        </Button>
        <Button
          sx={{ width: '160px' }}
          disabled={depositRequestHook.isLoading}
          variant='contained'
          onClick={() => createRequest(files)}
          type='button'
        >
          {depositRequestHook.isLoading ? <CircularProgress color='warning' size={20} /> : 'Send Request'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddMoney
