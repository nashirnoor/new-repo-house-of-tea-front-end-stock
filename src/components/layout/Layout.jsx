import { useSelector } from 'react-redux';
import BranchSidebar from './BranchSidebar';
import StoreSidebar from './StoreSidebar';

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex h-screen bg-gray-100">
      {user.role === 'admin' ? <StoreSidebar /> : <BranchSidebar />}      
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
