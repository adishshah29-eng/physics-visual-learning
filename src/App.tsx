import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LearningStudio from "./pages/LearningStudio";
import UnitsPage from "./pages/UnitsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn/projectile-motion" element={<LearningStudio />} />
          <Route path="/learn/units" element={<UnitsPage />} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;