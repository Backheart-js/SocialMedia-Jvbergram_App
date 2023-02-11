export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/

export const INPUT_IMAGE_REGEX = /\.(jpe?g|png|gif|svg)$/i

export const CHECK_URL_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|(\/\/[^\s]+)/g;

export const CHECK_HASHTAG_REGEX = /#[a-zA-Z0-9_]+/g;