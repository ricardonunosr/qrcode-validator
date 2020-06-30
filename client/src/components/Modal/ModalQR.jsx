import React from 'react';

export class ModalQR extends React.Component {
  render() {
    return (
      <>
        <img src={this.props.qrcodeData} alt="QRCode" />
      </>
    );
  }
}
