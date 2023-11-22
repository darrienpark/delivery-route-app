import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import classes from "./AddressInput.module.css";
import { IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/ClearOutlined";

const AddressInput = ({
  label,
  id,
  setAddress,
  clearAddress,
  inputRef,
  ...props
}) => {
  const autocompleteRef = useRef();

  const handleAddressSelect = async () => {
    if (autocompleteRef.current) {
      const place = await autocompleteRef.current.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        const position = { lat: location.lat(), lng: location.lng() };
        setAddress({ fullString: inputRef.current.value, position: position });
      }
    }
  };

  const clearAddressHandler = () => {
    inputRef.current.value = "";
    clearAddress();
  };

  return (
    <Autocomplete
      onLoad={(auto) => (autocompleteRef.current = auto)}
      onPlaceChanged={handleAddressSelect}
    >
      <div className={classes.control}>
        <label htmlFor={id}>{label}</label>
        <TextField
          placeholder="Enter a location"
          InputProps={{
            endAdornment: (
              <IconButton edge="end" onClick={clearAddressHandler}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          inputRef={inputRef}
          id={id}
          name={id}
          type="text"
          {...props}
        />
      </div>
    </Autocomplete>
  );
};

export default AddressInput;
