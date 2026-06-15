import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box, Card, Table, Button, Dialog, TableRow, TableBody, TableCell, TableHead,
  TextField, Typography, IconButton, DialogTitle, DialogContent, DialogActions,
  TableContainer, Divider, Grid, Paper, Tabs, Tab
} from '@mui/material';

import { Icon } from '@iconify/react';

import {
  getLandings,
  createLanding,
  updateLanding,
  deleteLanding,
} from 'src/store/landingSlice';

const initialFormState = {
  hero: { title: '', subtitle: '', description: '', image: '', buttonText: '' },
  statistics: { Students: 0, Total_success: 0, Main_question: 0, Chief_experts: 0, Year_of_exp: 0 },
  CloudSoftware: [],
  WhatIsTOTC: {
    title: '', description: '',
    ForInstructors: { title: '', image: '', buttonText: '' },
    ForStudents: { title: '', image: '', buttonText: '' }
  },
  EverythingYouCanDoWithTOTC: { title: '', highlightedText: '', description: '', image: '', buttonText: '', videoUrl: '' },
  OurFeatures: { title: '', description: '', features: [] },
  IntegrationSection: { title: '', description: '', image: '' },
  Testimonials: [],
  LatestNewsAndResources: {
    title: '', description: '',
    featuredNews: { title: '', description: '', image: '', tag: '', readMoreLink: '' },
    news: []
  }
};

const DataViewer = ({ data, indent = 0 }: { data: any; indent?: number }) => {
  if (!data) return null;

  return (
    <Box sx={{ ml: indent * 2 }}>
      {Object.entries(data).map(([key, value]) => {
        if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return null;

        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();

        if (Array.isArray(value)) {
          return (
            <Box key={key} sx={{ mb: 2, mt: 1 }}>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold' }}>
                {formattedKey}
              </Typography>
              {value.length === 0 ? (
                <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>None</Typography>
              ) : (
                value.map((item, idx) => (
                  <Box key={idx} sx={{ ml: 2, mb: 1, p: 1.5, borderLeft: '3px solid', borderColor: 'primary.main', bgcolor: '#f9fafb', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 0.5, display: 'block' }}>
                      ITEM {idx + 1}
                    </Typography>
                    {typeof item === 'object' ? <DataViewer data={item} /> : <Typography variant="body2">{String(item)}</Typography>}
                  </Box>
                ))
              )}
            </Box>
          );
        }

        if (typeof value === 'object' && value !== null) {
          return (
            <Box key={key} sx={{ mb: 2, mt: 1 }}>
              <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', borderBottom: '1px solid #eee', pb: 0.5, mb: 1 }}>
                {formattedKey}
              </Typography>
              <Box sx={{ ml: 2 }}>
                <DataViewer data={value} />
              </Box>
            </Box>
          );
        }

        return (
          <Box key={key} sx={{ display: 'flex', mb: 0.5, alignItems: 'flex-start' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mr: 1, minWidth: '160px' }}>
              {formattedKey}:
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', wordBreak: 'break-word' }}>
              {String(value)}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export function ProductsView() {
  const dispatch = useDispatch<any>();
  const { landings } = useSelector((state: any) => state.landing);

  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleView = (row: any) => {
    setViewData(row);
    setViewOpen(true);
  };

  const [form, setForm] = useState<any>(initialFormState);

  useEffect(() => {
    dispatch(getLandings());
  }, [dispatch]);

  const handleSave = () => {
    if (editId) {
      dispatch(updateLanding({ id: editId, data: form }));
    } else {
      dispatch(createLanding(form));
    }
    setOpen(false);
    setEditId(null);
  };

  const handleEdit = (row: any) => {
    setEditId(row._id);
    const newForm = { ...initialFormState, ...row };
    if (row.hero) newForm.hero = { ...initialFormState.hero, ...row.hero };
    if (row.statistics) newForm.statistics = { ...initialFormState.statistics, ...row.statistics };
    if (row.WhatIsTOTC) {
      newForm.WhatIsTOTC = { ...initialFormState.WhatIsTOTC, ...row.WhatIsTOTC };
      if (row.WhatIsTOTC.ForInstructors) newForm.WhatIsTOTC.ForInstructors = { ...initialFormState.WhatIsTOTC.ForInstructors, ...row.WhatIsTOTC.ForInstructors };
      if (row.WhatIsTOTC.ForStudents) newForm.WhatIsTOTC.ForStudents = { ...initialFormState.WhatIsTOTC.ForStudents, ...row.WhatIsTOTC.ForStudents };
    }
    if (row.EverythingYouCanDoWithTOTC) newForm.EverythingYouCanDoWithTOTC = { ...initialFormState.EverythingYouCanDoWithTOTC, ...row.EverythingYouCanDoWithTOTC };
    if (row.OurFeatures) newForm.OurFeatures = { ...initialFormState.OurFeatures, ...row.OurFeatures };
    if (row.IntegrationSection) newForm.IntegrationSection = { ...initialFormState.IntegrationSection, ...row.IntegrationSection };
    if (row.LatestNewsAndResources) {
      newForm.LatestNewsAndResources = { ...initialFormState.LatestNewsAndResources, ...row.LatestNewsAndResources };
      if (row.LatestNewsAndResources.featuredNews) newForm.LatestNewsAndResources.featuredNews = { ...initialFormState.LatestNewsAndResources.featuredNews, ...row.LatestNewsAndResources.featuredNews };
    }
    setForm(newForm);
    setOpen(true);
    setTabValue(0);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      dispatch(deleteLanding(deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const updateField = (path: string[], value: any) => {
    setForm((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...(current[path[i]] || {}) };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newData;
    });
  };

  const renderInput = (label: string, path: string[], type: string = 'text') => {
    let val = form;
    for (const p of path) val = val?.[p];
    return (
      <TextField
        fullWidth
        label={label}
        type={type}
        value={val !== undefined ? val : ''}
        onChange={(e) => updateField(path, type === 'number' ? Number(e.target.value) : e.target.value)}
        sx={{ mb: 2 }}
      />
    );
  };

  const handleAddArrayItem = (path: string[], defaultItem: any) => {
    setForm((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...(current[path[i]] || {}) };
        current = current[path[i]];
      }
      const arr = Array.isArray(current[path[path.length - 1]]) ? [...current[path[path.length - 1]]] : [];
      arr.push(defaultItem);
      current[path[path.length - 1]] = arr;
      return newData;
    });
  };

  const handleRemoveArrayItem = (path: string[], index: number) => {
    setForm((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...(current[path[i]] || {}) };
        current = current[path[i]];
      }
      const arr = Array.isArray(current[path[path.length - 1]]) ? [...current[path[path.length - 1]]] : [];
      arr.splice(index, 1);
      current[path[path.length - 1]] = arr;
      return newData;
    });
  };

  const updateArrayField = (path: string[], index: number, field: string, value: any) => {
    setForm((prev: any) => {
      const newData = { ...prev };
      let current = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...(current[path[i]] || {}) };
        current = current[path[i]];
      }
      const arr = Array.isArray(current[path[path.length - 1]]) ? [...current[path[path.length - 1]]] : [];
      if (arr[index]) {
        arr[index] = { ...arr[index], [field]: value };
      }
      current[path[path.length - 1]] = arr;
      return newData;
    });
  };

  const renderArrayInput = (label: string, path: string[], index: number, field: string, type: string = 'text') => {
    let arr = form;
    for (const p of path) arr = arr?.[p];
    const val = arr?.[index]?.[field];
    return (
      <TextField
        fullWidth
        label={label}
        type={type}
        value={val !== undefined ? val : ''}
        onChange={(e) => updateArrayField(path, index, field, type === 'number' ? Number(e.target.value) : e.target.value)}
        sx={{ mb: 2 }}
      />
    );
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>Landing Page CMS</Typography>

      <Button variant="contained" onClick={() => { setForm(initialFormState); setEditId(null); setOpen(true); setTabValue(0); }}>
        Add New Landing Content
      </Button>

      {/* TABLE */}
      <Card sx={{ mt: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Sr No.</TableCell>
                <TableCell>Title (Hero)</TableCell>
                <TableCell>Students Stat</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {(Array.isArray(landings) ? landings : (landings?.data || landings?.landings || landings?.result || [])).map((row: any, i: number) => (
                <TableRow key={row._id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{row.hero?.title || 'No Title'}</TableCell>
                  <TableCell>{row.statistics?.Students || 0}</TableCell>
                  <TableCell>
                    <IconButton color="info" onClick={() => handleView(row)}>
                      <Icon icon="solar:eye-bold" />
                    </IconButton>
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

      {/* FORM DIALOG */}
      <Dialog open={open} fullWidth maxWidth="lg" onClose={(e, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') setOpen(false); }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editId ? 'Edit Landing Content' : 'Add Landing Content'}
          <IconButton onClick={() => setOpen(false)}>
            <Icon icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ minHeight: '60vh' }}>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Hero & Stats" />
              <Tab label="Cloud Software" />
              <Tab label="What Is TOTC" />
              <Tab label="Everything You Can Do" />
              <Tab label="Features" />
              <Tab label="Integrations & Testimonials" />
              <Tab label="News" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Hero Section</Typography>
                {renderInput('Hero Title', ['hero', 'title'])}
                {renderInput('Hero Subtitle', ['hero', 'subtitle'])}
                {renderInput('Hero Description', ['hero', 'description'])}
                {renderInput('Hero Image URL', ['hero', 'image'])}
                {renderInput('Hero Button Text', ['hero', 'buttonText'])}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Statistics</Typography>
                {renderInput('Students', ['statistics', 'Students'], 'number')}
                {renderInput('Total Success', ['statistics', 'Total_success'], 'number')}
                {renderInput('Main Question', ['statistics', 'Main_question'], 'number')}
                {renderInput('Chief Experts', ['statistics', 'Chief_experts'], 'number')}
                {renderInput('Year of Experience', ['statistics', 'Year_of_exp'], 'number')}
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Cloud Software</Typography>
                <Button variant="outlined" onClick={() => handleAddArrayItem(['CloudSoftware'], { title: '', description: '', icon: '' })}>
                  Add Item
                </Button>
              </Box>
              {(form.CloudSoftware || []).map((item: any, idx: number) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button color="error" size="small" onClick={() => handleRemoveArrayItem(['CloudSoftware'], idx)}>Remove</Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Title', ['CloudSoftware'], idx, 'title')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Description', ['CloudSoftware'], idx, 'description')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Icon URL', ['CloudSoftware'], idx, 'icon')}</Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>What Is TOTC</Typography>
                {renderInput('Title', ['WhatIsTOTC', 'title'])}
                {renderInput('Description', ['WhatIsTOTC', 'description'])}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>For Instructors</Typography>
                {renderInput('Title', ['WhatIsTOTC', 'ForInstructors', 'title'])}
                {renderInput('Image URL', ['WhatIsTOTC', 'ForInstructors', 'image'])}
                {renderInput('Button Text', ['WhatIsTOTC', 'ForInstructors', 'buttonText'])}
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>For Students</Typography>
                {renderInput('Title', ['WhatIsTOTC', 'ForStudents', 'title'])}
                {renderInput('Image URL', ['WhatIsTOTC', 'ForStudents', 'image'])}
                {renderInput('Button Text', ['WhatIsTOTC', 'ForStudents', 'buttonText'])}
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Everything You Can Do With TOTC</Typography>
              {renderInput('Title', ['EverythingYouCanDoWithTOTC', 'title'])}
              {renderInput('Highlighted Text', ['EverythingYouCanDoWithTOTC', 'highlightedText'])}
              {renderInput('Description', ['EverythingYouCanDoWithTOTC', 'description'])}
              {renderInput('Image URL', ['EverythingYouCanDoWithTOTC', 'image'])}
              {renderInput('Button Text', ['EverythingYouCanDoWithTOTC', 'buttonText'])}
              {renderInput('Video URL', ['EverythingYouCanDoWithTOTC', 'videoUrl'])}
            </Box>
          )}

          {tabValue === 4 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Our Features</Typography>
              {renderInput('Section Title', ['OurFeatures', 'title'])}
              {renderInput('Section Description', ['OurFeatures', 'description'])}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Feature Items</Typography>
                <Button variant="outlined" onClick={() => handleAddArrayItem(['OurFeatures', 'features'], { title: '', description: '', image: '' })}>
                  Add Feature
                </Button>
              </Box>

              {(form.OurFeatures?.features || []).map((item: any, idx: number) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button color="error" size="small" onClick={() => handleRemoveArrayItem(['OurFeatures', 'features'], idx)}>Remove</Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Title', ['OurFeatures', 'features'], idx, 'title')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Description', ['OurFeatures', 'features'], idx, 'description')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Image URL', ['OurFeatures', 'features'], idx, 'image')}</Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

          {tabValue === 5 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Integrations Section</Typography>
              {renderInput('Title', ['IntegrationSection', 'title'])}
              {renderInput('Description', ['IntegrationSection', 'description'])}
              {renderInput('Image URL', ['IntegrationSection', 'image'])}

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Testimonials</Typography>
                <Button variant="outlined" onClick={() => handleAddArrayItem(['Testimonials'], { name: '', designation: '', image: '', review: '', rating: 5 })}>
                  Add Testimonial
                </Button>
              </Box>

              {(form.Testimonials || []).map((item: any, idx: number) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button color="error" size="small" onClick={() => handleRemoveArrayItem(['Testimonials'], idx)}>Remove</Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 3 }}>{renderArrayInput('Name', ['Testimonials'], idx, 'name')}</Grid>
                    <Grid size={{ xs: 12, md: 3 }}>{renderArrayInput('Designation', ['Testimonials'], idx, 'designation')}</Grid>
                    <Grid size={{ xs: 12, md: 3 }}>{renderArrayInput('Image URL', ['Testimonials'], idx, 'image')}</Grid>
                    <Grid size={{ xs: 12, md: 3 }}>{renderArrayInput('Rating (1-5)', ['Testimonials'], idx, 'rating', 'number')}</Grid>
                    <Grid size={{ xs: 12 }}>{renderArrayInput('Review', ['Testimonials'], idx, 'review')}</Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

          {tabValue === 6 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Latest News And Resources</Typography>
              {renderInput('Section Title', ['LatestNewsAndResources', 'title'])}
              {renderInput('Section Description', ['LatestNewsAndResources', 'description'])}

              <Divider sx={{ my: 3 }} />

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>Featured News</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>{renderInput('Title', ['LatestNewsAndResources', 'featuredNews', 'title'])}</Grid>
                <Grid size={{ xs: 12, md: 6 }}>{renderInput('Description', ['LatestNewsAndResources', 'featuredNews', 'description'])}</Grid>
                <Grid size={{ xs: 12, md: 4 }}>{renderInput('Image URL', ['LatestNewsAndResources', 'featuredNews', 'image'])}</Grid>
                <Grid size={{ xs: 12, md: 4 }}>{renderInput('Tag', ['LatestNewsAndResources', 'featuredNews', 'tag'])}</Grid>
                <Grid size={{ xs: 12, md: 4 }}>{renderInput('Read More Link', ['LatestNewsAndResources', 'featuredNews', 'readMoreLink'])}</Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>News List</Typography>
                <Button variant="outlined" onClick={() => handleAddArrayItem(['LatestNewsAndResources', 'news'], { title: '', description: '', image: '', tag: '', date: '' })}>
                  Add News
                </Button>
              </Box>

              {(form.LatestNewsAndResources?.news || []).map((item: any, idx: number) => (
                <Paper key={idx} sx={{ p: 2, mb: 2, border: '1px solid #ddd' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
                    <Button color="error" size="small" onClick={() => handleRemoveArrayItem(['LatestNewsAndResources', 'news'], idx)}>Remove</Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>{renderArrayInput('Title', ['LatestNewsAndResources', 'news'], idx, 'title')}</Grid>
                    <Grid size={{ xs: 12, md: 6 }}>{renderArrayInput('Description', ['LatestNewsAndResources', 'news'], idx, 'description')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Image URL', ['LatestNewsAndResources', 'news'], idx, 'image')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Tag', ['LatestNewsAndResources', 'news'], idx, 'tag')}</Grid>
                    <Grid size={{ xs: 12, md: 4 }}>{renderArrayInput('Date', ['LatestNewsAndResources', 'news'], idx, 'date')}</Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save Landing Content
          </Button>
        </DialogActions>
      </Dialog>

      {/* VIEW DIALOG */}
      <Dialog open={viewOpen} fullWidth maxWidth="md" onClose={(e, reason) => { if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') setViewOpen(false); }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          View Landing Content
          <IconButton onClick={() => setViewOpen(false)}>
            <Icon icon="mingcute:close-line" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DataViewer data={viewData} />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setViewOpen(false)}>Close</Button>
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
    </Box>
  );
}