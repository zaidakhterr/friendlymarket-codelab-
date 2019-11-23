import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import * as serviceWorker from './serviceWorker';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import { Router } from '@reach/router';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';
import { FirebaseAppProvider } from 'reactfire';
import Detail from './pages/Detail';
import ForSaleList from './pages/ForSaleList';
import Sell from './pages/Sell';
import firebaseConfig from './firebase-config';

export default function app() {
  const theme = createMuiTheme({
    palette: {
      primary: blue,
      secondary: amber
    },
    status: {
      danger: 'orange'
    }
  });

  if (
    !firebaseConfig ||
    !firebaseConfig.apiKey ||
    firebaseConfig.apiKey === 'TODO'
  ) {
    ReactDOM.render(
      <h1>
        Welcome to the friendlymarket codelab! Please add your Firebase config
        in <pre>src/firebase-config.js</pre>
      </h1>,
      document.getElementById('root')
    );
    return;
  }

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Router style={{ height: '100vh', overflowY: 'hidden' }}>
          <ForSaleList path="/" />
          <Sell path="/sell-something/*" />
          <Detail path="/detail/:itemId" />
        </Router>
      </FirebaseAppProvider>
    </ThemeProvider>,
    document.getElementById('root')
  );

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
}
