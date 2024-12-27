const toRupiah = input => {
  // Return early if input is null or undefined
  if (input == null) return input;

  // Handle both number and string inputs
  let numericValue;
  if (typeof input === 'number') {
    numericValue = input;
  } else if (typeof input === 'string') {
    // Remove any existing commas and convert to number
    numericValue = parseFloat(input.replace(/,/g, ''));
  } else {
    return input;
  }

  // Return if not a valid number
  if (isNaN(numericValue)) return input;

  // Handle negative numbers
  const isNegative = numericValue < 0;
  const absoluteValue = Math.abs(numericValue);

  return convert(absoluteValue, isNegative);
};

const convert = (input, isNegative = false) => {
  // Convert to string and split into whole and decimal parts
  const [whole, decimal] = input.toString().split('.');

  // Format the whole number part with thousand separators
  const reverse = whole.split('').reverse().join('');
  const splitThree = reverse.match(/\d{1,3}/g) || [];
  const formatted = splitThree.join(',').split('').reverse().join('');

  // Combine the parts
  let result = formatted;
  if (decimal) {
    result += '.' + decimal;
  }

  // Add negative sign if needed
  return isNegative ? '-' + result : result;
};

export default toRupiah;
