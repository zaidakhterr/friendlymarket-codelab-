import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { navigate, Router } from '@reach/router';
import React from 'react';
import {
  AuthCheck,
  useDatabaseList,
  useDatabaseObject,
  useFirebaseApp,
  useStorageDownloadURL,
  useUser
} from 'reactfire';
import SellerForm from '../display/Form';
import IconFAB from '../display/IconFAB';
import {
  getDraftItemRef,
  getImageRef,
  getNewSaleItemRef,
  getSellerRef,
  updateDraftField
} from '../firebase-refs';
import Page from './Page';

const useStyles = makeStyles(theme => ({
  appBar: {},
  card: {
    maxWidth: 500,
    maxHeight: '80vh',
    overflowY: 'auto'
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
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  input: {
    display: 'none'
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  uploadButton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  formField: {
    width: '300px'
  },
  container: {
    padding: theme.spacing(1)
  },
  cardTitle: {
    margin: theme.spacing(3)
  }
}));

function StorageImage({ storageRef }) {
  const firebaseApp = useFirebaseApp();
  const imageURL = useStorageDownloadURL(
    getImageRef(firebaseApp.storage, storageRef).original
  );
  return (
    <img
      src={imageURL}
      style={{ maxWidth: '30vw', maxHeight: '30vh' }}
      alt="Some item"
    />
  );
}

function Form(props) {
  // draftId comes from Reach Router
  const { draftId } = props;
  const currentUser = useUser();

  const database = useFirebaseApp().database;
  const sellerRef = getSellerRef(database, currentUser.uid);
  const draftRef = getDraftItemRef(database, draftId);
  const draft = useDatabaseObject(draftRef);

  const draftContents = draft.snapshot.val();
  const { title, askingPrice, image, description } = draftContents;

  const setTitle = updateDraftField(draftRef, 'title');
  const setAskingPrice = updateDraftField(draftRef, 'askingPrice');
  const setImage = updateDraftField(draftRef, 'image');
  const [imageIsUploading, setIsUploading] = React.useState(false);
  const uploadAndSetImage = newImageFile => {
    setIsUploading(true);
    const newImageFileName = `friendlymarket/${currentUser.uid}-${newImageFile.name}`;
    const imageRef = firebaseApp.storage().ref(newImageFileName);
    imageRef.put(newImageFile).then(() => {
      setImage(newImageFileName);
      setIsUploading(false);
    });
  };
  const setDescription = updateDraftField(draftRef, 'description');

  const classes = useStyles();
  const firebaseApp = useFirebaseApp();

  const postItem = async () => {
    const newItemRef = getNewSaleItemRef(database);
    const promises = [
      sellerRef.update({
        name: currentUser.displayName,
        contactEmail: currentUser.email
      }),
      newItemRef.set({
        title,
        askingPrice,
        image,
        description,
        seller: currentUser.uid
      })
    ];

    try {
      await Promise.all(promises);

      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={classes.container}>
      <Typography variant="h3" className={classes.cardTitle}>
        Sell your stuff!
      </Typography>

      <SellerForm
        title={title}
        setTitle={setTitle}
        askingPrice={askingPrice}
        setAskingPrice={setAskingPrice}
        description={description}
        setDescription={setDescription}
        imageFileName={image}
        imageIsUploading={imageIsUploading}
        Image={
          image ? (
            <React.Suspense fallback={''}>
              <StorageImage storageRef={image} />
            </React.Suspense>
          ) : (
            ''
          )
        }
        setImage={uploadAndSetImage}
      />
      <IconFAB
        text="Post"
        onClick={postItem}
        Icon={LibraryAddIcon}
        disabled={!(title && askingPrice && image && description)}
      />

      <DraftList currentKey={draftId} />
    </div>
  );
}

function DraftList({ currentKey }) {
  const user = useUser();
  const draftsRef = useFirebaseApp()
    .database()
    .ref(`drafts`)
    .orderByChild('seller')
    .equalTo(user.uid);
  const allDrafts = useDatabaseList(draftsRef);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h3" className={classes.cardTitle}>
        Your Drafts
      </Typography>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <List style={{ width: '400px', maxWidth: '80vw' }}>
          {allDrafts.map(draft => {
            // don't display the draft we're working on
            if (draft.snapshot.key === currentKey) {
              return '';
            }

            const draftPath = `/sell-something/${draft.snapshot.key}`;
            const draftDisplayText =
              draft.snapshot.val().title ||
              `Untitled (id: ${draft.snapshot.key})`;

            return (
              <ListItem key={draft.snapshot.key} button>
                <ListItemText
                  primary={draftDisplayText}
                  onClick={() => navigate(draftPath)}
                />
              </ListItem>
            );
          })}
        </List>
      </div>
    </>
  );
}

function SellItem() {
  return (
    <Page>
      <AuthCheck fallback={'please sign in to view this page'}>
        <Router>
          <Form path="/:draftId" />
        </Router>
      </AuthCheck>
    </Page>
  );
}

export default SellItem;
