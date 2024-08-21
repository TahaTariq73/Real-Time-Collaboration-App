import { useState, Fragment } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Panel from './components/Panel';
import ProtectedRoute from './ProtectedRoute';
import "./App.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={
          <ProtectedRoute Component={Panel} />
        } />
      </Routes>      
    </Fragment>
  )
}

export default App;