export const locale = {
  languages: [
    {
      name: 'ไทย',
      code: 'th_TH',
      url: 'th',
      active: true,
    },
    {
      name: 'EN',
      code: 'en_US',
      url: 'en',
      active: false,
    },
  ],
  options: {
    renderInnerHtml: true,
    showMissingTranslationMsg: true,
    missingTranslationMsg: '${key}',
    ignoreTranslateChildren: false,
  },
  translations: {
    homepage_text: ['หน้าหลัก', 'Homepage'],
    'order_history.order_history': ['ประวัติการสั่งซื้อ', 'Order History'],
    'order_history.my_account': ['บัญชีของฉัน', 'My Account'],
    'order_history.table.number': ['เลขที่ใบสั่งซื้อ', 'Order Number'],
    'order_history.table.date': ['วันและเวลา', 'Date & Time'],
    'order_history.table.status': ['สถานะใบสั่งซื้อ', 'Order Status'],
    'order_history.table.price': ['ราคาสุทธิ', 'Total'],
    'order_history.table.address': ['ที่อยู่จัดส่ง', 'Delivery address'],
    'order_history.table.repeat': ['สั่งซื้อซ้ำ', 'Reorder'],
    'order_history.table.track_order': ['ติดตามการจัดส่ง', 'Track Order'],
    'order_history.view_button': ['ดูคำสั่งซื้อ', 'View'],
    'order_history.status.pending': ['กำลังดำเนินการ', 'Pending'],
    'order_history.status.logistics': ['กำลังจัดเตรียมสินค้า', 'Logistics'],
    'order_history.status.complete': ['จัดส่งสำเร็จ', 'Complete'],
    'order_history.status.canceled': ['การสั่งซื้อไม่สมบูรณ์', 'Canceled'],
    'order_history.status.on_hold': ['กำลังดำเนินการ', 'On Hold'],
    'order_history.status.new': ['ได้รับคำสั่งซื้อ', 'New'],
    'order_history.status.rejected': ['ยกเลิกคำสั่งซื้อ', 'Rejected'],
    'order_history.status.error': ['คำสั่งซื้อเกิดความผิดพลาด', 'Error'],
    'order_history.status.partial_shipped': [
      'จัดส่งสำเร็จบางส่วน',
      'Partial shipped',
    ],
    'order_history.status.pending_payment': [
      'รอการชำระเงิน',
      'Pending Payment',
    ],
    'order_history.status.approved': ['ยืนยันคำสั่งซื้อ', 'Approved'],
    'order_history.status.processing': ['การประมวลผล', 'Processing'],
    'order_history.status.received': ['ได้รับคำสั่งซื้อ', 'Received'],
    'product.notification.reorder_limit_qty_200': [
      'ไม่สามารถเพิ่มสินค้าได้ เนื่องจากสินค้าถึงจำนวนที่จำกัดต่อคำสั่งซื้อ กรุณาเลือกสินค้าบางรายการ',
      `Can't reorder due to cart item limit exceeded. Please select some item(s) and try again.`,
    ],
    'order_detail.number': ['เลขที่ใบสั่งซื้อ', 'Order No.'],
    'order_detail.unit_pack': ['แพค', 'pack'],
    'order_detail.unit_item': ['ชิ้น', 'item'],
    'order_detail.baht': ['บาท', 'baht'],
    'order_detail.payment.summary': ['การทำรายการทั้งหมด', 'Payment summary'],
    'order_detail.payment.method': ['การชำระเงิน', 'Payment'],
    'order_detail.subtotal': ['ค่าสินค้าก่อนหักส่วนลด', 'Subtotal'],
    'order_detail.coupon_discount': ['ส่วนลด', 'Discount'],
    'order_detail.staff_discount': ['ส่วนลดพนักงาน', 'Staff discount'],
    'order_detail.delivery.fee': ['ค่าจัดส่ง', 'Delivery fee'],
    'order_detail.delivery.date': ['วันที่จัดส่ง', 'Delivery date'],
    'order_detail.delivery.time': ['เวลาจัดส่ง', 'Delivery Time'],
    'order_detail.receiver.name': ['ชื่อผู้รับ', 'Recipient'],
    'order_detail.receiver.contact_number': ['เบอร์ผู้รับ', 'Recipient Tel.'],
    'order_detail.grand_total': ['จำนวนเงินทั้งหมด', 'Grand total'],
    'order_detail.estimate_t1c_point': [
      'คะแนนที่คาดว่าจะได้รับ',
      'Estimate T1C point',
    ],
    'order_detail.shipping.summary': ['สรุปรายการจัดส่ง', 'Shipping summary'],
    'order_detail.shipping.name': ['Shipping name', 'Shipping name'],
    'order_detail.shipping.address': ['ส่งที่', 'Shipping address'],
    'order_detail.table.products': [
      'รายการสินค้าที่ท่านสั่งซื้อ',
      'Your order',
    ],
    'order_detail.table.details': ['รายละเอียดสินค้า', 'Item description'],
    'order_detail.table.count': ['จำนวน', 'Quantity'],
    'order_detail.table.unit': ['หน่วย', 'Unit'],
    'order_detail.table.price': ['ราคา', 'Price per unit'],
    'order_detail.table.discount': ['ส่วนลด', 'Discount'],
    'order_detail.table.net_price': ['ราคารวมสุทธิ', 'Subtotal'],
    'order_detail.notice_point': ['จุดสังเกต', 'Notice point'],
    'order_detail.currency': ['บาท', 'THB'],
    'shipping_address.title': ['สรุปรายการจัดส่ง', 'Delivery Summary'],
    'shipping_address.title_pickup': ['สรุปรายการรับสินค้า', 'Pickup Summary'],
    'shipping_address.address': ['ส่งที่', 'Delivery to'],
    'shipping_address.recipient_address': ['รับสินค้าที่', 'Pick up at'],
    'shipping_address.landmark': ['จุดสังเกต', 'Landmark'],
    'shipping_address.delivery_date': ['วันที่จัดส่ง', 'Date'],
    'shipping_address.delivery_time': ['เวลาจัดส่ง', 'Time'],
    'shipping_address.recipient_name': ['ชื่อผู้รับ', 'Name'],
    'shipping_address.recipient_tel': ['เบอร์ผู้รับ', 'Tel.'],
    'shipping_address.prefix_moo': ['หมู่', 'Moo'],
    'shipping_address.prefix_soi': ['ซอย', 'Soi'],
    'shipping_address.delivery_date_time': ['วันที่จัดส่ง', 'Delivery Date'],
    'shipping_address.delivery_method': ['วิธีการจัดส่ง', 'Delivery method'],
    'shipping_address.recipient_date': ['วันรับสินค้า', 'Date'],
    'shipping_address.recipient_time': ['เวลารับสินค้า', 'Time'],
    'shipping_address.method.express': ['จัดส่งด่วน', 'Express delivery'],
    'meta_tags.home.title': [
      'Tops online ซูเปอร์มาร์เก็ตออนไลน์อันดับ 1 ของไทย',
      'Tops online is Thailand’s Number 1 online grocery shopping',
    ],
    'meta_tags.home.description': [
      'ท็อปส์ ออนไลน์ สั่งออนไลน์ 24 ชม. บริการจัดส่งด่วนพิเศษ ภายใน 2 ชั่วโมง',
      'Tops online Grocery Delivery Convenient and easy to shop',
    ],
    'meta_tags.home.keywords': [
      'ท็อปส์ ออนไลน์, ท็อปซูเปอร์มาร์เก็ต , ท็อป ออนไลน์, top ออนไลน์, ท็อปซูเปอร์,  tops ออนไลน์, เซ็นทรัลฟู้ดฮอลล์, ซูเปอร์มาร์เก็ต ออนไลน์, supermarket ออนไลน์',
      'Tops online , top supermarket, tops thailand, top super, top market, central food hall',
    ],
    'meta_tags.home.og_description': [
      'ท็อป ช็อปออนไลน์ ซื้อและส่งสินค้า จาก Tops  มี โปรโมชั่น ซื้อ 1 แถม 1 และ สินค้าลดราคา',
      'Tops Shoponline order and delivery from Tops Promotions buy 1 get 1 free and sale',
    ],
    'meta_tags.home.og_title': [
      'Tops online ท็อปส์ ออนไลน์',
      'Tops online ท็อปส์ ออนไลน์',
    ],
    'meta_tags.trending.title': [
      'โปรโมชั่น | Tops online',
      'Promotion | Tops online',
    ],
    'meta_tags.trending.description': [
      'โปรโมชั่น - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Promotion - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.trending.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, โปรโมชั่น',
      'Tops, Tops online, shop online, promotion',
    ],
    'meta_tags.deal.title': [
      'ดีลส์พิเศษจาก ท็อปส์ออนไลน์ | Tops online',
      'Special deals from Tops.co.th | Tops online',
    ],
    'meta_tags.deal.description': [
      'รับดีลส์พิเศษเพื่อซื้อสินค้าต่างๆ ที่ ท็อปส์ออนไลน์ ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Special deals from Tops online. Enjoy your online shopping with our special deals at Tops online.',
    ],
    'meta_tags.deal.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ดีล, ดีลส์, ดีลพิเศษ',
      'Tops, Tops online, shop online, best price, deals, special deals',
    ],
    'meta_tags.privilege.title': [
      'สิทธิพิเศษอื่นๆ จาก ท็อปส์ออนไลน์ | Tops online',
      'Privileges | Tops online',
    ],
    'meta_tags.privilege.description': [
      'สิทธิพิเศษเพื่อซื้อสินค้าต่างๆ ที่ ท็อปส์ออนไลน์ ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      "Let's see the previleges from Tops online. Enjoy your privileges for online shopping with our special deals at Tops online.",
    ],
    'meta_tags.privilege.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, สิทธิพิเศษ, สิทธิพิเศษอื่นๆ',
      'Tops, Tops online, shop online, best price, privilege, privileges',
    ],
    'meta_tags.wishlist.title': [
      'ลิสต์ของฉัน | Tops online',
      'Wishlist | Tops online',
    ],
    'meta_tags.wishlist.description': [
      'ลิสต์สินค้าของฉัน ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Wishlist - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.wishlist.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ลิสต์ของฉัน',
      'Tops, Tops online, shop online, best price, wishlist',
    ],
    'meta_tags.search.title': [
      'ค้นหาสินค้า | Tops online',
      'Search | Tops online',
    ],
    'meta_tags.search.description': [
      'ค้นหาสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Search - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.search.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ค้นหาสินค้า',
      'Tops, Tops online, shop online, best price, search',
    ],
    'meta_tags.cart.title': [
      'ตะกร้าสินค้า | Tops online',
      'Cart | Tops online',
    ],
    'meta_tags.cart.description': [
      'ตะกร้าสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Cart - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.cart.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ตะกร้าสินค้า',
      'Tops, Tops online, shop online, best price, cart, basket',
    ],
    'meta_tags.login.title': [
      'เข้าสู่ระบบ | Tops online',
      'Login | Tops online',
    ],
    'meta_tags.login.description': [
      'เข้าสู่ระบบ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Login - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.login.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, เข้าสู่ระบบ',
      'Tops, Tops online, shop online, best price, login',
    ],
    'meta_tags.registration.title': [
      'ลงทะเบียน | Tops online',
      'Registration | Tops online',
    ],
    'meta_tags.registration.description': [
      'ลงทะเบียน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Registration - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.registration.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ลงทะเบียน',
      'Tops, Tops online, shop online, best price, registration',
    ],
    'meta_tags.registration_completed.title': [
      'ลงทะเบียนเรียบร้อย | Tops online',
      'Registration | Tops online',
    ],
    'meta_tags.registration_completed.description': [
      'ลงทะเบียน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Registration - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.registration_completed.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ลงทะเบียน',
      'Tops, Tops online, shop online, best price, registration',
    ],
    'meta_tags.reset_password.title': [
      'รีเซ็ตพาสเวิร์ด | Tops online',
      'Reset password | Tops online',
    ],
    'meta_tags.reset_password.description': [
      'รีเซ็ตพาสเวิร์ด - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Reset password - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.reset_password.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, พาสเวิร์ด, รีเซ็ตพาสเวิร์ด',
      'Tops, Tops online, shop online, best price, reset password',
    ],
    'meta_tags.reset_password_completed.title': [
      'รีเซ็ตพาสเวิร์ดสำเร็จ | Tops online',
      'Reset password | Tops online',
    ],
    'meta_tags.reset_password_completed.description': [
      'รีเซ็ตพาสเวิร์ด - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Reset password - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.reset_password_completed.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, พาสเวิร์ด, รีเซ็ตพาสเวิร์ด',
      'Tops, Tops online, shop online, best price, reset password',
    ],
    'meta_tags.checkout.title': [
      'ชำระเงิน | Tops online',
      'Checkout | Tops online',
    ],
    'meta_tags.checkout.description': [
      'ชำระเงิน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Checkout - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.checkout.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ชำระเงิน',
      'Tops, Tops online, shop online, best price, checkout',
    ],
    'meta_tags.checkout_completed.title': [
      'ชำระเงินเรียบร้อย | Tops online',
      'Checkout | Tops online',
    ],
    'meta_tags.checkout_completed.description': [
      'ชำระเงิน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Checkout - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.checkout_completed.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ชำระเงิน',
      'Tops, Tops online, shop online, best price, checkout',
    ],
    'meta_tags.order_detail.title': [
      'รายละเอียดออร์เดอร์ | Tops online',
      'Order details | Tops online',
    ],
    'meta_tags.order_detail.description': [
      'รายละเอียดออร์เดอร์ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Order details - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.order_detail.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, สินค้าในตะกร้า, ออร์เดอร์',
      'Tops, Tops online, shop online, best price, order details',
    ],
    'meta_tags.forgot_password.title': [
      'ลืมพาสเวิร์ด | Tops online',
      'Forgot password | Tops online',
    ],
    'meta_tags.forgot_password.description': [
      'ลืมพาสเวิร์ด - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Forgot password - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.forgot_password.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, พาสเวิร์ด',
      'Tops, Tops online, shop online, best price, forgot password',
    ],
    'meta_tags.forgot_completed.title': [
      'ลืมพาสเวิร์ด | Tops online',
      'Forgot password | Tops online',
    ],
    'meta_tags.forgot_completed.description': [
      'ลืมพาสเวิร์ด - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Forgot password - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.forgot_completed.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, พาสเวิร์ด, ลืมพาสเวิร์ด',
      'Tops, Tops online, shop online, best price, forgot password',
    ],
    'meta_tags.help.title': ['ช่วยเหลือ | Tops online', 'Help | Tops online'],
    'meta_tags.help.description': [
      'ช่วยเหลือ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.how_to_use_website.title': [
      'การใช้งานเว็บไซต์ | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.how_to_use_website.description': [
      'ช่วยเหลือ เรื่องการใช้งานเว็บไซต์ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.how_to_use_website.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, การใช้งานเว็บไซต์',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.how_to_shop.title': [
      'การสั่งซื้อสินค้า | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.how_to_shop.description': [
      'ช่วยเหลือ เรื่องการสั่งซื้อสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.how_to_shop.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, การสั่งซื้อสินค้า',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.product_and_promotion.title': [
      'ข้อมูลสินค้าและโปรโมชั่น | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.product_and_promotion.description': [
      'ช่วยเหลือ เรื่องข้อมูลสินค้าและโปรโมชั่น - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.product_and_promotion.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, ข้อมูลสินค้าและโปรโมชั่น',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.how_to_pay.title': [
      'วิธีการชำระเงิน | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.how_to_pay.description': [
      'ช่วยเหลือ เรื่องวิธีการชำระเงิน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.how_to_pay.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, วิธีการชำระเงิน',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.shipping_and_delivery.title': [
      'การส่งสินค้า | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.shipping_and_delivery.description': [
      'ช่วยเหลือ เรื่องวิธีส่งสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.shipping_and_delivery.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, การส่งสินค้า',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.help.nodes.user_account.title': [
      'บัญชีผู้ใช้งาน | Tops online',
      'Help | Tops online',
    ],
    'meta_tags.help.nodes.user_account.description': [
      'ช่วยเหลือ เรื่องบัญชีผู้ใช้งาน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Help - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.help.nodes.user_account.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ช่วยเหลือ, บัญชีผู้ใช้งาน',
      'Tops, Tops online, shop online, best price, help',
    ],
    'meta_tags.contact.title': [
      'ติดต่อเรา | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.description': [
      'ติดต่อเรา - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.user_account.title': [
      'ติดต่อเรา เรื่องบัญชีผู้ใช้ | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.user_account.description': [
      'ติดต่อเรา เรื่องบัญชีผู้ใช้ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.user_account.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, บัญชีผู้ใช้',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.how_to_shop.title': [
      'ติดต่อเรา เรื่องการสั่งซื้อสินค้า | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.how_to_shop.description': [
      'ติดต่อเรา เรื่องการสั่งซื้อสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.how_to_shop.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, การสั่งซื้อสินค้า',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.product_and_promotion.title': [
      'ติดต่อเรา เรื่องข้อมูลสินค้าและโปรโมชั่น | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.product_and_promotion.description': [
      'ติดต่อเรา เรื่องข้อมูลสินค้าและโปรโมชั่น - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.product_and_promotion.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, ข้อมูลสินค้าและโปรโมชั่น',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.how_to_pay.title': [
      'ติดต่อเรา เรื่องวิธีการชำระเงิน | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.how_to_pay.description': [
      'ติดต่อเรา เรื่องวิธีการชำระเงิน - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.how_to_pay.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, วิธีการชำระเงิน',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.shipping_and_delivery.title': [
      'ติดต่อเรา เรื่องการส่งสินค้า | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.shipping_and_delivery.description': [
      'ติดต่อเรา เรื่องการส่งสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.shipping_and_delivery.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, การส่งสินค้า',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.contact.nodes.other_issues.title': [
      'ติดต่อเรา เรื่องปัญหาอื่นๆ | Tops online',
      'Contact us | Tops online',
    ],
    'meta_tags.contact.nodes.other_issues.description': [
      'ติดต่อเรา เรื่องปัญหาอื่นๆ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Contact us - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.contact.nodes.other_issues.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ติดต่อเรา, ปัญหาอื่นๆ',
      'Tops, Tops online, shop online, best price, contact us',
    ],
    'meta_tags.order_history.title': [
      'ประวัติการสั่งซื้อสินค้า | Tops online',
      'Order History | Tops online',
    ],
    'meta_tags.order_history.description': [
      'ประวัติการซื้อสินค้า - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Order history - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.order_history.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, ประวัติการซื้อสินค้า',
      'Tops, Tops online, shop online, best price, order history',
    ],
    'meta_tags.recommended.title': [
      'สินค้าแนะนำ | Tops online',
      'Recommended | Tops online',
    ],
    'meta_tags.recommended.description': [
      'สินค้าแนะนำ - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Recommended - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.recommended.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, สินค้าแนะนำ',
      'Tops, Tops online, shop online, recommended product',
    ],
    'meta_tags.promotion.title': [
      'โปรโมชั่น | Tops online',
      'Promotion | Tops online',
    ],
    'meta_tags.promotion.description': [
      'โปรโมชั่น - Tops online ซื้อของสด ผัก ผลไม้ เนื้อสัตว์ อาหารสด อาหารพร้อมรับประทาน เครื่องดื่ม ขนมขบเคี้ยว ของหวาน สินค้าแม่และเด็ก และอื่นๆ ได้ที่ ท็อปส์ออนไลน์',
      'Promotion - Tops online, online shopping for your fresh groceries such as fruits, vegetables, meat, seafood, fresh food, ready to eat, snacks, desserts, beverages and more at Tops online',
    ],
    'meta_tags.promotion.keywords': [
      'ท็อปส์, ท็อปส์ ออนไลน์, ช้อปออนไลน์, โปรโมชั่น',
      'Tops, Tops online, shop online, promotion',
    ],
  },
};
