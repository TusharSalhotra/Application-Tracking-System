import rootReducer from "../rootReducer";
import { persistStore } from "redux-persist";
import store from "../store";

// Types
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
