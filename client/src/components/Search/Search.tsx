import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import { QRCode } from '../../models/QRCode';

interface SearchProps {
  qrcodes: QRCode[];
  setQrcodesFiltered: React.Dispatch<React.SetStateAction<QRCode[]>>;
}

const Search: React.FC<SearchProps> = ({ qrcodes, setQrcodesFiltered }) => {
  const [searchState, setSearchState] = useState<string>('');

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.currentTarget.value;
    setSearchState(newValue);
    if (newValue === '') {
      setQrcodesFiltered(qrcodes);
    } else {
      const regex = new RegExp('^' + newValue.toLowerCase());
      const filtered = qrcodes.filter((qrcode) =>
        qrcode.associatedName?.toLowerCase().match(regex)
      );
      setQrcodesFiltered(filtered);
    }
  };

  return (
    <TextField
      label={
        <>
          <SearchIcon />
          Search
        </>
      }
      variant="outlined"
      value={searchState}
      onChange={handleChange}
    />
  );
};

export default Search;
