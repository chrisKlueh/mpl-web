import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingGroups: false,
  isCreatingGroup: false,
  isEditingGroup: false,
  isDeletingGroup: false,
  groups: [],
};

export const feedbackSlice = createSlice({
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
    createGroupRequest: (state, action) => {
      state.isCreatingGroup = true;
    },
    createGroupSuccess: (state, action) => {
      state.isCreatingGroup = false;
    },
    createGroupError: (state, action) => {
      state.isCreatingGroup = false;
    },
    deleteGroupRequest: (state, action) => {
      state.isDeletingGroup = true;
    },
    deleteGroupSuccess: (state, action) => {
      state.isDeletingGroup = false;
    },
    deleteGroupError: (state, action) => {
      state.isDeletingGroup = false;
    },
    resetGroupState: (state, action) => initialState,
  },
});
export const {
  showGroupsRequest,
  showGroupsSuccess,
  showGroupsError,
  createGroupRequest,
  createGroupSuccess,
  createGroupError,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError,
  resetGroupState,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;
