'use client'
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from 'redux-persist/integration/react'
const ReduxProvide = ({ children }) => {
    return (
        <div>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </Provider>
        </div>
    )
}
export default ReduxProvide;