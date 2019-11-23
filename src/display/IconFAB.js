import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';

import React from 'react';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

export default function IconFAB({ Icon, onClick, text, disabled }) {
  const classes = useStyles();
  return (
    <Zoom in>
      <Fab
        variant="extended"
        aria-label="sell something"
        className={classes.fab}
        color="secondary"
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className={classes.extendedIcon} />
        {text}
      </Fab>
    </Zoom>
  );
}
