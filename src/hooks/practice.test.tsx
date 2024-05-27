import { RecoilRoot, useRecoilValue } from 'recoil';
import { cartListState, filteredCartItemState } from '@/store/atoms';
import { renderHook, waitFor } from '@testing-library/react';

import { MOCK_CART_LIST } from '@/constants/_mock/mockCartList';
import { MOCK_FILTERED_CART_LIST_LESS_100000 } from '@/constants/_mock/mockFilteredCartList';
import { orderRecipeState } from '@/store/selectors/orderRecipeSelector';

describe('orderRecipeState selector', () => {
  it('장바구니 목록의 금액 합계를 올바르게 계산한다.', async () => {
    const EXPECTED_CART_AMOUNT = {
      orderPrice: 7000,
      shippingFee: 3000,
      totalPrice: 10000,
    };

    const { result } = renderHook(() => useRecoilValue(orderRecipeState), {
      wrapper: ({ children }) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(cartListState, MOCK_CART_LIST);

            MOCK_FILTERED_CART_LIST_LESS_100000.forEach((item) => {
              set(filteredCartItemState(item.id), item);
            });
          }}
        >
          {children}
        </RecoilRoot>
      ),
    });

    await waitFor(() => {
      expect(result.current).toEqual(EXPECTED_CART_AMOUNT);
    });
  });
});
