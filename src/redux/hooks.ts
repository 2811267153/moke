import { useSelector as useReduxSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>()