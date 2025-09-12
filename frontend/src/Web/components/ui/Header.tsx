import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { useUser } from '../../services/userService';
import authService from '../../services/authService';
import APP_LOGO from '../../assets/image/hozy-logo.png';

const Header: React.FC = ({ backurl, backtext }: { backurl: string, backtext: string }) => {
  const { user, loading } = useUser();

  const handleLogout = () => {
    authService.logout();
  };

  // if (loading) {
  //   return (
  //     <header className="bg-base-200 p-4 flex justify-between items-center">
  //       <span className="loading loading-spinner loading-md"></span>
  //     </header>
  //   );
  // }

  return (
    <header className=" border-b border-base-content/10  p-2 flex justify-between items-center ">
      <Link to={backurl} className="text-xl font-bold group">
        <span className='group-hover:hidden flex items-center gap-2'>
          <img src={APP_LOGO} alt="hozy-logo" className='w-8 h-8' />
          {/* Hozy form */}
        </span>
        <span className='group-hover:block hidden '>
          <span className='flex items-center gap-2'> <ArrowLeft /> {backtext}</span>
        </span>

      </Link>
      {user ? (
        <Link to="/profile" className="flex items-center gap-4">
          {user.photoURL ? (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user.photoURL} alt={user.displayName || user.email} />
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary text-base-100 flex items-center justify-center">
              {loading ? <span className="loading loading-spinner loading-md"></span> : user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
            </div>
          )}
          {/* <div className="flex flex-col">
            <span className="font-semibold">{user.displayName || user.email}</span>
            <span className="text-sm text-gray-500">{user.role}</span>
          </div>  */}
          {/* <button className="btn btn-sm btn-error" onClick={handleLogout}>
            Déconnexion
          </button> */}
        </Link>
      ) : (
        <div className="text-gray-500">Utilisateur non connecté</div>
      )}
    </header>
  );
};

export default Header;
