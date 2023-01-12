export const firebaseSelector = (state) => {
    return state.firebase;
}

export const authIdSelector = (state) => {
    return state.authentication.uid
}

export const rememberPasswordSelector = (state) => {
    return state.remember_password
}