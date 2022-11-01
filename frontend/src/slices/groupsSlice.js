import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingGroups: false,
  groups: [],
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    showGroupsRequest: (state, action) => {
      state.isGettingGroups = true;
    },
    showGroupsSuccess: (state, action) => {
      state.groups = action.payload;
      state.isGettingGroups = false;
    },
    showGroupsError: (state, action) => {
      state.isGettingGroups = false;
    },
    resetGroupsState: (state, action) => initialState,
  },
});
export const {
  showGroupsRequest,
  showGroupsSuccess,
  showGroupsError,
  resetGroupsState,
} = groupsSlice.actions;

export default groupsSlice.reducer;
