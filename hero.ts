import { heroui } from '@heroui/react'

export default heroui({
  addCommonColors: false,
  defaultTheme: 'dark',
  defaultExtendTheme: 'dark',

  themes: {
    light: {
      colors: {
        background: '#F4FAF6',
        foreground: '#0D1A12',

        content1: '#E8F4EC',
        content2: '#DAF0E2',
        content3: '#CBE8D4',
        content4: '#CBE8D4',

        divider: '#1A9B60',

        focus: '#1A9B60',

        default: {
          DEFAULT:  '#4A7055',
          900:      '#2A4A35',
          foreground: '#0D1A12',
        },

        primary: {
          DEFAULT: '#1A9B60',
          600:     '#157A4C',
          foreground: '#F4FAF6',
        },

        secondary: {
          DEFAULT: '#C08B2D',
          600:     '#A07524',
          foreground: '#F4FAF6',
        },

        success: {
          DEFAULT: '#5A9B42',
          foreground: '#F4FAF6',
        },
      },

      layout: {
        radius: {
          small:  '6px',
          medium: '9px',
          large:  '14px',
        },
        fontSize: {
          tiny:   '10.5px',
          small:  '11px',
          medium: '15.5px',
          large:  '1rem',
        },
      },
    },

    dark: {
      colors: {
        // Page surface layers
        background: '#080C09', // --color-bg-0
        foreground: '#E4EDE6', // --color-ink

        // Content surface scale (bg-1 → bg-3)
        content1: '#0D1210', // --color-bg-1
        content2: '#141C16', // --color-bg-2
        content3: '#1A2319', // --color-bg-3
        content4: '#1A2319',

        // Divider is the raw emerald; opacity variants are applied in @theme
        divider: '#50C88C',

        // Focus ring follows accent
        focus: '#3ECF8E',

        // Default scale = muted-text family (i2 → DEFAULT, i3 → 900)
        default: {
          DEFAULT:  '#7A9A82', // i2 — mid-tone muted text
          900:      '#3D5C44', // i3 — subdued/label text
          foreground: '#E4EDE6',
        },

        // Primary = emerald accent; 600 shade is accent-dark
        primary: {
          DEFAULT: '#3ECF8E',
          600: '#2AAF72', // --color-accent-dark
          foreground: '#080C09',
        },

        // Secondary = warm amber accent for aggregate timelines
        secondary: {
          DEFAULT: '#E0A840',
          600:     '#C89430',
          foreground: '#080C09',
        },

        // Success = muted green
        success: {
          DEFAULT: '#8BBF6E',
          foreground: '#080C09',
        },
      },

      layout: {
        // Border radius scale
        radius: {
          small: '6px',  // --radius-sm
          medium: '9px', // --radius-md
          large: '14px', // --radius-lg
        },

        // Match HeroUI component font sizes to body-level tokens
        fontSize: {
          tiny:   '10.5px', // --font-size-label
          small:  '11px',   // --font-size-caption
          medium: '15.5px', // --font-size-body-lg
          large:  '1rem',
        },
      },
    },
  },
})
