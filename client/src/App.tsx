import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';

import ListQR from './components/ListQR';
import GenerateQRBtn from './components/GenerateQRBtn';
import Search from './components/Search';
import Status from './components/Status';

import { QRCode } from './models/QRCode';
import Types from './models/Types';
import client from './services/feathers';
import qrcodeIcon from './assets/qrcodestatus.png';
import mcIcon from './assets/mcstatus.png';
import './App.css';

const App: React.FC = () => {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [qrcodesFiltered, setQrcodesFiltered] = useState<QRCode[]>([]);
  const [scannerStatus, setScannerStatus] = useState(false);
  const [mcStatus, setMcStatus] = useState(false);

  const fetchAllQRCodes = async () => {
    try {
      const qrcodesService = await client.service('qrcode');
      const entries = await qrcodesService.find();
      setQrcodes(entries);
      setQrcodesFiltered(entries);

      client.service('qrcode').on('created', async () => {
        const entries = await client.service('qrcode').find();
        setQrcodes(entries);
        setQrcodesFiltered(entries);
      });
      client.service('qrcode').on('removed', async () => {
        const entries = await client.service('qrcode').find();
        setQrcodes(entries);
        setQrcodesFiltered(entries);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQR = async (uuid: string) => {
    try {
      const qrcodesService = await client.service('qrcode');
      const qrcode = await qrcodesService.find({
        query: {
          uuid: uuid,
        },
      });
      await qrcodesService.remove(qrcode[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScannerStatus = (data: any) => {
    if (data.status) {
      setScannerStatus(true);
    } else {
      setScannerStatus(false);
    }
  };

  const GetScannerStatus = async () => {
    const data = await client.service('scanner').get(0);
    handleScannerStatus(data);
    client.service('scanner').on('status', async (data: any) => {
      handleScannerStatus(data);
    });
  };

  const handleMCStatus = (data: any) => {
    if (data.status) {
      setMcStatus(true);
    } else {
      setMcStatus(false);
    }
  };

  const GetMCStatus = async () => {
    const data = await client.service('microcontroller').get(0);
    handleMCStatus(data);
    client.service('microcontroller').on('status', async (data: any) => {
      handleMCStatus(data);
    });
  };

  useEffect(() => {
    fetchAllQRCodes();
    GetScannerStatus();
    GetMCStatus();
  }, []);

  return (
    <div className="MainContent">
      <div className="Top">
        <GenerateQRBtn />
        <Status icon={qrcodeIcon} status={scannerStatus} />
        <Status icon={mcIcon} status={mcStatus} />
        <Search qrcodes={qrcodes} setQrcodesFiltered={setQrcodesFiltered} />
      </div>
      <div className="Table">
        <ListQR qrcodesFiltered={qrcodesFiltered} deleteQR={deleteQR} />
      </div>
      <Typography variant="h3">
        OneTimeQRCodes:
        {qrcodes.filter((qrcode) => qrcode.type === Types.OneTime).length}
      </Typography>
    </div>
  );
};

export default App;
