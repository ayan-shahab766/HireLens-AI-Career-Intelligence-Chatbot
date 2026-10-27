// src/components/cv/CVList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getCVs, deleteCV, reset } from '../../redux/slices/cvSlice';

function CVList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cvs, isLoading, isError, message } = useSelector((state) => state.cv);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    }

    dispatch(getCVs());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this CV?')) {
      dispatch(deleteCV(id));
    }
  };

  const navigateToNewCV = () => {
    console.log('Navigating to /cvs/new');
    // Force a hard navigation to the page
    window.location.href = '/cvs/new';
    // As a fallback, also try the navigate function
    // navigate('/cvs/new');
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your CVs</h1>
        <button
          onClick={navigateToNewCV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          Upload New CV
        </button>
      </div>

      {cvs.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">You haven't uploaded any CVs yet.</p>
          <button
            onClick={navigateToNewCV}
            className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 inline-block"
          >
            Upload your first CV
          </button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cvs.map((cv) => (
              <li key={cv.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <Link
                      to={`/cvs/${cv.id}`}
                      className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {cv.title}
                    </Link>
                    <p className="text-gray-500 text-sm">
                      Uploaded: {new Date(cv.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Status: {cv.is_processed ? 'Processed' : 'Processing...'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/chat/${cv.id}`}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Chat
                    </Link>
                    <Link
                      to={`/cvs/${cv.id}/edit`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(cv.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CVList;