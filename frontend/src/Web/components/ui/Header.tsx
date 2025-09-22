import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '../../services/userService';
import APP_LOGO from '../../assets/image/hozy-logo.png';

interface HeaderProps {
  backurl?: string;
  backtext?: string;
}

const Header: React.FC<HeaderProps> = ({ backurl, backtext }) => {
  const { user, loading } = useUser();


  
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-base-100/30 border-b border-base-content/10 p-1 fl ex justify-center items-center ">
     <div className="mx-auto flex justify-between items-center max-w-4xl  rounded-xl py-1   px-10 mx-10"> 
      <Link to={backurl || "/"} className="text-xl font-bold group w-50">
        <span className={'flex items-center gap-2 group-hover:'  + (backurl === '/' ? 'hidden' : '')}>
          <img src={APP_LOGO} alt="hozy-logo" className='w-7 h-7' />
          {/* Hozy form */}
        </span>
        {backurl && (
        <span className={'group-hover:block ' + (backurl === '/' ? 'hidden' : '')}>
          <span className='flex items-center gap-2'> <ArrowLeft /> {backtext}</span>
        </span>
        )}

      </Link>
      {user ? (
        <Link to="/profile" className="flex items-center gap-4">
          {user.photoURL ? (
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={user.photoURL} alt={user.displayName || user.email} />
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary text-base-100 flex items-center justify-center">
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
      </div>
    </header>
  );
};

export default Header;
