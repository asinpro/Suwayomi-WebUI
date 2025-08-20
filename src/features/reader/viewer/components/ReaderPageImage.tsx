/*
 * Copyright (C) Contributors to the Suwayomi project
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { ForwardedRef, forwardRef } from 'react';
import { SpinnerImage, SpinnerImageProps } from '@/base/components/SpinnerImage.tsx';
import { userReaderStatePagesContext } from '@/features/reader/contexts/state/ReaderStatePagesContext.tsx';

export interface ReaderPageImageProps extends Omit<SpinnerImageProps, 'src'> {
    originalSrc: string;
    translatedSrc?: string;
}

export const ReaderPageImage = forwardRef(
    (
        { originalSrc, translatedSrc, ...props }: ReaderPageImageProps,
        ref: ForwardedRef<HTMLImageElement | HTMLDivElement | null>,
    ) => {
        const { showTranslation } = userReaderStatePagesContext();
        const src = showTranslation && translatedSrc ? translatedSrc : originalSrc;

        return <SpinnerImage src={src} ref={ref} {...props} />;
    },
);
