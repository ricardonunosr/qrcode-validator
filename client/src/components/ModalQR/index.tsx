import React, { Component } from 'react';

interface ModalQRProps {
  qrcodeData: string;
}

export class ModalQR extends Component<ModalQRProps> {
  render() {
    return (
      <>
        <img src={this.props.qrcodeData} alt="QRCode" />
      </>
    );
  }
}
