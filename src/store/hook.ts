import { useSelector as _useSelector } from 'react-redux';
import { RootState } from './store';

export const useSelector: <TSelected>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean,
) => TSelected = _useSelector;
