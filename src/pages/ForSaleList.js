import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import { navigate } from '@reach/router';
import React from 'react';
import { useDatabaseList, useFirebaseApp, useUser } from 'reactfire';
import DetailCard from '../display/Card';
import IconFAB from '../display/IconFAB';
import {
  getDraftListRef,
  getForSaleListRef,
  getImageRef
} from '../firebase-refs';
import Page from './Page';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    overflowY: 'auto',
    backgroundColor: theme.palette.background.paper
  },
  card: {
    width: 400
    // height: 400
  },
  media: {
    height: 140
  },
  gridList: {
    width: '100%',
    maxHeight: '100%',
    maxWidth: '400px',
    backgroundColor: 'black'
  },
  // grid: {
  //   // padding: theme.spacing(2),
  //   height: '100%',
  //   overflowY: 'auto',
  //   overflowX: 'hidden'
  // },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  }
}));

function ForSaleItem({ imagePath, title, itemId, description }) {
  const classes = useStyles();
  const firebaseApp = useFirebaseApp();
  const {
    resized: resizedImageRef,
    original: originalImageRef
  } = React.useMemo(() => getImageRef(firebaseApp.storage, imagePath), [
    imagePath,
    firebaseApp.storage
  ]);

  const [imageURL, setImageURL] = React.useState(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  );

  React.useEffect(() => {
    if (resizedImageRef) {
      resizedImageRef
        .getDownloadURL()
        .then(url => {
          setImageURL(url);
        })
        .catch(e => {
          console.info(
            `Could not find resized image for item "${title}". Fetching original image instead.`
          );
          return originalImageRef.getDownloadURL().then(url => {
            setImageURL(url);
          });
        });
    } else {
      originalImageRef.getDownloadURL().then(url => {
        setImageURL(url);
      });
    }
  }, [resizedImageRef, originalImageRef, title]);

  return (
    <DetailCard
      className={classes.card}
      onClick={() => navigate(`/detail/${itemId}`)}
      imageURL={imageURL}
      title={title}
      description={description}
    />
  );
}

function ForSaleList() {
  const classes = useStyles();

  const forSaleRef = getForSaleListRef(useFirebaseApp().database);

  const saleItems = useDatabaseList(forSaleRef);

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignContent="flex-start"
      alignItems="flex-start"
      spacing={0}
      className={classes.grid}
    >
      {saleItems.map(({ snapshot }) => {
        const { title, description, image } = snapshot.val();

        return (
          <Grid item key={snapshot.key} className={classes.card}>
            <ForSaleItem
              itemId={snapshot.key}
              title={title}
              description={description}
              imagePath={image}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

function NewPost() {
  const user = useUser();
  const firebaseApp = useFirebaseApp();
  const draftsList = getDraftListRef(firebaseApp.database);

  if (user) {
    return (
      <IconFAB
        text="Sell Something"
        onClick={() => {
          const newDraftRef = draftsList.push();
          newDraftRef
            .set({
              title: '',
              askingPrice: '',
              description: '',
              image: '',
              seller: user.uid
            })
            .then(() => {
              navigate(`/sell-something/${newDraftRef.key}`);
            });
        }}
        Icon={AddIcon}
      />
    );
  } else {
    return '';
  }
}

function App() {
  return (
    <Page>
      <ForSaleList />
      <NewPost />
    </Page>
  );
}

export default App;
