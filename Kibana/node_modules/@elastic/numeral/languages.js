module.exports = [
  {
    id: 'be-nl',
    name: 'Dutch (Belgium)',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: ' mln',
        billion: ' mld',
        trillion: ' bln'
      },
      ordinal: function(number) {
        var remainder = number % 100;
        return (number !== 0 && remainder <= 1) || remainder === 8 || remainder >= 20 ? 'ste' : 'de';
      },
      currency: {
        symbol: '€ '
      }
    }
  },
  {
    id: 'chs',
    name: 'Simplified Chinese',
    lang: {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      abbreviations: {
        thousand: '千',
        million: '百万',
        billion: '十亿',
        trillion: '兆'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '¥'
      }
    }
  },
  {
    id: 'cs',
    name: 'Czech',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'tis.',
        million: 'mil.',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function() {
        return '.';
      },
      currency: {
        symbol: 'Kč'
      }
    }
  },
  {
    id: 'da-dk',
    name: 'Danish (Denmark)',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'mio',
        billion: 'mia',
        trillion: 'b'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: 'DKK'
      }
    }
  },
  {
    id: 'de-ch',
    name: 'German (Switzerland)',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: 'CHF'
      }
    }
  },
  {
    id: 'de',
    name: 'German',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'en-gb',
    name: 'English (UK)',
    lang: {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        var b = number % 10;
        return ~~((number % 100) / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
      },
      currency: {
        symbol: '£'
      }
    }
  },
  {
    id: 'es-ES',
    name: 'Spanish (Spain)',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'mm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        var b = number % 10;
        return b === 1 || b === 3
          ? 'er'
          : b === 2 ? 'do' : b === 7 || b === 0 ? 'mo' : b === 8 ? 'vo' : b === 9 ? 'no' : 'to';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'es',
    name: 'Spanish',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'mm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        var b = number % 10;
        return b === 1 || b === 3
          ? 'er'
          : b === 2 ? 'do' : b === 7 || b === 0 ? 'mo' : b === 8 ? 'vo' : b === 9 ? 'no' : 'to';
      },
      currency: {
        symbol: '$'
      }
    }
  },
  {
    id: 'et',
    name: 'Estonian',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: ' tuh',
        million: ' mln',
        billion: ' mld',
        trillion: ' trl'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'fi',
    name: 'Finnish',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'G',
        trillion: 'T'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'fr-CA',
    name: 'French (Canada)',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'M',
        billion: 'G',
        trillion: 'T'
      },
      ordinal: function(number) {
        return number === 1 ? 'er' : 'e';
      },
      currency: {
        symbol: '$'
      }
    }
  },
  {
    id: 'fr-ch',
    name: 'French (Switzerland)',
    lang: {
      delimiters: {
        thousands: "'",
        decimal: '.'
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return number === 1 ? 'er' : 'e';
      },
      currency: {
        symbol: 'CHF'
      }
    }
  },
  {
    id: 'fr',
    name: 'French',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return number === 1 ? 'er' : 'e';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'hu',
    name: 'Hungarian',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'E', // ezer
        million: 'M', // millió
        billion: 'Mrd', // milliárd
        trillion: 'T' // trillió
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: ' Ft'
      }
    }
  },
  {
    id: 'it',
    name: 'Italian',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'mila',
        million: 'mil',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return 'º';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'ja',
    name: 'Japanese',
    lang: {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      abbreviations: {
        thousand: '千',
        million: '百万',
        billion: '十億',
        trillion: '兆'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '¥'
      }
    }
  },
  {
    id: 'nl-nl',
    name: 'Dutch (Netherlands)',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'mln',
        billion: 'mrd',
        trillion: 'bln'
      },
      ordinal: function(number) {
        var remainder = number % 100;
        return (number !== 0 && remainder <= 1) || remainder === 8 || remainder >= 20 ? 'ste' : 'de';
      },
      currency: {
        symbol: '€ '
      }
    }
  },
  {
    id: 'pl',
    name: 'Polish',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'tys.',
        million: 'mln',
        billion: 'mld',
        trillion: 'bln'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: 'PLN'
      }
    }
  },
  {
    id: 'pt-br',
    name: 'Portuguese (Brazil)',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'mil',
        million: 'milhões',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return 'º';
      },
      currency: {
        symbol: 'R$'
      }
    }
  },
  {
    id: 'pt-pt',
    name: 'Portuguese',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'k',
        million: 'm',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function(number) {
        return 'º';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'ru-UA',
    name: 'Russian (Ukraine)',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'тыс.',
        million: 'млн',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function() {
        // not ideal, but since in Russian it can taken on
        // different forms (masculine, feminine, neuter)
        // this is all we can do
        return '.';
      },
      currency: {
        symbol: '\u20B4'
      }
    }
  },
  {
    id: 'ru',
    name: 'Russian',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'тыс.',
        million: 'млн',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function() {
        // not ideal, but since in Russian it can taken on
        // different forms (masculine, feminine, neuter)
        // this is all we can do
        return '.';
      },
      currency: {
        symbol: 'руб.'
      }
    }
  },
  {
    id: 'sk',
    name: 'Slovak',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'tis.',
        million: 'mil.',
        billion: 'b',
        trillion: 't'
      },
      ordinal: function() {
        return '.';
      },
      currency: {
        symbol: '€'
      }
    }
  },
  {
    id: 'th',
    name: 'Thai',
    lang: {
      delimiters: {
        thousands: ',',
        decimal: '.'
      },
      abbreviations: {
        thousand: 'พัน',
        million: 'ล้าน',
        billion: 'พันล้าน',
        trillion: 'ล้านล้าน'
      },
      ordinal: function(number) {
        return '.';
      },
      currency: {
        symbol: '฿'
      }
    }
  },
  {
    id: 'tr',
    name: 'Turkish',
    lang: {
      delimiters: {
        thousands: '.',
        decimal: ','
      },
      abbreviations: {
        thousand: 'bin',
        million: 'milyon',
        billion: 'milyar',
        trillion: 'trilyon'
      },
      ordinal: (function() {
        var suffixes = {
          1: "'inci",
          5: "'inci",
          8: "'inci",
          70: "'inci",
          80: "'inci",

          2: "'nci",
          7: "'nci",
          20: "'nci",
          50: "'nci",

          3: "'üncü",
          4: "'üncü",
          100: "'üncü",

          6: "'ncı",

          9: "'uncu",
          10: "'uncu",
          30: "'uncu",

          60: "'ıncı",
          90: "'ıncı"
        };

        return function(number) {
          if (number === 0) {
            // special case for zero
            return "'ıncı";
          }

          var a = number % 10,
            b = number % 100 - a,
            c = number >= 100 ? 100 : null;

          return suffixes[a] || suffixes[b] || suffixes[c];
        };
      })(),
      currency: {
        symbol: '\u20BA'
      }
    }
  },
  {
    id: 'uk-UA',
    name: 'Ukrainian',
    lang: {
      delimiters: {
        thousands: ' ',
        decimal: ','
      },
      abbreviations: {
        thousand: 'тис.',
        million: 'млн',
        billion: 'млрд',
        trillion: 'блн'
      },
      ordinal: function() {
        // not ideal, but since in Ukrainian it can taken on
        // different forms (masculine, feminine, neuter)
        // this is all we can do
        return '';
      },
      currency: {
        symbol: '\u20B4'
      }
    }
  }
];
