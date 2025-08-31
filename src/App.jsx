import { Route, Routes } from 'react-router-dom'
import './App.css'
import Form from './components/Form/Form'
import Hero from './components/Hero/Hero'

function App() {

  return (
    <Routes>
      <Route path='/' element={ <Hero />}  />                 
      <Route path='/Form' element={ <Form />}   />                 
    </Routes>
  )
}

export default App