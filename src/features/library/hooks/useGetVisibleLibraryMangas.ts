/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { StringParam, useQueryParam } from 'use-query-params';
import { useMemo } from 'react';
import { useMetadataServerSettings } from '@/features/settings/services/ServerSettingsMetadata.ts';
import { ChapterType, MangaType, TrackRecordType } from '@/lib/graphql/generated/graphql.ts';
import { enhancedCleanup } from '@/base/utils/Strings.ts';
import { LibraryOptions, LibrarySortMode } from '@/features/library/Library.types.ts';
import {
    MangaChapterCountInfo,
    MangaDownloadInfo,
    MangaIdInfo,
    MangaStatusInfo,
    MangaUnreadInfo,
} from '@/features/manga/Manga.types.ts';

const triStateFilter = (
    triState: NullAndUndefined<boolean>,
    enabledFilter: () => boolean,
    disabledFilter: () => boolean,
): boolean => {
    switch (triState) {
        case true:
            return enabledFilter();
        case false:
            return disabledFilter();
        default:
            return true;
    }
};

const triStateFilterNumber = (triState: NullAndUndefined<boolean>, count?: number): boolean =>
    triStateFilter(
        triState,
        () => !!count && count >= 1,
        () => count === 0,
    );

const triStateFilterBoolean = (triState: NullAndUndefined<boolean>, status?: boolean): boolean =>
    triStateFilter(
        triState,
        () => !!status,
        () => !status,
    );

const performSearch = (
    queries: NullAndUndefined<string>[] | undefined,
    strings: NullAndUndefined<string>[],
): boolean => {
    const actualQueries = queries?.filter((query) => query != null);
    const actualStrings = strings?.filter((str) => str != null);

    if (!actualQueries?.length) return true;

    const cleanedUpQueries = actualQueries.map(enhancedCleanup);
    const cleanedUpStrings = actualStrings.map(enhancedCleanup).join(', ');

    return cleanedUpQueries.every((query) => cleanedUpStrings.includes(query));
};

type TMangaQueryFilter = Pick<MangaType, 'title' | 'genre' | 'description' | 'artist' | 'author' | 'sourceId'>;
const querySearchManga = (
    query: NullAndUndefined<string>,
    { title, genre: genres, description, artist, author, sourceId }: TMangaQueryFilter,
): boolean =>
    performSearch([query], [title]) ||
    performSearch(
        query?.split(','),
        genres.map((genre) => enhancedCleanup(genre)),
    ) ||
    performSearch([query], [description]) ||
    performSearch([query], [artist]) ||
    performSearch([query], [author]) ||
    performSearch([query], [sourceId]);

type TMangaTrackerFilter = { trackRecords: { nodes: Pick<TrackRecordType, 'id' | 'trackerId'>[] } };
const statusFilter = (statusFilters: LibraryOptions['hasStatus'], manga: MangaStatusInfo): boolean =>
    Object.entries(statusFilters)
        .map(([status, statusFilterState]) => triStateFilterBoolean(statusFilterState, status === manga.status))
        .every(Boolean);

type TMangaFilterOptions = Pick<
    LibraryOptions,
    | 'hasUnreadChapters'
    | 'hasReadChapters'
    | 'hasBookmarkedChapters'
    | 'hasDuplicateChapters'
    | 'hasStatus'
>;
type TMangaFilter = Pick<MangaType, 'bookmarkCount' | 'hasDuplicateChapters'> &
    TMangaTrackerFilter &
    MangaStatusInfo &
    MangaChapterCountInfo &
    MangaDownloadInfo &
    MangaUnreadInfo;
const filterManga = (
    manga: TMangaFilter,
    {
        hasUnreadChapters,
        hasReadChapters,
        hasBookmarkedChapters,
        hasDuplicateChapters,
        hasStatus,
    }: TMangaFilterOptions,
): boolean =>
    triStateFilterNumber(hasUnreadChapters, manga.unreadCount) &&
    triStateFilterNumber(hasReadChapters, manga.chapters.totalCount - manga.unreadCount) &&
    triStateFilterNumber(hasBookmarkedChapters, manga.bookmarkCount) &&
    triStateFilterBoolean(hasDuplicateChapters, manga.hasDuplicateChapters) &&
    statusFilter(hasStatus, manga);

type TMangasFilter = TMangaQueryFilter & TMangaFilter;
const filterMangas = <Manga extends TMangasFilter>(
    mangas: Manga[],
    query: NullAndUndefined<string>,
    options: TMangaFilterOptions & { ignoreFilters: boolean },
): Manga[] => {
    const ignoreFiltersWhileSearching = options.ignoreFilters && query?.length;

    return mangas.filter((manga) => {
        const matchesSearch = querySearchManga(query, manga);
        const matchesFilters = ignoreFiltersWhileSearching || filterManga(manga, options);

        return matchesSearch && matchesFilters;
    });
};

const sortByNumber = (a: number | string = 0, b: number | string = 0) => Number(a) - Number(b);

const sortByString = (a: string, b: string): number => a.localeCompare(b);

type TMangaSort = Pick<MangaType, 'title' | 'inLibraryAt' | 'unreadCount'> &
    MangaChapterCountInfo & {
        lastReadChapter?: Pick<ChapterType, 'lastReadAt'> | null;
        latestUploadedChapter?: Pick<ChapterType, 'uploadDate'> | null;
        latestFetchedChapter?: Pick<ChapterType, 'fetchedAt'> | null;
    };
const sortManga = <Manga extends TMangaSort>(
    manga: Manga[],
    sort: NullAndUndefined<LibrarySortMode>,
    desc: NullAndUndefined<boolean>,
): Manga[] => {
    const result = [...manga];

    switch (sort) {
        case 'alphabetically':
            result.sort((a, b) => sortByString(a.title, b.title));
            break;
        case 'dateAdded':
            result.sort((a, b) => sortByNumber(a.inLibraryAt, b.inLibraryAt));
            break;
        case 'unreadChapters':
            result.sort((a, b) => sortByNumber(a.unreadCount, b.unreadCount));
            break;
        case 'lastRead':
            result.sort((a, b) => sortByNumber(a.lastReadChapter?.lastReadAt, b.lastReadChapter?.lastReadAt));
            break;
        case 'latestUploadedChapter':
            result.sort((a, b) =>
                sortByNumber(a.latestUploadedChapter?.uploadDate, b.latestUploadedChapter?.uploadDate),
            );
            break;
        case 'latestFetchedChapter':
            result.sort((a, b) => sortByNumber(a.latestFetchedChapter?.fetchedAt, b.latestFetchedChapter?.fetchedAt));
            break;
        case 'totalChapters':
            result.sort((a, b) => sortByNumber(a.chapters.totalCount, b.chapters.totalCount));
            break;
        default:
            break;
    }

    if (desc) {
        result.reverse();
    }

    return result;
};

export const useGetVisibleLibraryMangas = <Manga extends MangaIdInfo & TMangasFilter & TMangaSort>(
    mangas: Manga[],
): {
    visibleMangas: Manga[];
    showFilteredOutMessage: boolean;
    filterKey: string;
} => {
    const [query] = useQueryParam('query', StringParam);
    const options = {
        hasUnreadChapters: null,
        hasReadChapters: null,
        hasBookmarkedChapters: null,
        hasDuplicateChapters: null,
        sortBy: null,
        sortDesc: null,
        hasStatus: {
            CANCELLED: null,
            COMPLETED: null,
            LICENSED: null,
            ONGOING: null,
            ON_HIATUS: null,
            PUBLISHING_FINISHED: null,
            UNKNOWN: null,
        },
    };
    const {
        hasUnreadChapters,
        hasReadChapters,
        hasBookmarkedChapters,
        hasDuplicateChapters,
    } = options;
    const { settings } = useMetadataServerSettings();

    const filteredMangas = useMemo(
        () =>
            filterMangas(mangas, query, {
                ...options,
                ignoreFilters: settings.ignoreFilters,
            }),
        [
            mangas,
            query,
            hasUnreadChapters,
            hasReadChapters,
            hasBookmarkedChapters,
            hasDuplicateChapters,
            settings.ignoreFilters,
        ],
    );
    const sortedMangas = useMemo(
        () => sortManga(filteredMangas, options.sortBy, options.sortDesc),
        [filteredMangas, options.sortBy, options.sortDesc],
    );

    const showFilteredOutMessage =
        (hasUnreadChapters != null ||
            hasReadChapters != null ||
            hasBookmarkedChapters != null ||
            hasDuplicateChapters != null ||
            !!query) &&
        filteredMangas.length === 0 &&
        mangas.length > 0;

    return {
        visibleMangas: sortedMangas,
        showFilteredOutMessage,
        filterKey: `${JSON.stringify(options)}${settings.ignoreFilters}`,
    };
};
