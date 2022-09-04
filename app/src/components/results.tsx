import { FC } from "react";
import { ReadabilityScores, scoreRanges } from "../functions/readability";
import { InfoCircledIcon } from "@radix-ui/react-icons";

const Progress: FC<{
  name: string;
  value: number;
  range: readonly [number, number];
}> = ({ name, value, range }) => {
  const [min, max] = range;

  return (
    <div className="flex space-x-3 items-center flex-nowrap">
      <div className="flex flex-1 items-center space-x-1">
        <p className="text-sm items-center min-w-0">{name}</p>
        <div>
          <InfoCircledIcon className="w-[15px] h-[15px]" />
        </div>
      </div>
      <p className="text-sm flex-none w-10">{Math.max(value, min)}</p>
      <progress
        value={value - min}
        max={max - min}
        className="progress flex-none w-40 progress-primary"
      />
    </div>
  );
};

export const ReadabilityResults: FC<{ scores: ReadabilityScores }> = ({
  scores,
}) => {
  return (
    <div className="card-body">
      <h1 className="card-title">Readability Scores</h1>
      <Progress
        value={scores.automatedReadabilityIndex}
        name="Automated Readability Index"
        range={scoreRanges.automatedReadabilityIndex}
      />
      <Progress
        value={scores.colemanLiauIndex}
        name="Coleman Liau"
        range={scoreRanges.colemanLiauIndex}
      />
      <Progress
        value={scores.fleschKincaidGrade}
        name="Flesch Kincaid"
        range={scoreRanges.fleschKincaidGrade}
      />
      <Progress
        value={scores.fleschReadingEase}
        name="Flesch Reading Ease"
        range={scoreRanges.fleschReadingEase}
      />
      <Progress
        value={scores.linsearWriteFormula}
        name="Linsear Write"
        range={scoreRanges.linsearWriteFormula}
      />
      <Progress
        value={scores.medianGrade}
        name="Median Grade"
        range={scoreRanges.medianGrade}
      />
      <Progress value={scores.rix} name="RIX" range={scoreRanges.rix} />
      <Progress
        value={scores.smogIndex}
        name="Smog Index"
        range={scoreRanges.smogIndex}
      />
    </div>
  );
};
