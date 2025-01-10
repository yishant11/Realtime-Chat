
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';
import { Route, Routes } from 'react-router-dom';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';
import Chat from './pages/Chat/Chat';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/profile' element={<ProfileUpdate />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App;
