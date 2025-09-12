import Index from "./pages/Index";
import Login from "./pages/authentication/Login";
import NotFound from "./pages/NotFound";
import Register from "./pages/authentication/Register";
import FormNotFound from "./pages/FormNotFound";
import ResetPassword from "./pages/authentication/ResetPassword";
import { FormViewer } from "./components/form-builder/FormViewer";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import { FormBuilder } from "./components/form-builder";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ProtectedRoute from "./pages/authentication/ProtectedRoute";
import Terms from "./pages/legal/Terms";
import About from "./pages/info/About";
import Privacy from "./pages/legal/Privacy";
import Contact from "./pages/info/Contact";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors />
      <Routes>
        <Route path="*" element={<NotFound />} />
        {/* Auth pages (publiques) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        
        <Route path="/terms" element={<Terms />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form-not-found/:error"
          element={
            <ProtectedRoute>
              <FormNotFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/builder/create"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form/builder/edit/:id"
          element={
            <ProtectedRoute>
              <FormBuilder />
            </ProtectedRoute>
          }
        />
        {/* Uniquement publique */}
        <Route path="/form/:id/view" element={<FormViewer />} />
        <Route
          path="/form/preview/:id"
          element={
            <ProtectedRoute>
              <FormViewer />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />{" "}
        <Route path="/contact" element={<Contact />} />{" "}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
