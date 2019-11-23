import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { navigate } from '@reach/router';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

function TopBar({ children }) {
  const classes = useStyles();

  return (
    <AppBar position="relative">
      <Toolbar style={{ height: '64px' }}>
        <div className={classes.title}>
          <Button color="inherit" title="Home">
            <Typography
              variant="h6"
              color="inherit"
              onClick={() => navigate('/')}
            >
              Friendly Market
            </Typography>
          </Button>
        </div>

        {children}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
