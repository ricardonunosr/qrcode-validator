import React from 'react';
import {Text, TouchableOpacity, Alert} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

import {getQRCode, deleteQRCode} from './services/qrcode-service';

export default class App extends React.Component {
  ifScanned = async e => {
    try {
      const qrcodeUuid = await getQRCode(e.data);
      if (qrcodeUuid != undefined) {
        await deleteQRCode(e.data);
        Alert.alert('Success', e.data);
      }
      Alert.alert('Failed', e.data);
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <QRCodeScanner
        containerStyle={{backgroundColor: '#FFF', marginBottom: '35%'}}
        onRead={this.ifScanned}
        reactivate={true}
        permissionDialogMessage="Need Permission To Acess Camera"
        reactivateTimeout={10}
        showMarker={true}
        markerStyle={{borderColor: '#FFF', borderRadius: 10}}
        bottomContent={
          <TouchableOpacity>
            <Text style={{fontSize: 21, color: 'rgb(0,122,255)'}}>
              Scan QRcode
            </Text>
          </TouchableOpacity>
        }
      />
    );
  }
}
