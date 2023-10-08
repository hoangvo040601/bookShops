import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';

const initialState = {
    cart: []
};

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {

        doAddBookAction: (state, action) => {
            let cart = state.cart;
            const item = action.payload;
            let isExistIndex = cart.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                cart[isExistIndex].quantity = cart[isExistIndex].quantity + item.quantity;
                if (cart[isExistIndex].quantity > cart[isExistIndex].detail.quantity) {
                    cart[isExistIndex].quantity = cart[isExistIndex].detail.quantity;
                }
            } else {
                cart.push({ quantity: item.quantity, _id: item._id, detail: item.detail });
            }
            state.cart = cart;
            message.success("Thêm vào giỏ hàng thành công!")

        },
        doUpdateQuantityBookAction: (state, action) => {
            let cart = state.cart;
            const item = action.payload;
            let isExistIndex = cart.findIndex(c => c._id === item._id)
            if (isExistIndex > -1) {
                cart[isExistIndex].quantity = item.quantity;
                if (cart[isExistIndex].quantity > cart[isExistIndex].detail.quantity) {
                    cart[isExistIndex].quantity = cart[isExistIndex].detail.quantity;
                }
            } else {
                cart.push({ quantity: item.quantity, _id: item._id, detail: item.detail });
            }
            state.cart = cart;
        },
        doDeleteBookCart: (state, action)=>{
            state.cart = state.cart.filter(c => c._id !== action.payload._id)
        },
        doPlaceOrderAction: (state,action)=>{
            state.cart = [];
        }

    }

}
);

export const { doAddBookAction, doUpdateQuantityBookAction, doDeleteBookCart, doPlaceOrderAction } = orderSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//         dispatch(incrementByAmount(amount));
//     }
// };

export default orderSlice.reducer;
