import autumnBackground from '../assets/backgrounds/autumn.png';
import christmasBackground from '../assets/backgrounds/christmas.png';
import rainyBackground from '../assets/backgrounds/rainy.png';
import springBackground from '../assets/backgrounds/spring.png';

const themeIcons = {
  spring: String.fromCodePoint(0x1f338),
  rainy: String.fromCodePoint(0x1f327),
  autumn: String.fromCodePoint(0x1f341),
  christmas: String.fromCodePoint(0x1f384)
};

export const themes = [
  {
    name: 'spring',
    label: 'Spring',
    icon: themeIcons.spring,
    backgroundImage: springBackground,
    ambiencePath: 'src/assets/sounds/spring-ambience.mp3',
    accentColor: '#ff92bd',
    buttonColor: '#ffd59a',
    glassTint: 'rgba(255, 213, 226, 0.24)',
    cardGlass: 'rgba(42, 24, 36, 0.55)',
    cardBlur: '18px',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    cardShadow: '0 18px 45px rgba(0, 0, 0, 0.30)',
    textColor: '#fff7ec',
    progressRingColor: '#ff9dbb'
  },
  {
    name: 'rainy',
    label: 'Rainy',
    icon: themeIcons.rainy,
    backgroundImage: rainyBackground,
    ambiencePath: 'src/assets/sounds/rainy-ambience.mp3',
    accentColor: '#8fc2cc',
    buttonColor: '#6f9aa5',
    glassTint: 'rgba(126, 162, 167, 0.24)',
    cardGlass: 'rgba(28, 32, 36, 0.62)',
    cardBlur: '20px',
    cardBorder: 'rgba(255, 255, 255, 0.12)',
    cardShadow: '0 20px 50px rgba(0, 0, 0, 0.40)',
    textColor: '#edf8f6',
    progressRingColor: '#9bd4dc'
  },
  {
    name: 'autumn',
    label: 'Autumn',
    icon: themeIcons.autumn,
    backgroundImage: autumnBackground,
    ambiencePath: 'src/assets/sounds/autumn-ambience.mp3',
    accentColor: '#f08a3c',
    buttonColor: '#c9672e',
    glassTint: 'rgba(219, 116, 45, 0.24)',
    cardGlass: 'rgba(52, 32, 24, 0.56)',
    cardBlur: '18px',
    cardBorder: 'rgba(255, 255, 255, 0.10)',
    cardShadow: '0 18px 45px rgba(0, 0, 0, 0.30)',
    textColor: '#fff1dd',
    progressRingColor: '#f6a24b'
  },
  {
    name: 'christmas',
    label: 'Christmas',
    icon: themeIcons.christmas,
    backgroundImage: christmasBackground,
    ambiencePath: 'src/assets/sounds/christmas-ambience.mp3',
    accentColor: '#f7c56b',
    buttonColor: '#8f4f62',
    glassTint: 'rgba(84, 70, 132, 0.28)',
    cardGlass: 'rgba(24, 22, 38, 0.62)',
    cardBlur: '20px',
    cardBorder: 'rgba(255, 255, 255, 0.14)',
    cardShadow: '0 22px 55px rgba(0, 0, 0, 0.42)',
    textColor: '#fff6e3',
    progressRingColor: '#ffd273'
  }
];

export const defaultThemeName = 'spring';

export function getThemeByName(themeName) {
  return themes.find((theme) => theme.name === themeName) ?? themes[0];
}
