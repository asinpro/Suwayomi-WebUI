/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import FilterList from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import { ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CustomTooltip } from '@/base/components/CustomTooltip.tsx';
import { LibraryOptionsPanel } from '@/features/library/components/LibraryOptionsPanel.tsx';

export const LibraryToolbarMenu = ({
    category,
}: {
    category: ComponentProps<typeof LibraryOptionsPanel>['category'];
}) => {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const active = false;

    return (
        <>
            <CustomTooltip title={t('settings.title')}>
                <IconButton onClick={() => setOpen(!open)} color={active ? 'warning' : 'inherit'}>
                    <FilterList />
                </IconButton>
            </CustomTooltip>
            <LibraryOptionsPanel category={category} open={open} onClose={() => setOpen(false)} />
        </>
    );
};
