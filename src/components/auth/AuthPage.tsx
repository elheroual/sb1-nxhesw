import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { User, Lock } from 'lucide-react';
import { Header } from '../Header';
import { useLanguage } from '../../contexts/LanguageContext';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (email === 'admin@company.com' && password === 'admin123') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name: 'Admin User',
          role: 'admin',
          email: email
        }, { merge: true });
        return;
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          role: 'technician',
          email,
          department: 'IT Support',
          ticketsCompleted: 0,
          averageResolutionTime: 0
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Header />
      
      <div className="pt-20 px-4 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-8 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-full bg-blue-100 animate-bounce-slow">
              {isLogin ? (
                <Lock className="h-8 w-8 text-blue-600" />
              ) : (
                <User className="h-8 w-8 text-blue-600" />
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {t(isLogin ? 'welcome.back' : 'create.account')}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
            >
              {t(isLogin ? 'sign.in' : 'sign.up')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? t('create.account') : t('welcome.back')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};