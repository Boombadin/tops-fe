import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  DateTime: any;
};

export type AcceptConsentInput = {
  cartId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  accept_consents: Array<ConsentType>;
};

export type AddCouponResponse = {
  __typename?: 'AddCouponResponse';
  message?: Maybe<Scalars['String']>;
  valid_coupon: Array<Scalars['String']>;
  invalid_coupon: Array<Scalars['String']>;
};

export type AddGiftWrapMessageInput = {
  isGuest: Scalars['Boolean'];
  cartId?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AdditionalAddressInfo = {
  __typename?: 'AdditionalAddressInfo';
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  region_name?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  customer_id?: Maybe<Scalars['Int']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  region_code?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Int']>;
  save_in_address_book?: Maybe<Scalars['Int']>;
  custom_attributes?: Maybe<AddressInputCustomAttributes>;
};

export type AddressInputCustomAttributes = {
  address_line?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  house_no?: Maybe<Scalars['String']>;
  moo?: Maybe<Scalars['String']>;
  village_name?: Maybe<Scalars['String']>;
  road?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  building_type?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['String']>;
  address_line2?: Maybe<Scalars['String']>;
  branch_code?: Maybe<Scalars['String']>;
};

export enum AddressType {
  Shipping = 'SHIPPING',
  Billing = 'BILLING'
}

export type AddToCartExtension = {
  allocated_store_id?: Maybe<Scalars['Int']>;
  pickup_store?: Maybe<PickupStoreInput>;
  quote_item_group: QuoteItemGroup;
  shipping_assignment?: Maybe<AddToCartShippingAssignMent>;
};

export type AddToCartInput = {
  quote_id?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  product_option?: Maybe<ProductConfigurableOption>;
  extension_attributes?: Maybe<AddToCartExtension>;
};

export type AddToCartResponse = {
  __typename?: 'AddToCartResponse';
  item_id?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  product_type?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<AddToCartResponseExtensionAttribute>;
};

export type AddToCartResponseExtensionAttribute = {
  __typename?: 'AddToCartResponseExtensionAttribute';
  quote_id_to_update?: Maybe<Scalars['Int']>;
};

export type AddToCartShippingAssignMent = {
  shipping_method?: Maybe<Scalars['String']>;
  store_code?: Maybe<Scalars['String']>;
};

export type AmPromotionRule = {
  __typename?: 'AmPromotionRule';
  sku?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['Int']>;
  after_product_banner_show_gift_images?: Maybe<Scalars['Int']>;
  top_banner_show_gift_images?: Maybe<Scalars['Int']>;
  minimal_items_price?: Maybe<Scalars['Int']>;
  apply_tax?: Maybe<Scalars['Int']>;
  apply_shipping?: Maybe<Scalars['Int']>;
};

export type AmRule = {
  __typename?: 'AmRule';
  promo_cats?: Maybe<Scalars['String']>;
  promo_skus?: Maybe<Scalars['String']>;
  apply_discount_to?: Maybe<Scalars['String']>;
  eachm?: Maybe<Scalars['String']>;
  priceselector?: Maybe<Scalars['Int']>;
  nqty?: Maybe<Scalars['String']>;
  max_discount?: Maybe<Scalars['String']>;
  skip_rule?: Maybe<Scalars['String']>;
};

export type ApplicableRulesPromotion = {
  __typename?: 'applicableRulesPromotion';
  rule_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<Scalars['JSON']>;
};

export type AssignCouponCampaignInput = {
  campaignName: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
  ruleId: Scalars['String'];
};

export type AssignCouponCampaignResponse = {
  __typename?: 'AssignCouponCampaignResponse';
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AssignCouponInput = {
  campaign_id: Scalars['Int'];
  customer_id?: Maybe<Scalars['Int']>;
  rule_id?: Maybe<Scalars['Int']>;
};

export type AssignCouponResponse = {
  __typename?: 'AssignCouponResponse';
  success: Scalars['Boolean'];
  errors?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Bank = {
  __typename?: 'Bank';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type Banner = {
  __typename?: 'banner';
  id: Scalars['ID'];
  name: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  sort_order?: Maybe<Scalars['String']>;
  page_type?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  product_condition?: Maybe<Scalars['String']>;
  category_ids?: Maybe<Scalars['String']>;
  animation_effect?: Maybe<Scalars['Int']>;
  pause_time_between_transitions?: Maybe<Scalars['Int']>;
  slide_transition_speed?: Maybe<Scalars['Int']>;
  is_stop_animation_mouse_on_banner?: Maybe<Scalars['Boolean']>;
  display_arrows?: Maybe<Scalars['Boolean']>;
  display_bullets?: Maybe<Scalars['Boolean']>;
  is_random_order_image?: Maybe<Scalars['Boolean']>;
  slide_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  slide_position?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<ExtensionAttributes>;
};

export type BannerProperty = {
  __typename?: 'BannerProperty';
  itemDeeplink?: Maybe<Scalars['String']>;
  showBullet?: Maybe<Scalars['Boolean']>;
};

export type Base64Image = {
  image?: Maybe<Scalars['String']>;
  image_type?: Maybe<Scalars['String']>;
};

export type BillingAddress = {
  __typename?: 'BillingAddress';
  address_type?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  region_code?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  extension_attributes?: Maybe<BillingAddressExtensionAttributes>;
  custom_attributes?: Maybe<Scalars['JSON']>;
};


export type BillingAddressCustom_AttributesArgs = {
  filter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type BillingAddressExtensionAttributes = {
  __typename?: 'BillingAddressExtensionAttributes';
  custom_attributes?: Maybe<Array<Maybe<CustomAttributes>>>;
};

export type BinLookup = {
  __typename?: 'BinLookup';
  bank_id?: Maybe<Scalars['String']>;
  promo_codes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Brand = {
  __typename?: 'Brand';
  brand_id: Scalars['ID'];
  name: Scalars['String'];
  url_key?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  meta_title?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<BrandExtensionAttributes>;
};

export type BrandAdditionalProduct = {
  __typename?: 'BrandAdditionalProduct';
  product_id?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
};

export type BrandContent = {
  __typename?: 'BrandContent';
  brand_id?: Maybe<Scalars['Int']>;
  store_id?: Maybe<Scalars['Int']>;
  meta_title?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type BrandDetail = {
  __typename?: 'BrandDetail';
  brand_id: Scalars['ID'];
  attribute_id?: Maybe<Scalars['Int']>;
  attribute_code?: Maybe<Scalars['String']>;
  option_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  website_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  url_key?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  is_featured?: Maybe<Scalars['Boolean']>;
  content?: Maybe<Array<Maybe<BrandContent>>>;
  meta_title?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  brand_additional_products?: Maybe<Array<Maybe<BrandAdditionalProduct>>>;
  extension_attributes?: Maybe<BrandDetailExtensionAttributess>;
};

export type BrandDetailExtensionAttributess = {
  __typename?: 'BrandDetailExtensionAttributess';
  parent_category?: Maybe<Scalars['Int']>;
  menu_css?: Maybe<Scalars['String']>;
  content_css?: Maybe<Scalars['String']>;
  brand_image_url?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  product_collections?: Maybe<Array<Maybe<BrandProductCollection>>>;
  product_count?: Maybe<Scalars['Int']>;
  product_name_special?: Maybe<Scalars['Boolean']>;
  hide_product_original_price?: Maybe<Scalars['Boolean']>;
  hide_t1c_redeemable_amount?: Maybe<Scalars['Boolean']>;
  allow_product_review?: Maybe<Scalars['Boolean']>;
  banners?: Maybe<Scalars['JSON']>;
  sort_orders?: Maybe<Array<BrandSortOrders>>;
};

export type BrandExtensionAttributes = {
  __typename?: 'BrandExtensionAttributes';
  only_central?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  product_count?: Maybe<Scalars['Int']>;
};

export type BrandProductCollection = {
  __typename?: 'BrandProductCollection';
  brand_collection_id: Scalars['ID'];
  brand_id?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  identification?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  brand_collection_products?: Maybe<Array<Maybe<BrandAdditionalProduct>>>;
  position?: Maybe<Scalars['Int']>;
  deep_link?: Maybe<Scalars['String']>;
  is_official?: Maybe<Scalars['Boolean']>;
  collection_products_textarea?: Maybe<Scalars['String']>;
};

export type BrandSortOrders = {
  __typename?: 'BrandSortOrders';
  field: Scalars['String'];
  direction: Scalars['String'];
};

export type Breadcrumbs = {
  __typename?: 'Breadcrumbs';
  category_id: Scalars['ID'];
  level?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type BtsOrderStatus = {
  __typename?: 'BtsOrderStatus';
  seller_id?: Maybe<Scalars['Int']>;
  seller_name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type BundlePromotion = {
  __typename?: 'BundlePromotion';
  products?: Maybe<Array<Maybe<BundleSkuList>>>;
  rule_id?: Maybe<Scalars['Int']>;
  simple_action?: Maybe<Scalars['String']>;
  coupon_code?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  from_date?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_qty?: Maybe<Scalars['Int']>;
  discount_step?: Maybe<Scalars['Int']>;
  total_price_with_discount?: Maybe<Scalars['Float']>;
  total_price?: Maybe<Scalars['Float']>;
  total_discount_amount?: Maybe<Scalars['Float']>;
};

export type BundleSkuList = {
  __typename?: 'BundleSkuList';
  sku?: Maybe<Scalars['String']>;
};

export type BurnPointResponse = {
  __typename?: 'BurnPointResponse';
  message?: Maybe<Scalars['String']>;
};

export type ButtonProperty = {
  __typename?: 'ButtonProperty';
  text?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
};

export type ButtonStyle = {
  __typename?: 'ButtonStyle';
  cornerRadius?: Maybe<Scalars['Float']>;
  backgroundColor?: Maybe<Scalars['String']>;
  iconGravity?: Maybe<Scalars['String']>;
  textColor?: Maybe<Scalars['String']>;
  outline?: Maybe<Scalars['Int']>;
  outlineColor?: Maybe<Scalars['String']>;
  textSize?: Maybe<Scalars['Float']>;
  marginRight?: Maybe<Scalars['Int']>;
  marginLeft?: Maybe<Scalars['Int']>;
};

export type Card = {
  __typename?: 'Card';
  id: Scalars['ID'];
  type: CardType;
  masked_number: Scalars['String'];
  is_default: Scalars['Boolean'];
  expiry_month: Scalars['Int'];
  expiry_year: Scalars['Int'];
  bank_id?: Maybe<Scalars['String']>;
  bank_name?: Maybe<Scalars['String']>;
  promo_codes?: Maybe<Array<Maybe<Scalars['String']>>>;
  bank?: Maybe<Bank>;
  created_at?: Maybe<Scalars['DateTime']>;
};

export type CardInput = {
  encrypted_card_data: Scalars['String'];
  is_store_card: Scalars['Boolean'];
  cardholder_name: Scalars['String'];
  expiry_month: Scalars['Int'];
  expiry_year: Scalars['Int'];
};

export type CardSort = {
  id: CardSortIdEnum;
  direction: SortDirection;
};

export enum CardSortIdEnum {
  Id = 'ID',
  CreatedAt = 'CREATED_AT'
}

export enum CardType {
  Visa = 'Visa',
  MasterCard = 'MasterCard',
  Amex = 'AMEX',
  Jcb = 'JCB',
  UnionPay = 'UnionPay',
  Others = 'Others'
}

export type Cart = CartInterface & {
  __typename?: 'Cart';
  id?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  items_count?: Maybe<Scalars['Int']>;
  items_qty?: Maybe<Scalars['Int']>;
  billing_address?: Maybe<CartBillingAddress>;
  extension_attributes?: Maybe<CartExtensionAttributes>;
  totals?: Maybe<CartTotals>;
  guest_id?: Maybe<Scalars['String']>;
  has_gift_wrap: Scalars['Boolean'];
};

export type CartBillingAddress = {
  __typename?: 'CartBillingAddress';
  id?: Maybe<Scalars['Float']>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  region_code?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  telephone?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  vat_id?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Float']>;
  save_in_address_book?: Maybe<Scalars['Float']>;
  customer_id?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<CartBillingAddressExtensionAttributes>;
  custom_attributes?: Maybe<CartBillingAddressCustomAttributes>;
};

export type CartBillingAddressCustomAttributes = {
  __typename?: 'CartBillingAddressCustomAttributes';
  address_line?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['String']>;
  address_line2?: Maybe<Scalars['String']>;
  branch_code?: Maybe<Scalars['String']>;
};

export type CartBillingAddressExtensionAttributes = {
  __typename?: 'CartBillingAddressExtensionAttributes';
  full_tax_request?: Maybe<Scalars['String']>;
};

export type CartExtensionAttributes = {
  __typename?: 'CartExtensionAttributes';
  free_items?: Maybe<Array<Maybe<FreeItem>>>;
  free_items_added?: Maybe<Array<Maybe<FreeItemAdded>>>;
  free_shipping_offer?: Maybe<FreeShippingOffer>;
  shipping_assignments?: Maybe<Array<Maybe<CartExtensionAttributesShippingAssigments>>>;
  order_id?: Maybe<Scalars['String']>;
  /** [PWB] - Check Cart Merge */
  is_split_quote?: Maybe<Scalars['Int']>;
  /** [PWB] - List of child cart */
  children?: Maybe<Array<Maybe<Cart>>>;
  /** [PWB] - Store object when select shipping with store type */
  retailer?: Maybe<Store>;
  /** [SSP] - Free Item Count */
  free_items_qty?: Maybe<Scalars['Int']>;
};

export type CartExtensionAttributesShippingAssigments = {
  __typename?: 'CartExtensionAttributesShippingAssigments';
  shipping?: Maybe<ShippingAssigmentsShipping>;
  items?: Maybe<Array<Maybe<Product>>>;
};

export type CartInterface = {
  id?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  items_count?: Maybe<Scalars['Int']>;
  items_qty?: Maybe<Scalars['Int']>;
  billing_address?: Maybe<CartBillingAddress>;
  extension_attributes?: Maybe<CartExtensionAttributes>;
  totals?: Maybe<CartTotals>;
  guest_id?: Maybe<Scalars['String']>;
  has_gift_wrap: Scalars['Boolean'];
};

export type CartItem = {
  __typename?: 'CartItem';
  base_price_incl_tax?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_percent?: Maybe<Scalars['Float']>;
  extension_attributes?: Maybe<CartItemExtensionAttributes>;
  item_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  options: Array<CartItemOption>;
  parent?: Maybe<Product>;
  price: Scalars['Float'];
  price_incl_tax?: Maybe<Scalars['Float']>;
  product?: Maybe<Product>;
  product_type?: Maybe<Scalars['String']>;
  qty: Scalars['Float'];
  quote_id?: Maybe<Scalars['String']>;
  row_total?: Maybe<Scalars['Float']>;
  row_total_incl_tax?: Maybe<Scalars['Float']>;
  row_total_with_discount?: Maybe<Scalars['Float']>;
  sku: Scalars['String'];
  tax_amount?: Maybe<Scalars['Float']>;
  total_price?: Maybe<Scalars['Float']>;
};

export type CartItemExtensionAttributes = {
  __typename?: 'CartItemExtensionAttributes';
  allocated_store_id: Scalars['Int'];
  configurable_product_labels?: Maybe<Array<Maybe<Scalars['String']>>>;
  free_items?: Maybe<Array<Maybe<FreeItem>>>;
  free_items_added?: Maybe<Array<Maybe<FreeItemAdded>>>;
  line_items?: Maybe<Array<Maybe<CartLineItems>>>;
  parent_quote_item_id?: Maybe<Scalars['String']>;
  parent_sku?: Maybe<Scalars['String']>;
  quote_item_group: Scalars['String'];
  salable_quantity?: Maybe<Scalars['Int']>;
  shipping_assignment?: Maybe<CartItemShippingAssignment>;
};

export type CartItemOption = {
  __typename?: 'CartItemOption';
  value: Scalars['String'];
  label: Scalars['String'];
};

export type CartItemShippingAssignment = {
  __typename?: 'CartItemShippingAssignment';
  shipping_method?: Maybe<Scalars['String']>;
};

export type CartLineItemExtensionAttribute = {
  __typename?: 'CartLineItemExtensionAttribute';
  estimated_lead_times?: Maybe<Array<Maybe<Scalars['JSON']>>>;
  lead_time?: Maybe<Scalars['JSON']>;
  shipping_information?: Maybe<Scalars['JSON']>;
};

export type CartLineItems = {
  __typename?: 'CartLineItems';
  entity_id: Scalars['ID'];
  quote_id: Scalars['Int'];
  line_id: Scalars['Int'];
  line_number: Scalars['Int'];
  extension_attributes?: Maybe<CartLineItemExtensionAttribute>;
};

export type CartMini = CartInterface & {
  __typename?: 'CartMini';
  id?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<CartItem>>>;
  items_count?: Maybe<Scalars['Int']>;
  items_qty?: Maybe<Scalars['Int']>;
  billing_address?: Maybe<CartBillingAddress>;
  extension_attributes?: Maybe<CartExtensionAttributes>;
  totals?: Maybe<CartTotals>;
  guest_id?: Maybe<Scalars['String']>;
  has_gift_wrap: Scalars['Boolean'];
};

export type CartTotals = {
  __typename?: 'CartTotals';
  grand_total?: Maybe<Scalars['Float']>;
  base_grand_total?: Maybe<Scalars['Float']>;
  subtotal?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  subtotal_with_discount?: Maybe<Scalars['Float']>;
  shipping_amount?: Maybe<Scalars['Float']>;
  shipping_discount_amount?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  shipping_tax_amount?: Maybe<Scalars['Float']>;
  subtotal_incl_tax?: Maybe<Scalars['Float']>;
  shipping_incl_tax?: Maybe<Scalars['Float']>;
  extension_attributes?: Maybe<CartTotalsExtensionAttributes>;
  total_segments?: Maybe<Array<Maybe<TotalSegment>>>;
  coupon_code?: Maybe<Scalars['String']>;
};

export type CartTotalsExtensionAttributes = {
  __typename?: 'CartTotalsExtensionAttributes';
  t1c_earn_points_estimate?: Maybe<Scalars['String']>;
  t1c_forgot_password_url?: Maybe<Scalars['String']>;
  reward_points_balance?: Maybe<Scalars['Float']>;
  reward_currency_amount?: Maybe<Scalars['Float']>;
  surcharge?: Maybe<Scalars['String']>;
  t1c_maximum_redeemable_points?: Maybe<Scalars['Int']>;
  cart_summary?: Maybe<CartTotalsExtensionAttributesCartSummary>;
};

export type CartTotalsExtensionAttributesCartSummary = {
  __typename?: 'CartTotalsExtensionAttributesCartSummary';
  other_discount?: Maybe<Scalars['Float']>;
  other_discount_incl_tax?: Maybe<Scalars['Float']>;
  other_discount_tax?: Maybe<Scalars['Float']>;
  t1c_discount?: Maybe<Scalars['Float']>;
  t1c_discount_incl_tax?: Maybe<Scalars['Float']>;
  t1c_discount_tax?: Maybe<Scalars['Float']>;
  coupon_discount?: Maybe<Scalars['Float']>;
  coupon_discount_incl_tax?: Maybe<Scalars['Float']>;
  coupon_discount_tax?: Maybe<Scalars['Float']>;
  total_save?: Maybe<Scalars['Float']>;
  total_save_incl_tax?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  total_shipping_fee?: Maybe<Scalars['Float']>;
  total_shipping_fee_incl_tax?: Maybe<Scalars['Float']>;
};

/** Category */
export type Category = {
  __typename?: 'Category';
  id: Scalars['ID'];
  parent_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['Int']>;
  level?: Maybe<Scalars['Int']>;
  children?: Maybe<Scalars['String']>;
  sub_category?: Maybe<Array<Maybe<Category>>>;
  created_at?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  include_in_menu?: Maybe<Scalars['Boolean']>;
  meta_title?: Maybe<Scalars['String']>;
  meta_keywords?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  children_count?: Maybe<Scalars['Int']>;
  url_key?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
  path?: Maybe<Array<Maybe<Category>>>;
  is_virtual_category?: Maybe<Scalars['String']>;
  virtual_category_root?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  display_mode?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  product_count?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<Scalars['JSON']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  /** extension catalogServiceFilterbyFlashDeal */
  is_hide_display_price?: Maybe<Scalars['Boolean']>;
};

export type CategoryFlat = {
  __typename?: 'CategoryFlat';
  id: Scalars['ID'];
  entity_id: Scalars['String'];
  parent_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  level?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  include_in_menu?: Maybe<Scalars['String']>;
  product_count?: Maybe<Scalars['Int']>;
  children?: Maybe<Scalars['String']>;
  children_count?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
  virtual_category_root?: Maybe<Scalars['String']>;
  image_icon_tablet?: Maybe<Scalars['String']>;
  image_mobile?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  mega_cms_brand?: Maybe<Scalars['String']>;
  mega_cms_banner?: Maybe<Scalars['String']>;
  mega_cms_menu?: Maybe<Scalars['String']>;
  display_mode?: Maybe<Scalars['String']>;
  segment_information?: Maybe<Scalars['String']>;
  children_data?: Maybe<Array<Maybe<CategoryFlat>>>;
};

export type CategoryItem = {
  __typename?: 'CategoryItem';
  breadcrumb?: Maybe<Array<Maybe<Scalars['String']>>>;
  count?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['Int']>;
  level?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type CategoryPath = {
  __typename?: 'CategoryPath';
  category_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  parent_id?: Maybe<Scalars['Int']>;
};

export type CentralSaleRuleMaxDiscountRule = {
  __typename?: 'CentralSaleRuleMaxDiscountRule';
  entity_id?: Maybe<Scalars['Int']>;
  rule_id?: Maybe<Scalars['Int']>;
  max_discount_amount?: Maybe<Scalars['Int']>;
};

export type ChangePasswordInput = {
  currentPassword?: Maybe<Scalars['String']>;
  newPassword?: Maybe<Scalars['String']>;
};

export type ChangePasswordResponse = {
  __typename?: 'ChangePasswordResponse';
  message?: Maybe<Scalars['String']>;
};

export type ClearCacheBySkuInput = {
  sku: Scalars['String'];
  username: Scalars['String'];
  password: Scalars['String'];
};

export type ClearCacheBySkuResponse = {
  __typename?: 'ClearCacheBySkuResponse';
  isSuccess?: Maybe<Scalars['Boolean']>;
};

export type CmsBlock = {
  __typename?: 'CmsBlock';
  id: Scalars['ID'];
  identifier: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  content?: Maybe<Scalars['String']>;
  creation_time?: Maybe<Scalars['String']>;
  update_time?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type CmsContent = {
  __typename?: 'CmsContent';
  status?: Maybe<Scalars['String']>;
  cms_list?: Maybe<Array<Maybe<CmsItem>>>;
};

export type CmsContentDetail = {
  __typename?: 'CmsContentDetail';
  meta?: Maybe<Scalars['JSON']>;
  instagram?: Maybe<Scalars['JSON']>;
  js?: Maybe<Scalars['String']>;
  css?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
};

export type CmsContentObject = {
  __typename?: 'CmsContentObject';
  css?: Maybe<Scalars['String']>;
  html?: Maybe<Scalars['String']>;
  files?: Maybe<CmsFiles>;
  meta?: Maybe<Scalars['JSON']>;
  lang_code?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['String']>;
  contents?: Maybe<Scalars['JSON']>;
};

export type CmsFiles = {
  __typename?: 'CmsFiles';
  js?: Maybe<Scalars['String']>;
  css?: Maybe<Scalars['String']>;
};

export type CmsFilterInput = {
  identifier?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
};

export type CmsItem = {
  __typename?: 'CmsItem';
  identifier?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  languages?: Maybe<CmsLanguageField>;
  contents?: Maybe<CmsContentDetail>;
  page_layout?: Maybe<Scalars['String']>;
  custom_field?: Maybe<Scalars['JSON']>;
  layout_type?: Maybe<Scalars['String']>;
  _id?: Maybe<Scalars['ID']>;
};

export type CmsLanguageField = {
  __typename?: 'CmsLanguageField';
  en?: Maybe<CmsContentObject>;
  th?: Maybe<CmsContentObject>;
};

export type CmsMobileContent = {
  __typename?: 'CMSMobileContent';
  status?: Maybe<Scalars['String']>;
  cms_list?: Maybe<Array<Maybe<CmsMobileItemInterface>>>;
};

export type CmsMobileFilterInput = {
  identifier?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
};

export type CmsMobileItemBanner = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemBanner';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<BannerProperty>;
  items?: Maybe<Array<Maybe<CmsMobileItemInterface>>>;
  data?: Maybe<CmsMobileItemInterface>;
};

export type CmsMobileItemButton = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemButton';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<ButtonProperty>;
  styles?: Maybe<ButtonStyle>;
};

export type CmsMobileItemDivider = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemDivider';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  styles?: Maybe<DividerStyle>;
};

export type CmsMobileItemHeader = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemHeader';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<HeaderProperty>;
};

export type CmsMobileItemImage = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemImage';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<ImageProperty>;
};

export type CmsMobileItemImageLabel = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemImageLabel';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<ImageLabelProperty>;
  styles?: Maybe<ImageLabelStyle>;
};

export type CmsMobileItemInterface = {
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
};

export type CmsMobileItemOneColumnHorizontalCarousel = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemOneColumnHorizontalCarousel';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<OneColumnHorizontalCarouselProperty>;
  items?: Maybe<Array<Maybe<CmsMobileItemInterface>>>;
  data?: Maybe<CmsMobileItemInterface>;
};

export type CmsMobileItemProduct = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemProduct';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<ProductProperty>;
  styles?: Maybe<ProductStyle>;
};

export type CmsMobileItemProductScroll = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemProductScroll';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<ProductScrollProperty>;
  items?: Maybe<Array<Maybe<CmsMobileItemInterface>>>;
  data?: Maybe<CmsMobileItemInterface>;
};

export type CmsMobileItemText = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemText';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<TextProperty>;
  styles?: Maybe<TextStyle>;
};

export type CmsMobileItemTwoColumnVerticalCarousel = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemTwoColumnVerticalCarousel';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<TwoColumnVerticalCarouselProperty>;
  data?: Maybe<CmsMobileItemInterface>;
  items?: Maybe<Array<Maybe<CmsMobileItemInterface>>>;
};

export type CmsMobileItemVideo = CmsMobileItemInterface & {
  __typename?: 'CMSMobileItemVideo';
  viewType?: Maybe<Scalars['String']>;
  deeplink?: Maybe<Scalars['String']>;
  properties?: Maybe<VideoProperty>;
  styles?: Maybe<VideoStyle>;
};

export type CompareProductInput = {
  sku?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type CompareProducts = {
  __typename?: 'CompareProducts';
  attribute_code?: Maybe<Scalars['String']>;
  attribute_label?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<CompareProductsItem>>>;
};

export type CompareProductsItem = {
  __typename?: 'CompareProductsItem';
  sku?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export enum ConditionType {
  Eq = 'eq',
  Finset = 'finset',
  From = 'from',
  Gt = 'gt',
  Gteq = 'gteq',
  In = 'in',
  Like = 'like',
  Lt = 'lt',
  Lteq = 'lteq',
  Moreq = 'moreq',
  Neq = 'neq',
  Nin = 'nin',
  Notnull = 'notnull',
  Null = 'NULL',
  To = 'to'
}

export type ConfigExtensionAttribute = {
  __typename?: 'ConfigExtensionAttribute';
  social_facebook_app_id?: Maybe<Scalars['String']>;
  google_tag_manager_key?: Maybe<Scalars['String']>;
  google_tag_manager_cookies?: Maybe<Array<Maybe<GoogleTagManagerCookieExtensionAttribute>>>;
  review_image_upload?: Maybe<ConfigReviewImageUpload>;
};

export type ConfigReviewImageUpload = {
  __typename?: 'ConfigReviewImageUpload';
  max_number_of_file_upload?: Maybe<Scalars['Int']>;
  max_size_upload?: Maybe<Scalars['Int']>;
  allow_extensions?: Maybe<Array<Maybe<Scalars['String']>>>;
  folder_upload?: Maybe<Scalars['String']>;
};

export type ConfigurableProductOptions = {
  __typename?: 'ConfigurableProductOptions';
  id?: Maybe<Scalars['Int']>;
  attribute_id?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  values?: Maybe<Array<Maybe<ProductOptionsValues>>>;
};

export type Consent = {
  __typename?: 'Consent';
  marketing: Scalars['String'];
  privacy_policy: Scalars['String'];
  version: Scalars['String'];
};

export enum ConsentType {
  Privacy = 'PRIVACY',
  Marketing = 'MARKETING'
}

export type ContactUsInput = {
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  subject?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
};

export type ContactUsResponse = {
  __typename?: 'ContactUsResponse';
  success?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type Coordinate = {
  __typename?: 'Coordinate';
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
};

export type CouponCampaignResponse = {
  __typename?: 'CouponCampaignResponse';
  rule: CouponRuleData;
  remaining_count: Scalars['Int'];
  coupon_image: Scalars['String'];
};

export type CouponDiscount = {
  __typename?: 'CouponDiscount';
  discount_amount?: Maybe<Scalars['Float']>;
  discount_amount_formatted?: Maybe<Scalars['String']>;
  coupon_code?: Maybe<Scalars['String']>;
};

export type CouponInput = {
  campaignId: Scalars['Int'];
  page: Scalars['Int'];
  batch: Scalars['Int'];
};

export type CouponResponse = {
  __typename?: 'CouponResponse';
  rules?: Maybe<Array<Maybe<CouponRule>>>;
  current_page: Scalars['Int'];
  total_page: Scalars['Int'];
  total_count: Scalars['Int'];
};

export type CouponRule = {
  __typename?: 'CouponRule';
  rule?: Maybe<CouponRuleData>;
  current_coupon?: Maybe<Scalars['String']>;
  remaining_count?: Maybe<Scalars['Int']>;
  coupon_expiration_date?: Maybe<Scalars['String']>;
  time_used?: Maybe<Scalars['Int']>;
};

export type CouponRuleActionCondition = {
  __typename?: 'CouponRuleActionCondition';
  condition_type?: Maybe<Scalars['String']>;
  aggregator_type?: Maybe<Scalars['String']>;
  operator?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CouponRuleCondition = {
  __typename?: 'CouponRuleCondition';
  condition_type?: Maybe<Scalars['String']>;
  conditions?: Maybe<Array<Maybe<CouponRuleConditionData>>>;
  aggregator_type?: Maybe<Scalars['String']>;
  operator?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CouponRuleConditionData = {
  __typename?: 'CouponRuleConditionData';
  condition_type?: Maybe<Scalars['String']>;
  operator?: Maybe<Scalars['String']>;
  attribute_name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type CouponRuleData = {
  __typename?: 'CouponRuleData';
  rule_id: Scalars['ID'];
  name: Scalars['String'];
  store_labels?: Maybe<Array<Maybe<Scalars['String']>>>;
  description?: Maybe<Scalars['String']>;
  website_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  customer_group_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  from_date?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['String']>;
  uses_per_customer?: Maybe<Scalars['Int']>;
  is_active?: Maybe<Scalars['Boolean']>;
  condition?: Maybe<CouponRuleCondition>;
  action_condition?: Maybe<CouponRuleActionCondition>;
  stop_rules_processing?: Maybe<Scalars['Boolean']>;
  is_advanced?: Maybe<Scalars['Boolean']>;
  sort_order?: Maybe<Scalars['Int']>;
  simple_action?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Int']>;
  discount_step?: Maybe<Scalars['Int']>;
  apply_to_shipping?: Maybe<Scalars['Boolean']>;
  times_used?: Maybe<Scalars['Int']>;
  is_rss?: Maybe<Scalars['Boolean']>;
  coupon_type?: Maybe<Scalars['String']>;
  use_auto_generation?: Maybe<Scalars['Boolean']>;
  uses_per_coupon?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<CouponRuleExtendsionAttributes>;
  promotion_mdid?: Maybe<Scalars['Int']>;
};

export type CouponRuleExtendsionAttributes = {
  __typename?: 'CouponRuleExtendsionAttributes';
  term_and_condition?: Maybe<Scalars['String']>;
  coupon_image?: Maybe<Scalars['String']>;
  reward_points_delta?: Maybe<Scalars['Int']>;
  ampromo_rule?: Maybe<AmPromotionRule>;
  amrules?: Maybe<AmRule>;
  t1c_special_rate?: Maybe<T1cSpecialRate>;
  central_salesrulemaxdiscount_rule?: Maybe<CentralSaleRuleMaxDiscountRule>;
  discount_code?: Maybe<Scalars['String']>;
  promotion_mdid?: Maybe<Scalars['String']>;
};

export type CreateCustomerAddress = {
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  telephone: Scalars['String'];
  building?: Maybe<Scalars['String']>;
  address_line: Scalars['String'];
  subdistrict: PlaceInput;
  district: PlaceInput;
  province: PlaceInput;
  postcode: Scalars['String'];
  address_name?: Maybe<Scalars['String']>;
  customer_address_type: AddressType;
  full_tax_type?: Maybe<TaxType>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  is_default_billing?: Maybe<Scalars['Boolean']>;
  is_default_shipping?: Maybe<Scalars['Boolean']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  /** deprecated, for backword compatability only */
  street?: Maybe<Array<Scalars['String']>>;
  /** deprecated, for backword compatability only */
  city?: Maybe<Scalars['String']>;
};

export type CreateWishlistInput = {
  name?: Maybe<Scalars['String']>;
  customer_id: Scalars['Int'];
  items: Array<Maybe<ItemInput>>;
};

export type CreateWishlistItemInput = {
  wishlist_id?: Maybe<Scalars['Int']>;
  product_id: Scalars['Int'];
  store_id?: Maybe<Scalars['Int']>;
  qty?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Array<Maybe<CustomAttributesInput>>>;
};

export type CreditCardPromotion = {
  __typename?: 'CreditCardPromotion';
  promotion_id?: Maybe<Scalars['Int']>;
  bank_icon?: Maybe<Scalars['String']>;
  bank_color?: Maybe<Scalars['String']>;
  rule_id?: Maybe<Scalars['Int']>;
  simple_action?: Maybe<Scalars['String']>;
  coupon_code?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  from_date?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_qty?: Maybe<Scalars['Int']>;
  discount_step?: Maybe<Scalars['Int']>;
};

export type CustomAttributes = {
  __typename?: 'CustomAttributes';
  attribute_code?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CustomAttributesInput = {
  attribute_code?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Customer = {
  __typename?: 'Customer';
  id: Scalars['ID'];
  group_id?: Maybe<Scalars['Int']>;
  created_at?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  created_in?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['String']>;
  default_shipping?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  /** @deprecated Use `tax_id` instead */
  taxvat?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  store_id?: Maybe<Scalars['Int']>;
  website_id?: Maybe<Scalars['Int']>;
  addresses: Array<CustomerAddress>;
  disable_auto_group_change?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<CustomerExtensionAttributes>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  message?: Maybe<Scalars['String']>;
  is_subscribed: Scalars['Boolean'];
  phone?: Maybe<Scalars['String']>;
  tax_id?: Maybe<Scalars['String']>;
  t1c_no?: Maybe<Scalars['String']>;
  t1c_phone?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  need_reaccept_consents: Scalars['Boolean'];
};

export type CustomerAddress = {
  __typename?: 'CustomerAddress';
  id: Scalars['ID'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  telephone: Scalars['String'];
  building?: Maybe<Scalars['String']>;
  address_line: Scalars['String'];
  subdistrict: Place;
  district: Place;
  province: Place;
  postcode: Scalars['String'];
  address_name?: Maybe<Scalars['String']>;
  customer_address_type: AddressType;
  full_tax_type?: Maybe<TaxType>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  country_id: Scalars['String'];
  is_default_billing: Scalars['Boolean'];
  is_default_shipping: Scalars['Boolean'];
  city?: Maybe<Scalars['String']>;
  /** @deprecated Use `province.id` instead */
  region_id?: Maybe<Scalars['String']>;
  /** @deprecated Use `province` instead */
  region?: Maybe<Region>;
  /** @deprecated Use `parent.id` instead */
  customer_id?: Maybe<Scalars['Int']>;
  /** @deprecated Use `is_default_billing` instead */
  default_billing?: Maybe<Scalars['Boolean']>;
  /** @deprecated Use `is_default_shipping` instead */
  default_shipping?: Maybe<Scalars['Boolean']>;
  /** @deprecated This field is for compatibility with CustomerAddress only */
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** @deprecated All mandatory field is moved to the Address, only use this field when you have special requirement for address */
  custom_attributes?: Maybe<Scalars['JSON']>;
};

export type CustomerAddressCustomAttributesInput = {
  tel_mobile?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  house_no?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
};

export type CustomerAddressCustomAttributesResult = {
  __typename?: 'CustomerAddressCustomAttributesResult';
  tel_mobile?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  house_no?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
};

export type CustomerAddressResult = {
  __typename?: 'CustomerAddressResult';
  id?: Maybe<Scalars['Int']>;
  customer_id?: Maybe<Scalars['Int']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
};

export type CustomerCouponInput = {
  campaignId: Scalars['Int'];
  customer_id?: Maybe<Scalars['Int']>;
  page: Scalars['Int'];
  batch: Scalars['Int'];
};

export type CustomerExtensionAttributes = {
  __typename?: 'CustomerExtensionAttributes';
  is_subscribed?: Maybe<Scalars['Boolean']>;
};


export type DeleteCouponResponse = {
  __typename?: 'DeleteCouponResponse';
  message?: Maybe<Scalars['String']>;
};

export type DeleteCustomerAddress = {
  address_id?: Maybe<Scalars['Int']>;
};

export type DeleteCustomerAddressResult = {
  __typename?: 'DeleteCustomerAddressResult';
  is_success?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
};

export type DeleteGiftWrapMessageInput = {
  isGuest: Scalars['Boolean'];
  cartId?: Maybe<Scalars['String']>;
};

export type DeleteImageInput = {
  path: Scalars['String'];
};

export type DeleteItemStatus = {
  __typename?: 'DeleteItemStatus';
  success?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
};

export type DeletePointResponse = {
  __typename?: 'DeletePointResponse';
  message?: Maybe<Scalars['String']>;
};

export type DeliveryOptionItem = {
  __typename?: 'DeliveryOptionItem';
  shipping_method?: Maybe<Scalars['String']>;
  delivery_lead_time_message?: Maybe<Scalars['String']>;
  delivery_free_message?: Maybe<Scalars['String']>;
  shipping_fee?: Maybe<Scalars['String']>;
  shipping_method_label?: Maybe<Scalars['String']>;
};

export type DeliveryStatusHistory = {
  __typename?: 'DeliveryStatusHistory';
  status?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
};

export type District = {
  __typename?: 'District';
  district_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  region_code?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  default_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Array<Maybe<SubDistrict>>>;
};

export type DividerStyle = {
  __typename?: 'DividerStyle';
  height?: Maybe<Scalars['Int']>;
  color?: Maybe<Scalars['String']>;
  marginLeft?: Maybe<Scalars['Int']>;
  marginRight?: Maybe<Scalars['Int']>;
};

export type EditCartItemExtensionAttribute = {
  allocated_store_id: Scalars['Int'];
  pickup_store?: Maybe<PickupStoreInput>;
  quote_item_group: QuoteItemGroup;
  shipping_assignment?: Maybe<EditCartItemShippingAssignment>;
};

export type EditCartItemInput = {
  qty: Scalars['Int'];
  quote_id: Scalars['String'];
  extension_attributes?: Maybe<EditCartItemExtensionAttribute>;
};

export type EditCartItemResponse = {
  __typename?: 'EditCartItemResponse';
  item_id?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  product_type?: Maybe<Scalars['String']>;
  quote_id?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<Scalars['JSON']>;
};

export type EditCartItemShippingAssignment = {
  shipping_method?: Maybe<Scalars['String']>;
};

export type EditCustomerAddress = {
  id: Scalars['ID'];
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  subdistrict: PlaceInput;
  district: PlaceInput;
  province?: Maybe<PlaceInput>;
  postcode?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  customer_address_type: AddressType;
  full_tax_type?: Maybe<TaxType>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  is_default_billing?: Maybe<Scalars['Boolean']>;
  is_default_shipping?: Maybe<Scalars['Boolean']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  /** deprecated, for backword compatability only */
  street?: Maybe<Array<Scalars['String']>>;
  /** deprecated, for backword compatability only */
  city?: Maybe<Scalars['String']>;
};

export type EstimateShippingInput = {
  customer_id?: Maybe<Scalars['Int']>;
  region?: Maybe<Scalars['String']>;
  region_id: Scalars['Int'];
  country_id: Scalars['String'];
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  telephone?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  custom_attributes?: Maybe<Array<Maybe<CustomAttributesInput>>>;
};

export type EstimateShippingMethods = {
  __typename?: 'EstimateShippingMethods';
  method?: Maybe<Scalars['String']>;
  method_caption?: Maybe<Scalars['String']>;
  method_code?: Maybe<Scalars['String']>;
  fastest_method?: Maybe<Scalars['String']>;
  fastest_method_caption?: Maybe<Scalars['String']>;
  free_method?: Maybe<Scalars['String']>;
  free_method_cost?: Maybe<Scalars['String']>;
  shipping_method?: Maybe<Array<Maybe<ShippingMethods>>>;
};

export type ExtensionAttributes = {
  __typename?: 'extensionAttributes';
  image_dir?: Maybe<Scalars['String']>;
  slides?: Maybe<Array<Maybe<Slides>>>;
};

export type FilterGroups = {
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type Filters = {
  field: Scalars['String'];
  value: Scalars['String'];
  conditionType?: Maybe<ConditionType>;
};

export type FiltersQuery = {
  page?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['Int']>;
  filterGroups?: Maybe<Array<Maybe<FilterGroups>>>;
  sortOrders?: Maybe<Array<Maybe<SortOrder>>>;
};

export type FreeItem = {
  __typename?: 'FreeItem';
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
  cart_id?: Maybe<Scalars['String']>;
  sales_rule_id?: Maybe<Scalars['Int']>;
  sales_rule_action_type?: Maybe<Scalars['Int']>;
  sales_rule_action_apply?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
};

export type FreeItemAdded = {
  __typename?: 'FreeItemAdded';
  quote_id?: Maybe<Scalars['Int']>;
  item_id?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  sales_rule_id?: Maybe<Scalars['Int']>;
  qty?: Maybe<Scalars['Int']>;
  intent_qty?: Maybe<Scalars['Int']>;
  for_item_id?: Maybe<Scalars['Int']>;
  associated_item_id?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
};

export type FreeItemProduct = {
  __typename?: 'FreeItemProduct';
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
};

export type FreeItemPromotion = {
  __typename?: 'FreeItemPromotion';
  freebies?: Maybe<Array<Maybe<FreeItemProduct>>>;
  rule_id?: Maybe<Scalars['Int']>;
  simple_action?: Maybe<Scalars['String']>;
  coupon_code?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  from_date?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_qty?: Maybe<Scalars['Int']>;
  discount_step?: Maybe<Scalars['Int']>;
};

export type FreeShippingOffer = {
  __typename?: 'FreeShippingOffer';
  message?: Maybe<Scalars['String']>;
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER'
}

export type GetCustomerAddress = {
  address_id: Scalars['String'];
};

export type GetRetailerByIdInput = {
  id: Scalars['Int'];
};

export type GetRetailerByPostcodeInput = {
  postcode: Scalars['String'];
};

export type GoogleTagManagerCookieExtensionAttribute = {
  __typename?: 'GoogleTagManagerCookieExtensionAttribute';
  identifier?: Maybe<Scalars['String']>;
  experiment_id?: Maybe<Scalars['String']>;
  cookie_variant_id?: Maybe<Scalars['String']>;
  request_header_value?: Maybe<Scalars['String']>;
};

export type GuestCartResponse = {
  __typename?: 'GuestCartResponse';
  id: Scalars['ID'];
};

export type HeaderProperty = {
  __typename?: 'HeaderProperty';
  text?: Maybe<Scalars['String']>;
  viewAll?: Maybe<Scalars['Boolean']>;
};

export type ImageLabelProperty = {
  __typename?: 'ImageLabelProperty';
  text?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ImageLabelStyle = {
  __typename?: 'ImageLabelStyle';
  backgroundColor?: Maybe<Scalars['String']>;
};

export type ImagePath = {
  __typename?: 'ImagePath';
  path: Scalars['String'];
};

export type ImageProperty = {
  __typename?: 'ImageProperty';
  url?: Maybe<Scalars['String']>;
};

export type InputImagePath = {
  path: Scalars['String'];
};

export type InstallmentBank = {
  __typename?: 'InstallmentBank';
  bank_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  bank_image?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
  update?: Maybe<Scalars['String']>;
};

export type InstallmentPlan = InstallmentPlanInterface & {
  __typename?: 'InstallmentPlan';
  installmentplan_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['Int']>;
  bank?: Maybe<InstallmentBank>;
  currency?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  merchant_rate?: Maybe<Scalars['String']>;
  customer_rate?: Maybe<Scalars['String']>;
  interest_type?: Maybe<Scalars['String']>;
  installment_type?: Maybe<Scalars['String']>;
  min_amount?: Maybe<Scalars['String']>;
  max_amount?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['String']>;
  valid_from?: Maybe<Scalars['String']>;
  valid_until?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
};

export type InstallmentPlanInterface = {
  installmentplan_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['Int']>;
  bank?: Maybe<InstallmentBank>;
  currency?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  merchant_rate?: Maybe<Scalars['String']>;
  customer_rate?: Maybe<Scalars['String']>;
  interest_type?: Maybe<Scalars['String']>;
  installment_type?: Maybe<Scalars['String']>;
  min_amount?: Maybe<Scalars['String']>;
  max_amount?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['String']>;
  valid_from?: Maybe<Scalars['String']>;
  valid_until?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
};

export type IsSalable = {
  __typename?: 'IsSalable';
  status?: Maybe<Scalars['Boolean']>;
};

export type ItemInput = {
  product_id: Scalars['Int'];
  store_id?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  qty: Scalars['String'];
};


export type LazyRegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  is_subscribed?: Maybe<Scalars['Boolean']>;
  storeId?: Maybe<Scalars['Int']>;
  orderId: Scalars['Int'];
  accept_consents?: Maybe<Array<ConsentType>>;
};

export type LoginInput = {
  username: Scalars['String'];
  password: Scalars['String'];
  guestToken?: Maybe<Scalars['String']>;
  is_jwt?: Maybe<Scalars['Boolean']>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  token?: Maybe<Scalars['String']>;
};

export type LoginT1CInput = {
  email?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type MarketplaceInfo = {
  __typename?: 'MarketplaceInfo';
  seller_info?: Maybe<SellerInfo>;
};

export type MarketPlaceSeller = {
  __typename?: 'MarketPlaceSeller';
  /** seller name (product.custom_attributes_option[attribute_code = 'marketplace_seller']) */
  seller_id?: Maybe<Scalars['ID']>;
  seller?: Maybe<Scalars['String']>;
  seller_url_key?: Maybe<Scalars['String']>;
};

export type MediaGalleryEntry = {
  __typename?: 'MediaGalleryEntry';
  disabled?: Maybe<Scalars['Boolean']>;
  file?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  label?: Maybe<Scalars['String']>;
  media_type?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
  extension_attributes?: Maybe<MediaGalleryExtension>;
};

export type MediaGalleryExtension = {
  __typename?: 'MediaGalleryExtension';
  video_content?: Maybe<VideoContent>;
};

export type Metadata = {
  __typename?: 'Metadata';
  row_id?: Maybe<Scalars['ID']>;
  entity_id?: Maybe<Scalars['ID']>;
  attribute_set_id?: Maybe<Scalars['ID']>;
  parent_id?: Maybe<Scalars['ID']>;
  path?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['String']>;
  children_count?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
  product_count?: Maybe<Scalars['String']>;
  is_anchor?: Maybe<Scalars['String']>;
};

export type MultipleInfoInput = {
  cart_id?: Maybe<Scalars['String']>;
  payment_method: PaymentMethodInput;
  billing_address?: Maybe<AddressInput>;
};

export type MultipleInformationFormat = {
  payment_information?: Maybe<Array<Scalars['JSON']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCartItem?: Maybe<AddToCartResponse>;
  addCoupon?: Maybe<AddCouponResponse>;
  addCustomerAddress?: Maybe<CustomerAddress>;
  addGiftWrapMessage?: Maybe<ResponseMessage>;
  addReview?: Maybe<ReviewResponse>;
  assignCoupon?: Maybe<AssignCouponResponse>;
  assignCouponCampaign?: Maybe<AssignCouponCampaignResponse>;
  burnPoint?: Maybe<BurnPointResponse>;
  changePassword?: Maybe<ChangePasswordResponse>;
  clearCacheBySku?: Maybe<ClearCacheBySkuResponse>;
  consent?: Maybe<Customer>;
  contactUs?: Maybe<ContactUsResponse>;
  createCard: Card;
  createWishlist?: Maybe<Wishlist>;
  createWishlistItem?: Maybe<WishlistItem>;
  deleteCard?: Maybe<Scalars['Boolean']>;
  deleteCartItem?: Maybe<DeleteItemStatus>;
  deleteCoupon?: Maybe<DeleteCouponResponse>;
  deleteCustomerAddress?: Maybe<DeleteCustomerAddressResult>;
  deleteGiftWrapMessage?: Maybe<ResponseMessage>;
  deletePoint?: Maybe<DeletePointResponse>;
  deleteReviewImage?: Maybe<Scalars['Boolean']>;
  deleteWishlist?: Maybe<Array<Maybe<Scalars['String']>>>;
  deleteWishlistItem?: Maybe<Array<Maybe<Scalars['String']>>>;
  editCartItem?: Maybe<EditCartItemResponse>;
  editCustomerAddress?: Maybe<CustomerAddress>;
  estimateShippingMethods?: Maybe<Array<Maybe<ShippingMethods>>>;
  facebookLogin?: Maybe<LoginResponse>;
  forgotPassword?: Maybe<ResponseMessage>;
  hello: Scalars['String'];
  lazyRegister?: Maybe<Register>;
  login?: Maybe<LoginResponse>;
  loginT1?: Maybe<TheOneAccountInfo>;
  newsletter?: Maybe<Scalars['String']>;
  register?: Maybe<Register>;
  repayment: SetPaymentInfoResponse;
  resetPassword?: Maybe<ResponseMessage>;
  restoreShippingAssignment?: Maybe<ResponseMessage>;
  setDefaultCard: Card;
  setPaymentInformation?: Maybe<SetPaymentInfoResponse>;
  setShippingInformation?: Maybe<ResponseMessage>;
  setShippingSlotHdl?: Maybe<ResponseMessage>;
  socialLogin?: Maybe<LoginResponse>;
  subscribe?: Maybe<Subscribe>;
  updateCustomer?: Maybe<Customer>;
  updateMultiplePaymentInformation?: Maybe<SetMultiPaymentResponse>;
  updatePaymentInformation?: Maybe<SetPaymentInfoResponse>;
  updateWishlist?: Maybe<Wishlist>;
  updateWishlistItem?: Maybe<WishlistItem>;
  uploadReviewImage?: Maybe<UploadImageResponse>;
  v2SetShippingInformation?: Maybe<ResponseMessage>;
  vipInterest?: Maybe<VipInterestResponse>;
  vipNeedAssistance?: Maybe<VipNeedAssistanceResponse>;
  vipValidate?: Maybe<VipValidateResponse>;
};


export type MutationAddCartItemArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  input: AddToCartInput;
  cartId?: Maybe<Scalars['String']>;
};


export type MutationAddCouponArgs = {
  coupon?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type MutationAddCustomerAddressArgs = {
  input?: Maybe<CreateCustomerAddress>;
};


export type MutationAddGiftWrapMessageArgs = {
  input: AddGiftWrapMessageInput;
};


export type MutationAddReviewArgs = {
  storeCode?: Maybe<Scalars['String']>;
  input: ReviewInput;
};


export type MutationAssignCouponArgs = {
  input: AssignCouponInput;
};


export type MutationAssignCouponCampaignArgs = {
  input: AssignCouponCampaignInput;
};


export type MutationBurnPointArgs = {
  points: Scalars['Int'];
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type MutationChangePasswordArgs = {
  input?: Maybe<ChangePasswordInput>;
};


export type MutationClearCacheBySkuArgs = {
  input?: Maybe<ClearCacheBySkuInput>;
};


export type MutationConsentArgs = {
  input: AcceptConsentInput;
};


export type MutationContactUsArgs = {
  storeCode?: Maybe<Scalars['String']>;
  input: ContactUsInput;
};


export type MutationCreateCardArgs = {
  cardInput: CardInput;
  setDefault: Scalars['Boolean'];
};


export type MutationCreateWishlistArgs = {
  input?: Maybe<CreateWishlistInput>;
};


export type MutationCreateWishlistItemArgs = {
  input?: Maybe<CreateWishlistItemInput>;
  customer_id?: Maybe<Scalars['Int']>;
};


export type MutationDeleteCardArgs = {
  cardId: Scalars['String'];
};


export type MutationDeleteCartItemArgs = {
  guest?: Maybe<Scalars['String']>;
  item_id: Scalars['String'];
};


export type MutationDeleteCouponArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type MutationDeleteCustomerAddressArgs = {
  input?: Maybe<DeleteCustomerAddress>;
};


export type MutationDeleteGiftWrapMessageArgs = {
  input: DeleteGiftWrapMessageInput;
};


export type MutationDeletePointArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type MutationDeleteReviewImageArgs = {
  input: DeleteImageInput;
};


export type MutationDeleteWishlistArgs = {
  id: Scalars['Int'];
};


export type MutationDeleteWishlistItemArgs = {
  id: Scalars['Int'];
};


export type MutationEditCartItemArgs = {
  id?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  item_id: Scalars['String'];
  input: EditCartItemInput;
};


export type MutationEditCustomerAddressArgs = {
  input?: Maybe<EditCustomerAddress>;
};


export type MutationEstimateShippingMethodsArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: EstimateShippingInput;
};


export type MutationFacebookLoginArgs = {
  social_id: Scalars['String'];
  customerToken?: Maybe<Scalars['String']>;
};


export type MutationForgotPasswordArgs = {
  storeCode?: Maybe<Scalars['String']>;
  email: Scalars['String'];
};


export type MutationLazyRegisterArgs = {
  input: LazyRegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLoginT1Args = {
  input?: Maybe<LoginT1CInput>;
  isGuest?: Maybe<Scalars['Boolean']>;
  guestToken?: Maybe<Scalars['String']>;
};


export type MutationNewsletterArgs = {
  email: Scalars['String'];
  optional?: Maybe<NewsletterOptional>;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRepaymentArgs = {
  incrementId: Scalars['String'];
  card?: Maybe<CardInput>;
  saved_card?: Maybe<SavedCardInput>;
};


export type MutationResetPasswordArgs = {
  input?: Maybe<ResetPasswordInput>;
};


export type MutationRestoreShippingAssignmentArgs = {
  input: RestoreShippingAssignmentInput;
};


export type MutationSetDefaultCardArgs = {
  cardId: Scalars['String'];
};


export type MutationSetPaymentInformationArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: PaymentInformationInput;
};


export type MutationSetShippingInformationArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: SetShippingInformationInput;
};


export type MutationSetShippingSlotHdlArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: SetShippingSlotHdlInput;
};


export type MutationSocialLoginArgs = {
  input: SocialLoginInput;
};


export type MutationSubscribeArgs = {
  email: Scalars['String'];
};


export type MutationUpdateCustomerArgs = {
  input?: Maybe<UpdateInputCustomer>;
};


export type MutationUpdateMultiplePaymentInformationArgs = {
  input: MultipleInformationFormat;
};


export type MutationUpdatePaymentInformationArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: PaymentInformationInput;
};


export type MutationUpdateWishlistArgs = {
  input?: Maybe<UpdateWishlistInput>;
};


export type MutationUpdateWishlistItemArgs = {
  input?: Maybe<UpdateWishlistItemInput>;
};


export type MutationUploadReviewImageArgs = {
  input: UploadImageInput;
};


export type MutationV2SetShippingInformationArgs = {
  cartId?: Maybe<Scalars['String']>;
  input: V2SetShippingInformationInput;
};


export type MutationVipInterestArgs = {
  input: VipInterestInput;
};


export type MutationVipNeedAssistanceArgs = {
  input: VipNeedAssistanceInput;
};


export type MutationVipValidateArgs = {
  input: VipValidateInput;
};

export type Newsletter = {
  __typename?: 'Newsletter';
  result?: Maybe<Scalars['String']>;
};

export type NewsletterOptional = {
  gender?: Maybe<Gender>;
};

export type OneColumnHorizontalCarouselProperty = {
  __typename?: 'OneColumnHorizontalCarouselProperty';
  title?: Maybe<Scalars['String']>;
  maxItemsSize?: Maybe<Scalars['Int']>;
  minimumVisible?: Maybe<Scalars['Int']>;
};

export type OpenHourExtension = {
  __typename?: 'OpenHourExtension';
  start_time?: Maybe<Scalars['String']>;
  end_time?: Maybe<Scalars['String']>;
};

export type Order = {
  __typename?: 'Order';
  billing_address?: Maybe<BillingAddress>;
  children?: Maybe<Array<Order>>;
  coupon_code?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['String']>;
  customer_email?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_description?: Maybe<Scalars['String']>;
  entity_id?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<OrderExtensionAttributes>;
  grand_total?: Maybe<Scalars['Float']>;
  increment_id?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  order_currency_code?: Maybe<Scalars['String']>;
  payment?: Maybe<Payment>;
  promotion_code?: Maybe<Scalars['String']>;
  shipment?: Maybe<Array<ShipmentTrackingItem>>;
  shipping_description?: Maybe<Scalars['String']>;
  shipping_incl_tax?: Maybe<Scalars['Float']>;
  state?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  status_histories?: Maybe<Array<Maybe<StatusHistories>>>;
  subtotal?: Maybe<Scalars['Float']>;
  subtotal_incl_tax?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  total_due?: Maybe<Scalars['Float']>;
};

export type OrderExtensionAttributes = {
  __typename?: 'OrderExtensionAttributes';
  shipping_assignments?: Maybe<Array<Maybe<ShippingAssignment>>>;
  payment_method_label?: Maybe<Scalars['String']>;
  order_status?: Maybe<Scalars['String']>;
  delivery_status_history?: Maybe<Array<Maybe<DeliveryStatusHistory>>>;
  mom_status_reason?: Maybe<Scalars['String']>;
  retailer?: Maybe<Store>;
  shipping_slot?: Maybe<ShippingSlot>;
  t1c_redeem?: Maybe<T1cRedeem>;
  gift_cards_amount?: Maybe<Scalars['Int']>;
  order_children_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  /** @deprecated Use Extenstions orderWithOrderChildrenItems with field `Order.children` instead */
  order_children_items?: Maybe<Array<Maybe<Order>>>;
  coupon?: Maybe<CouponDiscount>;
  keep_at_store_hours?: Maybe<Scalars['Int']>;
  shipping_method_label?: Maybe<Scalars['String']>;
  order_package_status?: Maybe<Array<Maybe<OrderPackageStatus>>>;
  bts_order_status?: Maybe<Array<BtsOrderStatus>>;
};

export type OrderFilter = {
  field?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  product_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
  store_id?: Maybe<Scalars['Int']>;
  qty_ordered?: Maybe<Scalars['Float']>;
  qty_canceled?: Maybe<Scalars['Float']>;
  price?: Maybe<Scalars['Float']>;
  price_incl_tax?: Maybe<Scalars['Float']>;
  row_total?: Maybe<Scalars['Float']>;
  row_total_incl_tax?: Maybe<Scalars['Float']>;
  tax_amount?: Maybe<Scalars['Float']>;
  tax_canceled?: Maybe<Scalars['Float']>;
  base_discount_amount?: Maybe<Scalars['Float']>;
  base_discount_invoiced?: Maybe<Scalars['Float']>;
  base_discount_tax_compensation_amount?: Maybe<Scalars['Float']>;
  base_original_price?: Maybe<Scalars['Float']>;
  base_price?: Maybe<Scalars['Float']>;
  base_price_incl_tax?: Maybe<Scalars['Float']>;
  base_row_invoiced?: Maybe<Scalars['Float']>;
  base_row_total?: Maybe<Scalars['Float']>;
  base_row_total_incl_tax?: Maybe<Scalars['Float']>;
  base_tax_amount?: Maybe<Scalars['Float']>;
  base_tax_invoiced?: Maybe<Scalars['Float']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_invoiced?: Maybe<Scalars['Float']>;
  discount_percent?: Maybe<Scalars['Float']>;
  discount_tax_compensation_amount?: Maybe<Scalars['Float']>;
  discount_tax_compensation_canceled?: Maybe<Scalars['Float']>;
  original_price?: Maybe<Scalars['Float']>;
  store_code?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  small_image?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<ProductsCustomAttributes>;
  product?: Maybe<Product>;
  extension_attributes?: Maybe<OrderItemExtensionAttributes>;
};

export type OrderItemExtensionAttributes = {
  __typename?: 'OrderItemExtensionAttributes';
  line_items?: Maybe<Array<OrderLineItem>>;
  marketplace_info?: Maybe<MarketplaceInfo>;
};

export type OrderLineItem = {
  __typename?: 'OrderLineItem';
  entity_id?: Maybe<Scalars['Int']>;
  order_id?: Maybe<Scalars['Int']>;
  line_id?: Maybe<Scalars['Int']>;
  line_number?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<OrderLineItemExtensionAttributes>;
};

export type OrderLineItemExtensionAttributes = {
  __typename?: 'OrderLineItemExtensionAttributes';
  status: Scalars['String'];
  package_id?: Maybe<Scalars['String']>;
  carrier?: Maybe<Scalars['String']>;
  tracking_number?: Maybe<Scalars['String']>;
  tracking_link?: Maybe<Scalars['String']>;
};

export type OrderPackageStatus = {
  __typename?: 'OrderPackageStatus';
  shipment_provider?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  track_url?: Maybe<Scalars['String']>;
  track_number?: Maybe<Scalars['String']>;
  sold_by?: Maybe<Scalars['String']>;
};

export type Orders = {
  __typename?: 'Orders';
  items?: Maybe<Array<Maybe<Order>>>;
  total_count?: Maybe<Scalars['Int']>;
};

export type OrderSearchCriteria = {
  filters?: Maybe<Array<Maybe<OrderFilter>>>;
  sortOrders?: Maybe<Array<Maybe<OrderSort>>>;
  pageSize?: Maybe<Scalars['Int']>;
  currentPage?: Maybe<Scalars['Int']>;
};

export type OrderSearchResult = {
  __typename?: 'OrderSearchResult';
  orders?: Maybe<Array<Maybe<Order>>>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type OrderSort = {
  field?: Maybe<Scalars['String']>;
  direction?: Maybe<Scalars['String']>;
};

export type P2c2pCreditCardPromotion = {
  __typename?: 'P2c2pCreditCardPromotion';
  promotion_id?: Maybe<Scalars['String']>;
  bank?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  card_image?: Maybe<Scalars['String']>;
  card_type?: Maybe<Scalars['String']>;
  card_name?: Maybe<Scalars['String']>;
  banner?: Maybe<Scalars['String']>;
  promotion_code?: Maybe<Scalars['String']>;
  payment_method?: Maybe<Scalars['String']>;
  ipp_plan?: Maybe<Scalars['String']>;
  bank_color?: Maybe<Scalars['String']>;
  bank_icon?: Maybe<Scalars['String']>;
  simple_action?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['String']>;
};

export type P2c2pPaymentAgent = {
  __typename?: 'P2c2pPaymentAgent';
  agent_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  agent_image?: Maybe<Scalars['String']>;
};

export type P2c2pPaymentOption = {
  __typename?: 'P2c2pPaymentOption';
  payment?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
};

export type Payment = {
  __typename?: 'Payment';
  method?: Maybe<Scalars['String']>;
};

export type PaymentDolfinDetail = {
  __typename?: 'PaymentDolfinDetail';
  qrValue?: Maybe<Scalars['String']>;
  qrCodeImage?: Maybe<Scalars['String']>;
};

export type PaymentDolfinResponse = {
  __typename?: 'PaymentDolfinResponse';
  isSuccess?: Maybe<Scalars['Boolean']>;
  incrementId?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  failReason?: Maybe<Scalars['Int']>;
  detail?: Maybe<PaymentDolfinDetail>;
};

export type PaymentExtensionAttributes = {
  __typename?: 'PaymentExtensionAttributes';
  is_payment_promotion_locked: Scalars['Boolean'];
  company_credit_available?: Maybe<Scalars['Boolean']>;
  company_credit_message?: Maybe<Scalars['String']>;
  p2c2p_payment_options?: Maybe<Array<Maybe<P2c2pPaymentOption>>>;
  p2c2p_installment_unavailable_message?: Maybe<Scalars['String']>;
  p2c2p_payment_agents?: Maybe<Array<Maybe<P2c2pPaymentAgent>>>;
  p2c2p_credit_card_promotions?: Maybe<Array<Maybe<P2c2pCreditCardPromotion>>>;
  surcharge?: Maybe<Scalars['String']>;
};

export type PaymentFormPayload = {
  __typename?: 'PaymentFormPayload';
  paymentRequest: Scalars['String'];
};

export type PaymentInformationInput = {
  accept_consents?: Maybe<Array<ConsentType>>;
  billing_address?: Maybe<AddressInput>;
  card?: Maybe<CardInput>;
  email?: Maybe<Scalars['String']>;
  payment_method: PaymentMethodInput;
  payment_service_methods?: Maybe<PaymentServiceKey>;
  remark?: Maybe<Scalars['String']>;
  saved_card?: Maybe<SavedCardInput>;
  substitution?: Maybe<Scalars['String']>;
};

export type PaymentInformations = {
  __typename?: 'PaymentInformations';
  payment_methods?: Maybe<Array<Maybe<PaymentMethod>>>;
  extension_attributes?: Maybe<PaymentExtensionAttributes>;
  installment_plans?: Maybe<Array<PaymentServiceInstallPlans>>;
};

export type PaymentMethod = {
  __typename?: 'PaymentMethod';
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type PaymentMethodExtensionAttributesInput = {
  admin_username?: Maybe<Scalars['String']>;
  apm_agent_code?: Maybe<Scalars['String']>;
  apm_channel_code?: Maybe<Scalars['String']>;
  approval_email?: Maybe<Scalars['String']>;
  approval_message?: Maybe<Scalars['String']>;
  card_code?: Maybe<Scalars['String']>;
  card_issuer?: Maybe<Scalars['String']>;
  channel?: Maybe<Scalars['String']>;
  company_id?: Maybe<Scalars['Int']>;
  customer_email?: Maybe<Scalars['String']>;
  customer_name?: Maybe<Scalars['String']>;
  customer_phone?: Maybe<Scalars['String']>;
  gcl_id?: Maybe<Scalars['String']>;
  ofm_need_callback?: Maybe<Scalars['Int']>;
  ofm_po_filename?: Maybe<Scalars['String']>;
  ofm_po_no?: Maybe<Scalars['String']>;
  ofm_po_ref?: Maybe<Scalars['String']>;
  promotion_id?: Maybe<Scalars['String']>;
  request_tax_invoice?: Maybe<Scalars['Boolean']>;
  t1c_earn_card_number?: Maybe<Scalars['String']>;
  utm_campaign?: Maybe<Scalars['String']>;
  utm_content?: Maybe<Scalars['String']>;
  utm_medium?: Maybe<Scalars['String']>;
  utm_source?: Maybe<Scalars['String']>;
};

export type PaymentMethodInput = {
  extension_attributes?: Maybe<PaymentMethodExtensionAttributesInput>;
  installment_plan_id?: Maybe<Scalars['String']>;
  method: Scalars['String'];
};

export type PaymentOffileDetail = {
  __typename?: 'PaymentOffileDetail';
  orderId?: Maybe<Scalars['String']>;
  paymentCode?: Maybe<Scalars['String']>;
  referenceCode?: Maybe<Scalars['String']>;
  agentpaymentCode?: Maybe<Scalars['String']>;
  paymentExpiry?: Maybe<Scalars['String']>;
  instructionUrl?: Maybe<Scalars['String']>;
  barcodeValue?: Maybe<Scalars['String']>;
  barcodeImage?: Maybe<Scalars['String']>;
  qrCodeImage?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Float']>;
  currencyCode?: Maybe<Scalars['String']>;
  merchantName?: Maybe<Scalars['String']>;
  amountString?: Maybe<Scalars['String']>;
};

export type PaymentOfflineResponse = {
  __typename?: 'PaymentOfflineResponse';
  isSuccess?: Maybe<Scalars['Boolean']>;
  responseCode?: Maybe<Scalars['String']>;
  detail?: Maybe<PaymentOffileDetail>;
  key?: Maybe<Scalars['String']>;
};

export type PaymentRequestForm = {
  __typename?: 'PaymentRequestForm';
  url: Scalars['String'];
  payload: PaymentFormPayload;
};

export type PaymentServiceInstallPlans = InstallmentPlanInterface & {
  __typename?: 'PaymentServiceInstallPlans';
  installmentplan_id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  bank_id?: Maybe<Scalars['Int']>;
  bank?: Maybe<InstallmentBank>;
  currency?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  merchant_rate?: Maybe<Scalars['String']>;
  customer_rate?: Maybe<Scalars['String']>;
  interest_type?: Maybe<Scalars['String']>;
  installment_type?: Maybe<Scalars['String']>;
  min_amount?: Maybe<Scalars['String']>;
  max_amount?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['String']>;
  valid_from?: Maybe<Scalars['String']>;
  valid_until?: Maybe<Scalars['String']>;
  create?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<PaymentServiceInstallPlansExtensionAttributes>;
};

export type PaymentServiceInstallPlansExtensionAttributes = {
  __typename?: 'PaymentServiceInstallPlansExtensionAttributes';
  p2c2p_ipp_amount_per_month?: Maybe<Scalars['String']>;
};

export enum PaymentServiceKey {
  PaymentServiceFullpayment = 'payment_service_fullpayment',
  PaymentServiceInstallment = 'payment_service_installment',
  PaymentServiceBankTransfer = 'payment_service_bank_transfer',
  PaymentServiceDolfin = 'payment_service_dolfin'
}

export type PaymentStatusResponse = {
  __typename?: 'PaymentStatusResponse';
  is_success: Scalars['Boolean'];
  response_code?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  order_id?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  currency?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
};

export type PickupLocation = {
  __typename?: 'PickupLocation';
  id?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  display_order?: Maybe<Scalars['String']>;
  address_line1?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  long?: Maybe<Scalars['String']>;
  pickup_fee?: Maybe<Scalars['String']>;
  pos_handling_fee?: Maybe<Scalars['String']>;
  opening_hours?: Maybe<Array<Maybe<Scalars['String']>>>;
  extension_attributes?: Maybe<PickupLocationExtension>;
};

export type PickupLocationExtension = {
  __typename?: 'PickupLocationExtension';
  additional_address_info?: Maybe<AdditionalAddressInfo>;
  available_services?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type PickUpStore = {
  __typename?: 'PickUpStore';
  source_item?: Maybe<PickUpStoreSourceItem>;
  store?: Maybe<Store>;
};

export type PickupStoreInput = {
  store_id: Scalars['ID'];
};

export type PickupStoreLocation = {
  __typename?: 'PickupStoreLocation';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  storeCode?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  address?: Maybe<PickupStoreLocationAddress>;
  openingHours?: Maybe<Array<Maybe<PickupStoreLocationOpeningHour>>>;
  image?: Maybe<Scalars['String']>;
  allowPickAtStore?: Maybe<Scalars['Boolean']>;
  isDisplayAsStoreInformation?: Maybe<Scalars['Boolean']>;
  salableItems?: Maybe<Array<Maybe<PickupStoreLocationSalableItem>>>;
  storePickup?: Maybe<PickupStoreLocationStorePickup>;
  additionalText?: Maybe<PickupStoreLocationAdditionalText>;
  cutOffTime?: Maybe<Scalars['String']>;
};

export type PickupStoreLocationAdditionalText = {
  __typename?: 'PickupStoreLocationAdditionalText';
  methodCode?: Maybe<Scalars['String']>;
  methodLabelCode?: Maybe<Scalars['String']>;
  timeValue?: Maybe<Scalars['Int']>;
  timeUnit?: Maybe<Scalars['String']>;
  datetime?: Maybe<Scalars['String']>;
  totalAvailable?: Maybe<Scalars['Int']>;
  totalOrdered?: Maybe<Scalars['Int']>;
};

export type PickupStoreLocationAddress = {
  __typename?: 'PickupStoreLocationAddress';
  streetNumber?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  districtId?: Maybe<Scalars['Int']>;
  subDistrict?: Maybe<Scalars['String']>;
  subDistrictId?: Maybe<Scalars['Int']>;
  region?: Maybe<Scalars['String']>;
  regionId?: Maybe<Scalars['Int']>;
  postcode?: Maybe<Scalars['String']>;
  contactNumber?: Maybe<Scalars['String']>;
  countryCode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
};

export type PickupStoreLocationFilter = {
  keyword?: Maybe<Scalars['String']>;
  location?: Maybe<PickupStoreLocationFilterLatLng>;
  input?: Maybe<EstimateShippingInput>;
};

export type PickupStoreLocationFilterLatLng = {
  lat: Scalars['String'];
  lng: Scalars['String'];
};

export type PickupStoreLocationOpeningHour = {
  __typename?: 'PickupStoreLocationOpeningHour';
  day?: Maybe<Scalars['String']>;
  openTime?: Maybe<Scalars['String']>;
  closeTime?: Maybe<Scalars['String']>;
};

export type PickupStoreLocationSalableItem = {
  __typename?: 'PickupStoreLocationSalableItem';
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
};

export type PickupStoreLocationStorePickup = {
  __typename?: 'PickupStoreLocationStorePickup';
  stockId?: Maybe<Scalars['Int']>;
  allowIspu?: Maybe<Scalars['Boolean']>;
  allowSts?: Maybe<Scalars['Boolean']>;
};

export type PickUpStoreMulti = {
  __typename?: 'PickUpStoreMulti';
  sku?: Maybe<Scalars['String']>;
  data?: Maybe<Array<Maybe<PickUpStore>>>;
};

export type PickupStoresLocation = {
  __typename?: 'PickupStoresLocation';
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  store_code?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  address?: Maybe<PickupStoresLocationAddress>;
  extension_attributes?: Maybe<PickupStoresLocationExtensionAttributes>;
  distance?: Maybe<PickupStoresLocationDistance>;
};

export type PickupStoresLocationAdditionalText = {
  __typename?: 'PickupStoresLocationAdditionalText';
  method_code?: Maybe<Scalars['String']>;
  method_label_code?: Maybe<Scalars['String']>;
  time_value?: Maybe<Scalars['Int']>;
  time_unit?: Maybe<Scalars['String']>;
  date_time?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<PickupStoresLocationAdditionalTextExtensionAttributes>;
};

export type PickupStoresLocationAdditionalTextExtensionAttributes = {
  __typename?: 'PickupStoresLocationAdditionalTextExtensionAttributes';
  additional_text_variable?: Maybe<PickupStoresLocationAdditionalTextVariable>;
};

export type PickupStoresLocationAdditionalTextVariable = {
  __typename?: 'PickupStoresLocationAdditionalTextVariable';
  total_available?: Maybe<Scalars['Int']>;
  total_ordered?: Maybe<Scalars['Int']>;
};

export type PickupStoresLocationAddress = {
  __typename?: 'PickupStoresLocationAddress';
  street_number?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
  street?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['Int']>;
  sub_district?: Maybe<Scalars['String']>;
  sub_district_id?: Maybe<Scalars['Int']>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  post_code?: Maybe<Scalars['String']>;
  contact_number?: Maybe<Scalars['String']>;
  country_code?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
};

export type PickupStoresLocationDistance = {
  __typename?: 'PickupStoresLocationDistance';
  text?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type PickupStoresLocationExtensionAttributes = {
  __typename?: 'PickupStoresLocationExtensionAttributes';
  opening_hours?: Maybe<Array<Maybe<PickupStoresLocationOpeningHours>>>;
  store_pickup?: Maybe<PickupStoresLocationStorePickup>;
  stock_id?: Maybe<Scalars['Int']>;
  image?: Maybe<Scalars['String']>;
  allow_pick_at_store?: Maybe<Scalars['Boolean']>;
  display_as_store_information?: Maybe<Scalars['Boolean']>;
  salable_items?: Maybe<Array<Maybe<PickupStoresLocationSalableItems>>>;
  additional_text?: Maybe<PickupStoresLocationAdditionalText>;
  cut_off_time?: Maybe<Scalars['String']>;
};

export type PickupStoresLocationOpeningHours = {
  __typename?: 'PickupStoresLocationOpeningHours';
  day?: Maybe<Scalars['String']>;
  open?: Maybe<Scalars['String']>;
  close?: Maybe<Scalars['String']>;
};

export type PickupStoresLocationSalableItems = {
  __typename?: 'PickupStoresLocationSalableItems';
  sku?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['Int']>;
};

export type PickupStoresLocationStorePickup = {
  __typename?: 'PickupStoresLocationStorePickup';
  stock_id?: Maybe<Scalars['Int']>;
  allow_ispu?: Maybe<Scalars['Boolean']>;
  allow_sts?: Maybe<Scalars['String']>;
};

export type PickUpStoreSourceItem = {
  __typename?: 'PickUpStoreSourceItem';
  sku?: Maybe<Scalars['String']>;
  source_code?: Maybe<Scalars['String']>;
  quantity?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
};

export type Place = {
  __typename?: 'Place';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PlaceInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PostcodeResult = {
  __typename?: 'PostcodeResult';
  postcode?: Maybe<Scalars['String']>;
};

export type PricePerStoreInput = {
  sku: Scalars['String'];
  retailerId: Scalars['Int'];
};

export type Product = {
  __typename?: 'Product';
  id?: Maybe<Scalars['String']>;
  attribute_set_id?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  breadcrumbs?: Maybe<Array<Maybe<Breadcrumbs>>>;
  status?: Maybe<Scalars['Int']>;
  visibility?: Maybe<Scalars['Int']>;
  type_id?: Maybe<ProductType>;
  created_at?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  product_links?: Maybe<Array<Maybe<ProductLink>>>;
  options?: Maybe<Array<Maybe<ProductOption>>>;
  media_gallery_entries?: Maybe<Array<Maybe<MediaGalleryEntry>>>;
  tier_prices?: Maybe<Array<Maybe<ProductsTierPrices>>>;
  image?: Maybe<Scalars['String']>;
  small_image?: Maybe<Scalars['String']>;
  thumbnail?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  short_description?: Maybe<Scalars['String']>;
  special_price?: Maybe<Scalars['Float']>;
  special_from_date?: Maybe<Scalars['String']>;
  special_to_date?: Maybe<Scalars['String']>;
  meta_title?: Maybe<Scalars['String']>;
  meta_keyword?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  marketplace_product_type_option?: Maybe<Scalars['String']>;
  marketplace_seller_option?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  custom_attributes_option?: Maybe<Scalars['JSON']>;
  extension_attributes?: Maybe<ProductsExtensionAttributes>;
  cart_price_rule_overlays?: Maybe<Array<ProductsCartPriceRuleOverlay>>;
  /** configurable product children */
  configurable_product_items?: Maybe<Array<Maybe<Product>>>;
  /** min price of configurable children */
  price_min?: Maybe<Scalars['Float']>;
  /** max price of configurable children */
  price_max?: Maybe<Scalars['Float']>;
  /** min sale price calculate from special price and price */
  sale_price_min?: Maybe<Scalars['Float']>;
  /** max sale price calculate from special price and price */
  sale_price_max?: Maybe<Scalars['Float']>;
  /** tags (product.custom_attributes.product_tags) */
  product_tags?: Maybe<Scalars['String']>;
  /** metket place feature */
  marketplace?: Maybe<MarketPlaceSeller>;
  isReview?: Maybe<Scalars['Boolean']>;
};


export type ProductCustom_AttributesArgs = {
  filter?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type ProductCustom_Attributes_OptionArgs = {
  filter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ProductConfigurableItemOption = {
  option_id?: Maybe<Scalars['ID']>;
  option_value?: Maybe<Scalars['Int']>;
};

export type ProductConfigurableOption = {
  extension_attributes?: Maybe<ProductOptionExtension>;
};

export type ProductItem = {
  __typename?: 'ProductItem';
  id?: Maybe<Scalars['ID']>;
  title?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  brand_name?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  count?: Maybe<Scalars['Int']>;
  sku?: Maybe<Scalars['String']>;
  final_price?: Maybe<Scalars['Float']>;
  original_price?: Maybe<Scalars['Float']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
};

export type ProductLink = {
  __typename?: 'ProductLink';
  sku?: Maybe<Scalars['String']>;
  link_type?: Maybe<ProductLinkType>;
  linked_product_sku?: Maybe<Scalars['String']>;
  linked_product_type?: Maybe<ProductType>;
  position?: Maybe<Scalars['Int']>;
  product?: Maybe<Product>;
};

export enum ProductLinkType {
  Related = 'related',
  Crosssell = 'crosssell',
  Upsell = 'upsell'
}

export type ProductOption = {
  __typename?: 'ProductOption';
  value?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
};

export type ProductOptionExtension = {
  configurable_item_options?: Maybe<Array<Maybe<ProductConfigurableItemOption>>>;
};

export type ProductOptionsExtensionAttributes = {
  __typename?: 'ProductOptionsExtensionAttributes';
  label?: Maybe<Scalars['String']>;
  frontend_value?: Maybe<Scalars['String']>;
  frontend_type?: Maybe<Scalars['String']>;
  products?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type ProductOptionsValues = {
  __typename?: 'ProductOptionsValues';
  value_index?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<ProductOptionsExtensionAttributes>;
};

export type ProductProperty = {
  __typename?: 'ProductProperty';
  sku?: Maybe<Scalars['String']>;
};

export type ProductsCartPriceRuleOverlay = {
  __typename?: 'ProductsCartPriceRuleOverlay';
  id: Scalars['ID'];
  overlay_image?: Maybe<Scalars['String']>;
  display_priority?: Maybe<Scalars['Int']>;
};

export type ProductsCategory = {
  __typename?: 'ProductsCategory';
  category_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  level?: Maybe<Scalars['Int']>;
  parent_id?: Maybe<Scalars['String']>;
  url_key?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
  is_parent?: Maybe<Scalars['Boolean']>;
};

export type ProductsCcPromotionAttributes = {
  __typename?: 'ProductsCcPromotionAttributes';
  discount?: Maybe<Scalars['Float']>;
  bank_icon?: Maybe<Scalars['String']>;
  bank_color?: Maybe<Scalars['String']>;
  sales_rule_id?: Maybe<Scalars['String']>;
  promotion_id?: Maybe<Scalars['String']>;
};

export type ProductScrollProperty = {
  __typename?: 'ProductScrollProperty';
  maxItemsSize?: Maybe<Scalars['Int']>;
  minimumVisible?: Maybe<Scalars['Int']>;
};

export type ProductsCustomAttributes = {
  __typename?: 'ProductsCustomAttributes';
  brand_name?: Maybe<Scalars['String']>;
  free_gift?: Maybe<Scalars['String']>;
  free_delivery?: Maybe<Scalars['String']>;
  free_text_flag?: Maybe<Scalars['String']>;
  free_text_on_top?: Maybe<Scalars['String']>;
  badge?: Maybe<Scalars['String']>;
  show_badge?: Maybe<Scalars['String']>;
  free_installation?: Maybe<Scalars['String']>;
  product_tags?: Maybe<Scalars['String']>;
  related_to?: Maybe<Scalars['String']>;
  home_branch?: Maybe<Scalars['String']>;
  attached_pdf_file?: Maybe<Scalars['String']>;
  barcode?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  shipping_methods?: Maybe<Scalars['String']>;
  payment_methods?: Maybe<Scalars['String']>;
};

export type ProductSearch = {
  __typename?: 'ProductSearch';
  filters?: Maybe<Array<Maybe<ProductsFilter>>>;
  products?: Maybe<Array<Maybe<Product>>>;
  sorting?: Maybe<Array<Maybe<ProductsSorting>>>;
  total_count?: Maybe<Scalars['Int']>;
};

export type ProductsExtensionAttributes = {
  __typename?: 'ProductsExtensionAttributes';
  ispu_salable?: Maybe<Scalars['Boolean']>;
  free_shipping_amount?: Maybe<Scalars['String']>;
  category_links?: Maybe<Array<Maybe<Scalars['String']>>>;
  category_paths?: Maybe<Array<Maybe<CategoryPath>>>;
  stock_item?: Maybe<StockItem>;
  overall_rating?: Maybe<ProductsExtensionAttributesOverallRating>;
  reviews?: Maybe<Array<Maybe<ProductsExtensionAttributesReviews>>>;
  specification_attributes?: Maybe<Array<Maybe<ProductsSpecialAttributes>>>;
  brand?: Maybe<ProductsExtensionAttributesBrand>;
  t1c_redeemable_points?: Maybe<Array<Maybe<Scalars['String']>>>;
  t1c_earn_points_estimate?: Maybe<Array<Maybe<Scalars['String']>>>;
  installment_plans?: Maybe<Array<Maybe<InstallmentPlan>>>;
  cc_promotions?: Maybe<Array<Maybe<ProductsCcPromotionAttributes>>>;
  salable?: Maybe<Scalars['Boolean']>;
  seller_url_key?: Maybe<Scalars['String']>;
  overlays?: Maybe<Array<Maybe<ProductsExtensionAttributesOverlay>>>;
  configurable_product_links?: Maybe<Array<Maybe<Scalars['String']>>>;
  configurable_product_options?: Maybe<Array<Maybe<ConfigurableProductOptions>>>;
  size_map?: Maybe<ProductSizeMap>;
  size_maps?: Maybe<Array<Maybe<ProductSizeMap>>>;
  suggest_promotions?: Maybe<Array<ProductsExtensionAttributesSuggestPromotions>>;
  flash_sale_price?: Maybe<Array<Maybe<ProductsExtensionAttributesFlashSalePrice>>>;
};

export type ProductsExtensionAttributesBrand = {
  __typename?: 'ProductsExtensionAttributesBrand';
  meta_title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  website_ids?: Maybe<Array<Maybe<Scalars['String']>>>;
  extension_attributes?: Maybe<ProductsExtensionAttributesBrandExtensionAttributes>;
  content?: Maybe<Array<Maybe<Scalars['String']>>>;
  brand_id?: Maybe<Scalars['Int']>;
  url_key?: Maybe<Scalars['String']>;
  meta_description?: Maybe<Scalars['String']>;
  brand_additional_products?: Maybe<Array<Maybe<Scalars['String']>>>;
  attribute_id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  option_id?: Maybe<Scalars['Int']>;
  is_featured?: Maybe<Scalars['String']>;
  attribute_code?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
};

export type ProductsExtensionAttributesBrandExtensionAttributes = {
  __typename?: 'ProductsExtensionAttributesBrandExtensionAttributes';
  product_name_special?: Maybe<Scalars['Boolean']>;
  hide_product_original_price?: Maybe<Scalars['Boolean']>;
  hide_t1c_redeemable_amount?: Maybe<Scalars['Boolean']>;
  allow_product_review?: Maybe<Scalars['Boolean']>;
  product_count?: Maybe<Scalars['Int']>;
  parent_category?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  banners?: Maybe<Array<Maybe<Scalars['String']>>>;
  product_collections?: Maybe<Array<Maybe<Scalars['String']>>>;
  menu_css?: Maybe<Scalars['String']>;
  content_css?: Maybe<Scalars['String']>;
  brand_image_url?: Maybe<Scalars['String']>;
};

export type ProductsExtensionAttributesFlashSalePrice = {
  __typename?: 'ProductsExtensionAttributesFlashSalePrice';
  start_date: Scalars['String'];
  end_date: Scalars['String'];
  special_price: Scalars['String'];
};

export type ProductsExtensionAttributesOverallRating = {
  __typename?: 'ProductsExtensionAttributesOverallRating';
  total_vote?: Maybe<Scalars['Int']>;
  one_star?: Maybe<Scalars['Int']>;
  four_star?: Maybe<Scalars['Int']>;
  five_star?: Maybe<Scalars['Int']>;
  three_star?: Maybe<Scalars['Int']>;
  two_star?: Maybe<Scalars['Int']>;
  rating?: Maybe<Scalars['Float']>;
  rounded_rating?: Maybe<Scalars['Int']>;
};

export type ProductsExtensionAttributesOverlay = {
  __typename?: 'ProductsExtensionAttributesOverlay';
  overlay_image?: Maybe<Scalars['String']>;
  overlay_status?: Maybe<Scalars['String']>;
  mobile_overlay_status?: Maybe<Scalars['String']>;
  overlay_start_date?: Maybe<Scalars['String']>;
  overlay_end_date?: Maybe<Scalars['String']>;
  overlay_position?: Maybe<Scalars['String']>;
};

export type ProductsExtensionAttributesReviews = {
  __typename?: 'ProductsExtensionAttributesReviews';
  nickname?: Maybe<Scalars['String']>;
  rating_items?: Maybe<ProductsRatingItems>;
  created_at?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  detail?: Maybe<Scalars['String']>;
  is_validate?: Maybe<Scalars['Boolean']>;
  images?: Maybe<Array<ImagePath>>;
  region_id?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<ProductsExtensionAttributesReviewsExtensionAttributes>;
};

export type ProductsExtensionAttributesReviewsExtensionAttributes = {
  __typename?: 'ProductsExtensionAttributesReviewsExtensionAttributes';
  review_images?: Maybe<Array<Scalars['String']>>;
  region_id?: Maybe<Scalars['Int']>;
};

export type ProductsExtensionAttributesSuggestPromotions = {
  __typename?: 'ProductsExtensionAttributesSuggestPromotions';
  promotion_name: Scalars['String'];
  full_condition: Scalars['String'];
  start_datetime?: Maybe<Scalars['String']>;
  end_datetime?: Maybe<Scalars['String']>;
};

export type ProductsFilter = {
  __typename?: 'ProductsFilter';
  name?: Maybe<Scalars['String']>;
  attribute_code?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<ProductsFilterItems>>>;
  position?: Maybe<Scalars['Int']>;
};

export type ProductsFilterItems = {
  __typename?: 'ProductsFilterItems';
  label?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  count?: Maybe<Scalars['Int']>;
  custom_attributes?: Maybe<ProductsFilterItemsAttributes>;
};

export type ProductsFilterItemsAttributes = {
  __typename?: 'ProductsFilterItemsAttributes';
  level?: Maybe<Scalars['Int']>;
  parent_id?: Maybe<Scalars['Int']>;
  url_key?: Maybe<Scalars['String']>;
  url_path?: Maybe<Scalars['String']>;
};

export type ProductSizeMap = {
  __typename?: 'ProductSizeMap';
  type?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
};

export type ProductsRatingItems = {
  __typename?: 'ProductsRatingItems';
  rating_id?: Maybe<Scalars['Int']>;
  rating?: Maybe<Scalars['Int']>;
  category?: Maybe<Scalars['String']>;
};

export type ProductsSorting = {
  __typename?: 'ProductsSorting';
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type ProductsSpecialAttributes = {
  __typename?: 'ProductsSpecialAttributes';
  label?: Maybe<Scalars['String']>;
  attribute_code?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['JSON']>;
};

export type ProductsStock = {
  __typename?: 'ProductsStock';
  qty?: Maybe<Scalars['Int']>;
  is_in_stock?: Maybe<Scalars['String']>;
};

export type ProductsStockItem = {
  __typename?: 'ProductsStockItem';
  qty?: Maybe<Scalars['Int']>;
  is_in_stock?: Maybe<Scalars['String']>;
  min_qty?: Maybe<Scalars['Int']>;
  min_sale_qty?: Maybe<Scalars['Int']>;
  use_config_max_sale_qty?: Maybe<Scalars['String']>;
  max_sale_qty?: Maybe<Scalars['Int']>;
};

export type ProductsTierPrices = {
  __typename?: 'ProductsTierPrices';
  price?: Maybe<Scalars['Int']>;
  original_price?: Maybe<Scalars['Int']>;
  customer_group_id?: Maybe<Scalars['Int']>;
  is_discount?: Maybe<Scalars['Boolean']>;
};

export type ProductStorePrice = {
  __typename?: 'ProductStorePrice';
  entity_id: Scalars['ID'];
  id: Scalars['Int'];
  sku: Scalars['String'];
  price: Scalars['Float'];
  special_price?: Maybe<Scalars['Float']>;
  configurable_product_items?: Maybe<Array<Maybe<ProductStorePrice>>>;
};

export type ProductStyle = {
  __typename?: 'ProductStyle';
  titleColor?: Maybe<Scalars['String']>;
};

export enum ProductType {
  Simple = 'simple',
  Configurable = 'configurable',
  Grouped = 'grouped',
  Virtual = 'virtual',
  Bundle = 'bundle',
  Downloadable = 'downloadable',
  Giftcard = 'giftcard',
  Unknown = 'unknown'
}

export type ProductUrlKeyQuery = {
  url: Scalars['String'];
};

export type PromotionSuggestion = {
  __typename?: 'PromotionSuggestion';
  sku?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<PromotionSuggestionExtensionAttribute>;
};

export type PromotionSuggestionExtensionAttribute = {
  __typename?: 'PromotionSuggestionExtensionAttribute';
  free_items?: Maybe<Array<Maybe<FreeItemPromotion>>>;
  bundles?: Maybe<Array<Maybe<BundlePromotion>>>;
  credit_card_promotions?: Maybe<Array<Maybe<CreditCardPromotion>>>;
  t1c?: Maybe<Array<Maybe<T1CPromotion>>>;
  all_applicable_rules?: Maybe<Array<Maybe<ApplicableRulesPromotion>>>;
  tier_price?: Maybe<Array<Maybe<TierPricePromotion>>>;
};

export type Query = {
  __typename?: 'Query';
  banner?: Maybe<Array<Maybe<Banner>>>;
  binLookup: BinLookup;
  brandDetail?: Maybe<BrandDetail>;
  brands?: Maybe<Array<Maybe<Brand>>>;
  cards: Array<Card>;
  cart?: Maybe<Cart>;
  cartMini?: Maybe<CartMini>;
  categories?: Maybe<Array<Maybe<CategoryFlat>>>;
  categoriesTree?: Maybe<Array<Maybe<CategoryFlat>>>;
  category?: Maybe<Category>;
  cms?: Maybe<CmsContent>;
  cmsBlock?: Maybe<CmsBlock>;
  cmsBlockByIdentifier?: Maybe<CmsBlock>;
  cmsBlocks?: Maybe<Array<Maybe<CmsBlock>>>;
  cmsMobile?: Maybe<CmsMobileContent>;
  compareProducts?: Maybe<Array<Maybe<CompareProducts>>>;
  consentInfo?: Maybe<Consent>;
  couponCampaignList?: Maybe<Array<Maybe<CouponCampaignResponse>>>;
  couponList?: Maybe<CouponResponse>;
  customer?: Maybe<Customer>;
  customerCouponList?: Maybe<CouponResponse>;
  deliveryOptions?: Maybe<Array<Maybe<DeliveryOptionItem>>>;
  districts?: Maybe<Array<Maybe<District>>>;
  estimateShippingMethods?: Maybe<Array<Maybe<EstimateShippingMethods>>>;
  /** [PWB] - Query available store for 2hr pick up shipping method */
  get2hrsPickUpStores?: Maybe<Array<Maybe<PickUpStore>>>;
  getAddress?: Maybe<CustomerAddressResult>;
  /** [PWB] - Query all active store for 2hr pick up shipping method */
  getAllActive2hrsPickUpStores?: Maybe<Array<Maybe<PickUpStore>>>;
  /** [PWB] - Query available store for click and collect shipping method */
  getClickNCollectPickUpStores?: Maybe<Array<Maybe<Store>>>;
  /** [PWB] - Query available store with multiple sku for 2hr pick up shipping method */
  getMulti2hrsPickUpStores?: Maybe<Array<Maybe<PickUpStoreMulti>>>;
  /** [PWB] - Query get available time of ship from store (3hr) shipping method */
  getShipFromStoreAvailableTime?: Maybe<ShipFromStoreAvailableTime>;
  /** [PWB] - Query check active status store */
  getStatusActivePickupStore?: Maybe<IsSalable>;
  getStore?: Maybe<Store>;
  /** [PWB] - Query store (deprecated) */
  getStores?: Maybe<Array<Maybe<Store>>>;
  hello: Scalars['String'];
  homepageRecommendationByUserId?: Maybe<Scalars['JSON']>;
  listAddresses?: Maybe<Array<Maybe<CustomerAddressResult>>>;
  order?: Maybe<Order>;
  orderByEmail?: Maybe<Order>;
  orderByIncrementId?: Maybe<Order>;
  orders?: Maybe<Orders>;
  paymentInformations?: Maybe<PaymentInformations>;
  paymentOffline: PaymentOffileDetail;
  paymentStatus: PaymentStatusResponse;
  pickupLocations?: Maybe<Array<Maybe<PickupStoreLocation>>>;
  postcodeByLatLng?: Maybe<PostcodeResult>;
  pricePerStore?: Maybe<ProductStorePrice>;
  product?: Maybe<Product>;
  productBySku?: Maybe<Product>;
  productRecommendationBySku?: Maybe<Scalars['JSON']>;
  productRecommendationByUser?: Maybe<Scalars['JSON']>;
  productSearch?: Maybe<ProductSearch>;
  /** [PWB] - Search Promotion by search criteria */
  promotionSuggestion?: Maybe<Array<Maybe<PromotionSuggestion>>>;
  ratingOptions?: Maybe<Array<Maybe<RatingOptions>>>;
  regionByPostCode?: Maybe<RegionByPostCode>;
  regions?: Maybe<Array<Maybe<Regions>>>;
  retailerById?: Maybe<Store>;
  retailerByPostcode?: Maybe<Store>;
  search?: Maybe<Scalars['JSON']>;
  searchSuggestion?: Maybe<SearchSuggestionLists>;
  searchTrending?: Maybe<Array<Maybe<TermItem>>>;
  shippingSlotInfoHdl?: Maybe<Array<Maybe<SlotInfo>>>;
  storeConfigs?: Maybe<Array<Maybe<StoreConfig>>>;
  storePickupLocationsAvailable?: Maybe<Array<Maybe<StorePickupLocationsAvailable>>>;
  storeWithStockLevel: Array<Maybe<StoreWithStockLevel>>;
  subDistricts?: Maybe<Array<Maybe<SubDistrict>>>;
  trackOrder?: Maybe<Array<ShipmentTrackingItem>>;
  urlRedirect?: Maybe<UrlRedirect>;
  urlRewrite?: Maybe<UrlRewrite>;
  v2BrandById?: Maybe<V2Brand>;
  v2BrandSearch?: Maybe<Array<Maybe<V2Brand>>>;
  v2Cart: V2Cart;
  v2DeliveryOptionByPostcode: Array<V2DeliveryOptionByPostcode>;
  v2PackageOptions?: Maybe<Array<Maybe<V2PackageOptionResponse>>>;
  v2ProductBySKU: V2Product;
  v2ProductByUrlKey: V2Product;
  v2ProductSearch: V2ProductSearchResult;
  v2SuggestSearch: V2SuggestSearchResult;
  v2TrendSearch: V2TrendSearchResult;
  version: Scalars['String'];
  vipList?: Maybe<VipListResponse>;
  vipWithToken?: Maybe<VipValidateResponse>;
  wishlists?: Maybe<Wishlists>;
};


export type QueryBannerArgs = {
  input?: Maybe<FiltersQuery>;
};


export type QueryBinLookupArgs = {
  bin: Scalars['String'];
};


export type QueryBrandDetailArgs = {
  brandId?: Maybe<Scalars['Int']>;
};


export type QueryBrandsArgs = {
  input?: Maybe<FiltersQuery>;
};


export type QueryCardsArgs = {
  sort?: Maybe<CardSort>;
};


export type QueryCartArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type QueryCartMiniArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
};


export type QueryCategoriesArgs = {
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryCategoryArgs = {
  storeCode?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type QueryCmsArgs = {
  filter?: Maybe<CmsFilterInput>;
};


export type QueryCmsBlockArgs = {
  id?: Maybe<Scalars['Int']>;
};


export type QueryCmsBlockByIdentifierArgs = {
  identifier: Scalars['String'];
  store_id: Scalars['String'];
};


export type QueryCmsBlocksArgs = {
  input?: Maybe<FiltersQuery>;
};


export type QueryCmsMobileArgs = {
  filter?: Maybe<CmsMobileFilterInput>;
};


export type QueryCompareProductsArgs = {
  input?: Maybe<CompareProductInput>;
};


export type QueryCouponCampaignListArgs = {
  campaignName: Scalars['String'];
};


export type QueryCouponListArgs = {
  input: CouponInput;
};


export type QueryCustomerCouponListArgs = {
  input: CustomerCouponInput;
};


export type QueryDeliveryOptionsArgs = {
  storeCode: Scalars['String'];
  sku: Scalars['String'];
  postcode?: Maybe<Scalars['String']>;
};


export type QueryDistrictsArgs = {
  storeCode?: Maybe<Scalars['String']>;
  input?: Maybe<RegionId>;
};


export type QueryEstimateShippingMethodsArgs = {
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  input: EstimateShippingInput;
};


export type QueryGet2hrsPickUpStoresArgs = {
  sku?: Maybe<Scalars['String']>;
};


export type QueryGetAddressArgs = {
  input: GetCustomerAddress;
};


export type QueryGetAllActive2hrsPickUpStoresArgs = {
  sku?: Maybe<Scalars['String']>;
};


export type QueryGetClickNCollectPickUpStoresArgs = {
  cartId?: Maybe<Scalars['String']>;
};


export type QueryGetMulti2hrsPickUpStoresArgs = {
  skus?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryGetStatusActivePickupStoreArgs = {
  sku?: Maybe<Scalars['String']>;
};


export type QueryGetStoreArgs = {
  id: Scalars['ID'];
};


export type QueryHomepageRecommendationByUserIdArgs = {
  customerId?: Maybe<Scalars['String']>;
};


export type QueryListAddressesArgs = {
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryOrderArgs = {
  orderId: Scalars['Int'];
};


export type QueryOrderByEmailArgs = {
  incrementId: Scalars['String'];
  email: Scalars['String'];
};


export type QueryOrderByIncrementIdArgs = {
  incrementId: Scalars['String'];
  key?: Maybe<Scalars['String']>;
};


export type QueryOrdersArgs = {
  filter: FiltersQuery;
};


export type QueryPaymentInformationsArgs = {
  isGuest?: Maybe<Scalars['Boolean']>;
  cartId?: Maybe<Scalars['String']>;
  childrenIds?: Maybe<Array<Scalars['String']>>;
  company_id?: Maybe<Scalars['Int']>;
};


export type QueryPaymentOfflineArgs = {
  incrementId: Scalars['String'];
  key: Scalars['String'];
};


export type QueryPaymentStatusArgs = {
  incrementId: Scalars['String'];
  key: Scalars['String'];
  paymentServiceKey: PaymentServiceKey;
};


export type QueryPickupLocationsArgs = {
  sku: Scalars['String'];
};


export type QueryPostcodeByLatLngArgs = {
  lat: Scalars['String'];
  lng: Scalars['String'];
};


export type QueryPricePerStoreArgs = {
  input: PricePerStoreInput;
};


export type QueryProductArgs = {
  url?: Maybe<Scalars['String']>;
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryProductBySkuArgs = {
  sku: Scalars['String'];
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryProductRecommendationBySkuArgs = {
  sku?: Maybe<Scalars['String']>;
};


export type QueryProductRecommendationByUserArgs = {
  customerId?: Maybe<Scalars['String']>;
};


export type QueryProductSearchArgs = {
  filter?: Maybe<FiltersQuery>;
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryPromotionSuggestionArgs = {
  filter?: Maybe<FiltersQuery>;
};


export type QueryRegionByPostCodeArgs = {
  storeCode?: Maybe<Scalars['String']>;
  input?: Maybe<RegionPostCode>;
};


export type QueryRegionsArgs = {
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryRetailerByIdArgs = {
  input: GetRetailerByIdInput;
};


export type QueryRetailerByPostcodeArgs = {
  input: GetRetailerByPostcodeInput;
};


export type QuerySearchArgs = {
  store: Scalars['String'];
  locale: Scalars['String'];
  keyword?: Maybe<Scalars['String']>;
  sort?: Maybe<Scalars['JSON']>;
  pagination?: Maybe<Scalars['JSON']>;
  filter?: Maybe<Scalars['JSON']>;
};


export type QuerySearchSuggestionArgs = {
  searchTermsInput?: Maybe<SearchTermsInput>;
};


export type QuerySearchTrendingArgs = {
  storeCode?: Maybe<Scalars['String']>;
};


export type QueryShippingSlotInfoHdlArgs = {
  cartId: Scalars['String'];
  address: ShippingSlotHdlInput;
};


export type QueryStorePickupLocationsAvailableArgs = {
  sku: Scalars['String'];
  filter?: Maybe<PickupStoreLocationFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};


export type QueryStoreWithStockLevelArgs = {
  sku: Scalars['String'];
};


export type QuerySubDistrictsArgs = {
  storeCode?: Maybe<Scalars['String']>;
  input?: Maybe<SubRegionId>;
};


export type QueryTrackOrderArgs = {
  incrementId: Scalars['String'];
};


export type QueryUrlRedirectArgs = {
  url?: Maybe<Scalars['String']>;
};


export type QueryUrlRewriteArgs = {
  url?: Maybe<Scalars['String']>;
};


export type QueryV2BrandByIdArgs = {
  id: Scalars['ID'];
};


export type QueryV2BrandSearchArgs = {
  input: FiltersQuery;
};


export type QueryV2DeliveryOptionByPostcodeArgs = {
  input: V2DeliveryOptionByPostcodeInput;
};


export type QueryV2PackageOptionsArgs = {
  cartId?: Maybe<Scalars['String']>;
  storeId: Scalars['String'];
};


export type QueryV2ProductBySkuArgs = {
  sku: Scalars['String'];
};


export type QueryV2ProductByUrlKeyArgs = {
  urlKey: Scalars['String'];
};


export type QueryV2ProductSearchArgs = {
  input: V2ProductSearchInput;
};


export type QueryV2SuggestSearchArgs = {
  input?: Maybe<V2SuggestSearchInput>;
};


export type QueryV2TrendSearchArgs = {
  size?: Maybe<Scalars['Int']>;
};


export type QueryVipWithTokenArgs = {
  token: Scalars['String'];
};


export type QueryWishlistsArgs = {
  filter: FiltersQuery;
};

export enum QuoteItemGroup {
  Standard = 'standard',
  Storepickup = 'storepickup'
}

export type RatingItem = {
  rating_id: Scalars['Int'];
  rating: Scalars['Int'];
  option_id: Scalars['Int'];
};

export type RatingOptions = {
  __typename?: 'RatingOptions';
  option_id?: Maybe<Scalars['Int']>;
  rating_id?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['Int']>;
  rating_code?: Maybe<Scalars['String']>;
};

export type Region = {
  __typename?: 'Region';
  region_code?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['Int']>;
};

export type RegionByPostCode = {
  __typename?: 'RegionByPostCode';
  region_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  default_name?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sort_order?: Maybe<Scalars['String']>;
  district?: Maybe<Array<Maybe<District>>>;
};

export type RegionId = {
  regionId?: Maybe<Scalars['String']>;
};

export type RegionPostCode = {
  postcode?: Maybe<Scalars['String']>;
};

export type Regions = {
  __typename?: 'Regions';
  region_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  default_name?: Maybe<Scalars['String']>;
  sort_order?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Register = {
  __typename?: 'Register';
  data?: Maybe<Customer>;
  error?: Maybe<ResponseMessage>;
  message?: Maybe<Scalars['String']>;
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  firstname: Scalars['String'];
  lastname: Scalars['String'];
  is_subscribed?: Maybe<Scalars['Boolean']>;
  storeId?: Maybe<Scalars['Int']>;
  dob?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  tax_id?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  t1c_no?: Maybe<Scalars['String']>;
  t1c_phone?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  accept_consents?: Maybe<Array<ConsentType>>;
};

export type ResetPasswordInput = {
  newPassword: Scalars['String'];
  email: Scalars['String'];
  resetToken: Scalars['String'];
};

export type ResponseMessage = {
  __typename?: 'ResponseMessage';
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Boolean']>;
};

export type RestoreShippingAssignmentInput = {
  isGuest: Scalars['Boolean'];
  cartId?: Maybe<Scalars['String']>;
};

export type ReviewInput = {
  nickname?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  detail?: Maybe<Scalars['String']>;
  rating_items: RatingItem;
  sku: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['Int']>;
  customer_id?: Maybe<Scalars['String']>;
  images?: Maybe<Array<InputImagePath>>;
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  success?: Maybe<Scalars['String']>;
};

export type SavedCardInput = {
  card_id: Scalars['String'];
  encrypted_card_data?: Maybe<Scalars['String']>;
};

export type SearchSuggestionLists = {
  __typename?: 'SearchSuggestionLists';
  products?: Maybe<Array<Maybe<ProductItem>>>;
  terms?: Maybe<Array<Maybe<TermItem>>>;
  categories?: Maybe<Array<Maybe<CategoryItem>>>;
};

export type SearchTermsInput = {
  storeCode?: Maybe<Scalars['String']>;
  keyword?: Maybe<Scalars['String']>;
  productsSize?: Maybe<Scalars['Int']>;
  termsSize?: Maybe<Scalars['Int']>;
};

export type SellerInfo = {
  __typename?: 'SellerInfo';
  entity_id: Scalars['ID'];
  name: Scalars['String'];
  mirakl_seller_id: Scalars['String'];
  url_key?: Maybe<Scalars['String']>;
};

export type SetMultiPaymentResponse = {
  __typename?: 'SetMultiPaymentResponse';
  statusPayment?: Maybe<Scalars['Boolean']>;
};

export type SetPaymentInfoResponse = {
  __typename?: 'SetPaymentInfoResponse';
  message?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['JSON']>;
  payment_dolfin?: Maybe<PaymentDolfinResponse>;
  payment_offline?: Maybe<PaymentOfflineResponse>;
  redirect_url?: Maybe<Scalars['String']>;
  request_form?: Maybe<PaymentRequestForm>;
};

export type SetShippingInformationInput = {
  shipping_address?: Maybe<AddressInput>;
  billing_address?: Maybe<AddressInput>;
  shipping_method_code?: Maybe<Scalars['String']>;
  shipping_carrier_code?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<SetShippingInformationInputExtensionAttributes>;
};

export type SetShippingInformationInputExtensionAttributes = {
  pickup_store?: Maybe<SetShippingInformationInputExtensionAttributesPickupStore>;
};

export type SetShippingInformationInputExtensionAttributesPickupStore = {
  store_id: Scalars['ID'];
};

export type SetShippingSlotHdlInput = {
  date_time_from?: Maybe<Scalars['String']>;
  date_time_to?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<ShippingSlotItemExtensionAttributesInput>;
};

export type ShipFromStoreAvailableTime = {
  __typename?: 'ShipFromStoreAvailableTime';
  available_from?: Maybe<Scalars['String']>;
  available_to?: Maybe<Scalars['String']>;
};

export type ShipmentTrackingItem = {
  __typename?: 'ShipmentTrackingItem';
  con_no?: Maybe<Scalars['String']>;
  status_code?: Maybe<Scalars['String']>;
  status_desc?: Maybe<Scalars['String']>;
  status_date?: Maybe<Scalars['String']>;
  update_date?: Maybe<Scalars['String']>;
  ref_no?: Maybe<Scalars['String']>;
  order_id?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
};

export type Shipping = {
  __typename?: 'Shipping';
  address?: Maybe<ShippingAddress>;
  method?: Maybe<Scalars['String']>;
};

export type ShippingAddress = {
  __typename?: 'ShippingAddress';
  address_type?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  prefix?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  region_code?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  telephone?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Scalars['JSON']>;
};


export type ShippingAddressCustom_AttributesArgs = {
  filter?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type ShippingAssigmentsShipping = {
  __typename?: 'ShippingAssigmentsShipping';
  address?: Maybe<CartBillingAddress>;
  method?: Maybe<Scalars['String']>;
};

export type ShippingAssignment = {
  __typename?: 'ShippingAssignment';
  shipping?: Maybe<Shipping>;
  items?: Maybe<Array<Maybe<ShippingItems>>>;
};

export type ShippingItems = {
  __typename?: 'ShippingItems';
  store_id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  product_type?: Maybe<Scalars['String']>;
  sku?: Maybe<Scalars['String']>;
};

export type ShippingMethodExtension = {
  __typename?: 'ShippingMethodExtension';
  pickup_locations?: Maybe<Array<Maybe<PickupLocation>>>;
  pickup_stores_location?: Maybe<Array<Maybe<PickupStoresLocation>>>;
  gmap_api_key?: Maybe<Scalars['String']>;
  shipping_slot_list?: Maybe<Array<Maybe<ShippingSlotItem>>>;
  messages?: Maybe<Array<Maybe<ShippingMethodExtensionMessage>>>;
};


export type ShippingMethodExtensionPickup_Stores_LocationArgs = {
  filter?: Maybe<PickupStoreLocationFilter>;
  limit?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
};

export type ShippingMethodExtensionMessage = {
  __typename?: 'ShippingMethodExtensionMessage';
  message_code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  pre_render_message?: Maybe<Scalars['String']>;
};

export type ShippingMethods = {
  __typename?: 'ShippingMethods';
  carrier_code?: Maybe<Scalars['String']>;
  method_code?: Maybe<Scalars['String']>;
  carrier_title?: Maybe<Scalars['String']>;
  caption?: Maybe<Scalars['String']>;
  method_title?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['Int']>;
  base_amount?: Maybe<Scalars['Int']>;
  available?: Maybe<Scalars['Boolean']>;
  error_message?: Maybe<Scalars['String']>;
  price_excl_tax?: Maybe<Scalars['Int']>;
  price_incl_tax?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<ShippingMethodExtension>;
};

export type ShippingSlot = {
  __typename?: 'ShippingSlot';
  id?: Maybe<Scalars['Int']>;
  date_time_from?: Maybe<Scalars['String']>;
  date_time_to?: Maybe<Scalars['String']>;
};

export type ShippingSlotHdlInput = {
  customer_id?: Maybe<Scalars['Int']>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['String']>;
  country_id: Scalars['String'];
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  telephone?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<SlotHdlCustomAttributesInput>;
};

export type ShippingSlotItem = {
  __typename?: 'ShippingSlotItem';
  id?: Maybe<Scalars['Int']>;
  date_time_from?: Maybe<Scalars['String']>;
  date_time_to?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<ShippingSlotItemExtensionAttributes>;
};

export type ShippingSlotItemExtensionAttributes = {
  __typename?: 'ShippingSlotItemExtensionAttributes';
  day_slot_id?: Maybe<Scalars['Int']>;
};

export type ShippingSlotItemExtensionAttributesInput = {
  day_slot_id?: Maybe<Scalars['Int']>;
};

export type Slides = {
  __typename?: 'slides';
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  store_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  customer_group_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  display_from?: Maybe<Scalars['String']>;
  display_to?: Maybe<Scalars['String']>;
  img_type?: Maybe<Scalars['String']>;
  img_file?: Maybe<Scalars['String']>;
  img_url?: Maybe<Scalars['String']>;
  img_title?: Maybe<Scalars['String']>;
  img_alt?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  is_open_url_in_new_window?: Maybe<Scalars['Boolean']>;
  is_add_nofollow_to_url?: Maybe<Scalars['Boolean']>;
  banner_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  extension_attributes?: Maybe<SubExtensionAttributes>;
};

export type SlotHdlCustomAttributesInput = {
  tel_mobile?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  house_no?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  postcode_id?: Maybe<Scalars['String']>;
};

export type SlotInfo = {
  __typename?: 'SlotInfo';
  id?: Maybe<Scalars['String']>;
  date_time_from: Scalars['String'];
  date_time_to: Scalars['String'];
  extension_attributes?: Maybe<SlotInfoExtensionAttributes>;
};

export type SlotInfoExtensionAttributes = {
  __typename?: 'SlotInfoExtensionAttributes';
  day_slot_id: Scalars['Int'];
};

export type SocialLoginInput = {
  provider: SocialLoginInputProvider;
  token: Scalars['String'];
  is_jwt: Scalars['Boolean'];
  guest_token?: Maybe<Scalars['String']>;
};

export enum SocialLoginInputProvider {
  Facebook = 'facebook'
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type SortOrder = {
  field?: Maybe<Scalars['String']>;
  direction?: Maybe<SortDirection>;
};

export type StatusHistories = {
  __typename?: 'StatusHistories';
  created_at?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type StockItem = {
  __typename?: 'StockItem';
  qty?: Maybe<Scalars['Int']>;
  is_in_stock?: Maybe<Scalars['Boolean']>;
  use_config_min_qty?: Maybe<Scalars['Boolean']>;
  min_qty?: Maybe<Scalars['Int']>;
  use_config_min_sale_qty?: Maybe<Scalars['Boolean']>;
  min_sale_qty?: Maybe<Scalars['Int']>;
  use_config_max_sale_qty?: Maybe<Scalars['Boolean']>;
  max_sale_qty?: Maybe<Scalars['Int']>;
  item_id?: Maybe<Scalars['Int']>;
  product_id?: Maybe<Scalars['Int']>;
  stock_id?: Maybe<Scalars['Int']>;
  is_qty_decimal?: Maybe<Scalars['Boolean']>;
  backorders?: Maybe<Scalars['Int']>;
  use_config_backorders?: Maybe<Scalars['Boolean']>;
  low_stock_date?: Maybe<Scalars['String']>;
  notify_stock_qty?: Maybe<Scalars['Int']>;
  use_config_notify_stock_qty?: Maybe<Scalars['Boolean']>;
  manage_stock?: Maybe<Scalars['Boolean']>;
  use_config_manage_stock?: Maybe<Scalars['Boolean']>;
  stock_status_changed_auto?: Maybe<Scalars['Int']>;
  qty_increments?: Maybe<Scalars['Int']>;
  use_config_qty_increments?: Maybe<Scalars['Boolean']>;
  enable_qty_increments?: Maybe<Scalars['Boolean']>;
  use_config_enable_qty_increments?: Maybe<Scalars['Boolean']>;
  is_decimal_divided?: Maybe<Scalars['Boolean']>;
  show_default_notification_message?: Maybe<Scalars['Boolean']>;
};

export enum StockLevelStatus {
  FullStock = 'FULL_STOCK',
  MediumStock = 'MEDIUM_STOCK',
  OutOfStock = 'OUT_OF_STOCK'
}

export type Store = StoreInterface & {
  __typename?: 'Store';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  seller_code?: Maybe<Scalars['String']>;
  attribute_set_name?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<StoreCustomAttribute>;
  extension_attributes?: Maybe<StoreExtensionAttribute>;
};

export type StoreAddress = {
  __typename?: 'StoreAddress';
  id?: Maybe<Scalars['Int']>;
  retailer_id?: Maybe<Scalars['Int']>;
  coordinates?: Maybe<Coordinate>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['Int']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  postcode?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
};

export type StoreConfig = {
  __typename?: 'StoreConfig';
  id?: Maybe<Scalars['ID']>;
  code?: Maybe<Scalars['String']>;
  website_id?: Maybe<Scalars['Int']>;
  locale?: Maybe<Scalars['String']>;
  base_currency_code?: Maybe<Scalars['String']>;
  default_display_currency_code?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  weight_unit?: Maybe<Scalars['String']>;
  base_url?: Maybe<Scalars['String']>;
  base_link_url?: Maybe<Scalars['String']>;
  base_static_url?: Maybe<Scalars['String']>;
  base_media_url?: Maybe<Scalars['String']>;
  secure_base_url?: Maybe<Scalars['String']>;
  secure_base_link_url?: Maybe<Scalars['String']>;
  secure_base_static_url?: Maybe<Scalars['String']>;
  secure_base_media_url?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<ConfigExtensionAttribute>;
};

export type StoreCustomAttribute = {
  __typename?: 'StoreCustomAttribute';
  url_key?: Maybe<Scalars['String']>;
  show_contact_form?: Maybe<Scalars['String']>;
  inventory_source?: Maybe<Scalars['String']>;
  contact_phone?: Maybe<Scalars['String']>;
  contact_fax?: Maybe<Scalars['String']>;
  min_lead_time?: Maybe<Scalars['String']>;
  max_lead_time?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
};

export type StoreExtensionAttribute = {
  __typename?: 'StoreExtensionAttribute';
  address?: Maybe<StoreAddress>;
  opening_hours?: Maybe<Array<Maybe<Array<Maybe<OpenHourExtension>>>>>;
  special_opening_hours?: Maybe<Array<Maybe<Scalars['String']>>>;
  ispu_promise_delivery?: Maybe<Scalars['String']>;
  stock_low_indicator_threshold?: Maybe<Scalars['Int']>;
};

export type StoreInterface = {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  seller_code?: Maybe<Scalars['String']>;
  attribute_set_name?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<StoreCustomAttribute>;
  extension_attributes?: Maybe<StoreExtensionAttribute>;
};

export type StorePickupLocationsAvailable = {
  __typename?: 'StorePickupLocationsAvailable';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  storeCode?: Maybe<Scalars['String']>;
  isActive?: Maybe<Scalars['Boolean']>;
  address?: Maybe<PickupStoreLocationAddress>;
  openingHours?: Maybe<Array<Maybe<PickupStoreLocationOpeningHour>>>;
  image?: Maybe<Scalars['String']>;
  allowPickAtStore?: Maybe<Scalars['Boolean']>;
  isDisplayAsStoreInformation?: Maybe<Scalars['Boolean']>;
  storePickup?: Maybe<PickupStoreLocationStorePickup>;
  stockStatusCode?: Maybe<Scalars['String']>;
  stockStatusLabel?: Maybe<Scalars['String']>;
  distance?: Maybe<PickupStoresLocationDistance>;
};

export type StoreWithStockLevel = StoreInterface & {
  __typename?: 'StoreWithStockLevel';
  /** `id` is Store.id-Product.sku */
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  seller_code?: Maybe<Scalars['String']>;
  attribute_set_name?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<StoreCustomAttribute>;
  extension_attributes?: Maybe<StoreExtensionAttribute>;
  stock_level: StockLevelStatus;
  stock_quantity: Scalars['Int'];
};

export type SubDistrict = {
  __typename?: 'SubDistrict';
  subdistrict_id?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  district_code?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  default_name?: Maybe<Scalars['String']>;
  zip_code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type SubExtensionAttributes = {
  __typename?: 'subExtensionAttributes';
  cms_content?: Maybe<Scalars['String']>;
  cms_position?: Maybe<Scalars['String']>;
};

export type SubRegionId = {
  regionId?: Maybe<Scalars['String']>;
  districtId?: Maybe<Scalars['String']>;
};

export type Subscribe = {
  __typename?: 'Subscribe';
  success?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type T1CPromotion = {
  __typename?: 'T1CPromotion';
  redemption_rate?: Maybe<Scalars['Float']>;
  maximum_point_rate?: Maybe<Scalars['Int']>;
  redeemable_points?: Maybe<Array<Maybe<Scalars['Float']>>>;
  redeemable_amounts?: Maybe<Array<Maybe<Scalars['Float']>>>;
  rule_id?: Maybe<Scalars['Int']>;
  simple_action?: Maybe<Scalars['String']>;
  coupon_code?: Maybe<Scalars['String']>;
  is_active?: Maybe<Scalars['Boolean']>;
  from_date?: Maybe<Scalars['String']>;
  to_date?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['Float']>;
  discount_qty?: Maybe<Scalars['Int']>;
  discount_step?: Maybe<Scalars['Int']>;
};

export type T1cRedeem = {
  __typename?: 'T1cRedeem';
  t1_cnumber?: Maybe<Scalars['String']>;
  points_redeem?: Maybe<Scalars['String']>;
  points_total?: Maybe<Scalars['String']>;
  discount_amount?: Maybe<Scalars['String']>;
  discount_amount_formatted?: Maybe<Scalars['String']>;
};

export type T1cSpecialRate = {
  __typename?: 'T1cSpecialRate';
  entity_id?: Maybe<Scalars['Int']>;
  salesrule_id?: Maybe<Scalars['Int']>;
  redemption_rate?: Maybe<Scalars['Int']>;
  maximum_point_rate?: Maybe<Scalars['Int']>;
};

export enum TaxType {
  Personal = 'PERSONAL',
  Company = 'COMPANY'
}

export type TermItem = {
  __typename?: 'TermItem';
  text?: Maybe<Scalars['String']>;
  score?: Maybe<Scalars['Float']>;
  frequency?: Maybe<Scalars['Int']>;
};

export type TextProperty = {
  __typename?: 'TextProperty';
  text?: Maybe<Scalars['String']>;
};

export type TextStyle = {
  __typename?: 'TextStyle';
  textSize?: Maybe<Scalars['Float']>;
  textColor?: Maybe<Scalars['String']>;
  textAlignment?: Maybe<Scalars['String']>;
};

export type TheOneAccountInfo = {
  __typename?: 'TheOneAccountInfo';
  points?: Maybe<Scalars['Int']>;
  points_used?: Maybe<Scalars['Int']>;
  card_no?: Maybe<Scalars['Float']>;
  conversion_rate?: Maybe<Scalars['Int']>;
  min_allowed_points?: Maybe<Scalars['Int']>;
  max_allowed_points?: Maybe<Scalars['Int']>;
};

export type TierPricePromotion = {
  __typename?: 'TierPricePromotion';
  id: Scalars['ID'];
  name: Scalars['String'];
  amount: Scalars['Float'];
  extension_attributes: TierPricePromotionExtension;
  type: TierPricePromotionType;
};

export type TierPricePromotionExtension = {
  __typename?: 'TierPricePromotionExtension';
  qty_from?: Maybe<Scalars['Int']>;
  qty_to?: Maybe<Scalars['Int']>;
  applicable_store_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export enum TierPricePromotionType {
  FixedAmount = 'fixed_amount',
  SpecialPrice = 'special_price',
  PercentAmount = 'percent_amount'
}

export type TotalSegment = {
  __typename?: 'TotalSegment';
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['JSON']>;
  extension_attributes?: Maybe<Scalars['JSON']>;
};

export type TwoColumnVerticalCarouselProperty = {
  __typename?: 'TwoColumnVerticalCarouselProperty';
  title?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
};

export type UpdateCustomerAddressesRegion = {
  __typename?: 'UpdateCustomerAddressesRegion';
  region_code?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['Int']>;
};

export type UpdateCustomerExtensionAttributes = {
  is_subscribed?: Maybe<Scalars['Boolean']>;
};

export type UpdateInputCustomer = {
  id?: Maybe<Scalars['ID']>;
  group_id?: Maybe<Scalars['ID']>;
  created_at?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  created_in?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['String']>;
  default_shipping?: Maybe<Scalars['String']>;
  dob?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  taxvat?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  store_id?: Maybe<Scalars['Int']>;
  website_id?: Maybe<Scalars['Int']>;
  addresses?: Maybe<Scalars['JSON']>;
  disable_auto_group_change?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<UpdateCustomerExtensionAttributes>;
  custom_attributes?: Maybe<Scalars['JSON']>;
  is_subscribed?: Maybe<Scalars['Boolean']>;
  phone?: Maybe<Scalars['String']>;
  tax_id?: Maybe<Scalars['String']>;
  t1c_no?: Maybe<Scalars['String']>;
  t1c_phone?: Maybe<Scalars['String']>;
  language: Scalars['String'];
};

export type UpdateWishlistInput = {
  wishlist_id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  items?: Maybe<Array<Maybe<ItemInput>>>;
  visibility?: Maybe<Scalars['Int']>;
};

export type UpdateWishlistItemInput = {
  wishlist_item_id: Scalars['Int'];
  product_id?: Maybe<Scalars['Int']>;
  store_id?: Maybe<Scalars['Int']>;
  qty?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Array<Maybe<CustomAttributesInput>>>;
};

export type UploadImageInput = {
  base64Image?: Maybe<Array<Maybe<Base64Image>>>;
};

export type UploadImageResponse = {
  __typename?: 'UploadImageResponse';
  error?: Maybe<Scalars['Boolean']>;
  items?: Maybe<Array<Maybe<UploadImageResponseItem>>>;
};

export type UploadImageResponseItem = {
  __typename?: 'UploadImageResponseItem';
  error?: Maybe<Scalars['Boolean']>;
  message?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

export type UrlRedirect = {
  __typename?: 'UrlRedirect';
  target_path?: Maybe<Scalars['String']>;
  redirect_type?: Maybe<Scalars['Int']>;
};

export type UrlRewrite = {
  __typename?: 'UrlRewrite';
  entity_type?: Maybe<Scalars['String']>;
  entity_id?: Maybe<Scalars['Int']>;
  request_path?: Maybe<Scalars['String']>;
  target_path?: Maybe<Scalars['String']>;
  redirect_type?: Maybe<Scalars['Int']>;
  store_id?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  metadata?: Maybe<Array<Maybe<Metadata>>>;
};

export type V2Address = {
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['ID']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  region_code?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Int']>;
  save_in_address_book?: Maybe<Scalars['Int']>;
  custom_attributes?: Maybe<V2AddressCustomAttributes>;
  customer_id?: Maybe<Scalars['Int']>;
  address_id?: Maybe<Scalars['ID']>;
  address_name?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['ID']>;
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['ID']>;
  remark?: Maybe<Scalars['String']>;
  billing_type?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['ID']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
};

export type V2AddressCustomAttributes = {
  __typename?: 'V2AddressCustomAttributes';
  address_line?: Maybe<Scalars['String']>;
  address_name?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  remark?: Maybe<Scalars['String']>;
  house_no?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['String']>;
  subdistrict?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  fax?: Maybe<Scalars['String']>;
  soi?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
};

export type V2AddressInput = {
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['ID']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  region_code?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Int']>;
  save_in_address_book?: Maybe<Scalars['Int']>;
  customer_id?: Maybe<Scalars['Int']>;
  address_id?: Maybe<Scalars['ID']>;
  address_name?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['ID']>;
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['ID']>;
  remark?: Maybe<Scalars['String']>;
  billing_type?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['ID']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<AddressInputCustomAttributes>;
};

export type V2AmountRange = {
  __typename?: 'V2AmountRange';
  min: Scalars['Float'];
  max: Scalars['Float'];
};

export type V2Bank = {
  __typename?: 'V2Bank';
  id: Scalars['ID'];
  name: Scalars['String'];
  imageUrl: Scalars['String'];
};

export type V2Brand = {
  __typename?: 'V2Brand';
  id: Scalars['ID'];
  name: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  contentCss?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
  urlKey: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type V2Breadcrumb = {
  __typename?: 'V2Breadcrumb';
  id: Scalars['ID'];
  title: Scalars['String'];
  urlKey: Scalars['String'];
  level: Scalars['Int'];
};

export type V2Cart = {
  __typename?: 'V2Cart';
  id: Scalars['String'];
  flags: Array<V2CartFlag>;
  couponCodes: Array<Scalars['String']>;
  priceBreakdown: V2CartPriceBreakdown;
  sellers: Array<V2CartSeller>;
  giftMessage?: Maybe<Scalars['String']>;
};

export enum V2CartFlag {
  GiftWrapping = 'GIFT_WRAPPING'
}

export type V2CartItem = {
  __typename?: 'V2CartItem';
  id: Scalars['String'];
  quantity: Scalars['Int'];
  priceBreakdown: V2CartItemPriceBreakdown;
  product: V2Product;
  productOptions: Array<V2ProductOption>;
};

export type V2CartItemPriceBreakdown = {
  __typename?: 'V2CartItemPriceBreakdown';
  subtotal: Scalars['Float'];
  discount: Scalars['Float'];
  vat: Scalars['Float'];
  grandTotal: Scalars['Float'];
};

export type V2CartPriceBreakdown = {
  __typename?: 'V2CartPriceBreakdown';
  subtotal: Scalars['Float'];
  discount: Scalars['Float'];
  giftWrapping: Scalars['Float'];
  shipping: Scalars['Float'];
  vat: Scalars['Float'];
  creditCardOnTop: Scalars['Float'];
  the1Redemption: V2CartPriceBreakdownThe1Redemption;
  grandTotal: Scalars['Float'];
};

export type V2CartPriceBreakdownThe1Redemption = {
  __typename?: 'V2CartPriceBreakdownThe1Redemption';
  point: Scalars['Float'];
  discount: Scalars['Float'];
};

export type V2CartSeller = {
  __typename?: 'V2CartSeller';
  id: Scalars['String'];
  name: Scalars['String'];
  items: Array<V2CartItem>;
};

export type V2ConfigurableOption = {
  __typename?: 'V2ConfigurableOption';
  id: Scalars['ID'];
  label: Scalars['String'];
  attributeCode: Scalars['String'];
  values: Array<V2ConfigurableOptionValue>;
};

export enum V2ConfigurableOptionType {
  SwatchText = 'SWATCH_TEXT',
  SwatchColor = 'SWATCH_COLOR',
  SwatchImage = 'SWATCH_IMAGE'
}

export type V2ConfigurableOptionValue = {
  __typename?: 'V2ConfigurableOptionValue';
  id: Scalars['ID'];
  type: V2ConfigurableOptionType;
  label?: Maybe<Scalars['String']>;
  colorCode?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type V2ConfigurableProduct = V2Product & {
  __typename?: 'V2ConfigurableProduct';
  id: Scalars['ID'];
  brand?: Maybe<V2Brand>;
  breadcrumbs: Array<V2Breadcrumb>;
  mediaGallery: Array<V2Media>;
  name: Scalars['String'];
  urlKey: Scalars['String'];
  priceSummary: V2PriceSummary;
  priceRange: V2ConfigurableProductPriceRange;
  sku: Scalars['String'];
  type: V2ProductType;
  installmentPlans: Array<V2InstallmentPlan>;
  the1Redemption?: Maybe<V2The1Redemption>;
  overlayImageUrl?: Maybe<Scalars['String']>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  shortDescription?: Maybe<Scalars['String']>;
  purchaseLimit?: Maybe<V2PurchaseLimit>;
  shippingMethods: Array<V2ShippingMethod>;
  paymentMethods: Array<V2PaymentMethod>;
  options: Array<V2ConfigurableOption>;
  children: Array<V2ConfigurableProductChild>;
  badge?: Maybe<Scalars['String']>;
  preorder?: Maybe<V2Preorder>;
  flashdeal?: Maybe<V2Flashdeal>;
  rating?: Maybe<V2Rating>;
  flags: Array<V2ProductFlag>;
  seller: V2Seller;
  promotions: Array<V2Promotion>;
  promotionTag?: Maybe<Scalars['String']>;
  reviews: Array<V2Review>;
  links: V2ProductLinks;
  createdAt?: Maybe<Scalars['DateTime']>;
};

export type V2ConfigurableProductChild = {
  __typename?: 'V2ConfigurableProductChild';
  options: Array<V2ProductOption>;
  product: V2Product;
};

export type V2ConfigurableProductPriceRange = {
  __typename?: 'V2ConfigurableProductPriceRange';
  original: Array<Scalars['Float']>;
  final: Array<Scalars['Float']>;
  discount?: Maybe<Array<V2Discount>>;
};

export type V2DateRange = {
  __typename?: 'V2DateRange';
  from?: Maybe<Scalars['DateTime']>;
  to?: Maybe<Scalars['DateTime']>;
};

export type V2DeliveryOptionByPostcode = {
  __typename?: 'V2DeliveryOptionByPostcode';
  title: Scalars['String'];
  postcode?: Maybe<Scalars['String']>;
  methods: Array<V2DeliveryOptionByPostcodeDeliveryMethod>;
};

export type V2DeliveryOptionByPostcodeDeliveryMethod = {
  __typename?: 'V2DeliveryOptionByPostcodeDeliveryMethod';
  method?: Maybe<Scalars['String']>;
  label?: Maybe<Scalars['String']>;
  leadTimes?: Maybe<Scalars['String']>;
  freeLabel?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['String']>;
};

export type V2DeliveryOptionByPostcodeInput = {
  sku: Scalars['String'];
  postcode?: Maybe<Scalars['String']>;
  lat?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['String']>;
};

export enum V2Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type V2Discount = {
  __typename?: 'V2Discount';
  amount: Scalars['Float'];
  percentage: Scalars['Float'];
  effectiveDateRange?: Maybe<V2DateRange>;
};

export type V2ExtensionAttributesInput = {
  pickup_store?: Maybe<V2PickupStoreInput>;
  pickup_location_id?: Maybe<Scalars['ID']>;
};

export type V2Flashdeal = {
  __typename?: 'V2Flashdeal';
  effectiveDateRange: V2DateRange;
  quantity: V2FlashdealQuantity;
};

export type V2FlashdealQuantity = {
  __typename?: 'V2FlashdealQuantity';
  sale: Scalars['Int'];
  available: Scalars['Int'];
  sold: Scalars['Int'];
};

export type V2InstallmentPlan = {
  __typename?: 'V2InstallmentPlan';
  id: Scalars['ID'];
  title: Scalars['String'];
  period: Scalars['Int'];
  interestRate: Scalars['Float'];
  validDateRange: V2DateRange;
  amountRange: V2AmountRange;
  bank: V2Bank;
};

export type V2LineItems = {
  __typename?: 'V2LineItems';
  entity_id?: Maybe<Scalars['ID']>;
  line_id: Scalars['ID'];
  line_number?: Maybe<Scalars['String']>;
};

export type V2LineItemsInput = {
  line_id: Scalars['ID'];
  line_number?: Maybe<Scalars['String']>;
};

export type V2Media = {
  __typename?: 'V2Media';
  id: Scalars['ID'];
  type: V2MediaType;
  url: Scalars['String'];
  title: Scalars['String'];
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export enum V2MediaType {
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type V2MethodData = {
  __typename?: 'V2MethodData';
  carrier_title?: Maybe<Scalars['String']>;
  method_title?: Maybe<Scalars['String']>;
  carrier_code?: Maybe<Scalars['String']>;
  method_code?: Maybe<Scalars['String']>;
  method_labels?: Maybe<V2MethodLabels>;
};

export type V2MethodLabels = {
  __typename?: 'V2MethodLabels';
  label?: Maybe<Scalars['String']>;
  date_time?: Maybe<Scalars['String']>;
};

export type V2MultiShipping = {
  __typename?: 'V2MultiShipping';
  shipping_address?: Maybe<V2MultiShippingAddress>;
  billing_address?: Maybe<V2ShippingAddress>;
  shipping_carrier_code?: Maybe<Scalars['String']>;
  shipping_method_code?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<V2ShippingExtensionAttributes>;
};

export type V2MultiShippingAddress = V2Address & {
  __typename?: 'V2MultiShippingAddress';
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['ID']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  region_code?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Int']>;
  save_in_address_book?: Maybe<Scalars['Int']>;
  custom_attributes?: Maybe<V2AddressCustomAttributes>;
  customer_id?: Maybe<Scalars['Int']>;
  address_id?: Maybe<Scalars['ID']>;
  address_name?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['ID']>;
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['ID']>;
  remark?: Maybe<Scalars['String']>;
  billing_type?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['ID']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<V2ShippingAddressExtensionAttributes>;
};

export type V2PackageInput = {
  line_items: Array<V2LineItemsInput>;
  stock_id: Scalars['ID'];
  carrier_code: Scalars['String'];
  method_code: Scalars['String'];
  sub_package?: Maybe<V2SubPackageInput>;
};

export type V2PackageOptionProduct = {
  __typename?: 'V2PackageOptionProduct';
  detail?: Maybe<V2Product>;
  product_id: Scalars['ID'];
  item_id: Scalars['ID'];
  sku?: Maybe<Scalars['String']>;
  qty_available_current_sku?: Maybe<Scalars['Int']>;
};

export type V2PackageOptionResponse = {
  __typename?: 'V2PackageOptionResponse';
  product?: Maybe<Array<Maybe<V2PackageOptionProduct>>>;
  line_items?: Maybe<Array<Maybe<V2LineItems>>>;
  delivery_method?: Maybe<Scalars['String']>;
  stock_id: Scalars['ID'];
  is_package_available?: Maybe<Scalars['Boolean']>;
  has_sub_package?: Maybe<Scalars['Boolean']>;
  qty_data?: Maybe<V2QtyData>;
  method_data?: Maybe<V2MethodData>;
  sub_package: Array<V2SubPackage>;
};

export enum V2PaymentMethod {
  CashOnDelivery = 'CASH_ON_DELIVERY',
  FullPayment = 'FULL_PAYMENT',
  Installment = 'INSTALLMENT',
  BankTransfer = 'BANK_TRANSFER',
  PayAtStore = 'PAY_AT_STORE',
  LinePay = 'LINE_PAY'
}

export type V2PickupStore = {
  __typename?: 'V2PickupStore';
  store_id?: Maybe<Scalars['ID']>;
  pickup_store_id?: Maybe<Scalars['ID']>;
  receiver_name?: Maybe<Scalars['String']>;
  receiver_phone?: Maybe<Scalars['String']>;
};

export type V2PickupStoreInput = {
  store_id?: Maybe<Scalars['ID']>;
  pickup_store_id?: Maybe<Scalars['ID']>;
  receiver_name?: Maybe<Scalars['String']>;
  receiver_phone?: Maybe<Scalars['String']>;
};

export type V2Preorder = {
  __typename?: 'V2Preorder';
  shippingDateTime: Scalars['DateTime'];
};

export type V2PriceSummary = {
  __typename?: 'V2PriceSummary';
  original: Scalars['Float'];
  final: Scalars['Float'];
  discount?: Maybe<V2Discount>;
};

export type V2Product = {
  id: Scalars['ID'];
  brand?: Maybe<V2Brand>;
  breadcrumbs: Array<V2Breadcrumb>;
  mediaGallery: Array<V2Media>;
  urlKey: Scalars['String'];
  name: Scalars['String'];
  priceSummary: V2PriceSummary;
  sku: Scalars['String'];
  type: V2ProductType;
  overlayImageUrl?: Maybe<Scalars['String']>;
  installmentPlans: Array<V2InstallmentPlan>;
  the1Redemption?: Maybe<V2The1Redemption>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  shortDescription?: Maybe<Scalars['String']>;
  purchaseLimit?: Maybe<V2PurchaseLimit>;
  shippingMethods: Array<V2ShippingMethod>;
  paymentMethods: Array<V2PaymentMethod>;
  badge?: Maybe<Scalars['String']>;
  flags: Array<V2ProductFlag>;
  seller: V2Seller;
  preorder?: Maybe<V2Preorder>;
  promotions: Array<V2Promotion>;
  promotionTag?: Maybe<Scalars['String']>;
  flashdeal?: Maybe<V2Flashdeal>;
  reviews: Array<V2Review>;
  rating?: Maybe<V2Rating>;
  links: V2ProductLinks;
  createdAt?: Maybe<Scalars['DateTime']>;
};

export enum V2ProductFlag {
  New = 'NEW',
  Marketplace = 'MARKETPLACE',
  OnlineExclusive = 'ONLINE_EXCLUSIVE',
  GiftWrapping = 'GIFT_WRAPPING',
  InStock = 'IN_STOCK',
  OnlyAtCentral = 'ONLY_AT_CENTRAL',
  Beauty = 'BEAUTY',
  AllowReturn = 'ALLOW_RETURN',
  AllowExpress = 'ALLOW_EXPRESS',
  PreOrder = 'PRE_ORDER',
  ByOrder = 'BY_ORDER',
  OnlineSalable = 'ONLINE_SALABLE',
  OfflineSalable = 'OFFLINE_SALABLE'
}

export type V2ProductLinks = {
  __typename?: 'V2ProductLinks';
  related: Array<V2Product>;
  upSell: Array<V2Product>;
  crossSell: Array<V2Product>;
};

export type V2ProductOption = {
  __typename?: 'V2ProductOption';
  id: Scalars['ID'];
  label: Scalars['String'];
  attributeCode: Scalars['String'];
  value: V2ConfigurableOptionValue;
};

export type V2ProductSearchFilterCategoryResult = V2ProductSearchFilterResult & {
  __typename?: 'V2ProductSearchFilterCategoryResult';
  id: Scalars['String'];
  label: Scalars['String'];
  options: Array<V2ProductSearchFilterCategoryResultOption>;
};

export type V2ProductSearchFilterCategoryResultOption = {
  __typename?: 'V2ProductSearchFilterCategoryResultOption';
  id: Scalars['String'];
  label: Scalars['String'];
  productCount: Scalars['Int'];
  children: Array<V2ProductSearchFilterCategoryResultOption>;
};

export enum V2ProductSearchFilterConditionInput {
  Eq = 'EQ',
  In = 'IN',
  Gte = 'GTE',
  Lte = 'LTE'
}

export type V2ProductSearchFilterInput = {
  id: Scalars['String'];
  optionIds: Array<Scalars['String']>;
  condition: V2ProductSearchFilterConditionInput;
};

export type V2ProductSearchFilterNormalResult = V2ProductSearchFilterResult & {
  __typename?: 'V2ProductSearchFilterNormalResult';
  id: Scalars['String'];
  label: Scalars['String'];
  options: Array<V2ProductSearchFilterNormalResultOption>;
};

export type V2ProductSearchFilterNormalResultOption = {
  __typename?: 'V2ProductSearchFilterNormalResultOption';
  id: Scalars['String'];
  label: Scalars['String'];
  productCount: Scalars['Int'];
};

export type V2ProductSearchFilterRangeResult = V2ProductSearchFilterResult & {
  __typename?: 'V2ProductSearchFilterRangeResult';
  id: Scalars['String'];
  label: Scalars['String'];
  options: Array<V2ProductSearchFilterRangeResultOption>;
};

export type V2ProductSearchFilterRangeResultOption = {
  __typename?: 'V2ProductSearchFilterRangeResultOption';
  id: Scalars['String'];
  label: Scalars['String'];
  value: Scalars['Float'];
};

export type V2ProductSearchFilterResult = {
  id: Scalars['String'];
  label: Scalars['String'];
};

export type V2ProductSearchFilterResultUnion = V2ProductSearchFilterNormalResult | V2ProductSearchFilterRangeResult | V2ProductSearchFilterCategoryResult;

export type V2ProductSearchInput = {
  page: Scalars['Int'];
  limit: Scalars['Int'];
  filters: Array<Maybe<V2ProductSearchFilterInput>>;
  sort?: Maybe<V2ProductSearchSortInput>;
  keyword?: Maybe<Scalars['String']>;
};

export type V2ProductSearchResult = {
  __typename?: 'V2ProductSearchResult';
  totalCount: Scalars['Int'];
  filters?: Maybe<Array<V2ProductSearchFilterResultUnion>>;
  products: Array<V2Product>;
  sorts: Array<V2ProductSearchSortResult>;
};

export type V2ProductSearchSortInput = {
  id: Scalars['String'];
  direction: V2Direction;
};

export type V2ProductSearchSortResult = {
  __typename?: 'V2ProductSearchSortResult';
  id: Scalars['String'];
  label: Scalars['String'];
  direction: V2Direction;
};

export enum V2ProductType {
  Simple = 'SIMPLE',
  Configurable = 'CONFIGURABLE',
  Bundle = 'BUNDLE',
  Virtual = 'VIRTUAL'
}

export type V2Promotion = {
  __typename?: 'V2Promotion';
  id: Scalars['String'];
  title: Scalars['String'];
  description: Scalars['String'];
  effectiveDateRange: V2DateRange;
};

export type V2PurchaseLimit = {
  __typename?: 'V2PurchaseLimit';
  quantity: V2AmountRange;
};

export type V2QtyData = {
  __typename?: 'V2QtyData';
  total_qty_available_in_package?: Maybe<Scalars['Int']>;
  total_qty_for_current_package?: Maybe<Scalars['Int']>;
  total_qty_ordered_in_cart?: Maybe<Scalars['Int']>;
};

export type V2Rating = {
  __typename?: 'V2Rating';
  average: Scalars['Float'];
  totalVoteCount: Scalars['Int'];
};

export type V2Review = {
  __typename?: 'V2Review';
  id: Scalars['ID'];
  title: Scalars['String'];
  detail: Scalars['String'];
  imageUrls: Array<Scalars['String']>;
  reviewer: V2Reviewer;
  rating: Scalars['Float'];
  createdAt?: Maybe<Scalars['DateTime']>;
};

export type V2Reviewer = {
  __typename?: 'V2Reviewer';
  name: Scalars['String'];
  email: Scalars['String'];
  province?: Maybe<Place>;
};

export type V2Seller = {
  __typename?: 'V2Seller';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type V2SetShippingInformationInput = {
  package?: Maybe<V2PackageInput>;
  billing_address: V2AddressInput;
  shipping_address: V2AddressInput;
  extension_attributes?: Maybe<V2ExtensionAttributesInput>;
  carrier_code?: Maybe<Scalars['String']>;
  method_code?: Maybe<Scalars['String']>;
};

export type V2ShippingAddress = V2Address & {
  __typename?: 'V2ShippingAddress';
  firstname?: Maybe<Scalars['String']>;
  lastname?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  telephone?: Maybe<Scalars['String']>;
  country_id?: Maybe<Scalars['String']>;
  street?: Maybe<Array<Maybe<Scalars['String']>>>;
  vat_id?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  region_id?: Maybe<Scalars['ID']>;
  region?: Maybe<Scalars['String']>;
  postcode?: Maybe<Scalars['String']>;
  default_billing?: Maybe<Scalars['Boolean']>;
  default_shipping?: Maybe<Scalars['Boolean']>;
  region_code?: Maybe<Scalars['String']>;
  same_as_billing?: Maybe<Scalars['Int']>;
  save_in_address_book?: Maybe<Scalars['Int']>;
  custom_attributes?: Maybe<V2AddressCustomAttributes>;
  customer_id?: Maybe<Scalars['Int']>;
  address_id?: Maybe<Scalars['ID']>;
  address_name?: Maybe<Scalars['String']>;
  address_line?: Maybe<Scalars['String']>;
  customer_address_type?: Maybe<Scalars['String']>;
  building?: Maybe<Scalars['String']>;
  district?: Maybe<Scalars['String']>;
  district_id?: Maybe<Scalars['ID']>;
  subdistrict?: Maybe<Scalars['String']>;
  subdistrict_id?: Maybe<Scalars['ID']>;
  remark?: Maybe<Scalars['String']>;
  billing_type?: Maybe<Scalars['String']>;
  branch_id?: Maybe<Scalars['ID']>;
  full_tax_request?: Maybe<Scalars['String']>;
  full_tax_type?: Maybe<Scalars['String']>;
};

export type V2ShippingAddressExtensionAttributes = {
  __typename?: 'V2ShippingAddressExtensionAttributes';
  lines?: Maybe<Array<Maybe<V2ShippingAddressExtensionAttributesLines>>>;
  extra_addresses?: Maybe<Array<Maybe<V2MultiShippingAddress>>>;
};

export type V2ShippingAddressExtensionAttributesLines = {
  __typename?: 'V2ShippingAddressExtensionAttributesLines';
  line_id?: Maybe<Scalars['ID']>;
  line_number?: Maybe<Scalars['Int']>;
  extension_attributes?: Maybe<V2ShippingAddressLinesExtensionAttributes>;
};

export type V2ShippingAddressLinesExtensionAttributes = {
  __typename?: 'V2ShippingAddressLinesExtensionAttributes';
  shipping_information?: Maybe<V2ShippingAddressShippingInformation>;
};

export type V2ShippingAddressShippingInformation = {
  __typename?: 'V2ShippingAddressShippingInformation';
  shipping_method_code?: Maybe<Scalars['String']>;
  shipping_carrier_code?: Maybe<Scalars['String']>;
};

export type V2ShippingExtensionAttributes = {
  __typename?: 'V2ShippingExtensionAttributes';
  pickup_store?: Maybe<V2PickupStore>;
  pickup_location_id?: Maybe<Scalars['ID']>;
  stock_ids_request?: Maybe<Array<Maybe<V2StockIdsRequest>>>;
};

export enum V2ShippingMethod {
  StandardPickUp = 'STANDARD_PICK_UP',
  TwoHoursPickUp = 'TWO_HOURS_PICK_UP',
  StandardDelivery = 'STANDARD_DELIVERY',
  SameDayDelivery = 'SAME_DAY_DELIVERY',
  NextDayDelivery = 'NEXT_DAY_DELIVERY',
  ThreeHoursDelivery = 'THREE_HOURS_DELIVERY'
}

export type V2SimpleProduct = V2Product & {
  __typename?: 'V2SimpleProduct';
  id: Scalars['ID'];
  brand?: Maybe<V2Brand>;
  breadcrumbs: Array<V2Breadcrumb>;
  urlKey: Scalars['String'];
  mediaGallery: Array<V2Media>;
  name: Scalars['String'];
  priceSummary: V2PriceSummary;
  sku: Scalars['String'];
  type: V2ProductType;
  installmentPlans: Array<V2InstallmentPlan>;
  the1Redemption?: Maybe<V2The1Redemption>;
  overlayImageUrl?: Maybe<Scalars['String']>;
  thumbnailUrl?: Maybe<Scalars['String']>;
  description: Scalars['String'];
  shortDescription?: Maybe<Scalars['String']>;
  purchaseLimit?: Maybe<V2PurchaseLimit>;
  shippingMethods: Array<V2ShippingMethod>;
  paymentMethods: Array<V2PaymentMethod>;
  badge?: Maybe<Scalars['String']>;
  flags: Array<V2ProductFlag>;
  seller: V2Seller;
  preorder?: Maybe<V2Preorder>;
  promotions: Array<V2Promotion>;
  promotionTag?: Maybe<Scalars['String']>;
  flashdeal?: Maybe<V2Flashdeal>;
  reviews: Array<V2Review>;
  rating?: Maybe<V2Rating>;
  links: V2ProductLinks;
  createdAt?: Maybe<Scalars['DateTime']>;
};

export type V2SingleShipping = {
  __typename?: 'V2SingleShipping';
  shipping_address?: Maybe<V2ShippingAddress>;
  billing_address?: Maybe<V2ShippingAddress>;
  shipping_carrier_code?: Maybe<Scalars['String']>;
  shipping_method_code?: Maybe<Scalars['String']>;
  extension_attributes?: Maybe<V2ShippingExtensionAttributes>;
};

export type V2StockIdsRequest = {
  __typename?: 'V2StockIdsRequest';
  stock_id?: Maybe<Scalars['ID']>;
  line_id?: Maybe<Scalars['ID']>;
  line_number?: Maybe<Scalars['Int']>;
};

export type V2SubPackage = {
  __typename?: 'V2SubPackage';
  product?: Maybe<Array<Maybe<V2PackageOptionProduct>>>;
  line_items?: Maybe<Array<Maybe<V2LineItems>>>;
  delivery_method?: Maybe<Scalars['String']>;
  stock_id: Scalars['ID'];
  is_package_available?: Maybe<Scalars['Boolean']>;
  has_sub_package?: Maybe<Scalars['Boolean']>;
  qty_data?: Maybe<V2QtyData>;
  method_data?: Maybe<V2MethodData>;
};

export type V2SubPackageInput = {
  line_items: Array<V2LineItemsInput>;
  stock_id: Scalars['ID'];
  carrier_code: Scalars['String'];
  method_code: Scalars['String'];
};

export type V2SuggestSearchCategory = {
  __typename?: 'V2SuggestSearchCategory';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
  urlPath?: Maybe<Scalars['String']>;
  isGtm?: Maybe<Scalars['Boolean']>;
};

export type V2SuggestSearchInput = {
  keyword: Scalars['String'];
  productSize?: Maybe<Scalars['Int']>;
  categorySize?: Maybe<Scalars['Int']>;
  suggestionTermSize?: Maybe<Scalars['Int']>;
};

export type V2SuggestSearchResult = {
  __typename?: 'V2SuggestSearchResult';
  products: Array<V2Product>;
  categories: Array<V2SuggestSearchCategory>;
  suggestionTerms: Array<Scalars['String']>;
};


export type V2SuggestSearchResultSuggestionTermsArgs = {
  input?: Maybe<V2SuggestSearchInput>;
};

export type V2The1Redemption = {
  __typename?: 'V2The1Redemption';
  earnPoint: Scalars['Int'];
  redeemPoint: Scalars['Int'];
};

export type V2TrendSearchResult = {
  __typename?: 'V2TrendSearchResult';
  trendingTerms: Array<Scalars['String']>;
};

export type VideoContent = {
  __typename?: 'VideoContent';
  media_type?: Maybe<Scalars['String']>;
  video_provider?: Maybe<Scalars['String']>;
  video_url?: Maybe<Scalars['String']>;
  video_title?: Maybe<Scalars['String']>;
  video_description?: Maybe<Scalars['String']>;
  video_metadata?: Maybe<Scalars['String']>;
};

export type VideoProperty = {
  __typename?: 'VideoProperty';
  videoId?: Maybe<Scalars['String']>;
};

export type VideoStyle = {
  __typename?: 'VideoStyle';
  autoplay?: Maybe<Scalars['Boolean']>;
};

export enum ViewType {
  Text = 'TEXT',
  Image = 'IMAGE',
  Banner = 'BANNER',
  OneColumnHorizontalCarousel = 'ONE_COLUMN_HORIZONTAL_CAROUSEL',
  TwoColumnVerticalCarousel = 'TWO_COLUMN_VERTICAL_CAROUSEL',
  Divider = 'DIVIDER',
  Video = 'VIDEO',
  Header = 'HEADER',
  Button = 'BUTTON',
  Product = 'PRODUCT',
  ProductScroll = 'PRODUCT_SCROLL',
  ImageLabel = 'IMAGE_LABEL'
}

export type VipInterestInput = {
  url: Scalars['String'];
  t1No: Scalars['String'];
  ids: Scalars['String'];
};

export type VipInterestResponse = {
  __typename?: 'VipInterestResponse';
  status?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ids?: Maybe<Scalars['String']>;
  need_assistance?: Maybe<Scalars['Int']>;
};

export type VipListResponse = {
  __typename?: 'VipListResponse';
  status?: Maybe<Scalars['Boolean']>;
  urls?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type VipNeedAssistanceInput = {
  url: Scalars['String'];
  t1No: Scalars['String'];
};

export type VipNeedAssistanceResponse = {
  __typename?: 'VipNeedAssistanceResponse';
  status?: Maybe<Scalars['Boolean']>;
  urls?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type VipValidateInput = {
  url: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  t1No: Scalars['String'];
};

export type VipValidateResponse = {
  __typename?: 'VipValidateResponse';
  status?: Maybe<Scalars['Boolean']>;
  url?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ids?: Maybe<Scalars['String']>;
  need_assistance?: Maybe<Scalars['Int']>;
  token?: Maybe<Scalars['String']>;
  t1No?: Maybe<Scalars['String']>;
};

export type Wishlist = {
  __typename?: 'Wishlist';
  wishlist_id: Scalars['Int'];
  customer_id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  sharing_code?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['String']>;
  visibility?: Maybe<Scalars['Int']>;
  shared?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<WishlistItem>>>;
};

export type WishlistFilterInput = {
  field?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type WishlistItem = {
  __typename?: 'WishlistItem';
  wishlist_item_id: Scalars['Int'];
  wishlist_id: Scalars['Int'];
  product_id?: Maybe<Scalars['Int']>;
  store_id?: Maybe<Scalars['Int']>;
  added_at?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  qty?: Maybe<Scalars['String']>;
  product_name?: Maybe<Scalars['String']>;
  product?: Maybe<Product>;
  sku?: Maybe<Scalars['String']>;
  custom_attributes?: Maybe<Array<Maybe<CustomAttributes>>>;
};

export type WishlistItemSearchResult = {
  __typename?: 'WishlistItemSearchResult';
  items?: Maybe<Array<Maybe<WishlistItem>>>;
  total_count?: Maybe<Scalars['Int']>;
};

export type Wishlists = {
  __typename?: 'Wishlists';
  items?: Maybe<Array<Maybe<Wishlist>>>;
  total_count?: Maybe<Scalars['Int']>;
};

export type WishlistSearchResult = {
  __typename?: 'WishlistSearchResult';
  items?: Maybe<Array<Maybe<Wishlist>>>;
};

export type CardFragmentFragment = (
  { __typename?: 'Card' }
  & Pick<Card, 'id' | 'type' | 'masked_number' | 'is_default' | 'expiry_month' | 'expiry_year' | 'bank_id' | 'bank_name'>
  & { bank?: Maybe<(
    { __typename?: 'Bank' }
    & Pick<Bank, 'name' | 'image' | 'icon' | 'color' | 'id' | 'active'>
  )> }
);

export type SetPaymentInformationMutationVariables = Exact<{
  input: PaymentInformationInput;
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
}>;


export type SetPaymentInformationMutation = (
  { __typename?: 'Mutation' }
  & { setPaymentInformation?: Maybe<(
    { __typename?: 'SetPaymentInfoResponse' }
    & Pick<SetPaymentInfoResponse, 'message' | 'order' | 'redirect_url'>
    & { payment_offline?: Maybe<(
      { __typename?: 'PaymentOfflineResponse' }
      & Pick<PaymentOfflineResponse, 'key'>
      & { detail?: Maybe<(
        { __typename?: 'PaymentOffileDetail' }
        & Pick<PaymentOffileDetail, 'orderId'>
      )> }
    )>, request_form?: Maybe<(
      { __typename?: 'PaymentRequestForm' }
      & Pick<PaymentRequestForm, 'url'>
      & { payload: (
        { __typename?: 'PaymentFormPayload' }
        & Pick<PaymentFormPayload, 'paymentRequest'>
      ) }
    )> }
  )> }
);

export type CardsQueryVariables = Exact<{
  sort?: Maybe<CardSort>;
}>;


export type CardsQuery = (
  { __typename?: 'Query' }
  & { cards: Array<(
    { __typename?: 'Card' }
    & CardFragmentFragment
  )> }
);

export type PaymentMethodsQueryVariables = Exact<{
  cartId?: Maybe<Scalars['String']>;
  isGuest?: Maybe<Scalars['Boolean']>;
  childrenIds?: Maybe<Array<Scalars['String']>>;
}>;


export type PaymentMethodsQuery = (
  { __typename?: 'Query' }
  & { paymentInformations?: Maybe<(
    { __typename?: 'PaymentInformations' }
    & { payment_methods?: Maybe<Array<Maybe<(
      { __typename?: 'PaymentMethod' }
      & Pick<PaymentMethod, 'code' | 'title'>
    )>>>, extension_attributes?: Maybe<(
      { __typename?: 'PaymentExtensionAttributes' }
      & Pick<PaymentExtensionAttributes, 'is_payment_promotion_locked'>
      & { p2c2p_payment_options?: Maybe<Array<Maybe<(
        { __typename?: 'P2c2pPaymentOption' }
        & Pick<P2c2pPaymentOption, 'payment' | 'code'>
      )>>>, p2c2p_payment_agents?: Maybe<Array<Maybe<(
        { __typename?: 'P2c2pPaymentAgent' }
        & Pick<P2c2pPaymentAgent, 'agent_id' | 'name' | 'code' | 'type' | 'channel' | 'agent_image'>
      )>>>, p2c2p_credit_card_promotions?: Maybe<Array<Maybe<(
        { __typename?: 'P2c2pCreditCardPromotion' }
        & Pick<P2c2pCreditCardPromotion, 'promotion_id' | 'bank' | 'description' | 'card_type' | 'card_name' | 'card_image' | 'banner' | 'promotion_code' | 'payment_method' | 'ipp_plan' | 'bank_color' | 'bank_icon' | 'simple_action' | 'discount_amount'>
      )>>> }
    )> }
  )> }
);

export type StoreConfigsQueryVariables = Exact<{ [key: string]: never; }>;


export type StoreConfigsQuery = (
  { __typename?: 'Query' }
  & { storeConfigs?: Maybe<Array<Maybe<(
    { __typename?: 'StoreConfig' }
    & Pick<StoreConfig, 'code'>
  )>>> }
);

export const CardFragmentFragmentDoc = gql`
    fragment cardFragment on Card {
  id
  type
  masked_number
  is_default
  expiry_month
  expiry_year
  bank_id
  bank_name
  bank {
    name
    image
    icon
    color
    id
    active
  }
}
    `;
export const SetPaymentInformationDocument = gql`
    mutation setPaymentInformation($input: PaymentInformationInput!, $cartId: String, $isGuest: Boolean) {
  setPaymentInformation(input: $input, cartId: $cartId, isGuest: $isGuest) {
    message
    order
    redirect_url
    payment_offline {
      detail {
        orderId
      }
      key
    }
    request_form {
      url
      payload {
        paymentRequest
      }
    }
  }
}
    `;
export type SetPaymentInformationMutationFn = ApolloReactCommon.MutationFunction<SetPaymentInformationMutation, SetPaymentInformationMutationVariables>;

/**
 * __useSetPaymentInformationMutation__
 *
 * To run a mutation, you first call `useSetPaymentInformationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPaymentInformationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPaymentInformationMutation, { data, loading, error }] = useSetPaymentInformationMutation({
 *   variables: {
 *      input: // value for 'input'
 *      cartId: // value for 'cartId'
 *      isGuest: // value for 'isGuest'
 *   },
 * });
 */
export function useSetPaymentInformationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetPaymentInformationMutation, SetPaymentInformationMutationVariables>) {
        return ApolloReactHooks.useMutation<SetPaymentInformationMutation, SetPaymentInformationMutationVariables>(SetPaymentInformationDocument, baseOptions);
      }
export type SetPaymentInformationMutationHookResult = ReturnType<typeof useSetPaymentInformationMutation>;
export type SetPaymentInformationMutationResult = ApolloReactCommon.MutationResult<SetPaymentInformationMutation>;
export type SetPaymentInformationMutationOptions = ApolloReactCommon.BaseMutationOptions<SetPaymentInformationMutation, SetPaymentInformationMutationVariables>;
export const CardsDocument = gql`
    query cards($sort: CardSort) {
  cards(sort: $sort) {
    ...cardFragment
  }
}
    ${CardFragmentFragmentDoc}`;

/**
 * __useCardsQuery__
 *
 * To run a query within a React component, call `useCardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsQuery({
 *   variables: {
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useCardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CardsQuery, CardsQueryVariables>) {
        return ApolloReactHooks.useQuery<CardsQuery, CardsQueryVariables>(CardsDocument, baseOptions);
      }
export function useCardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CardsQuery, CardsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CardsQuery, CardsQueryVariables>(CardsDocument, baseOptions);
        }
export type CardsQueryHookResult = ReturnType<typeof useCardsQuery>;
export type CardsLazyQueryHookResult = ReturnType<typeof useCardsLazyQuery>;
export type CardsQueryResult = ApolloReactCommon.QueryResult<CardsQuery, CardsQueryVariables>;
export const PaymentMethodsDocument = gql`
    query paymentMethods($cartId: String, $isGuest: Boolean, $childrenIds: [String!]) {
  paymentInformations(isGuest: $isGuest, cartId: $cartId, childrenIds: $childrenIds) {
    payment_methods {
      code
      title
    }
    extension_attributes {
      is_payment_promotion_locked
      p2c2p_payment_options {
        payment
        code
      }
      p2c2p_payment_agents {
        agent_id
        name
        code
        type
        channel
        agent_image
      }
      p2c2p_credit_card_promotions {
        promotion_id
        bank
        description
        card_type
        card_name
        card_image
        banner
        promotion_code
        payment_method
        ipp_plan
        bank_color
        bank_icon
        simple_action
        discount_amount
      }
    }
  }
}
    `;

/**
 * __usePaymentMethodsQuery__
 *
 * To run a query within a React component, call `usePaymentMethodsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentMethodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentMethodsQuery({
 *   variables: {
 *      cartId: // value for 'cartId'
 *      isGuest: // value for 'isGuest'
 *      childrenIds: // value for 'childrenIds'
 *   },
 * });
 */
export function usePaymentMethodsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PaymentMethodsQuery, PaymentMethodsQueryVariables>) {
        return ApolloReactHooks.useQuery<PaymentMethodsQuery, PaymentMethodsQueryVariables>(PaymentMethodsDocument, baseOptions);
      }
export function usePaymentMethodsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PaymentMethodsQuery, PaymentMethodsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<PaymentMethodsQuery, PaymentMethodsQueryVariables>(PaymentMethodsDocument, baseOptions);
        }
export type PaymentMethodsQueryHookResult = ReturnType<typeof usePaymentMethodsQuery>;
export type PaymentMethodsLazyQueryHookResult = ReturnType<typeof usePaymentMethodsLazyQuery>;
export type PaymentMethodsQueryResult = ApolloReactCommon.QueryResult<PaymentMethodsQuery, PaymentMethodsQueryVariables>;
export const StoreConfigsDocument = gql`
    query storeConfigs {
  storeConfigs {
    code
  }
}
    `;

/**
 * __useStoreConfigsQuery__
 *
 * To run a query within a React component, call `useStoreConfigsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStoreConfigsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStoreConfigsQuery({
 *   variables: {
 *   },
 * });
 */
export function useStoreConfigsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StoreConfigsQuery, StoreConfigsQueryVariables>) {
        return ApolloReactHooks.useQuery<StoreConfigsQuery, StoreConfigsQueryVariables>(StoreConfigsDocument, baseOptions);
      }
export function useStoreConfigsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StoreConfigsQuery, StoreConfigsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<StoreConfigsQuery, StoreConfigsQueryVariables>(StoreConfigsDocument, baseOptions);
        }
export type StoreConfigsQueryHookResult = ReturnType<typeof useStoreConfigsQuery>;
export type StoreConfigsLazyQueryHookResult = ReturnType<typeof useStoreConfigsLazyQuery>;
export type StoreConfigsQueryResult = ApolloReactCommon.QueryResult<StoreConfigsQuery, StoreConfigsQueryVariables>;
