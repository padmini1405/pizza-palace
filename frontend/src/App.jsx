// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import Home from "./pages/Home";
// import Menu from "./pages/Menu"; // Make sure to import your Menu page
// import ProductDescription from "./pages/ProductDescription";
// import AuthPage from "./pages/AuthPage";
// import AdminDashboard from "./pages/AdminDashboard";
// import "./styles/global.css";
// import { Toaster } from "react-hot-toast";
// import AdminPizzaList from "./pages/AdminPizzaList";
// import OrdersPage from "./pages/OrderPage";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import ProtectedRoute from "./routes/ProtectedRoute";
// import GuestRoute from "./routes/GuestRoute";
// import AdminRoute from "./routes/AdminRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Toaster position="top-right" />
//       <Routes>
//         <Route path="/home" element={<Home />} />
//         <Route path="/menu" element={<Menu />} />
//         <Route path="/product/:id" element={<ProductDescription />} />
//         <Route path="/" element={<AuthPage />} />
//         <Route path="/admin-dashboard" element={<AdminDashboard />}/>
//         <Route path="/admin-pizzalist" element={<AdminPizzaList />}/>
//         <Route path="/my-orders" element={<OrdersPage />}/>
//         <Route path="/admin-orders" element={<OrdersPage adminView={true} />}/>
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/checkout" element={<Checkout />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDescription from "./pages/ProductDescription";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPizzaList from "./pages/AdminPizzaList";
import OrdersPage from "./pages/OrderPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import AdminRoute from "./routes/AdminRoute";

import "./styles/global.css";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* LOGIN / REGISTER PAGE */}
        <Route path="/" element={ <GuestRoute> <AuthPage /> </GuestRoute>}/>

        {/* CUSTOMER PROTECTED ROUTES */}
        <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute>}/>

        <Route path="/menu" element={ <ProtectedRoute> <Menu /> </ProtectedRoute>}/>

        <Route path="/product/:id" element={ <ProtectedRoute> <ProductDescription /> </ProtectedRoute>}/>

        <Route path="/my-orders" element={ <ProtectedRoute> <OrdersPage /> </ProtectedRoute>} />

        <Route path="/cart" element={ <ProtectedRoute> <Cart /> </ProtectedRoute> }/>

        <Route path="/checkout" element={ <ProtectedRoute> <Checkout /> </ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin-dashboard" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> }/>

        <Route path="/admin-pizzalist" element={ <AdminRoute> <AdminPizzaList /> </AdminRoute>}/>

        <Route path="/admin-orders" element={ <AdminRoute> <OrdersPage adminView={true} /> </AdminRoute> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;