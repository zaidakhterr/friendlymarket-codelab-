import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import firebase from 'firebase/app';
import React from 'react';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { useFirebaseApp, useUser } from 'reactfire';
import AppBar from '../display/AppBar';

const useStyles = makeStyles(theme => ({
  leftIcon: {
    marginRight: theme.spacing(1)
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }
}));

function AuthButton({ login, logout }) {
  const user = useUser();
  const classes = useStyles();

  if (user) {
    return (
      <Button color="inherit" onClick={logout}>
        <AccountCircle className={classes.leftIcon} />
        Sign Out
      </Button>
    );
  } else {
    return (
      <Button color="inherit" onClick={login}>
        Sign In
      </Button>
    );
  }
}

function Page({ children }) {
  const [x, setX] = React.useState(false);
  const openDialog = () => setX(true);
  const closeDialog = () => setX(false);
  const firebaseAuth = useFirebaseApp().auth();
  const uiConfig = {
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
    credentialHelper: 'none',
    callbacks: {
      signInSuccessWithAuthResult: closeDialog
    }
  };

  return (
    <>
      <Dialog open={x} onClose={closeDialog}>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
      </Dialog>
      <AppBar>
        <React.Suspense fallback={''}>
          <AuthButton
            login={openDialog}
            logout={() => firebaseAuth.signOut()}
          />
        </React.Suspense>
      </AppBar>
      <div
        style={{
          overflowX: 'hidden',
          overflowY: 'auto',
          height: 'calc(100% - 64px)'
        }}
      >
        <React.Suspense fallback={''}>{children}</React.Suspense>
      </div>
    </>
  );
}

export default Page;
