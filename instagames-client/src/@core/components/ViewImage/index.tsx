import { Dialog, DialogContent } from '@mui/material'
import { IKImage } from 'imagekitio-react'
import PropTypes from 'prop-types'

const uri = 'https://ik.imagekit.io/anknown/'

function ViewImage(props: { onClose: any; image: any; open: any; height: any }) {
  const { onClose, image, open, height } = props

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog maxWidth='xl' onClose={handleClose} open={open}>
      <DialogContent>
        <div>{image && <IKImage urlEndpoint={uri} src={image} height={height} />}</div>
      </DialogContent>
    </Dialog>
  )
}

ViewImage.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  image: PropTypes.string.isRequired,
  height: PropTypes.string
}
ViewImage.defaultProps = {
  image: ''
}

export default ViewImage
