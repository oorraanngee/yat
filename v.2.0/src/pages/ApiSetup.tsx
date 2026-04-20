import React, { useState, useEffect, useRef } from 'react';
import { auth, db, signInWithGoogle } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { User, Calendar, Phone, CheckCircle, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApiSetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [smsFailedAttempts, setSmsFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const recaptchaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if already has key
    if (auth.currentUser) {
      checkExistingKey();
    }
  }, [auth.currentUser, step]);

  const checkExistingKey = async () => {
    const q = query(collection(db, 'api_keys'), where('userId', '==', auth.currentUser?.uid));
    const snap = await getDocs(q);
    if (!snap.empty && step < 4) {
      navigate('/api-dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdaySubmit = async () => {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 5 || age > 99) {
      setError('Извините, но вам должно быть от 5 до 99 лет для получения ключа.');
      return;
    }

    setStep(3);
    setError('');
  };

  const setupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) return;
    (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
  };

  const handleSendSms = async () => {
    setLoading(true);
    setError('');
    try {
      setupRecaptcha();
      const verifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      setConfirmationResult(result);
      setSmsFailedAttempts(0); // Reset on success
    } catch (err: any) {
      setSmsFailedAttempts(prev => prev + 1);
      setError('Ошибка отправки SMS. Убедитесь, что номер введен в международном формате (напр. +7...).');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    setError('');
    try {
      const result = await confirmationResult.confirm(verificationCode);
      // Success! Now generate API key
      await generateKey(result.user.uid);
      setStep(4);
    } catch (err: any) {
      setError('Неверный код подтверждения.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSms = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await generateKey(auth.currentUser.uid);
      setStep(4);
    } catch (err: any) {
      setError('Ошибка при генерации ключа.');
    } finally {
      setLoading(false);
    }
  };

  const generateKey = async (uid: string) => {
    const newKey = 'yat_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Save User profile
    await setDoc(doc(db, 'users', uid), {
      uid,
      email: auth.currentUser?.email,
      birthday,
      phoneVerified: true,
      createdAt: new Date().toISOString()
    });

    // Save API Key
    await addDoc(collection(db, 'api_keys'), {
      key: newKey,
      userId: uid,
      isActive: true,
      historyEnabled: false,
      createdAt: new Date().toISOString(),
      totalRequests: 0,
      lastUsedAt: null
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl uppercase tracking-[10px] text-[#f4ecd8] mb-4">Получение API Ключа</h1>
        <div className="flex justify-center gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div 
              key={s} 
              className={`w-3 h-3 rounded-full ${step >= s ? 'bg-[#d4af37]' : 'bg-[#3d2b20]'}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-[#2b1d14] border border-[#3d2b20] p-8 rounded-lg shadow-2xl relative">
        <div id="recaptcha-container"></div>
        
        <AnimatePresence mode="wait">
          {/* Step 1: Google login */}
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center gap-6"
            >
              <User size={64} className="text-[#856a54]" />
              <div className="text-center">
                <h2 className="text-xl text-[#f4ecd8] mb-2 font-bold">Шаг 1: Авторизация</h2>
                <p className="text-[#856a54] italic">Войдите через Google для начала процесса.</p>
              </div>
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="cta-button w-full flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Войти через Google'}
              </button>
            </motion.div>
          )}

          {/* Step 2: Birthday */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-4 text-[#f4ecd8]">
                <Calendar className="text-[#d4af37]" />
                <h2 className="text-xl font-bold">Шаг 2: Дата рождения</h2>
              </div>
              <p className="text-[#856a54] italic text-sm">Согласно правилам, мы должны убедиться в вашем возрасте.</p>
              
              <div className="flex flex-col gap-2">
                <label className="text-[#f4ecd8] text-sm uppercase tracking-widest px-1">Ваш день рождения</label>
                <input 
                  type="date" 
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="bg-[#1e130c] border border-[#3d2b20] p-3 text-[#f4ecd8] rounded focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {error && (
                <div className="flex bg-red-900/20 border border-red-900/50 p-3 rounded gap-2 text-red-500 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                onClick={handleBirthdaySubmit}
                disabled={!birthday}
                className="cta-button w-full"
              >
                Продолжить
              </button>
            </motion.div>
          )}

          {/* Step 3: SMS */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-4 text-[#f4ecd8]">
                <Phone className="text-[#d4af37]" />
                <h2 className="text-xl font-bold">Шаг 3: SMS Подтверждение</h2>
              </div>
              
              {!confirmationResult ? (
                <>
                  <p className="text-[#856a54] italic text-sm">Введите ваш номер телефона для получения кода.</p>
                  <input 
                    type="tel" 
                    placeholder="+7 000 000 00 00"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-[#1e130c] border border-[#3d2b20] p-3 text-[#f4ecd8] rounded focus:outline-none focus:border-[#d4af37]"
                  />
                  {error && <p className="text-red-500 text-xs italic">{error}</p>}
                  <button onClick={handleSendSms} disabled={loading} className="cta-button">
                    {loading ? <Loader2 className="animate-spin inline mr-2" /> : 'Отправить SMS'}
                  </button>
                  {smsFailedAttempts >= 5 && (
                    <button 
                      onClick={handleSkipSms} 
                      className="text-[#d4af37] text-xs uppercase tracking-widest hover:underline mt-2 p-2 border border-[#d4af37]/30 rounded hover:bg-[#d4af37]/5"
                    >
                      Пропустить подтверждение (техническая ошибка)
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-[#856a54] italic text-sm">Код отправлен на {phoneNumber}. Введите его ниже.</p>
                  <input 
                    type="text" 
                    placeholder="Код из SMS"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="bg-[#1e130c] border border-[#3d2b20] p-3 text-[#f4ecd8] rounded focus:outline-none focus:border-[#d4af37]"
                  />
                  {error && <p className="text-red-500 text-xs italic">{error}</p>}
                  <button onClick={handleVerifyCode} disabled={loading} className="cta-button">
                    {loading ? <Loader2 className="animate-spin inline mr-2" /> : 'Подтвердить код'}
                  </button>
                  <button onClick={() => setConfirmationResult(null)} className="text-[#856a54] text-xs hover:text-[#d4af37] underline">
                    Изменить номер
                  </button>
                </>
              )}
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center gap-6"
            >
              <CheckCircle size={80} className="text-green-500" />
              <div>
                <h2 className="text-2xl text-[#f4ecd8] mb-2 font-bold uppercase tracking-widest">Ключ готов!</h2>
                <p className="text-[#856a54] italic">
                  Поздравляем! Вы успешно прошли верификацию и получили доступ к API «Ять».
                </p>
              </div>
              <button 
                onClick={() => navigate('/api-dashboard')}
                className="cta-button w-full flex items-center justify-center gap-2"
              >
                В личный кабинет <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
