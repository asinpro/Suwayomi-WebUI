/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import CollectionsOutlinedBookmarkIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { NavbarItem, NavBarItemMoreGroup } from '@/features/navigation-bar/NavigationBar.types.ts';
import { AppRoutes } from '@/base/AppRoute.constants.ts';

// Removed unused imports
type RestrictedNavBarItem<Show extends NavbarItem['show']> = Omit<NavbarItem, 'show'> & { show: Show };

const NAVIGATION_BAR_BASE_ITEMS = [
    {
        path: AppRoutes.library.path() as RestrictedNavBarItem<'both'>['path'],
        title: 'library.title',
        SelectedIconComponent: CollectionsBookmarkIcon,
        IconComponent: CollectionsOutlinedBookmarkIcon,
        show: 'both',
        moreGroup: NavBarItemMoreGroup.GENERAL,
    },
] as const satisfies RestrictedNavBarItem<'both'>[];

const NAVIGATION_BAR_DESKTOP_ITEMS = [
    {
        path: AppRoutes.settings.path,
        title: 'settings.title',
        SelectedIconComponent: SettingsIcon,
        IconComponent: SettingsIcon,
        show: 'desktop',
        moreGroup: NavBarItemMoreGroup.SETTING_INFO,
    },
    // ...existing code...
] as const satisfies RestrictedNavBarItem<'desktop'>[];

export const NAVIGATION_BAR_MOBILE_ITEMS = [] as const satisfies RestrictedNavBarItem<'mobile'>[];

export const NAVIGATION_BAR_ITEMS = [
    ...NAVIGATION_BAR_BASE_ITEMS,
    ...NAVIGATION_BAR_DESKTOP_ITEMS,
    ...NAVIGATION_BAR_MOBILE_ITEMS,
] as const satisfies NavbarItem[];
