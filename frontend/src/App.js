import logo from "./logo.svg";
import "./App.css";
import EmployeeHome from "./pages/Employee/EmployeeHome";
import Login from "./pages/User/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Thankyou from "./pages/Thankyou/Thankyou";


function App() {

  const route = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/Employee/",
      element: <EmployeeHome />,
    },
    {
      path:'/thank-you',
      element:<Thankyou/>
    },
  ]);
  return (
    <>
      <RouterProvider router={route} />
    </>
  );
}

export default App;
