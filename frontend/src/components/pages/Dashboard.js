// src/components/pages/Dashboard.js
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCVs } from '../../redux/slices/cvSlice';

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cvs, isLoading } = useSelector((state) => state.cv);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }

    dispatch(getCVs());
  }, [user, navigate, dispatch]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CV Management Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">CV Management</h2>
            <p className="text-gray-600 mb-4">
              {cvs.length > 0
                ? `You have ${cvs.length} CV${cvs.length !== 1 ? 's' : ''} uploaded.`
                : 'You have not uploaded any CVs yet.'}
            </p>
            <div className="flex flex-col space-y-2">
              <Link
                to="/cvs"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-center"
              >
                View My CVs
              </Link>
              <Link
                to="/cvs/new"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-center"
              >
                Upload New CV
              </Link>
            </div>
          </div>
        </div>

        {/* Recent CVs Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent CVs</h2>
            {cvs.length === 0 ? (
              <p className="text-gray-600">No CVs found. Upload your first CV now!</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cvs.slice(0, 3).map((cv) => (
                  <li key={cv.id} className="py-2">
                    <Link
                      to={`/cvs/${cv.id}`}
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {cv.title}
                    </Link>
                    <p className="text-gray-500 text-sm">
                      Updated: {new Date(cv.updated_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Access Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link
                  to="/cvs/new"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <span className="mr-2">+</span> Upload a new CV
                </Link>
              </li>
              <li>
                <Link
                  to="/cvs"
                  className="flex items-center text-indigo-600 hover:text-indigo-800"
                >
                  <span className="mr-2">📄</span> Manage your CVs
                </Link>
              </li>
              {cvs.length > 0 && (
                <li>
                  <Link
                    to={`/chat/${cvs[0].id}`}
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <span className="mr-2">💬</span> Chat with your latest CV
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;