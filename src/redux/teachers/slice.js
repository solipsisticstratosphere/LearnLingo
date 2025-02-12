import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachers } from "./operations";

const ITEMS_PER_PAGE = 4;

const initialState = {
  allTeachers: [], // Все учителя
  displayedTeachers: [], // Отображаемые учителя
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
};

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    loadMoreTeachers: (state) => {
      const startIndex = state.displayedTeachers.length;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTeachers = state.allTeachers.slice(startIndex, endIndex);

      state.displayedTeachers = [...state.displayedTeachers, ...newTeachers];
      state.hasMore = endIndex < state.allTeachers.length;
      state.page += 1;
    },
    resetTeachers: (state) => {
      state.displayedTeachers = [];
      state.page = 1;
      state.hasMore = state.allTeachers.length > 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.allTeachers = payload;
        // Загружаем первые ITEMS_PER_PAGE учителей
        state.displayedTeachers = payload.slice(0, ITEMS_PER_PAGE);
        state.hasMore = payload.length > ITEMS_PER_PAGE;
      })
      .addCase(fetchTeachers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.hasMore = false;
      });
  },
});

export const { loadMoreTeachers, resetTeachers } = teachersSlice.actions;
export const teachersReducer = teachersSlice.reducer;
