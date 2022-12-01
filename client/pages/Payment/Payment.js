import React from 'react';

import { CreditCardProvider, PaymentProvider } from '@client/contexts';
import PaymentContainer from '@client/features/payment/PaymentContainer';

const Payment = () => {
  return (
    <PaymentProvider>
      <CreditCardProvider>
        <PaymentContainer />
      </CreditCardProvider>
    </PaymentProvider>
  );
};
export default Payment;
