"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePostAuthRegisterOtp } from '@/services/generated/auth/auth';
import { usePostAuthRegister } from '@/services/generated/customer-auth/customer-auth';

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Mutation for sending OTP
  const { mutate: sendOtpMutate, isPending: isSendingOtp } = usePostAuthRegisterOtp({
    mutation: {
      onSuccess: () => {
        setSuccessMessage('Mã OTP đã được gửi về email của bạn!');
        setStep(2);
      },
      onError: (err: unknown) => {
        console.error(err);
        const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
        const message = errorResponse?.response?.data?.message || errorResponse?.message || 'Không thể gửi mã OTP. Vui lòng kiểm tra lại email!';
        
        if (message.includes('Email') || message.includes('email')) {
          setFieldErrors({ email: message });
        } else {
          setError(message);
        }
      }
    }
  });

  // Mutation for completing registration
  const { mutate: registerMutate, isPending: isRegistering } = usePostAuthRegister({
    mutation: {
      onSuccess: () => {
        setSuccessMessage('');
        setStep(3);
        setTimeout(() => {
          router.push('/dang-nhap');
        }, 3000);
      },
      onError: (err: unknown) => {
        console.error(err);
        const errorResponse = err as { response?: { data?: { message?: string, fields?: Record<string, string> } }; message?: string };
        const serverErrors = errorResponse?.response?.data?.fields;
        const message = errorResponse?.response?.data?.message || errorResponse?.message || 'Đăng ký tài khoản thất bại. Vui lòng kiểm tra lại thông tin!';
        
        if (serverErrors && Object.keys(serverErrors).length > 0) {
          setFieldErrors(serverErrors);
        } else {
          const newErrors: Record<string, string> = {};
          if (message.includes('Email') || message.includes('email')) {
            newErrors.email = message;
          }
          if (message.includes('Số điện thoại') || message.includes('số điện thoại') || message.includes('phone')) {
            newErrors.phone = message;
          }
          if (message.includes('OTP') || message.includes('otp')) {
            newErrors.otp = message;
          }
          
          if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
          } else {
            setError(message);
          }
        }
      }
    }
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = 'Họ và tên không được để trống';
    }
    if (!email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email không đúng định dạng';
    }
    if (!password) {
      errors.password = 'Mật khẩu không được để trống';
    } else if (password.length < 8) {
      errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (phone.trim() && !/^[0-9+() -]{9,15}$/.test(phone)) {
      errors.phone = 'Số điện thoại không đúng định dạng';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    sendOtpMutate({ data: { email } });
  };

  const handleCompleteRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    if (!otp.trim()) {
      setFieldErrors({ otp: 'Vui lòng nhập mã OTP để xác nhận' });
      return;
    }
    if (otp.length !== 6) {
      setFieldErrors({ otp: 'Mã OTP phải có 6 chữ số' });
      return;
    }

    registerMutate({
      data: {
        email,
        password,
        name: fullName,
        phone: phone ? phone.trim() : undefined,
        otp
      }
    });
  };

  return (
    <div className="bg-background text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex items-center justify-center p-sm md:p-md" style={{ backgroundColor: '#fff9ed' }}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-[0.06]" aria-hidden={true}>
        <svg
            className="absolute -top-20 -left-20 w-[600px] h-[600px] text-soft-sage" fill="currentColor"
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M40,100 Q40,40 100,40 Q160,40 160,100 Q160,160 100,160 Q40,160 40,100 M100,40 L100,160 M40,100 L160,100"
                fill="none" stroke="currentColor" strokeWidth="0.5"></path>
            <path d="M100,40 C120,60 140,80 140,110 C140,140 120,160 100,160 C80,160 60,140 60,110 C60,80 80,60 100,40"
                fill="currentColor"></path>
        </svg>
        <svg className="absolute -bottom-40 -right-20 w-[800px] h-[800px] text-herbal-beige" fill="currentColor"
            viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100,20 C110,50 150,70 150,110 C150,150 120,180 100,180 C80,180 50,150 50,110 C50,70 90,50 100,20"
                fill="currentColor"></path>
        </svg>
      </div>

      <main className="w-full max-w-md">
          <div
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-herbal-beige p-lg flex flex-col items-center relative overflow-hidden">
              
              {(isSendingOtp || isRegistering) && (
                  <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-50 transition-all duration-300">
                      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                      <p className="mt-sm text-label-md font-label-md text-primary animate-pulse">
                          {isSendingOtp ? 'Đang gửi mã OTP...' : 'Đang xử lý đăng ký...'}
                      </p>
                  </div>
              )}

              {/* Logo Area */}
              <div className="flex flex-col items-center mb-md w-full">
                  <Link href="/" className="flex flex-col items-center">
                      <img className="h-16 w-16 object-contain mb-xs"
                          data-alt="NaHerbs Logo"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdUdIPnmPwjFAlnYzsFrod8gw_Fi_LEz7tMBbOarhF2B5-5P_cv7JwEfAT9Wcj_NAHZ4pWG0TG_VDFgep8qzJam-li_Nf-SXCDXSlGwpfzLJ32BujozunXtZnDd8OhqcyoS1MVJri8HtnGl0OQmbzEEPnPYJoo7ER8pJ-QuokxxKuLqi19SZ1lUSOtKD0D4dz1z5bD9ul7fq35ixtL7XCUc4nJQRAtaKlolZrhXpez0_RS4ZtqzPxWUmUWnfmtlJoM09EsIuCfBhA" />
                      <h1 className="font-headline-md text-headline-md text-primary text-center font-bold">NaHerbs</h1>
                  </Link>
                  <p className="font-body-md text-body-md text-text-muted text-center mt-xs">
                      {step === 1 ? 'Đăng ký để lưu giỏ hàng và theo dõi đơn hàng dễ dàng hơn' : step === 2 ? 'Nhập mã OTP để xác nhận tài khoản' : 'Hoàn tất đăng ký thành viên'}
                  </p>
              </div>

              {error && (
                  <div className="w-full mb-md p-sm bg-error-bg border border-error-text text-error-text text-caption rounded-lg text-center">
                      {error}
                  </div>
              )}

              {successMessage && (
                  <div className="w-full mb-md p-sm bg-success-bg border border-primary/20 text-primary text-caption rounded-lg text-center">
                      {successMessage}
                  </div>
              )}

              {step === 1 && (
                  /* Step 1: Registration Form */
                  <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-sm">
                      <div>
                          <label className="block font-label-md text-label-md text-text-main mb-xs" htmlFor="fullName">Họ và tên</label>
                          <div className="relative">
                              <span
                                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">person</span>
                              <input
                                  className={`organic-input w-full rounded-lg pl-10 pr-4 font-body-md text-body-md text-text-main placeholder:text-text-muted/60 ${
                                      fieldErrors.fullName ? 'border-error-text focus:ring-error-text/25 focus:border-error-text' : ''
                                  }`}
                                  id="fullName" 
                                  name="fullName" 
                                  placeholder="Nguyễn Văn A" 
                                  type="text"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  disabled={isSendingOtp}
                              />
                          </div>
                          {fieldErrors.fullName && (
                              <p className="mt-xs text-caption font-caption text-error-text text-left pl-2">
                                  {fieldErrors.fullName}
                              </p>
                          )}
                      </div>
                      <div>
                          <label className="block font-label-md text-label-md text-text-main mb-xs" htmlFor="phone">Số điện thoại (Tùy chọn)</label>
                          <div className="relative">
                              <span
                                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">call</span>
                              <input
                                  className={`organic-input w-full rounded-lg pl-10 pr-4 font-body-md text-body-md text-text-main placeholder:text-text-muted/60 ${
                                      fieldErrors.phone ? 'border-error-text focus:ring-error-text/25 focus:border-error-text' : ''
                                  }`}
                                  id="phone" 
                                  name="phone" 
                                  placeholder="0912 345 678" 
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  disabled={isSendingOtp}
                              />
                          </div>
                          {fieldErrors.phone && (
                              <p className="mt-xs text-caption font-caption text-error-text text-left pl-2">
                                  {fieldErrors.phone}
                              </p>
                          )}
                      </div>
                      <div>
                          <label className="block font-label-md text-label-md text-text-main mb-xs" htmlFor="email">Email</label>
                          <div className="relative">
                              <span
                                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">mail</span>
                              <input
                                  className={`organic-input w-full rounded-lg pl-10 pr-4 font-body-md text-body-md text-text-main placeholder:text-text-muted/60 ${
                                      fieldErrors.email ? 'border-error-text focus:ring-error-text/25 focus:border-error-text' : ''
                                  }`}
                                  id="email" 
                                  name="email" 
                                  placeholder="name@example.com" 
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  disabled={isSendingOtp}
                              />
                          </div>
                          {fieldErrors.email && (
                              <p className="mt-xs text-caption font-caption text-error-text text-left pl-2">
                                  {fieldErrors.email}
                              </p>
                          )}
                      </div>
                      <div>
                          <label className="block font-label-md text-label-md text-text-main mb-xs" htmlFor="password">Mật khẩu</label>
                          <div className="relative">
                              <span
                                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">lock</span>
                              <input
                                  className={`organic-input w-full rounded-lg pl-10 pr-10 font-body-md text-body-md text-text-main placeholder:text-text-muted/60 ${
                                      fieldErrors.password ? 'border-error-text focus:ring-error-text/25 focus:border-error-text' : ''
                                  }`}
                                  id="password" 
                                  name="password" 
                                  placeholder="Tối thiểu 8 ký tự" 
                                  type={showPassword ? 'text' : 'password'}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  disabled={isSendingOtp}
                              />
                              <button
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  disabled={isSendingOtp}
                              >
                                  <span className="material-symbols-outlined">
                                      {showPassword ? 'visibility' : 'visibility_off'}
                                  </span>
                              </button>
                          </div>
                          {fieldErrors.password && (
                              <p className="mt-xs text-caption font-caption text-error-text text-left pl-2">
                                  {fieldErrors.password}
                              </p>
                          )}
                      </div>
                      {/* CTA */}
                      <button
                          className="mt-xs w-full h-[48px] bg-primary text-on-primary font-label-md text-label-md rounded-full hover:bg-surface-tint hover:-translate-y-[2px] transition-all duration-300 shadow-sm flex items-center justify-center disabled:opacity-50"
                          type="submit"
                          disabled={isSendingOtp}
                      >
                          {isSendingOtp ? 'Đang gửi mã OTP...' : 'Đăng ký (Nhận mã OTP)'}
                      </button>
                  </form>
              )}

              {step === 2 && (
                  /* Step 2: OTP Verification Form */
                  <form onSubmit={handleCompleteRegister} className="w-full flex flex-col gap-sm">
                      <div className="text-center my-xs text-body-md font-body-md text-text-main">
                          Chúng tôi đã gửi mã xác thực gồm 6 chữ số đến email: <br/>
                          <strong className="text-primary">{email}</strong>
                      </div>
                      <div>
                          <label className="block font-label-md text-label-md text-text-main mb-xs" htmlFor="otp">Mã xác thực OTP</label>
                          <div className="relative">
                              <span
                                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">key</span>
                              <input
                                  className={`organic-input w-full rounded-lg pl-10 pr-4 font-body-md text-body-md text-text-main text-center tracking-[8px] font-bold ${
                                      fieldErrors.otp ? 'border-error-text focus:ring-error-text/25 focus:border-error-text' : ''
                                  }`}
                                  id="otp" 
                                  name="otp" 
                                  placeholder="******" 
                                  maxLength={6}
                                  type="text"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  disabled={isRegistering}
                              />
                          </div>
                          {fieldErrors.otp && (
                              <p className="mt-xs text-caption font-caption text-error-text text-center pl-2">
                                  {fieldErrors.otp}
                              </p>
                          )}
                      </div>
                      {/* CTA */}
                      <button
                          className="mt-xs w-full h-[48px] bg-primary text-on-primary font-label-md text-label-md rounded-full hover:bg-surface-tint hover:-translate-y-[2px] transition-all duration-300 shadow-sm flex items-center justify-center disabled:opacity-50"
                          type="submit"
                          disabled={isRegistering}
                      >
                          {isRegistering ? 'Đang xác thực...' : 'Xác nhận Đăng ký'}
                      </button>
                      <button
                          className="w-full h-[40px] border border-border-warm text-on-surface font-label-md text-label-md rounded-full hover:bg-surface-container-low transition-colors"
                          type="button"
                          onClick={() => {
                            setStep(1);
                            setError('');
                            setSuccessMessage('');
                            setFieldErrors({});
                          }}
                          disabled={isRegistering}
                      >
                          Quay lại chỉnh sửa thông tin
                      </button>
                  </form>
              )}

              {step === 3 && (
                  /* Step 3: Success Screen */
                  <div className="w-full flex flex-col items-center text-center py-md animate-fade-in">
                      <div className="w-16 h-16 bg-success-bg text-primary rounded-full flex items-center justify-center mb-md animate-pulse">
                          <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-primary font-bold mb-xs">Đăng ký thành công!</h2>
                      <p className="font-body-md text-body-md text-text-muted mb-lg max-w-[320px]">
                          Chào mừng bạn đến với NaHerbs. Hệ thống sẽ tự động chuyển hướng bạn đến trang đăng nhập trong giây lát...
                      </p>
                      <Link href="/dang-nhap" className="w-full h-[48px] bg-primary text-on-primary font-label-md text-label-md rounded-full flex items-center justify-center hover:bg-surface-tint hover:-translate-y-[2px] transition-all duration-300 shadow-sm">
                          Đăng nhập ngay
                      </Link>
                  </div>
              )}

              {/* Login Link */}
              {step !== 3 && (
                  <div className="mt-md pt-sm border-t border-border-warm w-full text-center">
                      <p className="font-body-md text-body-md text-text-muted">
                          Đã có tài khoản?{' '}
                          <Link className="font-label-md text-label-md text-primary hover:text-surface-tint transition-colors ml-1"
                              href="/dang-nhap">Đăng nhập</Link>
                      </p>
                  </div>
              )}
          </div>
          {/* Trust Indicators below card */}
          <div className="mt-md flex justify-center items-center gap-sm text-text-muted">
              <span className="material-symbols-outlined text-soft-sage"
                  style={{ fontVariationSettings: '"FILL" 1' }}>encrypted</span>
              <span className="font-caption text-caption">Thông tin của bạn được bảo mật an toàn</span>
          </div>
      </main>
    </div>
  );
}
