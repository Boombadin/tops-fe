export const mockShippingMethods = [
  {
    carrierCode: 'tops',
    methodCode: 'express',
    carrierTitle: 'จัดส่งด่วน',
    methodTitle: 'จัดส่งด่วน',
    amount: 150,
    baseAmount: 150,
    available: true,
    extensionAttributes: {
      deliverySlot: [
        {
          date: '2020-11-17',
          isAllow: undefined,
          slot: [
            {
              available: 200,
              cost: 80,
              enabled: false,
              id: 20,
              isAllow: false,
              quota: 200,
              round: undefined,
              timeFrom: '10:00',
              timeTo: '11:00',
            },
            {
              available: 200,
              cost: 80,
              enabled: false,
              id: 21,
              isAllow: false,
              quota: 200,
              round: undefined,
              timeFrom: '11:00',
              timeTo: '12:00',
            },
            {
              available: 199,
              cost: 100,
              enabled: true,
              id: 22,
              isAllow: true,
              quota: 200,
              round: undefined,
              timeFrom: '12:00',
              timeTo: '13:00',
            },
          ],
        },
      ],
      shipping_description: [
        {
          key: 'caption',
          value:
            'รับสินค้าเร็วขึ้นด้วยการจัดส่งแบบด่วน หรือจัดส่งแบบปกติภายในวันเมื่อสั่งก่อนบ่าย',
        },
        {
          key: 'slot_label',
          value: 'รับสินค้าเร็วขึ้นด้วยบริการจัดส่งแบบด่วน',
        },
      ],
    },
    priceExclTax: 150,
    priceInclTax: 150,
  },
  {
    carrierCode: 'standard',
    methodCode: 'mds',
    carrierTitle: 'จัดส่งถึงบ้าน',
    methodTitle: 'จัดส่งปกติ',
    amount: 60,
    baseAmount: 60,
    available: true,
    extensionAttributes: {
      shipping_description: [
        {
          key: 'caption',
          value:
            'รับสินค้าเร็วขึ้นด้วยการจัดส่งแบบด่วน หรือจัดส่งแบบปกติภายในวันเมื่อสั่งก่อนบ่าย',
        },
        {
          key: 'slot_label',
          value: 'เลือกช่วงเวลารับสินค้าได้ 7 วันล่วงหน้า',
        },
      ],
    },
    priceExclTax: 60,
    priceInclTax: 60,
  },
  {
    carrierCode: 'pickupatstore',
    methodCode: 'tops',
    carrierTitle: 'รับสินค้าที่สาขา / ไดร์ฟ-ทรู',
    methodTitle: 'รับสินค้าที่สาขา / ไดร์ฟ-ทรู',
    amount: 0,
    baseAmount: 0,
    available: true,
    extensionAttributes: {
      shipping_description: [
        {
          key: 'caption',
          value:
            'ช็อปออนไลน์ง่ายๆ และรับสินค้าที่สาขาใกล้บ้าน ฟรีค่าบริการ! ไม่มีขั้นต่ำ',
        },
        {
          key: 'slot_label',
          value: 'ฟรีค่าบริการ! เลือกช่วงเวลารับสินค้าได้ 7 วันล่วงหน้า',
        },
      ],
      store_pickup_enabled: true,
      allowed_retailers: [],
    },
    priceExclTax: 0,
    priceInclTax: 0,
  },
];
