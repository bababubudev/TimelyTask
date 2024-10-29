import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import { router } from "./utility/routingUtil.tsx"
import "./styles/index.scss"
import OptionsProvider from "./context/OptionsProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OptionsProvider>
      <RouterProvider router={router} />
    </OptionsProvider>
  </StrictMode>,
)
