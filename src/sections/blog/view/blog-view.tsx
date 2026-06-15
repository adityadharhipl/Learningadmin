import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Card,
  Grid,
  Chip,
  Table,
  Button,
  Dialog,
  Select,
  TableRow,
  Checkbox,
  MenuItem,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  IconButton,
  Pagination,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  OutlinedInput,
  TableContainer,
  FormControlLabel,
} from '@mui/material';

import { Icon } from '@iconify/react';

import { DashboardContent } from 'src/layouts/dashboard';
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from 'src/store/blogSlice';

// import { uploadImage } from 'src/api/uploadImage';


const CATEGORY_OPTIONS = [
  'Mobile Development',
  'Web Development',
  'Programming',
  'AI / ML',
  'DevOps',
  'UI/UX',
  'Backend',
  'Frontend',
];



export function BlogView() {
  const dispatch = useDispatch();
  const { blogs } = useSelector((state: any) => state.blog);

  const [openForm, setOpenForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    categories: [],
    author: { name: '', image: '' },
    views: 0,
    readTime: '',
    isFeatured: false,
    isMarketing: false,
  });

  const [errors, setErrors] = useState<any>({});

  // ---------------- LOAD BLOGS ----------------
  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const err: any = {};

    if (!formData.title) err.title = 'Title required';
    if (!formData.slug) err.slug = 'Slug required';
    if (!formData.description) err.description = 'Description required';
    if (!formData.content) err.content = 'Content required';

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ---------------- IMAGE UPLOAD ----------------
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // const url = await uploadImage(file);

    setFormData((prev: any) => ({
      ...prev,
      image: '',
      // image: url,
    }));
  };

  // ---------------- SAVE (CREATE / UPDATE) ----------------
  const handleSave = () => {
    if (!validate()) return;

    if (editId) {
      dispatch(updateBlog({ id: editId, data: formData }));
    } else {
      dispatch(createBlog(formData));
    }

    setOpenForm(false);
    setEditId(null);

    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      image: '',
      author: { name: '', image: '' },
      views: 0,
      readTime: '',
      isFeatured: false,
      isMarketing: false,
    });
  };

  // ---------------- EDIT ----------------
  const handleEdit = (row: any) => {
    setEditId(row._id);

    setFormData({
      title: row.title,
      slug: row.slug,
      description: row.description,
      content: row.content,
      image: row.image,
      categories: row.categories || [],
      author: row.author || { name: '', image: '' },
      views: row.views,
      readTime: row.readTime,
      isFeatured: row.isFeatured,
      isMarketing: row.isMarketing,
    });

    setOpenForm(true);
  };

  // ---------------- DELETE ----------------
  const handleDelete: any = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      dispatch(deleteBlog(deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  return (
    <DashboardContent>
      {/* HEADER */}
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Blog Management</Typography>

        <Button
          variant="contained"
          onClick={() => {
            setEditId(null);
            setFormData({
              title: '',
              slug: '',
              description: '',
              content: '',
              image: '',
              author: { name: '', image: '' },
              views: 0,
              readTime: '',
              isFeatured: false,
              isMarketing: false,
            });
            setOpenForm(true);
          }}
        >
          Add Blog
        </Button>
      </Box>

      {/* TABLE */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Views</TableCell>
                <TableCell>Categories</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {blogs?.map((row: any,index:any) => (
                <TableRow key={row._id}>
                   <TableCell>{index + 1}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.author?.name}</TableCell>
                  <TableCell>{row.views}</TableCell>
                  <TableCell>
                    {row.categories?.join(', ')}
                  </TableCell>
                  <TableCell>{row.isFeatured ? 'Yes' : 'No'}</TableCell>

                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <Icon icon="solar:pen-bold" />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(row._id)}>
                      <Icon icon="solar:trash-bin-trash-bold" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Pagination count={10} sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} />

      {/* ================= DIALOG ================= */}
      <Dialog open={openForm} onClose={(e, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') setOpenForm(false); }} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editId ? 'Edit Blog' : 'Add Blog'}
          <IconButton onClick={() => setOpenForm(false)}>
            <Icon icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* TITLE */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                error={!!errors.title}
                helperText={errors.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Grid>

            {/* SLUG */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Slug"
                value={formData.slug}
                error={!!errors.slug}
                helperText={errors.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </Grid>

            {/* DESCRIPTION */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                error={!!errors.description}
                helperText={errors.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel>Categories</InputLabel>

                <Select
                  multiple
                  value={formData.categories}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData({
                      ...formData,
                      categories:
                        typeof value === 'string'
                          ? value.split(',')
                          : value,
                    });
                  }}
                  input={<OutlinedInput label="Categories" />}
                  renderValue={(selected: any) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected?.map((value: string) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* CONTENT */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={formData.content}
                error={!!errors.content}
                helperText={errors.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </Grid>

            {/* IMAGE UPLOAD */}
            <Grid size={12}>
              <Button variant="outlined" component="label">
                Upload Image
                <input hidden type="file" onChange={handleImageUpload} />
              </Button>

              {formData.image && (
                <img
                  src={formData.image}
                  style={{ width: 120, marginTop: 10 }}
                />
              )}
            </Grid>

            {/* AUTHOR */}
            <Grid size={6}>
              <TextField
                fullWidth
                label="Author Name"
                value={formData.author.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, name: e.target.value },
                  })
                }
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Author Image"
                value={formData.author.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    author: { ...formData.author, image: e.target.value },
                  })
                }
              />
            </Grid>

            {/* EXTRA */}
            <Grid size={6}>
              <TextField
                fullWidth
                label="Views"
                type="number"
                value={formData.views}
                onChange={(e) =>
                  setFormData({ ...formData, views: Number(e.target.value) })
                }
              />
            </Grid>

            <Grid size={6}>
              <TextField
                fullWidth
                label="Read Time"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData({ ...formData, readTime: e.target.value })
                }
              />
            </Grid>

            <Grid size={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isFeatured: e.target.checked,
                      })
                    }
                  />
                }
                label="Featured"
              />
            </Grid>

            <Grid size={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isMarketing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isMarketing: e.target.checked,
                      })
                    }
                  />
                }
                label="Marketing"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSave}>
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>No</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}