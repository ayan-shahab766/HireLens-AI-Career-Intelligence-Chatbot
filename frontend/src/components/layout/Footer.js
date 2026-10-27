// src/components/layout/Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">HireLens Chatbot</h2>
            <p className="text-gray-400">Your AI career intelligence assistant</p>
          </div>
          <div>
            <p className="text-gray-400">© {new Date().getFullYear()} HireLens Chatbot. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
