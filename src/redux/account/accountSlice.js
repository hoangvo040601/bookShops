import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        email: "",
        phone: "",
        fullName: "",
        role: "",
        avatar: "",
        id: "",
    }
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = action.payload
        },
        doGetAccountAction: (state, action) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = action.payload.user
        },
        doLogoutAction : (state, action)=>{
            localStorage.removeItem('access_token')
            state.isAuthenticated = false
            state.user = {
                email: "",
                phone: "",
                fullName: "",
                role: "",
                avatar: "",
                id: "",
            }
        }
    }

}
);

export const { doLoginAction, doGetAccountAction, doLogoutAction } = accountSlice.actions;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd = (amount) => (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//         dispatch(incrementByAmount(amount));
//     }
// };

export default accountSlice.reducer;
