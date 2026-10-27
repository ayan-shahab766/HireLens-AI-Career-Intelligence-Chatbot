// src/redux/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../api/chatService';

const initialState = {
  sessions: [],
  currentSession: null,
  messages: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get chat sessions
export const getSessions = createAsyncThunk(
  'chat/getSessions',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await chatService.getSessions(token);
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

// Create chat session
export const createSession = createAsyncThunk(
  'chat/createSession',
  async (cvId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await chatService.createSession({cv: cvId}, token);
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

// Get session by ID
export const getSessionById = createAsyncThunk(
  'chat/getSessionById',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await chatService.getSessionById(id, token);
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

// Send message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ sessionId, message }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token.access;
      return await chatService.sendMessage(sessionId, message, token);
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

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
      state.messages = action.payload?.messages || [];
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.sessions.push(action.payload);
        state.currentSession = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(createSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSessionById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSessionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentSession = action.payload;
        state.messages = action.payload.messages || [];
      })
      .addCase(getSessionById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.messages.push({
          role: 'user',
          content: action.meta.arg.message,
          created_at: new Date().toISOString(),
        });
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setCurrentSession, clearCurrentSession } = chatSlice.actions;
export default chatSlice.reducer;