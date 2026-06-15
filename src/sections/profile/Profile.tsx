import { useState, useEffect } from 'react';

import {
    Box, Card, Chip, Grid, Stack, Avatar, Button, Dialog,
    Divider, Container, TextField, Typography, IconButton, DialogTitle, DialogContent, DialogActions, InputAdornment, CircularProgress
} from '@mui/material';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { fetchAdminProfile, updateAdminProfile, deleteAdminProfile } from 'src/store/authSlice';

import { Iconify } from 'src/components/iconify';

export default function ProfileView() {
    const dispatch = useAppDispatch();
    const { profile, profileLoading } = useAppSelector((state) => state.auth);

    // Modal States
    const [openEdit, setOpenEdit] = useState(false);
    const [openPass, setOpenPass] = useState(false);

    // Form States
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [passData, setPassData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminProfile());
    }, [dispatch]);

    // FIX: Pre-fill logic. When clicking Edit, we take current profile data into state
    const handleOpenEdit = () => {
        if (profile) {
            setEditData({
                name: profile.name,
                email: profile.email
            });
            setOpenEdit(true);
        }
    };

    const handleUpdateProfile = async () => {
        if (!profile?._id) return;
        const res = await dispatch(updateAdminProfile({ id: profile._id, data: editData }));
        if (updateAdminProfile.fulfilled.match(res)) {
            setOpenEdit(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!profile?._id) return;
        if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            await dispatch(deleteAdminProfile(profile._id));
            // Redirect logic here if needed (e.g., to login page)
        }
    };

    if (profileLoading && !profile) {
        return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;
    }

    // Handle fallback if profile is null
    const data = profile || { name: 'Guest', email: '', role: 'User', _id: '', createdAt: '', updatedAt: '' };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>My Profile</Typography>

            <Card sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                <Box sx={{ height: 140, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }} />

                <Box sx={{ px: 3, pb: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-end" sx={{ mt: -5, mb: 3 }}>
                        <Avatar sx={{ width: 100, height: 100, border: '4px solid white', fontSize: 40, bgcolor: 'primary.main' }}>
                            {data.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ pb: 1 }}>
                            <Typography variant="h5" fontWeight={700}>{data.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{data.email}</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        <Chip
                            label={profile?.isSuperAdmin ? 'Super Admin' : (data.role || 'Admin')}
                            color="primary"
                            // variant="soft" 
                            sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}
                        />
                    </Stack>

                    <Divider />

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>User ID</Typography>
                            <Typography variant="body1" fontWeight={600}>{data._id || '---'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Member Since</Typography>
                            <Typography variant="body1" fontWeight={600}>
                                {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '---'}
                            </Typography>
                        </Grid>
                    </Grid>

                    <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="flex-end">
                        <Button variant="outlined" color="error" startIcon={<Iconify icon="solar:trash-bin-trash-bold" />} onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                        <Button variant="outlined" color="inherit" onClick={() => setOpenPass(true)}>
                            Change Password
                        </Button>
                        <Button variant="contained" startIcon={<Iconify icon="solar:pen-bold" />} onClick={handleOpenEdit}>
                            Edit Profile
                        </Button>
                    </Stack>
                </Box>
            </Card>

            {/* --- EDIT PROFILE DIALOG --- */}
            <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Update Information</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenEdit(false)} color="inherit">Cancel</Button>
                    <Button onClick={handleUpdateProfile} variant="contained" disabled={profileLoading}>
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- CHANGE PASSWORD DIALOG --- */}
            <Dialog open={openPass} onClose={() => setOpenPass(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 700 }}>Change Password</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth type={showPassword ? 'text' : 'password'}
                            label="Old Password"
                            value={passData.oldPassword}
                            onChange={(e) => setPassData({ ...passData, oldPassword: e.target.value })}
                        />
                        <TextField
                            fullWidth type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            value={passData.newPassword}
                            onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                        />
                        <TextField
                            fullWidth type={showPassword ? 'text' : 'password'}
                            label="Confirm New Password"
                            value={passData.confirmPassword}
                            onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                            <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenPass(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" color="error">Update Password</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}