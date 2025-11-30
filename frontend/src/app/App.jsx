import { BrowserRouter } from 'react-router-dom'
import { Routing } from './providers/router'
import './styles/App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routing />
      </div>
    </BrowserRouter>
  )
}

export default App