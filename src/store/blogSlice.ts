import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API = 'http://192.168.1.72:5001/api/v1/admin/blogs';

// ---------------- TYPES ----------------

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    image: string;
    categories: string[];
    tags: string[];
    views: number;
    isFeatured: boolean;
    isMarketing: boolean;
    readTime: string;
    author: {
        name: string;
        image: string;
    };
}

interface BlogState {
    blogs: Blog[];
    blog: Blog | null;
    loading: boolean;
    error: string | null;
}

// ---------------- INITIAL STATE ----------------

const initialState: BlogState = {
    blogs: [],
    blog: null,
    loading: false,
    error: null,
};

// ---------------- GET ALL ----------------

export const getBlogs: any = createAsyncThunk<Blog[]>(
    'blog/getBlogs',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API}/`);

            // 🔥 FIX HERE (handle different API shapes)
            return res.data.data || res.data.blogs || res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---------------- GET BY ID ----------------

export const getBlogById: any = createAsyncThunk<Blog, string>(
    'blog/getById',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${API}/${id}`);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---------------- CREATE ----------------

export const createBlog: any = createAsyncThunk<Blog, Blog>(
    'blog/create',
    async (data, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API}/add`, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---------------- UPDATE ----------------

export const updateBlog: any = createAsyncThunk<
    Blog,
    { id: string; data: Blog }
>(
    'blog/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await axios.put(`${API}/edit/${id}`, data);
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---------------- DELETE ----------------

export const deleteBlog: any = createAsyncThunk<string, string>(
    'blog/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(
                `http://192.168.1.72:5001/api/v1/admin/blogs/delete/${id}`
            );

            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

// ---------------- SLICE ----------------

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // GET ALL
            .addCase(getBlogs.fulfilled, (state, action) => {
                state.blogs = action.payload;
            })

            // GET BY ID
            .addCase(getBlogById.fulfilled, (state, action) => {
                state.blog = action.payload;
            })

            // CREATE
            .addCase(createBlog.fulfilled, (state, action) => {
                state.blogs.unshift(action.payload);
            })

            // UPDATE
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.map((b) =>
                    b._id === action.payload._id ? action.payload : b
                );
            })

            // DELETE
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter(
                    (b) => b._id !== action.payload
                );
            });
    },
});

export default blogSlice.reducer;