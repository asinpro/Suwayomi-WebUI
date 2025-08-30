/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import CheckBoxOutlineBlank from '@mui/icons-material/CheckBoxOutlineBlank';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { Mangas } from '@/features/manga/services/Mangas.ts';
import { SelectableCollectionReturnType } from '@/features/collection/hooks/useSelectableCollection.ts';
import { MenuItem } from '@/base/components/menu/MenuItem.tsx';
import {
    createGetMenuItemTitle,
    createIsMenuItemDisabled,
    createShouldShowMenuItem,
} from '@/base/components/menu/Menu.utils.ts';
import { defaultPromiseErrorHandler } from '@/lib/DefaultPromiseErrorHandler.ts';
import { MangaChapterStatFieldsFragment, MangaType } from '@/lib/graphql/generated/graphql.ts';
import { MangaAction, MangaDownloadInfo, MangaIdInfo, MangaUnreadInfo } from '@/features/manga/Manga.types.ts';
import { MANGA_ACTION_TO_TRANSLATION } from '@/features/manga/Manga.constants.ts';

const ACTION_DISABLES_SELECTION_MODE: MangaAction[] = [];

type BaseProps = { onClose: (selectionModeState: boolean) => void; setHideMenu: (hide: boolean) => void };

export type SingleModeProps = {
    manga: Pick<MangaType, 'id' | 'title' | 'sourceId'> & MangaDownloadInfo & MangaUnreadInfo;
    handleSelection?: SelectableCollectionReturnType<MangaType['id']>['handleSelection'];
};

type SelectModeProps = {
    selectedMangas: MangaChapterStatFieldsFragment[];
};

type Props =
    | (BaseProps & SingleModeProps & PropertiesNever<SelectModeProps>)
    | (BaseProps & PropertiesNever<SingleModeProps> & SelectModeProps);

export const MangaActionMenuItems = ({
    manga,
    handleSelection,
    selectedMangas: passedSelectedMangas,
    onClose,
    // setHideMenu,
}: Props) => {
    const { t } = useTranslation();

    // const [isTrackDialogOpen, setIsTrackDialogOpen] = useState(false);

    const isSingleMode = !!manga;
    const selectedMangas = passedSelectedMangas ?? [];

    // const getMenuItemTitle = createGetMenuItemTitle(isSingleMode, MANGA_ACTION_TO_TRANSLATION);
    const shouldShowMenuItem = createShouldShowMenuItem(isSingleMode);
    // const isMenuItemDisabled = createIsMenuItemDisabled(isSingleMode);

    // const isFullyDownloaded = !!manga && manga.downloadCount === manga.chapters.totalCount;
    // const hasDownloadedChapters = !!manga?.downloadCount;
    // const hasUnreadChapters = !!manga?.unreadCount;
    // const hasReadChapters = !!manga && manga.unreadCount !== manga.chapters.totalCount;

    const handleSelect = () => {
        handleSelection?.(manga.id, true);
        onClose(true);
    };

    // const performAction = (action: MangaAction, mangas: MangaIdInfo[]) => {
    //     Mangas.performAction(action, manga ? [manga.id] : Mangas.getIds(mangas), {
    //         wasManuallyMarkedAsRead: true,
    //     }).catch(defaultPromiseErrorHandler(`MangaActionMenuItems:performAction(${action})`));
    // 
    //     onClose(!ACTION_DISABLES_SELECTION_MODE.includes(action));
    // };

    // const { downloadableMangas, downloadedMangas, unreadMangas, readMangas } = useMemo(
    //     () => ({
    //         downloadableMangas: [
    //             ...Mangas.getNotDownloaded(selectedMangas),
    //             ...Mangas.getPartiallyDownloaded(selectedMangas),
    //         ],
    //         downloadedMangas: [
    //             ...Mangas.getPartiallyDownloaded(selectedMangas),
    //             ...Mangas.getFullyDownloaded(selectedMangas),
    //         ],
    //         unreadMangas: [...Mangas.getUnread(selectedMangas), ...Mangas.getPartiallyRead(selectedMangas)],
    //         readMangas: [...Mangas.getPartiallyRead(selectedMangas), ...Mangas.getFullyRead(selectedMangas)],
    //     }),
    //     [selectedMangas],
    // );

    return (
        <>
            {!!handleSelection && isSingleMode && (
                <MenuItem onClick={handleSelect} Icon={CheckBoxOutlineBlank} title={t('chapter.action.label.select')} />
            )}
            {shouldShowMenuItem(false) && null}
            {shouldShowMenuItem(false) && null}
            {shouldShowMenuItem(false) && null}
            {shouldShowMenuItem(false) && null}
            {false && null}
            {false && null}
            {false && null}
            {false && null}
        </>
    );
};
