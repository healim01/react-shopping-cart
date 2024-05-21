import { FlexColumn, FlexRow, FlexSpaceBetween } from '@/style/common.style';
import { MinusButton, PlusButton } from '@/components/Button/QuantityButton';
import { cartListState, filteredCartItemState } from '@/store/atoms';
import { deleteCartItem, patchCartItem } from '@/api/cartItem';
import { useEffect, useState } from 'react';

import BorderButton from '@/components/Button/BorderButton';
import { CartItemType } from '@/types/cart.type';
import CheckBox from '@/components/Input/CheckBoxInput';
import styled from '@emotion/styled';
import { theme } from '@/style/theme.style';
import { useRecoilState } from 'recoil';

interface Props {
  item: CartItemType;
}

const CartItem = ({ item }: Props) => {
  const { id, product } = item;

  const [filteredItemState, setFilteredItemState] = useRecoilState(
    filteredCartItemState(item.id)
  );
  const [cartList, setCartList] = useRecoilState(cartListState);

  const [, setError] = useState<Error | null>(null);

  useEffect(() => {
    setFilteredItemState({
      id,
      quantity: filteredItemState.quantity
        ? filteredItemState.quantity
        : item.quantity,
      price: item.product.price,
      isSelected: filteredItemState.isSelected,
    });
  }, []);

  const handleSelect = () => {
    const newValue = { ...filteredItemState };
    newValue.isSelected = !newValue.isSelected;
    setFilteredItemState(newValue);
  };

  const handleDelete = () => {
    try {
      const deleteData = async () => {
        await deleteCartItem(id);

        const newList = cartList.filter((item) => item.id !== id);
        setCartList(newList);
      };

      deleteData();
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleQuantity = (quantity: number) => {
    try {
      const patchData = async () => {
        await patchCartItem(id, quantity);
        const newValue = { ...filteredItemState, quantity };
        setFilteredItemState(newValue);
      };

      if (quantity > 0) patchData();
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <StyledItemWrapper>
      <StyledFlexBetweenBox>
        <CheckBox
          isSelected={filteredItemState.isSelected}
          onClick={handleSelect}
        />
        <BorderButton onClick={handleDelete}>삭제</BorderButton>
      </StyledFlexBetweenBox>
      <StyledRowBox>
        <StyledImg src={product.imageUrl} alt={product.name} />
        <StyledColumnBox>
          <StyledItemName>{product.name}</StyledItemName>
          <StyledItemPrice>
            {product.price.toLocaleString('ko-KR')}원
          </StyledItemPrice>
          <StyledQuantityBox>
            <MinusButton
              onClick={() => handleQuantity(filteredItemState.quantity - 1)}
            />
            {filteredItemState.quantity}
            <PlusButton
              onClick={() => handleQuantity(filteredItemState.quantity + 1)}
            />
          </StyledQuantityBox>
        </StyledColumnBox>
      </StyledRowBox>
    </StyledItemWrapper>
  );
};
export default CartItem;

const StyledItemWrapper = styled.div`
  ${FlexColumn}
  justify-content: space-around;
  width: 100%;
  height: 160px;
  margin-top: 10px;
  border-top: 1px solid ${theme.color.blackWithOpacity};
  padding: 10px 0;
`;

const StyledFlexBetweenBox = styled.div`
  ${FlexSpaceBetween}
  align-items: center;
`;

const StyledRowBox = styled.div`
  ${FlexRow}
  gap: 20px;
`;

const StyledColumnBox = styled.div`
  ${FlexColumn}
  gap: 5px;
  margin-top: 10px;
`;

const StyledImg = styled.img`
  width: 112px;
  height: 112px;

  border-radius: 8px;
`;

const StyledItemName = styled.span`
  font-size: ${theme.fontSize.small};
`;

const StyledItemPrice = styled.span`
  font-size: ${theme.fontSize.large};
  font-weight: ${theme.fontWeight.bold};
`;

const StyledQuantityBox = styled.div`
  ${FlexRow}
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;
