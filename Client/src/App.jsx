
import Landing from './Pages/Landing'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Signup from './Components/Signup'
import Login from './Components/Login'
import Home from './Pages/Home'
import Meditation from './Pages/Meditation'
import Workout from './Pages/Workout'
import Games from './Pages/Games'
import DietPlan from './Pages/DietPlan'
import Profile from './Pages/Profile'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/meditate' element={<Meditation/>}/>
        <Route path='/games' element={<Games/>}/>
        <Route path='/workout' element={<Workout/>}/>
        <Route path='/diet' element={<DietPlan/>}/>
        <Route path='/profile' element={<Profile/>}/>
        
      </Routes>
      
  
    </BrowserRouter>
      
      
    </>
  )
}

export default App
