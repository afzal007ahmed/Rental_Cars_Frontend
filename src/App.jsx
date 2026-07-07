import { BrowserRouter } from "react-router";
import AppRouter from "./routes/AppRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
