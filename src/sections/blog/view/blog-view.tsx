import { useState, useCallback } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Table,
  Avatar,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Pagination,
  TableContainer,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { PostSort } from '../post-sort';
import { PostSearch } from '../post-search';

export type IPostItem = {
  id: string;
  title: string;
  coverUrl: string;
  createdAt: string;
  publish?: boolean;
  category?: string;
  author?: {
    name: string;
    avatarUrl?: string;
  };
};

type Props = {
  posts: IPostItem[];
};

export function BlogView({ posts }: Props) {
 const [sortBy, setSortBy] = useState('latest');

const [openForm, setOpenForm] = useState(false);
const [openView, setOpenView] = useState(false);

const [selectedRow, setSelectedRow] = useState<any>(null);

const [formData, setFormData] = useState<any>({
  hero: {
    title: '',
  },
});

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleView = (row: any) => {
  console.log('View:', row);

  // view popup open
  setSelectedRow(row);
  setOpenView(true);
};

const handleEdit = (row: any) => {
  console.log('Edit:', row);

  // edit popup open
  setFormData(row);
  setOpenForm(true);
};

const handleDelete = (id: string) => {
  if (window.confirm('Delete this item?')) {
    console.log('Delete:', id);

    // dispatch(deleteBlog(id))
  }
};

  return (
    <DashboardContent>
      {/* Header */}
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Blog Management
        </Typography>
<Button
  variant="contained"
  startIcon={<Iconify icon="mingcute:add-line" />}
  onClick={() => {
    setFormData(null);
    setOpenForm(true);
  }}
>
  Add Blog
</Button>
      </Box>

      {/* Search & Sort */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* <PostSearch posts={posts} /> */}

        <PostSort
          sortBy={sortBy}
          onSort={handleSort}
          options={[
            { value: 'latest', label: 'Latest' },
            { value: 'popular', label: 'Popular' },
            { value: 'oldest', label: 'Oldest' },
          ]}
        />
      </Box>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hero Title</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Features</TableCell>
                <TableCell>Testimonials</TableCell>
                <TableCell>News</TableCell>
                <TableCell>Created Date</TableCell>

                {/* Actions Column */}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
  {posts.map((row:any) => (
    <TableRow key={row._id}>
      <TableCell>{row.hero?.title}</TableCell>
      <TableCell>{row.statistics?.Students}</TableCell>
      <TableCell>{row.OurFeatures?.features?.length}</TableCell>
      <TableCell>{row.Testimonials?.length}</TableCell>
      <TableCell>{row.LatestNewsAndResources?.news?.length}</TableCell>

      <TableCell>
        {new Date(row.createdAt).toLocaleDateString()}
      </TableCell>

      {/* Actions */}
      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">

          {/* View */}
          <IconButton
            color="info"
            onClick={() => handleView(row)}
          >
            <Iconify icon="solar:eye-bold" />
          </IconButton>

          {/* Edit */}
          <IconButton
            color="warning"
            onClick={() => handleEdit(row)}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>

          {/* Delete */}
          <IconButton
            color="error"
            onClick={() => handleDelete(row._id)}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>

        </Stack>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Pagination */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Pagination count={10} color="primary" />
      </Box>
    </DashboardContent>
  );
}