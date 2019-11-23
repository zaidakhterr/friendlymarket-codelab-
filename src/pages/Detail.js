import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React, { Suspense } from 'react';
import {
  AuthCheck,
  useDatabaseObject,
  useFirebaseApp,
  useStorageDownloadURL
} from 'reactfire';
import '../App.css';
import {
  getForSaleItemRef,
  getSellerEmailRef,
  getSellerNameRef
} from '../firebase-refs';
import Page from './Page';

const useStyles = makeStyles(theme => ({
  appBar: {},
  card: {
    maxWidth: 400,
    margin: theme.spacing(2)
  },
  media: {
    height: 140
  },
  grid: {
    // padding: theme.spacing(2),
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  container: {
    padding: theme.spacing(2)
  }
}));

function Contact({ sellerId }) {
  const sellerEmailRef = getSellerEmailRef(useFirebaseApp().database, sellerId);
  const sellerNameRef = getSellerNameRef(useFirebaseApp().database, sellerId);
  const emailSnapshot = useDatabaseObject(sellerEmailRef);
  const sellerNameSnapshot = useDatabaseObject(sellerNameRef);
  const classes = useStyles();

  if (emailSnapshot && emailSnapshot.snapshot.exists()) {
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            Seller contact information
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {sellerNameSnapshot.snapshot.val()} ({emailSnapshot.snapshot.val()})
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  } else {
    return (
      <ExpansionPanel disabled>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            No longer for sale - Seller has deleted their account
          </Typography>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    );
  }
}

function SellerDetails({ sellerId }) {
  const classes = useStyles();

  return (
    <Suspense
      fallback={
        <ExpansionPanel disabled>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Loading</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      }
    >
      <AuthCheck
        fallback={
          <ExpansionPanel disabled>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>
                Sign in to view seller details
              </Typography>
            </ExpansionPanelSummary>
          </ExpansionPanel>
        }
      >
        <Contact sellerId={sellerId} />
      </AuthCheck>
    </Suspense>
  );
}

function Details({ itemId }) {
  const firebaseApp = useFirebaseApp();
  const classes = useStyles();

  const itemRef = getForSaleItemRef(useFirebaseApp().database, itemId);
  const itemSnapshot = useDatabaseObject(itemRef);
  const { title, image, description, seller } = itemSnapshot.snapshot.val();
  const imageURL = useStorageDownloadURL(firebaseApp.storage().ref(image));
  return (
    <>
      <div style={{ width: '100%', backgroundColor: 'black' }}>
        <img
          src={imageURL}
          alt="Some item"
          style={{
            maxHeight: '30vh',
            maxWidth: '100%',
            display: 'block',
            margin: 'auto'
          }}
        />
      </div>
      <div className={classes.container}>
        <Typography variant="h2">{title}</Typography>
        <br />
        <Typography variant="body1">{description}</Typography>
      </div>
      <SellerDetails sellerId={seller} />
    </>
  );
}

function ItemDetail({ itemId }) {
  return (
    <Page>
      <Details itemId={itemId} />
    </Page>
  );
}

export default ItemDetail;
