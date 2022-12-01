/**
 * HTML Element ID Style
 *
 * This document is a guideline for naming HTML element identifier.
 * It is mainly designed to be used for Automated testing and
 * Google Tag Manager (GTM) operations. Automated testing needs a standard
 * identifier in order to reuse e-commerce test cases with other BUs as much as
 * possible. For GTM, element ID can be used to track activities, e.g. button
 * clicking. With this standard, all major elements should readily provide IDs that
 * marketing can easily choose ones that suit to their need.
 *
 * Implementation
 * Element ID is classified into 3 categories:
 * 1. Button/Link category: This includes any elements that perform action
 *  (e.g. button, link)
 * 2. Non-button category: Most of elements here are form elements (e.g. input text,
 *  radio) and also including common widgets (e.g. progress bar)
 * 3. Special category: Elements that have special meaning. It is often anyone that
 *  does not relate to any business module.
 */

/**
 * Button/Link ID
 * Format: <input type>-<action><module name>[On<position>][-<unique ID>]
 * Note, for input type and module name, see tables below.
 * Unique ID is additional information needed to make the whole ID unique. It could
 * be either SKU or field name. Note: an image which can be clicked is also
 * considered as Button/Link category
 *
 * Examples
 * btn-addCart-sku001 for Add-To-Cart button for product SKU001.
 * btn-viewShippingAddress for a button that shows shipping address list.
 * btn-addAccount for user sign-up. (This can also belong to special category – open
 *  for discussion). btn-saveAccount for update account information
 * btn-editAccount for a button that shows account edit form.
 *
 *
 * Non-Button
 * Format: <input type>-form<module name>[On<position>][-<unique id>]
 *
 * Examples
 * sel-formShippingAddress-district is for a dropdown list of district in Shipping
 *  Address form.
 * lnk-formCart-sku1234
 *
 * Special
 * Format: <input type>-<special action name>
 *
 * Examples
 * btn-login is for login/sign-in button
 * btn-logout is for logout/sign-out button btn-forgotPassword is for
 * forgot-password button. btn-resetPassword is for reset-password button.
 *
 * Glossaries
 * Following are glossary for standard keywords to use in making an identifier.
 * These lists are not final and are welcomed to be added more (please discuss with
 * team before doing so).
 * Please keep them ordered in ascending.
 */

// Input Type
export const ELEMENT_TYPE = {
  BUTTION: 'btn', //Button
  BUTTON: 'btn', //Button,
  CHECKBOX: 'chk', //Check Box
  SELECT: 'sel', //Dropdown
  LINK: 'lnk', //Hyperlink
  IMAGE: 'img', //Image
  TEXT: 'txt', // Text
  LABEL: 'lbl', //Label
  MENU: 'mnu', //Menu
  PROGRESSBAR: 'pbr', //Progress Bar
  RADIO: 'rdo', //Radio
  TABLE: 'tbl', //Table
  LIST: 'lst', //Unordered/Ordered List
  INFO: 'inf', //Info
  INPUT: 'inp', // input
  FORM: 'frm', // form
};

// Possible actions
export const ELEMENT_ACTION = {
  SEARCH: 'search',
  VIEW: 'view',
  ADD: 'add',
  REMOVE: 'remove',
  EDIT: 'edit',
  SAVE: 'save',
  FORM: 'form',
  TOGGLE: 'toggle',
  FILTER: 'filter',
  CHANGE: 'change',
};

export const generateElementId = (
  type,
  action,
  moduleName,
  position,
  uniqueId,
) => {
  let strElemId = '';
  if (moduleName) {
    strElemId = `${type}-${action}${moduleName}`;
  } else if (action) {
    strElemId = `${type}-${action}`;
  } else {
    return null;
  }

  strElemId += position ? `On${position}` : '';
  strElemId += uniqueId ? `-${uniqueId}` : '';
  return strElemId;
};

export function generateTestId({
  type = '',
  action = '',
  moduleName = '',
  position = '',
  uniqueId = '',
}) {
  if (type === '' || action === '') {
    console.error('missing type or action');
    return '';
  }

  let testId = `${type}-${action}${moduleName}`;
  testId += position ? `On${position}` : '';
  testId += uniqueId ? `-${uniqueId}` : '';
  return testId;
}
