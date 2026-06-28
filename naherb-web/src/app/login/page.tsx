"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { usePostAuthGoogle } from '@/services/generated/auth/auth';
import { usePostAuthLogin } from '@/services/generated/customer-auth/customer-auth';

export default function Login() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { mutate: loginMutate, isPending } = usePostAuthLogin({
    mutation: {
      onSuccess: () => {
        router.push('/');
      },
      onError: (err: unknown) => {
        console.error(err);
        const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
        const message = errorResponse?.response?.data?.message || errorResponse?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
        setError(message);
      }
    }
  });

  // Mutation for Google Login
  const { mutate: googleLoginMutate, isPending: isGooglePending } = usePostAuthGoogle({
    mutation: {
      onSuccess: () => {
        router.push('/');
      },
      onError: (err: unknown) => {
        console.error(err);
        const errorResponse = err as { response?: { data?: { message?: string } }; message?: string };
        const message = errorResponse?.response?.data?.message || errorResponse?.message || 'Đăng nhập bằng Google thất bại. Vui lòng thử lại!';
        setError(message);
      }
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!login || !password) {
      setError('Vui lòng điền đầy đủ email/số điện thoại và mật khẩu.');
      return;
    }

    loginMutate({ data: { login, password } });
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-sm md:p-md text-on-surface" style={{ backgroundColor: '#fff9ed', backgroundImage: "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M54.627 0l.83.83-53.797 53.8-.83-.83L54.627 0zM17.373 0l.83.83-16.544 16.543-.83-.83L17.373 0zM60 17.373l-.83.83L42.627 60l-.83-.83L59.17 17.373zM35.627 0l.83.83-34.797 34.8-.83-.83L35.627 0zM60 35.627l-.83.83L24.627 60l-.83-.83L59.17 35.627z\' fill=\'%23E8D8BD\' fillOpacity=\'0.2\' fillRule=\'evenodd\'%3E%3C/svg%3E')" }}>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <span className="material-symbols-outlined absolute text-soft-sage/5 text-[40px]"
              style={{ top: '10%', left: '5%', transform: 'rotate(15deg)' }}>eco</span>
          <span className="material-symbols-outlined absolute text-herbal-beige/5 text-[32px]"
              style={{ top: '25%', right: '8%', transform: 'rotate(-20deg)' }}>potted_plant</span>
          <span className="material-symbols-outlined absolute text-soft-sage/5 text-[48px]"
              style={{ bottom: '15%', left: '10%', transform: 'rotate(45deg)' }}>spa</span>
          <span className="material-symbols-outlined absolute text-herbal-beige/5 text-[36px]"
              style={{ bottom: '20%', right: '12%', transform: 'rotate(-10deg)' }}>psychiatry</span>
          <span className="material-symbols-outlined absolute text-soft-sage/5 text-[28px]"
              style={{ top: '60%', left: '3%', transform: 'rotate(30deg)' }}>eco</span>
          <span className="material-symbols-outlined absolute text-herbal-beige/5 text-[44px]"
              style={{ top: '45%', right: '4%', transform: 'rotate(-35deg)' }}>spa</span>
      </div>
      <div
          className="w-full max-w-md bg-surface-container-lowest rounded-xl organic-shadow p-gutter relative overflow-hidden z-10">
          
          {(isPending || isGooglePending) && (
              <div className="absolute inset-0 bg-surface/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-50 transition-all duration-300">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="mt-sm text-label-md font-label-md text-primary animate-pulse">Đang xử lý...</p>
              </div>
          )}

          <div className="text-center mb-lg">
              <h1 className="font-headline-lg hidden md:block text-headline-lg text-primary font-bold tracking-tight mb-xs">
                  <Link href="/">NaHerbs</Link>
              </h1>
              <h1
                  className="font-headline-lg-mobile md:hidden text-headline-lg-mobile text-primary font-bold tracking-tight mb-xs">
                  <Link href="/">NaHerbs</Link>
              </h1>
              <p className="font-body-md text-body-md text-text-muted">Wellness Management Platform</p>
          </div>

          {error && (
              <div className="mb-md p-sm bg-error-bg border border-error-text text-error-text text-caption rounded-lg">
                  {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">Email / Số điện thoại</label>
                  <div className="relative">
                      <span
                          className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">person</span>
                      <input
                          className="w-full h-[42px] pl-lg pr-sm bg-surface border border-border-warm rounded-lg font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          id="email" 
                          placeholder="Nhập email hoặc số điện thoại" 
                          type="text" 
                          value={login}
                          onChange={(e) => setLogin(e.target.value)}
                          disabled={isPending}
                      />
                  </div>
              </div>
              <div>
                  <div className="flex justify-between items-center mb-xs">
                      <label className="block font-label-md text-label-md text-on-surface-variant" htmlFor="password">Mật khẩu</label>
                      <Link className="font-caption text-caption text-primary hover:text-primary-container transition-colors"
                          href="/register">Quên mật khẩu?</Link>
                  </div>
                  <div className="relative">
                      <span
                          className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">lock</span>
                      <input
                          className="w-full h-[42px] pl-lg pr-lg bg-surface border border-border-warm rounded-lg font-body-md text-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                          id="password" 
                          placeholder="••••••••" 
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isPending}
                      />
                      <button
                          className="absolute right-sm top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isPending}
                      >
                          <span className="material-symbols-outlined">
                              {showPassword ? 'visibility' : 'visibility_off'}
                          </span>
                      </button>
                  </div>
              </div>
              <div className="pt-sm">
                  <button
                      className="w-full h-12 bg-primary text-on-primary font-label-md text-label-md rounded-full hover:bg-primary-container active:scale-[0.98] transition-all duration-150 organic-shadow disabled:opacity-50"
                      type="submit"
                      disabled={isPending}
                  >
                      {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </button>
              </div>
              <div className="flex items-center gap-2 my-md">
                  <div className="flex-1 h-px bg-border-warm"></div>
                  <span className="text-caption font-caption text-text-muted">Hoặc</span>
                  <div className="flex-1 h-px bg-border-warm"></div>
              </div>
              <div className="flex justify-center w-full">
                  <GoogleLogin
                      onSuccess={(credentialResponse) => {
                          if (credentialResponse.credential) {
                              setError('');
                              googleLoginMutate({ data: { idToken: credentialResponse.credential } });
                          }
                      }}
                      onError={() => {
                          setError('Đăng nhập Google thất bại. Vui lòng thử lại!');
                      }}
                      theme="outline"
                      size="large"
                      shape="circle"
                      width="352px"
                  />
              </div>
          </form>
          <div className="mt-lg text-center border-t border-border-warm pt-md">
              <p className="font-body-md text-body-md text-text-muted">
                  Chưa có tài khoản?{' '}
                  <Link className="text-primary font-semibold hover:text-primary-container transition-colors" href="/register">Đăng ký ngay</Link>
              </p>
          </div>
      </div>
    </div>
  );
}
