import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

expect.extend(matchers);

beforeAll(() => {
    i18n.use(initReactI18next).init({
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: {
                translation: {
                    header: { howItWorks: 'How it works', faq: 'FAQ', terms: 'Terms' },
                    hero: { title: 'Make Images Lighter', subtitle: 'Compress images', description: 'Test', dropzone: 'Drop files', browse: 'Browse', secure: 'Secure' },
                },
            },
        },
    });
});

afterEach(() => {
    cleanup();
});
