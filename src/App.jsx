import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
