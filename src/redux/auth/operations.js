import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../config/firebase";

export const register = createAsyncThunk(
  "auth/register",

  async (credentials, thunkAPI) => {
    try {
      const { email, password, name } = credentials;
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, {
        displayName: name,
      });

      const token = await user.getIdToken();

      return {
        user: {
          name: user.displayName,
          email: user.email,
          id: user.uid,
        },
        token,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",

  async (credentials, thunkAPI) => {
    try {
      const { email, password } = credentials;
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const token = await user.getIdToken();

      return {
        user: {
          name: user.displayName,
          email: user.email,
          id: user.uid,
        },
        token,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const refreshUser = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    try {
      return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();

          if (user) {
            resolve({
              name: user.displayName,
              email: user.email,
              id: user.uid,
            });
          } else {
            reject("No authenticated user");
          }
        });
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await signOut(auth);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});
