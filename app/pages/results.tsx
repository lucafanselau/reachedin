import { NextPage } from "next";
import { FC } from "react";
import { scoreRanges } from "../src/functions/readability";
import { useStore } from "../src/store";

const Progress: FC<{
  name: string;
  value: number;
  range: readonly [number, number];
}> = ({ name, value, range }) => {
  const [min, max] = range;

  return (
    <div className="flex space-x-3">
      <p>{name}</p>
      <progress
        value={value - min}
        max={max - min}
        className="progress w-56 progress-primary"
      />
    </div>
  );
};

const Results: NextPage = () => {
  const { results } = useStore();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container">
        <div className="grid auto-rows-min gap-3">
          <div className="card bg-base-100 shadow-xl">
            {results !== undefined ? (
              <div className="card-body">
                <h1 className="card-title">Readability Scores</h1>
                <Progress
                  value={results.scores.automatedReadabilityIndex}
                  name="Automated Readability Index"
                  range={scoreRanges.automatedReadabilityIndex}
                />
                <Progress
                  value={results.scores.colemanLiauIndex}
                  name="Coleman Liau"
                  range={scoreRanges.colemanLiauIndex}
                />
                <Progress
                  value={results.scores.fleschKincaidGrade}
                  name="Flesch Kincaid"
                  range={scoreRanges.fleschKincaidGrade}
                />
                <Progress
                  value={results.scores.fleschReadingEase}
                  name="Flesch Reading Ease"
                  range={scoreRanges.fleschReadingEase}
                />
                <Progress
                  value={results.scores.linsearWriteFormula}
                  name="Linsear Write"
                  range={scoreRanges.linsearWriteFormula}
                />
                <Progress
                  value={results.scores.medianGrade}
                  name="Median Grade"
                  range={scoreRanges.medianGrade}
                />
                <Progress
                  value={results.scores.rix}
                  name="RIX"
                  range={scoreRanges.rix}
                />
                <Progress
                  value={results.scores.smogIndex}
                  name="Smog Index"
                  range={scoreRanges.smogIndex}
                />
              </div>
            ) : (
              <div className="card-body">
                <h1 className="card-title">How did you get here...</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Results;
