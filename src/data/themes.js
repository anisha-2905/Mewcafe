import autumnBackground from '../assets/backgrounds/autumn.png';
import christmasBackground from '../assets/backgrounds/christmas.png';
import rainyBackground from '../assets/backgrounds/rainy.png';
import springBackground from '../assets/backgrounds/spring.png';

export const themes = [
  {
    name: 'spring',
    label: 'Spring',
    icon: '✿',
    backgroundImage: springBackground,
    accentColor: '#ff92bd',
    buttonColor: '#ffd59a',
    glassTint: 'rgba(255, 213, 226, 0.24)',
    textColor: '#fff7ec',
    progressRingColor: '#ff9dbb'
  },
  {
    name: 'rainy',
    label: 'Rainy',
    icon: '☂',
    backgroundImage: rainyBackground,
    accentColor: '#8fc2cc',
    buttonColor: '#6f9aa5',
    glassTint: 'rgba(126, 162, 167, 0.24)',
    textColor: '#edf8f6',
    progressRingColor: '#9bd4dc'
  },
  {
    name: 'autumn',
    label: 'Autumn',
    icon: '◆',
    backgroundImage: autumnBackground,
    accentColor: '#f08a3c',
    buttonColor: '#c9672e',
    glassTint: 'rgba(219, 116, 45, 0.24)',
    textColor: '#fff1dd',
    progressRingColor: '#f6a24b'
  },
  {
    name: 'christmas',
    label: 'Christmas',
    icon: '✦',
    backgroundImage: christmasBackground,
    accentColor: '#f7c56b',
    buttonColor: '#8f4f62',
    glassTint: 'rgba(84, 70, 132, 0.28)',
    textColor: '#fff6e3',
    progressRingColor: '#ffd273'
  }
];

export const defaultThemeName = 'spring';

export function getThemeByName(themeName) {
  return themes.find((theme) => theme.name === themeName) ?? themes[0];
}
