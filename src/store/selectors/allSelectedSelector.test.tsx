import {
  MOCK_FILTERED_CART_LIST_ALL_SELECTED,
  MOCK_FILTERED_CART_LIST_PARTLY_SELECTED,
} from '@/constants/_mock/mockFilteredCartList';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { cartListState, filteredCartItemState } from '@/store/atoms';

import { MOCK_CART_LIST } from '@/constants/_mock/mockCartList';
import { allSelectedState } from '@/store/selectors/allSelectedSelector';
import { renderHook } from '@testing-library/react';

describe('allSelectedState Test', () => {
  it.only('모든 아이템이 `선택됨` 상태이면 전체 선택 상태가 True 가 된다.', () => {
    const { result } = renderHook(() => useRecoilValue(allSelectedState), {
      wrapper: ({ children }) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(cartListState, MOCK_CART_LIST);

            MOCK_FILTERED_CART_LIST_ALL_SELECTED.forEach((item) => {
              set(filteredCartItemState(item.id), item);
            });
          }}
        >
          {children}
        </RecoilRoot>
      ),
    });

    expect(result.current).toBe(true);
  });

  it('하나의 아이템이라도 `선택됨`이 아니라면 전체 선택 상태가 False 가 된다.', () => {
    const { result } = renderHook(() => useRecoilValue(allSelectedState), {
      wrapper: ({ children }) => (
        <RecoilRoot
          initializeState={({ set }) => {
            set(cartListState, MOCK_CART_LIST);

            MOCK_FILTERED_CART_LIST_PARTLY_SELECTED.forEach((item) => {
              set(filteredCartItemState(item.id), item);
            });
          }}
        >
          {children}
        </RecoilRoot>
      ),
    });

    expect(result.current).toBe(false);
  });

  it.only('전체선택 체크박스 클릭시 모든 아이템이 `선택됨`으로 변경된다.', () => {
    const { result: before } = renderHook(
      () => useRecoilValue(allSelectedState),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => {
              set(cartListState, MOCK_CART_LIST);

              MOCK_FILTERED_CART_LIST_PARTLY_SELECTED.forEach((item) => {
                set(filteredCartItemState(item.id), item);
              });
            }}
          >
            {children}
          </RecoilRoot>
        ),
      }
    );

    expect(before.current).toBe(false);

    const { result: after } = renderHook(
      () => useRecoilValue(allSelectedState),
      {
        wrapper: ({ children }) => (
          <RecoilRoot
            initializeState={({ set }) => {
              set(cartListState, MOCK_CART_LIST);

              MOCK_FILTERED_CART_LIST_PARTLY_SELECTED.forEach((item) => {
                set(filteredCartItemState(item.id), item);
              });

              set(allSelectedState, true);
            }}
          >
            {children}
          </RecoilRoot>
        ),
      }
    );

    expect(after.current).toBe(true);
  });
});
