import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/pages/Dashboard';
import CareerIntelligence from './components/pages/CareerIntelligence';
import CVList from './components/cv/CVList';
import CVForm from './components/cv/CVForm';
import CVDetail from './components/cv/CVDetail';
import ChatInterface from './components/chat/ChatInterface';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/career-intelligence"
                element={<PrivateRoute><CareerIntelligence /></PrivateRoute>}
              />
              <Route 
                path="/cvs" 
                element={
                  <PrivateRoute>
                    <CVList />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/cvs/new" 
                element={
                  <PrivateRoute>
                    <CVForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/cvs/:id/edit" 
                element={
                  <PrivateRoute>
                    <CVForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/cvs/:id" 
                element={
                  <PrivateRoute>
                    <CVDetail />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/chat/:id" 
                element={
                  <PrivateRoute>
                    <ChatInterface />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
