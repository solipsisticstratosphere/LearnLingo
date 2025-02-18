export const selectDisplayedTeachers = (state) =>
  state.teachers.displayedTeachers;
export const selectIsLoading = (state) => state.teachers.isLoading;
export const selectError = (state) => state.teachers.error;
export const selectHasMore = (state) => state.teachers.hasMore;
export const selectAllTeachers = (state) => state.teachers.allTeachers;
