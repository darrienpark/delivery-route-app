import { Autocomplete } from "@react-google-maps/api";
import { useRef } from "react";
import classes from "./AddressInput.module.css";

const AddressInput = ({ label, id, setAddress, ...props }) => {
  const addressRef = useRef();
  const inputRef = useRef();

  const handleAddressSelect = async () => {
    if (addressRef.current) {
      const place = await addressRef.current.getPlace();
      if (place.geometry) {
        const location = place.geometry.location;
        const position = { lat: location.lat(), lng: location.lng() };
        setAddress(position);
      } else {
        setAddress(null);
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Autocomplete
      onLoad={(auto) => (addressRef.current = auto)}
      onPlaceChanged={handleAddressSelect}
    >
      <p className={classes.control}>
        <label htmlFor={id}>{label}</label>
        <input ref={inputRef} id={id} name={id} type="text" {...props} />
      </p>
    </Autocomplete>
  );
};

export default AddressInput;
