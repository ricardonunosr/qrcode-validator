import React, { useState, useRef } from 'react';
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
import Modal from 'react-modal';
import { useReactToPrint } from 'react-to-print';
import Button from '@material-ui/core/Button';

import { QRCode } from '../../models/QRCode';
import Types from '../../models/Types';
import ModalQR from '../Modal';
import useStyles from './styles';
import ModalStyles from './ModalStyles';

interface ListQRProps {
  qrcodesFiltered: QRCode[];
  deleteQR(uuid: string): void;
}

const ListQR: React.FC<ListQRProps> = ({ qrcodesFiltered, deleteQR }) => {
  const classes = useStyles();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [qrcodeData, setQrcodeData] = useState<string>('');
  const printReference = useRef();

  const handlePrint = useReactToPrint({
    content: () => printReference.current,
  });

  const openModal = (data: string) => {
    setIsOpen(true);
    setQrcodeData(data);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQrcodeData('');
  };

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
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={ModalStyles}
      >
        <div className={classes.modal}>
          <ModalQR
            qrcodeData={qrcodeData}
            ref={printReference}
            handlePrint={handlePrint}
          />
          <Button variant="contained" color="primary" onClick={handlePrint}>
            Print
          </Button>
        </div>
      </Modal>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>ValidUntil</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qrcodesFiltered
                .filter((qrcode) => qrcode.type !== Types.OneTime)
                .map((qrcode) => {
                  return (
                    <TableRow key={qrcode.uuid}>
                      <TableCell>{qrcode.associatedName}</TableCell>
                      <TableCell>
                        {new Date(qrcode.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>{qrcode.type}</TableCell>
                      <TableCell>
                        {qrcode.validUntil
                          ? new Date(qrcode.validUntil).toLocaleString()
                          : null}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          aria-label="print"
                          onClick={() => openModal(qrcode.qrcode)}
                        >
                          <PrintIcon />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDelete(qrcode.uuid)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};

export default ListQR;
