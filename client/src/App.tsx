import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';

import ListQR from './components/ListQR';
import GenerateQRBtn from './components/GenerateQRBtn';
import Search from './components/Search';

import { QRCode } from './models/QRCode';
import client from './services/feathers';
import './App.css';

interface Data {
  name: string;
  dateCreated: string;
  timeCreated: string;
}

function createData(
  name: string,
  dateCreated: string,
  timeCreated: string
): Data {
  return { name, dateCreated, timeCreated };
}

const rows: Data[] = [
  createData('Jose Almeida', '10-05-2020', '10:34:20'),
  createData('Antonio Almeida', '10-05-2020', '10:34:20'),
  createData('Andre Almeida', '10-05-2020', '10:34:20'),
  createData('Irineu Almeida', '10-05-2020', '10:34:20'),
  createData('Ricardo Ribeiro', '10-05-2020', '10:34:20'),
  createData('Ricardo Almeida', '10-05-2020', '10:34:20'),
  createData('Goncalo Almeida', '10-05-2020', '10:34:20'),
  createData('Francisco Almeida', '10-05-2020', '10:34:20'),
  createData('Joao Almeida', '10-05-2020', '10:34:20'),
];

const App: React.FC = () => {
  const [qrcodes, setQrcodes] = useState<Data[]>([]);
  const [qrcodesFiltered, setQrcodesFiltered] = useState<Data[]>([]);

  // const fetchAllQRCodes = async () => {
  //   try {
  //     const qrcodesService = await client.service('qrcode');
  //     const entries = await qrcodesService.find();
  //     setQrcodes(entries.data);

  //     client.service('qrcode').on('created', (qrcode: QRCode) => {
  //       setQrcodes((qrcodes) => qrcodes.concat(qrcode));
  //     });
  //     client.service('qrcode').on('removed', async () => {
  //       const entries = await client.service('qrcode').find();
  //       setQrcodes(entries.data);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const deleteQR = async (uuid: string) => {
    try {
      const qrcodesService = await client.service('qrcode');
      const qrcode = await qrcodesService.find({
        query: {
          uuid: uuid,
        },
      });
      await qrcodesService.remove(qrcode.data[0]._id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    //fetchAllQRCodes();
    setQrcodes(rows);
    setQrcodesFiltered(rows);
  }, []);

  return (
    <div className="App">
      <div className="MainContent">
        <div className="Top">
          <GenerateQRBtn />
          <div className="Search">
            <Search qrcodes={qrcodes} setQrcodesFiltered={setQrcodesFiltered} />
          </div>
        </div>
        <div className="Table">
          <ListQR qrcodesFiltered={qrcodesFiltered} deleteQR={deleteQR} />
        </div>
        <Typography variant="h3">TemporaryQRCodes:{rows.length}</Typography>
      </div>
    </div>
  );
};

export default App;
