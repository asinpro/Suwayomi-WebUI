/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CssBaseline from '@mui/material/CssBaseline';
import React, { useLayoutEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev';
import { loadable } from 'react-lazily/loadable';
import Box from '@mui/material/Box';
import { AppContext } from '@/base/contexts/AppContext.tsx';
import '@/i18n';
import { DefaultNavBar } from '@/features/navigation-bar/components/DefaultNavBar.tsx';
import { lazyLoadFallback } from '@/base/utils/LazyLoad.tsx';
import { ErrorBoundary } from '@/base/components/feedback/ErrorBoundary.tsx';
import { useNavBarContext } from '@/features/navigation-bar/NavbarContext.tsx';
import { AppRoutes } from '@/base/AppRoute.constants.ts';

const { Library } = loadable(() => import('@/features/library/screens/Library.tsx'), lazyLoadFallback);
const { Manga } = loadable(() => import('@/features/manga/screens/Manga.tsx'), lazyLoadFallback);
const { Reader } = loadable(() => import('@/features/reader/screens/Reader.tsx'), lazyLoadFallback);
const { Settings } = loadable(() => import('@/features/settings/screens/Settings.tsx'), lazyLoadFallback);

if (process.env.NODE_ENV !== 'production') {
    // Adds messages only in a dev environment
    loadDevMessages();
    loadErrorMessages();
}

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const MainApp = () => {
    const { navBarWidth, appBarHeight, bottomBarHeight } = useNavBarContext();

    return (
        <Box
            id="appMainContainer"
            component="main"
            sx={{
                minHeight: `calc(100vh - ${appBarHeight + bottomBarHeight}px)`,
                width: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                minWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                maxWidth: `calc(100vw - (100vw - 100%) - ${navBarWidth}px)`,
                position: 'relative',
                mt: `${appBarHeight}px`,
                pb: `calc(${bottomBarHeight}px + ${!bottomBarHeight ? 'env(safe-area-inset-bottom)' : '0px'})`,
                pr: 'env(safe-area-inset-right)',
            }}
        >
            <ErrorBoundary>
                <Routes>
                    <Route path={AppRoutes.root.match} element={<Navigate to={AppRoutes.library.path()} replace />} />
                    <Route path={AppRoutes.matchAll.match} element={<Navigate to={AppRoutes.root.path} replace />} />
                    <Route path={AppRoutes.library.match} element={<Library />} />
                    <Route path={AppRoutes.manga.match} element={<Manga />} />
                    <Route path={AppRoutes.reader.match} element={<Reader />} />
                    <Route path={AppRoutes.settings.match} element={<Settings />} />
                </Routes>
            </ErrorBoundary>
        </Box>
    );
};

export const App: React.FC = () => (
    <AppContext>
        <ScrollToTop />
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexShrink: 0, position: 'relative', height: '100vh' }}>
                <DefaultNavBar />
            </Box>
            <Routes>
                <Route path={AppRoutes.matchAll.match} element={<MainApp />} />
            </Routes>
        </Box>
    </AppContext>
);
