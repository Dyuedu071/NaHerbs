"use client";

import Link from 'next/link';
import { useGetAuthMe } from '@/services/generated/customer-profile/customer-profile';

export default function AuthFooterLink() {
    const { data } = useGetAuthMe({
        query: {
            retry: false,
            refetchOnWindowFocus: false,
        }
    });

    const user = data as unknown as { id: string } | undefined;

    if (user) {
        return null;
    }

    return (
        <Link 
            className="font-body-md text-body-md text-on-primary/80 hover:text-tertiary-fixed transition-colors w-fit"
            href="/dang-nhap"
        >
            Đăng nhập / Đăng ký
        </Link>
    );
}
