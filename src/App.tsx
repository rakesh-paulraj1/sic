import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Allschools from './pages/adminpages/Detailedidea';
import { Login } from './pages/adminpages/Login';
import Admindashboard from './pages/adminpages/Admindashboard';
import EvalutorRegistration from './pages/EvalutorRegistration';
import Ideaevaluator from './pages/adminpages/Ideaevaluator';
import EditEvaluator from './pages/adminpages/Editevaluator';
import Ideainput from './pages/adminpages/Ideainput';
import DetailedIdea from './pages/adminpages/Detailedidea';



function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/editevaluator/:evaluator_id" element={<EditEvaluator />} />         
          <Route path="/allschools" element={<Allschools />} />
          <Route path="/admin_ideaevaluator" element={<Ideaevaluator />} />
          <Route path="/evaluator_registration" element={<EvalutorRegistration />} />
          <Route path="/admindashboard" element={<Admindashboard />} />
          <Route path='/addideas' element={<Ideainput />} />
          <Route path='/detailedidea/:idea_id' element={<DetailedIdea />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
