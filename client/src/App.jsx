import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import {Inicio} from "./pages/Inicio.jsx"
import {Tema1} from "./pages/Tema1.jsx"
import {Tema2} from "./pages/Tema2.jsx"
import {Tema1SegundoIntento} from "./pages/Tema1Segundointento.jsx"
import {Tema2SegundoIntento} from "./pages/Tema2SegundoIntento.jsx"
import {Tema1Calculo} from "./pages/Tema1Calculo.jsx"
import {Tema2Calculo} from "./pages/Tema2Calculo.jsx"
import {Toaster} from "react-hot-toast"
function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio"/>}/>
        <Route path="/inicio" element={<Inicio/>} />
        <Route path="/tema1" element={<Tema1/>} />
        <Route path="/tema2" element={<Tema2/>} />
        <Route path="/tema1segundointento" element={<Tema1SegundoIntento/>} />
        <Route path="/tema2segundointento" element={<Tema2SegundoIntento/>} />
        <Route path="/tema1calculo" element={<Tema1Calculo/>} />
        <Route path="/tema2calculo" element={<Tema2Calculo/>} />
      </Routes>
      <Toaster/>
    </BrowserRouter>
  )
}

export default App