export const sortByTitle = (a, b) => {
    const titleA = a.title.toLowerCase(), titleB = b.title.toLowerCase();
    if (titleA < titleB)
        return -1;
    if (titleA > titleB)
        return 1;
    return 0;
};