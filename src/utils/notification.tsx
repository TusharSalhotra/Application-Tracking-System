import React, { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export const CommonToaster = () => {
  return (
    <ToastContainer
      autoClose={false}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};
/***********************************************SUCCESS_TOASTER*********************************************************************/
export const Successnotify = (message: string): void => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
    className: "custom-success-toast",
  });
};

/***********************************************WARNING_TOASTER********************************************************************/

export const Warningnotify = (message: string): void => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
    className: "custom-warning-toast",
  });
};

/************************************************ERROR_TOASTER*********************************************************************/

export const Errornotify = (message: string): void => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    theme: "colored",
    className: "custom-error-toast",
  });
};
