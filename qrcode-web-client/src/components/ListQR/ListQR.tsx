import React, { useEffect, useState, useRef } from 'react';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useReactToPrint } from 'react-to-print';
import Modal from 'react-modal';

import {
  generateQRCode,
  getAllQRCode,
  deleteQRCode,
} from '../../services/qrcode-service';
import { QRCode } from '../../models/QRCode';
import ModalQR from '../Modal';

const useStyles1 = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5),
    },
  })
);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}
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

export default function SimpleTable() {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const classes = useStyles2();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [qrcodeData, setQrcodeData] = useState<string>('');
  const printReference = useRef();
  const handlePrint = useReactToPrint({
    content: () => printReference.current,
  });

  function openModal(data: string) {
    setIsOpen(true);
    setQrcodeData(data);
  }

  function closeModal() {
    setIsOpen(false);
    setQrcodeData('');
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, qrcodes.length - page * rowsPerPage);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchAllQRCodes = async () => {
    try {
      const entries = await getAllQRCode();
      setQrcodes(entries);
    } catch (error) {
      console.error(error);
    }
  };

  const generateQR = async () => {
    try {
      const data = await generateQRCode();
      await fetchAllQRCodes();
      openModal(data.url);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQR = async (uuid: string) => {
    try {
      await deleteQRCode(uuid);
      await fetchAllQRCodes();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllQRCodes();
  }, []);

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
        contentLabel="Example Modal"
      >
        <ModalQR
          className={classes.content_modal}
          qrCodeData={qrcodeData}
          ref={printReference}
        />
        <Button
          className={classes.button_modal}
          variant="contained"
          color="primary"
          onClick={handlePrint}
        >
          Print
        </Button>
      </Modal>

      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="custom pagination table">
          <TableBody>
            {(rowsPerPage > 0
              ? qrcodes.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : qrcodes
            ).map((qrcode) => (
              <TableRow key={qrcode._id}>
                <TableCell component="th" scope="row">
                  {qrcode.uuid}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {qrcode.createdAt.substring(0, 10)}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {qrcode.createdAt.substring(11, 19)}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      deleteQR(qrcode.uuid);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={4}
                count={qrcodes.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
