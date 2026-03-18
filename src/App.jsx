import { RouterProvider } from "react-router-dom";
import router from "./route"; // Import the router you created in route.jsx

function App() {
  return (
    // RouterProvider is the "engine" that makes your routes work
    <RouterProvider router={router} />
  );
}

export default App;