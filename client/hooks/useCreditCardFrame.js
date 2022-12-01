import { useBinLookupLazyQuery } from '@central-tech/react-hooks';
import { useEffect, useState } from 'react';

import { creditCardEventType } from '../constants/creditCardEventType';

const defaultHeight = 320;
export const useCreditCardFrame = () => {
  const [formData, setFormData] = useState(null);
  const [bin, setBin] = useState(null);
  const [binResponse, setBinResponse] = useState(null);
  const [heightCreditCardFrame, setHeightCreditCardFrame] = useState(
    defaultHeight,
  );
  const [encryptedData, setEncryptedData] = useState();

  const [fetchBinLookup, binLookupLazyResponse] = useBinLookupLazyQuery({
    fetchPolicy: 'no-cache',
  });
  const handleCreditCartFrame = async event => {
    try {
      const eventType = event?.data?.type || false;
      if (eventType) {
        switch (eventType) {
          case creditCardEventType.CC_BIN_LOOKUP:
            const newBin = event?.data?.value?.masked;
            if (newBin && newBin.length >= 6) {
              const isExistingCreditCardNumber = newBin === bin;
              if (!isExistingCreditCardNumber) {
                setBin(newBin);
                fetchBinLookup({
                  variables: {
                    bin: newBin,
                  },
                });
              }
            }
            break;
          case creditCardEventType.CC_HEIGHT_CHANGE:
            const { height } = event?.data?.value;
            if (height && height !== heightCreditCardFrame) {
              setHeightCreditCardFrame(height);
            }
            break;
          case creditCardEventType.CC_SUBMIT_FORM_RESPONSE:
            setEncryptedData(event.data.value.encryptedData);
            break;
          case creditCardEventType.CC_HANDLE_CHANGE:
            const { values, errors } = event.data.value;
            setFormData({
              ...formData,
              values,
              errors,
            });
            break;
          default:
            console.error('handleCreditCartFrame: No type');
            break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const event = 'message';
    window.addEventListener(event, handleCreditCartFrame);
    return function cleanup() {
      window.removeEventListener(event, handleCreditCartFrame);
    };
  });

  useEffect(() => {
    if (binLookupLazyResponse) setBinResponse(binLookupLazyResponse);

    // reset old data
    if (binLookupLazyResponse?.loading) {
      setEncryptedData(null);
    }
  }, [binLookupLazyResponse?.loading, binLookupLazyResponse?.data]);

  const resetState = () => {
    setBin(null);
    setEncryptedData(null);
    setFormData(null);
  };

  return {
    heightCreditCardFrame,
    bin,
    binResponse,
    encryptedData,
    resetState,
  };
};
