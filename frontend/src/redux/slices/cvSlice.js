import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cvService from '../../api/cvService';

const initialState = {
  cvs: [],
  currentCV: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get all CVs
export const getCVs = createAsyncThunk(
  'cv/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await cvService.getCVs(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get CV by ID
export const getCVById = createAsyncThunk(
  'cv/getById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await cvService.getCVById(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new CV
export const createCV = createAsyncThunk(
  'cv/create',
  async (cvData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await cvService.createCV(cvData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update CV
export const updateCV = createAsyncThunk(
  'cv/update',
  async ({ id, cvData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await cvService.updateCV(id, cvData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete CV
export const deleteCV = createAsyncThunk(
  'cv/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      await cvService.deleteCV(id, token);
      return id;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentCV: (state, action) => {
      state.currentCV = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCVs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCVs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cvs = action.payload;
      })
      .addCase(getCVs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCVById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCVById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentCV = action.payload;
      })
      .addCase(getCVById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCV.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cvs.push(action.payload);
      })
      .addCase(createCV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCV.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cvs = state.cvs.map((cv) =>
          cv.id === action.payload.id ? action.payload : cv
        );
        state.currentCV = action.payload;
      })
      .addCase(updateCV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteCV.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCV.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.cvs = state.cvs.filter((cv) => cv.id !== action.payload);
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCurrentCV } = cvSlice.actions;
export default cvSlice.reducer;