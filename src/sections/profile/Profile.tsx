import { useEffect } from 'react';

import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Stack,
    Typography,
} from '@mui/material';

import { fetchAdminProfile } from 'src/store/authSlice';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
const STATIC_PROFILE = {
    _id: '6a28eb79a1e048bd5d2673ea',
    username: 'john',
    email: 'john@gmail.com',
    role: 'student',
    createdAt: '2026-06-10T04:43:37.357Z',
    updatedAt: '2026-06-11T06:04:01.149Z',
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5 }}>
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                }}
            >
                {/* <Iconify
                    // icon={icon}
                    width={20} sx={{ color: 'primary.main' }} icon={'solar:pen-bold'} /> */}
            </Box>
            <Box>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
}

// ----------------------------------------------------------------------

export default function Profile() {
    const dispatch = useAppDispatch();
    const { profile, profileLoading, profileError } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchAdminProfile());
    }, [dispatch]);

    // Use live API data if available, otherwise fall back to static data
    const data = profile ?? STATIC_PROFILE;
    const displayName = data.username ?? 'Admin';
    const isStaticFallback = !profile;

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            {/* Header */}
            <Typography variant="h4" fontWeight={700} sx={{ mb: 4 }}>
                My Profile
            </Typography>

            <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                {/* Banner */}
                <Box
                    sx={{
                        height: 120,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                />

                {/* Avatar + Name row */}
                <Box sx={{ px: 4, pb: 3 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'center', sm: 'flex-end' }}
                        spacing={2}
                        sx={{ mt: -6, mb: 3 }}
                    >
                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                fontSize: 38,
                                fontWeight: 700,
                                border: '4px solid white',
                                bgcolor: 'primary.main',
                                boxShadow: 3,
                            }}
                        >
                            {displayName.charAt(0).toUpperCase()}
                        </Avatar>

                        <Box sx={{ flex: 1, pb: 0.5 }}>
                            <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
                                <Typography variant="h5" fontWeight={700}>
                                    {displayName}
                                </Typography>
                                <Chip
                                    label={data.role}
                                    size="small"
                                    color="primary"
                                    // variant="soft"
                                    sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                                />
                                {isStaticFallback && (
                                    <Chip label="Demo data" size="small" color="warning"
                                    // variant="soft" 
                                    />
                                )}
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {data.email}
                            </Typography>
                        </Box>

                        {/* API status indicator */}
                        <Box>
                            {profileLoading && <CircularProgress size={20} />}
                            {profileError && (
                                <Chip
                                    label="API offline – showing static data"
                                    size="small"
                                    color="error"
                                // variant="soft"
                                />
                            )}
                        </Box>
                    </Stack>

                    <Divider sx={{ mb: 3 }} />

                    {/* Info Grid */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InfoRow
                                icon="solar:user-bold"
                                label="Username"
                                value={data.username}
                            />

                            <InfoRow
                                icon="solar:letter-bold"
                                label="Email"
                                value={data.email}
                            />

                            <InfoRow
                                icon="solar:shield-user-bold"
                                label="Role"
                                value={data.role}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InfoRow
                                icon="solar:calendar-bold"
                                label="Member Since"
                                value={formatDate(data.createdAt)}
                            />

                            <InfoRow
                                icon="solar:clock-circle-bold"
                                label="Last Updated"
                                value={formatDate(data.updatedAt)}
                            />

                            <InfoRow
                                icon="solar:key-bold"
                                label="User ID"
                                value={data._id}
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* Action buttons */}
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                            variant="outlined"
                        //    startIcon={<Iconify icon="solar:key-bold" />}
                        >
                            Change Password
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Iconify icon="solar:pen-bold" />}
                        >
                            Edit Profile
                        </Button>
                    </Stack>
                </Box>
            </Card>
        </Container>
    );
}