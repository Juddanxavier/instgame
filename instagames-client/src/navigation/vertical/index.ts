// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { HandFrontLeftOutline, WalletOutline } from 'mdi-material-ui'
import { CasinoOutlined, ImportExport, ReceiptLong } from '@mui/icons-material'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      icon: HomeOutline,
      path: '/'
    },
    {
      title: 'Profile',
      icon: AccountCogOutline,
      path: '/profile'
    },
    {
      sectionTitle: 'Play'
    },
    {
      title: 'Play Game',
      icon: CasinoOutlined,
      path: '/game'
    },
    {
      sectionTitle: 'Manage'
    },
    {
      title: 'Wallet',
      icon: WalletOutline,
      path: '/manage/wallet'
    },
    {
      title: 'Transactions',
      icon: ImportExport,
      path: '/manage/transactions'
    },
    // {
    //   title: 'Requests',
    //   icon: HandFrontLeftOutline,
    //   path: '/manage/requests'
    // },
    {
      sectionTitle: 'Reports'
    },
    {
      title: 'Game Report',
      icon: ReceiptLong,
      path: '/gamereport'
    }

    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true
    // },

    // {
    //   sectionTitle: 'User Interface'
    // },

    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
