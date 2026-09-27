import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Weather from "./pages/Weather.jsx";
import Labour from "./pages/Labour.jsx";
import Machinery from "./pages/Machinery.jsx";
import Mandi from "./pages/Mandi.jsx";
import Finance from "./pages/Finance.jsx";
import FinanceForm from "./pages/FinanceForm.jsx";
import FinanceDetails from "./pages/FinanceDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

const Layout = () => (
  <>
    <Navbar />
    <main className="page">
      <Outlet />
    </main>
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "weather", element: <ProtectedRoute><Weather /></ProtectedRoute> },
      { path: "labour", element: <ProtectedRoute><Labour /></ProtectedRoute> },
      { path: "machinery", element: <ProtectedRoute><Machinery /></ProtectedRoute> },
      { path: "mandi", element: <ProtectedRoute><Mandi /></ProtectedRoute> },
      { path: "finance", element: <ProtectedRoute><Finance /></ProtectedRoute> },
      { path: "finance/new", element: <ProtectedRoute><FinanceForm /></ProtectedRoute> },
      { path: "finance/:id", element: <ProtectedRoute><FinanceDetails /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
