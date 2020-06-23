import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

import ModalQR from '../Modal';
import client from '../../services/feathers';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    alignContent: 'center',
  },
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500,
  },
  button: {
    marginBottom: '10 px',
  },
  content_modal: {
    display: 'block',
  },
  button_modal: {
    display: 'block',
  },
});

Modal.setAppElement('#root');

const GenerateQRBtn: React.FC = () => {
  const classes = useStyles2();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [qrcodeData, setQrcodeData] = useState<string>('');
  const [type, setType] = useState<string>('Temporary');
  const [nameDefinitive, setNameDefinitive] = useState<string>('');
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

  const generateQR = async () => {
    try {
      const qrcodesService = await client.service('qrcode');
      const entrie = await qrcodesService.create({});
      openModal(entrie.qrcode);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const handleChangeName = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNameDefinitive(event.target.value as string);
  };

  //   <ModalQR
  //   className={classes.content_modal}
  //   qrCodeData={qrcodeData}
  //   ref={printReference}
  // />

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={generateQR}
      >
        Generate QRCode
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <Grid container direction="column" justify="center" alignItems="center">
          <InputLabel shrink>Type</InputLabel>
          <Select value={type} onChange={handleChange} displayEmpty>
            <MenuItem value={'Temporary'}>Temporary</MenuItem>
            <MenuItem value={'Definitive'}>Definitive</MenuItem>
          </Select>
          {type === 'Definitive' ? (
            <TextField
              variant="outlined"
              value={nameDefinitive}
              onChange={handleChangeName}
            />
          ) : null}
          <Button
            className={classes.button_modal}
            variant="contained"
            color="primary"
            onClick={handlePrint}
          >
            Print
          </Button>
        </Grid>
      </Modal>
    </>
  );
};

export default GenerateQRBtn;
