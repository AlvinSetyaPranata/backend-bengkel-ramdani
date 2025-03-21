export const console_dev = (messege: unknown) => {
    if (__DEV__) {
        console.log(messege)
    }
}