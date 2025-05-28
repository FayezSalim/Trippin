import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { User } from '../models/user';

type authStoreState = {
    name: string | undefined;
    emailId: string | undefined;
    profilePic: string | undefined;
    isLoggedIn: boolean,
    isLoading: boolean //TODO implement inprogress UI,
    useSecureProtocol?: boolean //TODO interceptor to switch to secure protocol for https //proxy for websocket to make the switch //check how to intercept fetch
};

const initialState: authStoreState = {
    emailId: undefined,
    name: undefined,
    profilePic: undefined,
    isLoggedIn: false,
    isLoading: false
}

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => ({
        updateLoggedInUser(user: User): void {
            patchState(store, (state) => ({ name: user.name, emailId: user.emailId, isLoggedIn: true, profilePic: user.imageKey }));
        }
    }))
);
