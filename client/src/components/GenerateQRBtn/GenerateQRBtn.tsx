import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import ModalQR from '../Modal';
import client from '../../services/feathers';
import Types from '../../models/Types';
import useStyles from './styles';
import ModalStyles from './ModalStyles';

Modal.setAppElement('#root');

const GenerateQRBtn: React.FC = () => {
  const classes = useStyles();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [qrcodeData, setQrcodeData] = useState<string>('');
  const [type, setType] = useState<string>('onetime');
  const [flag, setFlag] = useState(false);
  const [associatedName, setAssociatedName] = useState<string>('');
  const printReference = useRef();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const handlePrint = useReactToPrint({
    content: () => printReference.current,
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setQrcodeData('');
    setAssociatedName('');
    setFlag(false);
  };

  const generateQR = async () => {
    try {
      const qrcodesService = await client.service('qrcode');
      if (type === Types.OneTime) {
        const entrie = await qrcodesService.create({});
        setQrcodeData(entrie.qrcode);
        setFlag(true);
      } else {
        const entrie = await qrcodesService.create({
          type: type,
          validUntil: selectedDate,
          associatedName: associatedName,
        });
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string);
  };
  const handleChangeName = (event: React.ChangeEvent<{ value: unknown }>) => {
    setAssociatedName(event.target.value as string);
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={openModal}
      >
        Generate QRCode
      </Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={ModalStyles}
      >
        {flag ? (
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
        ) : (
          <div className={classes.main_modal}>
            <InputLabel shrink>Type</InputLabel>
            <Select value={type} onChange={handleChange} displayEmpty>
              <MenuItem value={'definitive'}>Definitive</MenuItem>
              <MenuItem value={'temporary'}>Temporary</MenuItem>
              <MenuItem value={'onetime'}>OneTime</MenuItem>
            </Select>
            {type === Types.Definitive || type === Types.Temporary ? (
              <>
                <TextField
                  variant="outlined"
                  value={associatedName}
                  onChange={handleChangeName}
                />
                {type === Types.Temporary ? (
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="date-picker-dialog"
                      label="Date picker dialog"
                      format="dd/MM/yyyy"
                      disablePast
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change date',
                      }}
                    />
                    <KeyboardTimePicker
                      margin="normal"
                      id="time-picker"
                      label="Time picker"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                ) : null}
              </>
            ) : null}
            <Button
              className={classes.button_modal}
              variant="contained"
              color="primary"
              onClick={generateQR}
            >
              Generate
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default GenerateQRBtn;
