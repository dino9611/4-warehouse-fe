const thousandSeparator = (value) => {
  let pattern = /(\d)(?=(\d{3})+(?!\d))/g;
  let replacement = "\$1,";
  let stringConvert = String(value);
  return stringConvert.replace(pattern, replacement);
};

export default thousandSeparator;