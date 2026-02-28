import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LearningStudio from "./pages/LearningStudio";
import UnitsPage from "./pages/UnitsPage";
import Kinematics1D from "./pages/Kinematics1DPage";
import LawsOfMotion from "./pages/LawsOfMotionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn/projectile-motion" element={<LearningStudio />} />
          <Route path="/learn/units" element={<UnitsPage />} />
          <Route path="/learn/Kinematics-1D" element={<Kinematics1D/>}/>
          <Route path="/learn/laws-of-motion" element= {<LawsOfMotion/>} />
        </Routes>
      </BrowserRouter>
  </QueryClientProvider>
);

export default App;