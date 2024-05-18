import {
  MOCK_FILTERED_CART_LIST_FREE_SHIPPING_FEE,
  MOCK_FILTERED_CART_LIST_NEED_SHIPPING_FEE,
} from '@/constants/_mock/mockFilteredCartList';
import { RecoilRoot, useRecoilValue, useSetRecoilState } from 'recoil';
import { cartListState, filteredCartItemState } from '@/store/atoms';

import MOCK_CART_LIST from '@/constants/_mock/mockCartList';
import { recipeState } from '@/store/selectors/recipeSelector';
import { renderHook } from '@testing-library/react';

jest.mock('../../api/config', () => ({
  config: {
    apiUrl: 'http://localhost:mock',
  },
}));

describe('cartTotalPriceState', () => {
  it('선택된 상품들의 최종 가격을 계산하고, 10만원 이하 시 배송비가 포함된다.', () => {
    const { result } = renderHook(
      () => {
        const setCartList = useSetRecoilState(cartListState);
        setCartList(MOCK_CART_LIST);

        MOCK_FILTERED_CART_LIST_NEED_SHIPPING_FEE.forEach((item) => {
          const setFilteredCartList = useSetRecoilState(
            filteredCartItemState(item.id)
          );
          setFilteredCartList(item);
        });

        const { orderPrice, shippingFee, totalPrice } =
          useRecoilValue(recipeState);

        return { orderPrice, shippingFee, totalPrice };
      },
      {
        wrapper: RecoilRoot,
      }
    );

    expect(result.current.orderPrice).toBe(7000);
    expect(result.current.shippingFee).toBe(3000);
    expect(result.current.totalPrice).toBe(10000);
  });

  it('선택된 상품들의 최종 가격을 계산하고, 10만원 이상 시 배송비가 무료이다.', () => {
    const { result } = renderHook(
      () => {
        const setCartList = useSetRecoilState(cartListState);
        setCartList(MOCK_CART_LIST);

        MOCK_FILTERED_CART_LIST_FREE_SHIPPING_FEE.forEach((item) => {
          const setFilteredCartList = useSetRecoilState(
            filteredCartItemState(item.id)
          );
          setFilteredCartList(item);
        });

        const { orderPrice, shippingFee, totalPrice } =
          useRecoilValue(recipeState);

        return { orderPrice, shippingFee, totalPrice };
      },
      {
        wrapper: RecoilRoot,
      }
    );

    expect(result.current.orderPrice).toBe(169000);
    expect(result.current.shippingFee).toBe(0);
    expect(result.current.totalPrice).toBe(169000);
  });
});
