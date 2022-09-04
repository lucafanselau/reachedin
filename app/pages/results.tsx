import { NextPage } from "next";
import { FC } from "react";
import { ReadabilityResults } from "../src/components/results";
import { scoreRanges } from "../src/functions/readability";
import { useStore } from "../src/store";
const Results: NextPage = () => {
  const { results } = useStore();

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container">
        <div className="grid auto-rows-min gap-3">
          <div className="card bg-base-100 shadow-xl">
            {results !== undefined ? (
              <ReadabilityResults scores={results.scores} />
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
