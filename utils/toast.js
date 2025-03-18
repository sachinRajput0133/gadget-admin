import { Store } from 'react-notifications-component';

const config = {
  insert: 'top',
  container: 'top-right',
  animationIn: ['animated', 'fadeIn'],
  animationOut: ['animated', 'fadeOut'],
  isMobile: true,
  dismiss: {
    duration: 3000,
    showIcon: true,
  },
};
const addToast = (title, message) => {
  Store.addNotification({
    message,
    ...config,
    type: title || 'info',
  });
};

const Toast = {
  error: (data) => {
    addToast('danger', data);
  },
  success: (data) => addToast('success', data),
  info: (data) => addToast('info', data),
  default: (data) => addToast('default', data),
  warn: (data) => addToast('warning', data),
};

export default Toast;
