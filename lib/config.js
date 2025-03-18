const ironOptions = {
  cookieName: 'gadget_admin',
  password: 'gadgetAdmin-gadgetAdmin-gadgetAdmin',
  secure: process.env.NODE_ENV === 'production',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default ironOptions;
