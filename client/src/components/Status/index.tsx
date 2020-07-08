import React from 'react';
import useStyles from './styles';

interface StatusProps {
  icon: string;
  status: boolean;
}

const Status: React.FC<StatusProps> = ({ icon, status }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <img className={classes.icon} src={icon} alt="icon" />
      <div className={status ? classes.dot_green : classes.dot_red} />
    </div>
  );
};

export default Status;
