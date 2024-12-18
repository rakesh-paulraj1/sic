import { Link } from 'react-router-dom';
import ProfileDropdown  from './ui/ProfileDropdown';
const Topbar = () => {
  return (
    <div className="bg-pink-800 text-white py-4 px-6">
    <div className="flex items-center space-x-6">
      <Link to={"/admindashboard"}><div className="text-lg font-bold">Verifier</div></Link>
      <Link to={"/admin_ideaevaluator"}><div className="text-lg font-bold">Idea Evaluator</div></Link>
      <Link to={"/addideas"}><div className="text-lg font-bold"> Add Ideas</div></Link>
      <div className="absolute top-30 right-4">
  <ProfileDropdown userName="Admin" />
</div>

    
    </div>
  </div>
  
  );
};

export default Topbar;
