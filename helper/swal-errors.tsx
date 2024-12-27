import Swal from 'sweetalert2';

const SwalErrors = ({ errors }) => {
  let errorList = errors.error;

  return Swal.fire({
    title: errors.message,
    html: errorList,
    icon: 'error',
    showConfirmButton: true
  });
};

export default SwalErrors;
