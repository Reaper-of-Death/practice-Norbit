import { BrowserRouter } from 'react-router-dom'
import { Routing } from './providers/router'
import { CartProvider } from "@features/addToCart/cartContext/cartProvader";
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <CartProvider>
          <Routing />
        </CartProvider>
      </div>
    </BrowserRouter>
  )
}

export default App