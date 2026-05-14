import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable action types
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        // Ignore specific non-serializable state paths
        ignoredPaths: ["register"], // Add any paths causing issues
      },
    }),
  // devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;

export default store;
