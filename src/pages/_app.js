import React from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import store from '../store';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Gadget Review Admin Panel</title>
        <meta name="description" content="Admin panel for managing gadget reviews" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
