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
    textColor: '#fff7ec',
    progressRingColor: '#ff9dbb',
    panelBg: 'rgba(92, 45, 65, 0.78)',
    panelBorder: 'rgba(255,255,255,0.18)',
    inputBg: 'rgba(255,255,255,0.08)',
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
    textColor: '#edf8f6',
    progressRingColor: '#9bd4dc',
    panelBg: 'rgba(32, 45, 52, 0.78)',
    panelBorder: 'rgba(210,230,235,0.15)',
    inputBg: 'rgba(255,255,255,0.07)',
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
    textColor: '#fff1dd',
    progressRingColor: '#f6a24b',
    panelBg: 'rgba(78, 42, 25, 0.78)',
    panelBorder: 'rgba(255,230,180,0.15)',
    inputBg: 'rgba(255,255,255,0.07)',
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
    textColor: '#fff6e3',
    progressRingColor: '#ffd273',
    panelBg: 'rgba(48, 32, 56, 0.78)',
    panelBorder: 'rgba(255,230,245,0.16)',
    inputBg: 'rgba(255,255,255,0.08)',
  }
];

export const defaultThemeName = 'spring';

export function getThemeByName(themeName) {
  return themes.find((theme) => theme.name === themeName) ?? themes[0];
}
