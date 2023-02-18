export const sliceParagraph = (paragraph) => {
    let words = paragraph.split(" ");

    if (words.length <= 25) {
        return paragraph;
    }

    let slicedWords = words.slice(0, 25);
    let slicedParagraph = slicedWords.join(" ") + "...";

    return slicedParagraph;
}