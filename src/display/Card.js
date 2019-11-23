import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';

const useStyles = makeStyles(theme => ({
  appBar: {},
  card: {
    maxWidth: 400,
    margin: theme.spacing(2)
  },
  media: {
    height: 200
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
  }
}));

function DetailCard({ onClick, imageURL, title, description }) {
  const classes = useStyles();

  const maxDescriptionLength = 50;
  const shortenedDescription =
    description.length > maxDescriptionLength
      ? `${description.substring(0, maxDescriptionLength)}...`
      : description;

  return (
    <Card className={classes.card}>
      <CardActionArea onClick={onClick}>
        <CardHeader title={title} />
        <CardMedia
          image={imageURL}
          title={`Image of ${title}`}
          className={classes.media}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {shortenedDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default DetailCard;
