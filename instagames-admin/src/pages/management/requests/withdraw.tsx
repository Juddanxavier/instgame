import React from 'react';

import SidebarLayout from '@/layouts/SidebarLayout';

function WithdrawRequest() {
  return <div>WithdrawRequest</div>;
}

WithdrawRequest.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default WithdrawRequest;
