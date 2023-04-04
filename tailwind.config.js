/**
 * Utility credit: https://play.tailwindcss.com/QNkCU1z1UX?file=config
 * @type {import('tailwindcss').Config} */

const toRgba = (hexCode, opacity = 50) => {
  let hex = hexCode.replace('#', '')

  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
  }

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `rgba(${r},${g},${b},${opacity / 100})`
}

const flattenColorPalette = (obj, sep = '-') =>
  Object.assign(
    {},
    ...(function _flatten(o, p = '') {
      return [].concat(
        ...Object.keys(o).map((k) => (typeof o[k] === 'object' ? _flatten(o[k], k + sep) : { [p + k]: o[k] }))
      )
    })(obj)
  )

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        22: 'repeat(22, minmax(0, 1fr))'
      },
      colors: {
        azure: {
          DEFAULT: '#0078D4',
          50: '#8DCDFF',
          100: '#78C5FF',
          200: '#4FB3FF',
          300: '#27A1FF',
          400: '#008FFD',
          500: '#0078D4',
          600: '#00589C',
          700: '#003864',
          800: '#00192C',
          900: '#000000'
        }
      },
      boxShadow: {
        modal: '0 0 50px 1px rgba(0, 0, 0, 0.3)'
      }
    }
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const utilities = {
        '.bg-stripes': {
          background:
            'repeating-linear-gradient(135deg, var(--stripes-color-1) 0px, var(--stripes-color-1) 4px, var(--stripes-color-2) 4px, var(--stripes-color-2) 8px)'
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */
        },
        /* Hide scrollbar for Chrome, Safari and Opera */
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none'
        },
        '.mac-scrollbar::-webkit-scrollbar': {
          width: '4px',
          height: '4px'
        },
        '.mac-scrollbar::-webkit-scrollbar-thumb': {
          'border-radius': '2px',
          'background-color': 'rgba(51,65,85,0.5)'
        },
        '.mac-scrollbar::-webkit-scrollbar-track': {
          background: 'transparent',
          position: 'absolute',
          'z-index': 10
        },
        '.invis-scrollbar::-webkit-scrollbar': {
          width: '4px',
          height: '4px'
        },
        '.invis-scrollbar::-webkit-scrollbar-thumb': {
          'border-radius': '2px',
          'background-color': 'rgba(51,65,85,0)'
        },
        '.invis-scrollbar::-webkit-scrollbar-track': {
          background: 'transparent',
          position: 'absolute',
          'z-index': 10
        }
      }

      const addColor1 = (name, color) => (utilities[`.bg-stripes-c1-${name}`] = { '--stripes-color-1': color })
      const addColor2 = (name, color) => (utilities[`.bg-stripes-c2-${name}`] = { '--stripes-color-2': color })

      const colors = flattenColorPalette(theme('backgroundColor'))
      for (let name in colors) {
        try {
          const [r, g, b, a] = toRgba(colors[name])
          if (a !== undefined) {
            addColor1(name, colors[name])
            addColor2(name, colors[name])
          } else {
            addColor1(name, `rgba(${r}, ${g}, ${b}, 0.4)`)
            addColor2(name, `rgba(${r}, ${g}, ${b}, 0.4)`)
          }
        } catch (_) {
          addColor1(name, colors[name])
          addColor2(name, colors[name])
        }
      }

      addUtilities(utilities)
    }
  ]
}
