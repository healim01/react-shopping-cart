import { Coupon } from '@/types/coupon.type';
import { MOCK_COUPON_LIST } from '@/constants/_mock/mockCouponList';
import { RecoilRoot } from 'recoil';
import { couponListState } from '@/store/atoms';
import { renderHook } from '@testing-library/react';
import useCouponValidator from '@/hooks/useCouponValidator';

describe('useCouponValidator test', () => {
  const date = new Date();

  it('[유효한 쿠폰] 쿠폰의 유효성을 확인한 후 유효 여부를 알려준다. (존재 여부, 만료일 체크)', () => {
    const validCoupon: Coupon = {
      id: 2,
      code: 'VALID_COUPON',
      description: '유효한 쿠폰',
      discountType: 'fixed',
      expirationDate: '2025-01-01',
    };

    const { result } = renderHook(
      () =>
        useCouponValidator({
          coupon: validCoupon,
          date,
        }),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => {
              set(couponListState, MOCK_COUPON_LIST);
            }}
          >
            {children}
          </RecoilRoot>
        ),
      }
    );

    expect(result.current).toBe(true);
  });

  it('[만료된 쿠폰] 쿠폰의 유효성을 확인한 후 유효 여부를 알려준다. (존재 여부, 만료일 체크)', () => {
    const expiredCoupon: Coupon = {
      id: 1,
      code: 'EXPIRED_COUPON',
      description: '만료된 쿠폰',
      discountType: 'fixed',
      expirationDate: '2024-01-01',
    };

    const { result } = renderHook(
      () =>
        useCouponValidator({
          coupon: expiredCoupon,
          date,
        }),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => {
              set(couponListState, MOCK_COUPON_LIST);
            }}
          >
            {children}
          </RecoilRoot>
        ),
      }
    );

    expect(result.current).toBe(false);
  });
});
