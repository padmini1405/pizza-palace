import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu"; // Make sure to import your Menu page
import ProductDescription from "./pages/ProductDescription";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";
import "./styles/global.css";
import { Toaster } from "react-hot-toast";
import AdminPizzaList from "./pages/AdminPizzaList";
import OrdersPage from "./pages/OrderPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/product/:id" element={<ProductDescription />} />
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />}/>
        <Route path="/admin-pizzalist" element={<AdminPizzaList />}/>
        <Route path="/my-orders" element={<OrdersPage />}/>
        <Route path="/admin-orders" element={<OrdersPage adminView={true} />}/>
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;