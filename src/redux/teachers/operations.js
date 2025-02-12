import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTeachers = createAsyncThunk(
  "teachers/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(
        "https://learnlingo-96439-default-rtdb.europe-west1.firebasedatabase.app/teachers.json",
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );

      const data = response.data;

      if (!data) {
        return [];
      }

      // Преобразуем объект в массив с ID
      const allTeachers = Object.entries(data).map(
        ([firebaseId, teacherData]) => ({
          firebaseId,
          ...teacherData,
        })
      );

      return allTeachers;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
