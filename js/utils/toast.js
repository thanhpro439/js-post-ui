import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const toast = {
  info (message) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", 
      position: "right",
      style: {
        background: "#2196f3",
      },
    }).showToast();
  },
  success (message) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", 
      position: "right",
      style: {
        background: "#4caf50",
      },
    }).showToast();
  },
  error (message) {
    Toastify({
      text: message,
      duration: 3000,
      newWindow: true,
      close: true,
      gravity: "top", 
      position: "right",
      style: {
        background: "#f44336",
      },
    }).showToast();
  }
}