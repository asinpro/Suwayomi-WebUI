/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import SyncIcon from '@mui/icons-material/Sync';
import { useTranslation } from 'react-i18next';
import { CustomButton } from '@/base/components/buttons/CustomButton.tsx';

export const TrackMangaButton = () => {
    const { t } = useTranslation();

    return (
        <CustomButton size="medium" disabled variant="outlined">
            <SyncIcon />
            {t('manga.button.track.start')}
        </CustomButton>
    );
};
