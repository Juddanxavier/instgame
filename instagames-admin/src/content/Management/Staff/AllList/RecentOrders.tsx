import { Card } from '@mui/material';

// import { CryptoOrder } from '@/models/crypto_order';
import RecentOrdersTable from './RecentOrdersTable';

function RecentOrders() {
  return (
    <Card>
      <RecentOrdersTable />
    </Card>
  );
}

export default RecentOrders;
