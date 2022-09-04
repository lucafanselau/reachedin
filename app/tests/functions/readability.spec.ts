import getScores from "../../src/functions/readability";

describe("Readability Tests", () => {
    test("Test", async () => {
        const expected = {
            automatedReadabilityIndex: 8.84,
            colemanLiauIndex: 8.24,
            fleschKincaidGrade: 8.28,
            fleschReadingEase: 68.18,
            linsearWriteFormula: 11.38,
            medianGrade: 9,
            readingTime: 17.51,
            rix: 3,
            smogIndex: 11.7
          }
        const testText = "This is not a scientific result in any way. Heck, the whole concept of readability escapes scientific scrutiny (just look at the number of different tests with different values!). If you want to modify it, you could use the average grade as well (take both rounded down and rounded up to get the grade spread). Or you could find what grade is the most common in the whole spread and use that instead."
        const readability = await getScores(testText);
        expect(readability).toStrictEqual(expected);
    });
});
