import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachers } from "./operations";

const ITEMS_PER_PAGE = 4;

const initialState = {
  allTeachers: [],
  displayedTeachers: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  filters: {
    language: "",
    level: "",
    pricePerHour: "",
  },
};

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    loadMoreTeachers: (state) => {
      const filteredTeachers = filterTeachers(state.allTeachers, state.filters);
      const startIndex = state.displayedTeachers.length;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newTeachers = filteredTeachers.slice(startIndex, endIndex);

      state.displayedTeachers = [...state.displayedTeachers, ...newTeachers];
      state.hasMore = endIndex < filteredTeachers.length;
      state.page += 1;
    },
    resetTeachers: (state) => {
      const filteredTeachers = filterTeachers(state.allTeachers, state.filters);
      state.displayedTeachers = filteredTeachers.slice(0, ITEMS_PER_PAGE);
      state.page = 1;
      state.hasMore = filteredTeachers.length > ITEMS_PER_PAGE;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      const filteredTeachers = filterTeachers(state.allTeachers, state.filters);
      state.displayedTeachers = filteredTeachers.slice(0, ITEMS_PER_PAGE);
      state.page = 1;
      state.hasMore = filteredTeachers.length > ITEMS_PER_PAGE;
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
        const filteredTeachers = filterTeachers(payload, state.filters);
        state.displayedTeachers = filteredTeachers.slice(0, ITEMS_PER_PAGE);
        state.hasMore = filteredTeachers.length > ITEMS_PER_PAGE;
      })
      .addCase(fetchTeachers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
        state.hasMore = false;
      });
  },
});

const filterTeachers = (teachers, filters) => {
  return teachers.filter((teacher) => {
    const matchesLanguage =
      !filters.language || teacher.languages.includes(filters.language);

    const matchesLevel =
      !filters.level || teacher.levels.includes(filters.level);

    const matchesPrice =
      !filters.pricePerHour ||
      teacher.price_per_hour <= parseInt(filters.pricePerHour);

    return matchesLanguage && matchesLevel && matchesPrice;
  });
};

export const { loadMoreTeachers, resetTeachers, setFilters } =
  teachersSlice.actions;
export const teachersReducer = teachersSlice.reducer;
