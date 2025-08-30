/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ChapterAction, ChapterListOptions, ChapterSortMode } from '@/features/chapter/Chapter.types.ts';
import { TranslationKey } from '@/base/Base.types.ts';

export const FALLBACK_CHAPTER = { id: -1, name: '', realUrl: '', isBookmarked: false };

export const DEFAULT_CHAPTER_OPTIONS: ChapterListOptions = {
    unread: undefined,
    downloaded: undefined,
    bookmarked: undefined,
    reverse: true,
    sortBy: 'source',
    showChapterNumber: false,
    excludedScanlators: [],
};

export const CHAPTER_SORT_OPTIONS_TO_TRANSLATION_KEY: Record<ChapterSortMode, TranslationKey> = {
    source: 'global.sort.label.by_source',
    chapterNumber: 'global.sort.label.by_chapter_number',
    uploadedAt: 'global.sort.label.by_upload_date',
    fetchedAt: 'global.sort.label.by_fetch_date',
};

export const CHAPTER_ACTION_TO_CONFIRMATION_REQUIRED: Record<
    ChapterAction,
    { always: boolean; bulkAction: boolean; bulkActionCountForce?: number }
> = {};

export const CHAPTER_ACTION_TO_TRANSLATION: {
    [key in ChapterAction]: {
        action: {
            single: TranslationKey;
            selected: TranslationKey;
        };
        confirmation?: TranslationKey;
        success: TranslationKey;
        error: TranslationKey;
    };
} = {};
