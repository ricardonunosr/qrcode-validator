import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { QRCode } from '../../models/QRCode';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});
interface ListQRProps {
  qrcodesFiltered: any[];
  deleteQR(uuid: string): void;
}

const ListQR: React.FC<ListQRProps> = ({ qrcodesFiltered, deleteQR }) => {
  const classes = useStyles();

  const handleDelete = (uuid: string) => {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteQR(uuid),
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Created Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {qrcodesFiltered.map((qrcode) => {
              return (
                <TableRow>
                  <TableCell>{qrcode.name}</TableCell>
                  <TableCell>{qrcode.dateCreated}</TableCell>
                  <TableCell>{qrcode.timeCreated}</TableCell>
                  <IconButton aria-label="print">
                    <PrintIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDelete(qrcode.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ListQR;
