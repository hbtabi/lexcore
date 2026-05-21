import { Routes, Route, useLocation } from "react-router";
import Home from "./pages/Home";
import DemoPage from "./pages/DemoPage";
import AdminPage from "./pages/AdminPage";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <PageTransition key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </PageTransition>
  );
}

export default function App() {
  return <AnimatedRoutes />;
}
