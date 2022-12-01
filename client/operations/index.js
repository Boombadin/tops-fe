"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStoreConfigsLazyQuery = exports.useStoreConfigsQuery = exports.StoreConfigsDocument = exports.usePaymentMethodsLazyQuery = exports.usePaymentMethodsQuery = exports.PaymentMethodsDocument = exports.useCardsLazyQuery = exports.useCardsQuery = exports.CardsDocument = exports.useSetPaymentInformationMutation = exports.SetPaymentInformationDocument = exports.CardFragmentFragmentDoc = exports.ViewType = exports.V2ShippingMethod = exports.V2ProductType = exports.V2ProductSearchFilterConditionInput = exports.V2ProductFlag = exports.V2PaymentMethod = exports.V2MediaType = exports.V2Direction = exports.V2ConfigurableOptionType = exports.V2CartFlag = exports.TierPricePromotionType = exports.TaxType = exports.StockLevelStatus = exports.SortDirection = exports.SocialLoginInputProvider = exports.QuoteItemGroup = exports.ProductType = exports.ProductLinkType = exports.PaymentServiceKey = exports.Gender = exports.ConsentType = exports.ConditionType = exports.CardType = exports.CardSortIdEnum = exports.AddressType = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const ApolloReactHooks = __importStar(require("@apollo/react-hooks"));
var AddressType;
(function (AddressType) {
    AddressType["Shipping"] = "SHIPPING";
    AddressType["Billing"] = "BILLING";
})(AddressType = exports.AddressType || (exports.AddressType = {}));
var CardSortIdEnum;
(function (CardSortIdEnum) {
    CardSortIdEnum["Id"] = "ID";
    CardSortIdEnum["CreatedAt"] = "CREATED_AT";
})(CardSortIdEnum = exports.CardSortIdEnum || (exports.CardSortIdEnum = {}));
var CardType;
(function (CardType) {
    CardType["Visa"] = "Visa";
    CardType["MasterCard"] = "MasterCard";
    CardType["Amex"] = "AMEX";
    CardType["Jcb"] = "JCB";
    CardType["UnionPay"] = "UnionPay";
    CardType["Others"] = "Others";
})(CardType = exports.CardType || (exports.CardType = {}));
var ConditionType;
(function (ConditionType) {
    ConditionType["Eq"] = "eq";
    ConditionType["Finset"] = "finset";
    ConditionType["From"] = "from";
    ConditionType["Gt"] = "gt";
    ConditionType["Gteq"] = "gteq";
    ConditionType["In"] = "in";
    ConditionType["Like"] = "like";
    ConditionType["Lt"] = "lt";
    ConditionType["Lteq"] = "lteq";
    ConditionType["Moreq"] = "moreq";
    ConditionType["Neq"] = "neq";
    ConditionType["Nin"] = "nin";
    ConditionType["Notnull"] = "notnull";
    ConditionType["Null"] = "NULL";
    ConditionType["To"] = "to";
})(ConditionType = exports.ConditionType || (exports.ConditionType = {}));
var ConsentType;
(function (ConsentType) {
    ConsentType["Privacy"] = "PRIVACY";
    ConsentType["Marketing"] = "MARKETING";
})(ConsentType = exports.ConsentType || (exports.ConsentType = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "MALE";
    Gender["Female"] = "FEMALE";
    Gender["Other"] = "OTHER";
})(Gender = exports.Gender || (exports.Gender = {}));
var PaymentServiceKey;
(function (PaymentServiceKey) {
    PaymentServiceKey["PaymentServiceFullpayment"] = "payment_service_fullpayment";
    PaymentServiceKey["PaymentServiceInstallment"] = "payment_service_installment";
    PaymentServiceKey["PaymentServiceBankTransfer"] = "payment_service_bank_transfer";
    PaymentServiceKey["PaymentServiceDolfin"] = "payment_service_dolfin";
})(PaymentServiceKey = exports.PaymentServiceKey || (exports.PaymentServiceKey = {}));
var ProductLinkType;
(function (ProductLinkType) {
    ProductLinkType["Related"] = "related";
    ProductLinkType["Crosssell"] = "crosssell";
    ProductLinkType["Upsell"] = "upsell";
})(ProductLinkType = exports.ProductLinkType || (exports.ProductLinkType = {}));
var ProductType;
(function (ProductType) {
    ProductType["Simple"] = "simple";
    ProductType["Configurable"] = "configurable";
    ProductType["Grouped"] = "grouped";
    ProductType["Virtual"] = "virtual";
    ProductType["Bundle"] = "bundle";
    ProductType["Downloadable"] = "downloadable";
    ProductType["Giftcard"] = "giftcard";
    ProductType["Unknown"] = "unknown";
})(ProductType = exports.ProductType || (exports.ProductType = {}));
var QuoteItemGroup;
(function (QuoteItemGroup) {
    QuoteItemGroup["Standard"] = "standard";
    QuoteItemGroup["Storepickup"] = "storepickup";
})(QuoteItemGroup = exports.QuoteItemGroup || (exports.QuoteItemGroup = {}));
var SocialLoginInputProvider;
(function (SocialLoginInputProvider) {
    SocialLoginInputProvider["Facebook"] = "facebook";
})(SocialLoginInputProvider = exports.SocialLoginInputProvider || (exports.SocialLoginInputProvider = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "ASC";
    SortDirection["Desc"] = "DESC";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var StockLevelStatus;
(function (StockLevelStatus) {
    StockLevelStatus["FullStock"] = "FULL_STOCK";
    StockLevelStatus["MediumStock"] = "MEDIUM_STOCK";
    StockLevelStatus["OutOfStock"] = "OUT_OF_STOCK";
})(StockLevelStatus = exports.StockLevelStatus || (exports.StockLevelStatus = {}));
var TaxType;
(function (TaxType) {
    TaxType["Personal"] = "PERSONAL";
    TaxType["Company"] = "COMPANY";
})(TaxType = exports.TaxType || (exports.TaxType = {}));
var TierPricePromotionType;
(function (TierPricePromotionType) {
    TierPricePromotionType["FixedAmount"] = "fixed_amount";
    TierPricePromotionType["SpecialPrice"] = "special_price";
    TierPricePromotionType["PercentAmount"] = "percent_amount";
})(TierPricePromotionType = exports.TierPricePromotionType || (exports.TierPricePromotionType = {}));
var V2CartFlag;
(function (V2CartFlag) {
    V2CartFlag["GiftWrapping"] = "GIFT_WRAPPING";
})(V2CartFlag = exports.V2CartFlag || (exports.V2CartFlag = {}));
var V2ConfigurableOptionType;
(function (V2ConfigurableOptionType) {
    V2ConfigurableOptionType["SwatchText"] = "SWATCH_TEXT";
    V2ConfigurableOptionType["SwatchColor"] = "SWATCH_COLOR";
    V2ConfigurableOptionType["SwatchImage"] = "SWATCH_IMAGE";
})(V2ConfigurableOptionType = exports.V2ConfigurableOptionType || (exports.V2ConfigurableOptionType = {}));
var V2Direction;
(function (V2Direction) {
    V2Direction["Asc"] = "ASC";
    V2Direction["Desc"] = "DESC";
})(V2Direction = exports.V2Direction || (exports.V2Direction = {}));
var V2MediaType;
(function (V2MediaType) {
    V2MediaType["Image"] = "IMAGE";
    V2MediaType["Video"] = "VIDEO";
})(V2MediaType = exports.V2MediaType || (exports.V2MediaType = {}));
var V2PaymentMethod;
(function (V2PaymentMethod) {
    V2PaymentMethod["CashOnDelivery"] = "CASH_ON_DELIVERY";
    V2PaymentMethod["FullPayment"] = "FULL_PAYMENT";
    V2PaymentMethod["Installment"] = "INSTALLMENT";
    V2PaymentMethod["BankTransfer"] = "BANK_TRANSFER";
    V2PaymentMethod["PayAtStore"] = "PAY_AT_STORE";
    V2PaymentMethod["LinePay"] = "LINE_PAY";
})(V2PaymentMethod = exports.V2PaymentMethod || (exports.V2PaymentMethod = {}));
var V2ProductFlag;
(function (V2ProductFlag) {
    V2ProductFlag["New"] = "NEW";
    V2ProductFlag["Marketplace"] = "MARKETPLACE";
    V2ProductFlag["OnlineExclusive"] = "ONLINE_EXCLUSIVE";
    V2ProductFlag["GiftWrapping"] = "GIFT_WRAPPING";
    V2ProductFlag["InStock"] = "IN_STOCK";
    V2ProductFlag["OnlyAtCentral"] = "ONLY_AT_CENTRAL";
    V2ProductFlag["Beauty"] = "BEAUTY";
    V2ProductFlag["AllowReturn"] = "ALLOW_RETURN";
    V2ProductFlag["AllowExpress"] = "ALLOW_EXPRESS";
    V2ProductFlag["PreOrder"] = "PRE_ORDER";
    V2ProductFlag["ByOrder"] = "BY_ORDER";
    V2ProductFlag["OnlineSalable"] = "ONLINE_SALABLE";
    V2ProductFlag["OfflineSalable"] = "OFFLINE_SALABLE";
})(V2ProductFlag = exports.V2ProductFlag || (exports.V2ProductFlag = {}));
var V2ProductSearchFilterConditionInput;
(function (V2ProductSearchFilterConditionInput) {
    V2ProductSearchFilterConditionInput["Eq"] = "EQ";
    V2ProductSearchFilterConditionInput["In"] = "IN";
    V2ProductSearchFilterConditionInput["Gte"] = "GTE";
    V2ProductSearchFilterConditionInput["Lte"] = "LTE";
})(V2ProductSearchFilterConditionInput = exports.V2ProductSearchFilterConditionInput || (exports.V2ProductSearchFilterConditionInput = {}));
var V2ProductType;
(function (V2ProductType) {
    V2ProductType["Simple"] = "SIMPLE";
    V2ProductType["Configurable"] = "CONFIGURABLE";
    V2ProductType["Bundle"] = "BUNDLE";
    V2ProductType["Virtual"] = "VIRTUAL";
})(V2ProductType = exports.V2ProductType || (exports.V2ProductType = {}));
var V2ShippingMethod;
(function (V2ShippingMethod) {
    V2ShippingMethod["StandardPickUp"] = "STANDARD_PICK_UP";
    V2ShippingMethod["TwoHoursPickUp"] = "TWO_HOURS_PICK_UP";
    V2ShippingMethod["StandardDelivery"] = "STANDARD_DELIVERY";
    V2ShippingMethod["SameDayDelivery"] = "SAME_DAY_DELIVERY";
    V2ShippingMethod["NextDayDelivery"] = "NEXT_DAY_DELIVERY";
    V2ShippingMethod["ThreeHoursDelivery"] = "THREE_HOURS_DELIVERY";
})(V2ShippingMethod = exports.V2ShippingMethod || (exports.V2ShippingMethod = {}));
var ViewType;
(function (ViewType) {
    ViewType["Text"] = "TEXT";
    ViewType["Image"] = "IMAGE";
    ViewType["Banner"] = "BANNER";
    ViewType["OneColumnHorizontalCarousel"] = "ONE_COLUMN_HORIZONTAL_CAROUSEL";
    ViewType["TwoColumnVerticalCarousel"] = "TWO_COLUMN_VERTICAL_CAROUSEL";
    ViewType["Divider"] = "DIVIDER";
    ViewType["Video"] = "VIDEO";
    ViewType["Header"] = "HEADER";
    ViewType["Button"] = "BUTTON";
    ViewType["Product"] = "PRODUCT";
    ViewType["ProductScroll"] = "PRODUCT_SCROLL";
    ViewType["ImageLabel"] = "IMAGE_LABEL";
})(ViewType = exports.ViewType || (exports.ViewType = {}));
exports.CardFragmentFragmentDoc = graphql_tag_1.default `
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
exports.SetPaymentInformationDocument = graphql_tag_1.default `
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
function useSetPaymentInformationMutation(baseOptions) {
    return ApolloReactHooks.useMutation(exports.SetPaymentInformationDocument, baseOptions);
}
exports.useSetPaymentInformationMutation = useSetPaymentInformationMutation;
exports.CardsDocument = graphql_tag_1.default `
    query cards($sort: CardSort) {
  cards(sort: $sort) {
    ...cardFragment
  }
}
    ${exports.CardFragmentFragmentDoc}`;
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
function useCardsQuery(baseOptions) {
    return ApolloReactHooks.useQuery(exports.CardsDocument, baseOptions);
}
exports.useCardsQuery = useCardsQuery;
function useCardsLazyQuery(baseOptions) {
    return ApolloReactHooks.useLazyQuery(exports.CardsDocument, baseOptions);
}
exports.useCardsLazyQuery = useCardsLazyQuery;
exports.PaymentMethodsDocument = graphql_tag_1.default `
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
function usePaymentMethodsQuery(baseOptions) {
    return ApolloReactHooks.useQuery(exports.PaymentMethodsDocument, baseOptions);
}
exports.usePaymentMethodsQuery = usePaymentMethodsQuery;
function usePaymentMethodsLazyQuery(baseOptions) {
    return ApolloReactHooks.useLazyQuery(exports.PaymentMethodsDocument, baseOptions);
}
exports.usePaymentMethodsLazyQuery = usePaymentMethodsLazyQuery;
exports.StoreConfigsDocument = graphql_tag_1.default `
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
function useStoreConfigsQuery(baseOptions) {
    return ApolloReactHooks.useQuery(exports.StoreConfigsDocument, baseOptions);
}
exports.useStoreConfigsQuery = useStoreConfigsQuery;
function useStoreConfigsLazyQuery(baseOptions) {
    return ApolloReactHooks.useLazyQuery(exports.StoreConfigsDocument, baseOptions);
}
exports.useStoreConfigsLazyQuery = useStoreConfigsLazyQuery;
//# sourceMappingURL=index.jsx.map
