import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isGettingGroups: false,
  isCreatingGroup: false,
  isEditingGroup: false,
  isDeletingGroup: false,
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
    createGroupRequest: (state, action) => {
      state.isCreatingGroup = true;
    },
    createGroupSuccess: (state, action) => {
      state.isCreatingGroup = false;
    },
    createGroupError: (state, action) => {
      state.isCreatingGroup = false;
    },
    editGroupRequest: (state, action) => {
      state.isEditingGroup = true;
    },
    editGroupSuccess: (state, action) => {
      state.isEditingGroup = false;
    },
    editGroupError: (state, action) => {
      state.isEditingGroup = false;
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
    resetGroupsState: (state, action) => initialState,
  },
});
export const {
  showGroupsRequest,
  showGroupsSuccess,
  showGroupsError,
  createGroupRequest,
  createGroupSuccess,
  createGroupError,
  editGroupRequest,
  editGroupSuccess,
  editGroupError,
  deleteGroupRequest,
  deleteGroupSuccess,
  deleteGroupError,
  resetGroupsState,
} = groupsSlice.actions;

export default groupsSlice.reducer;
