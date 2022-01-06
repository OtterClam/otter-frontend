import Safe from 'src/assets/images/safe-hand-note.jpg';
import Furry from 'src/assets/images/furry-hand-note.jpg';
import Stone from 'src/assets/images/stone-hand-note.jpg';
import Diamond from 'src/assets/images/diamond-hand-note.jpg';

export default function getNoteImage(name: string) {
  if (name.toLowerCase().indexOf('safe') >= 0) {
    return Safe;
  } else if (name.toLowerCase().indexOf('furry') >= 0) {
    return Furry;
  } else if (name.toLowerCase().indexOf('stone') >= 0) {
    return Stone;
  } else if (name.toLowerCase().indexOf('diamond') >= 0) {
    return Diamond;
  }

  throw new Error('Unsupported note: ' + name);
}
