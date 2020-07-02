import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';

import ListQR from './components/ListQR';
import GenerateQRBtn from './components/GenerateQRBtn';
import Search from './components/Search';

import { QRCode } from './models/QRCode';
import Types from './models/Types';
import client from './services/feathers';
import './App.css';

const App: React.FC = () => {
  const [qrcodes, setQrcodes] = useState<QRCode[]>([]);
  const [qrcodesFiltered, setQrcodesFiltered] = useState<QRCode[]>([]);

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

  useEffect(() => {
    fetchAllQRCodes();
  }, []);

  return (
    <div className="MainContent">
      <div className="Top">
        <GenerateQRBtn />
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
