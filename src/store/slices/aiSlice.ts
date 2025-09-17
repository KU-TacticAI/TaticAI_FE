
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAiListApi, deleteAiApi, createAiApi, updateAiApi } from '../../api/Api';
import { AI } from '../../component/game/GameTypes';

interface AiState {
  aiList: AI[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AiState = {
  aiList: [],
  status: 'idle',
  error: null,
};

export const createAi = createAsyncThunk(
    'ai/createAi',
    async ({ formData }: { formData: FormData }, { rejectWithValue }) => {
      try {
        const response = await createAiApi(formData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const fetchAiList = createAsyncThunk('ai/fetchAiList', async () => {
  const response = await getAiListApi();
  return response.data;
});

export const updateAi = createAsyncThunk(
    'ai/updateAi',
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
      try {
        const response = await updateAiApi(id, formData);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response.data);
      }
    }
);

export const deleteAi = createAsyncThunk(
    'ai/deleteAi',
    async ({ id, password }: { id: string; password: string }) => {
      await deleteAiApi(id, { password });
      return id; // 성공 시 삭제된 AI id 반환
    }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAiList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAiList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.aiList = action.payload;
      })
      .addCase(fetchAiList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createAi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.aiList.push(action.payload);
      })
      .addCase(createAi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateAi.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAi.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.aiList.findIndex(ai => ai.aiId === action.payload.aiId);
        if (index !== -1) {
          state.aiList[index] = action.payload;
        }
      })
      .addCase(updateAi.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
    .addCase(deleteAi.fulfilled, (state, action) => {
      // 삭제 성공 후 aiList에서 해당 id 제거
      state.aiList = state.aiList.filter(ai => ai.aiId !== action.payload);
      state.status = 'idle'; // 목록을 새로고침하기 위해 상태를 idle로 변경
    })
    .addCase(deleteAi.rejected, (state, action) => {
      // 삭제 실패 시 에러 처리 가능
      state.error = action.error.message || null;
    });
  },
});

export default aiSlice.reducer;
