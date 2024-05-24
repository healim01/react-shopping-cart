import { RecoilRoot, useSetRecoilState } from 'recoil';

import { Coupon } from '@/types/coupon.type';
import { MOCK_COUPON_LIST } from '@/constants/_mock/mockCouponList';
import { couponListState } from '@/store/atoms';
import { renderHook } from '@testing-library/react';
import useCouponValidator from '@/hooks/useCouponValidator';

describe('useCouponValidator test', () => {
  it('[유효한 쿠폰] 쿠폰의 유효성을 확인한 후 가능 여부를 알려준다. (존재 여부, 만료일 체크)', () => {
    const { result } = renderHook(
      () => {
        const setCouponList = useSetRecoilState(couponListState);
        setCouponList(MOCK_COUPON_LIST);

        const validCoupon: Coupon = {
          id: 2,
          code: 'VALID_COUPON',
          description: '유효한 쿠폰',
          discountType: 'fixed',
          expirationDate: '2025-01-01',
        };
        const today = new Date();

        const validateCoupon = useCouponValidator({
          coupon: validCoupon,
          date: today,
        });

        return validateCoupon;
      },
      {
        wrapper: RecoilRoot,
      }
    );

    expect(result.current).toBe(true);
  });

  it('[만료된 쿠폰] 쿠폰의 유효성을 확인한 후 가능 여부를 알려준다. (존재 여부, 만료일 체크)', () => {
    const { result } = renderHook(
      () => {
        const setCouponList = useSetRecoilState(couponListState);
        setCouponList(MOCK_COUPON_LIST);

        const expiredCoupon: Coupon = {
          id: 1,
          code: 'EXPIRED_COUPON',
          description: '만료된 쿠폰',
          discountType: 'fixed',
          expirationDate: '2024-05-01',
        };

        const today = new Date();

        const invalidateCoupon = useCouponValidator({
          coupon: expiredCoupon,
          date: today,
        });

        return invalidateCoupon;
      },
      {
        wrapper: RecoilRoot,
      }
    );

    expect(result.current).toBe(false);
  });
});
