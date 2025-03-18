import { hasCookie } from 'cookies-next';

import { DEFAULT_NEXT_API_HEADER, KEYS } from './constant';
import { setDeviceId } from './util';
import { LocalStorage } from './localStorage';

import Toast from '@utils/toast';

export const handleLogout = async () => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.ok) {
    return window.location.reload();
  }
  return false;
};

export const getToastMessage = ({ status, message, code }) => {
  if (code === 'SUCCESS') {
    Toast.success(message);
  } else if (status === false) {
    Toast.error(message);
  } else {
    console.error('No case found');
  }
};
//You'll need to verify your account before you can log in. Please check your email and click on the link to verify your account, then continue with logging in. If an email does not show up in your inbox, please check your spam or junk folder.

export const setDeviceIdCookie = () => {
  if (!hasCookie(KEYS.deviceToken)) setDeviceId();
  // if (!hasCookie(KEYS.readOnly) && user?.id) setCookie(KEYS.readOnly, !!user?.offBoardedAt || user.licenceExpire)
  // if (!hasCookie(KEYS.site)) setCookie(KEYS.site, user.role === USER_ROLE.CLIENT ? routes.clientLogin : routes.login)
};

export const formatAddress = (add) => {
  const { city, country, houseNumber, apartment, zipcode, state, streetAddress } = add || {};

  // Create the first line with street address and house number, if available
  const firstLineParts = [
    streetAddress, // Display streetAddress if available
  ];

  // Create an array of other address parts
  const secondLineParts = [
    apartment ? `Apt: ${apartment}` : '', // Only include "Apt" if `apt` is not empty
    houseNumber,
    city,
  ];

  // Create the third line for state, country, and zipcode
  const thirdLineParts = [state, country, zipcode];

  // Filter out any empty parts and join with ", " for each line
  const firstLine = firstLineParts.filter(Boolean).join(' ');
  const secondLine = secondLineParts.filter(Boolean).join(', ');
  const thirdLine = thirdLineParts.filter(Boolean).join(', ');

  // Return formatted address with newlines between different lines
  return [
    firstLine,
    secondLine, // Show only if second line exists
    thirdLine, // Show only if third line exists
  ]
    .filter(Boolean)
    .join('\n');
};
export const getAddressLabel = (add) => {
  const { label } = add || {};

  return label;
};
export const formatContactNumber = (phoneNumber) => {
  // Convert the number to a string
  if (!phoneNumber) return 'No ContactNumber';
  if (phoneNumber.split('')[0] === '+') {
    const countryCode = phoneNumber.slice(1, 4); // First 3 digits after "+"
    const areaCode = phoneNumber.slice(4, 7); // Next 3 digits
    const number = phoneNumber.slice(7); // Remaining 4 digits

    return `+${countryCode}-${areaCode}-${number}`;
  } else {
    const countryCode = phoneNumber.slice(0, 3); // First 3 digits after "+"
    const areaCode = phoneNumber.slice(3, 6); // Next 3 digits
    const number = phoneNumber.slice(6); // Remaining 4 digits

    return `${countryCode}-${areaCode}-${number}`;
  }
};

export const capitalizeWords = (sentence) => {
  if (!sentence) return '';
  return sentence
    .split(' ') // Split the sentence into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back into a sentence
};
export const removePaymentLocalKeys = () => {
  LocalStorage.remove(KEYS.REWARD_APPLIED);
  LocalStorage.remove(KEYS.TOTAL_AMOUNT);
  LocalStorage.remove(KEYS.TIP);
  LocalStorage.remove(KEYS.PAYMENT_METHOD);
  LocalStorage.remove(KEYS.TAX);
};

export const storeSessionData = async (data) => {
  await fetch('/api/storeId', {
    method: 'POST',
    headers: DEFAULT_NEXT_API_HEADER,
    body: JSON.stringify({
      id: {
        menuId: Number(data.menuId),
        restId: Number(data.restId),
      },
    }),
  });
};

export const fetchUserData = async (value) => {
  try {
    const response = await fetch('/api/getUserData', {
      method: 'GET',
      headers: DEFAULT_NEXT_API_HEADER,
    });
    const data = await response.json();
    if (data?.token) {
      value.setLoginData({ ...data, ...data.user });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};
