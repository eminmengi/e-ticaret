import { Switch, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ShopPage from "../pages/ShopPage";
import ProductDetail from "../pages/ProductDetail";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import PricingPage from "../pages/PricingPage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import CartPage from "../pages/CartPage";
import CheckoutAddressPage from "../pages/CheckoutAddressPage";
import ProtectedRoute from "./ProtectedRoute";

export default function PageContent() {
  return (
    <Switch>
      <Route exact path="/">
        <HomePage />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId">
        <ProductDetail />
      </Route>
      <Route path="/shop">
        <ShopPage />
      </Route>
      <Route path="/cart">
        <CartPage />
      </Route>
      <ProtectedRoute path="/checkout">
         <CheckoutAddressPage />
      </ProtectedRoute>
      <Route path="/contact">
        <ContactPage />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route path="/pricing">
        <PricingPage />
      </Route>
    </Switch>
  );
}