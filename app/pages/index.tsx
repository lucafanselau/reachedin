import { useRouter } from "next/router";
import { TextareaHTMLAttributes, useCallback } from "react";
import { ReadabilityResults } from "../src/components/results";
import getScores, { defaultScores } from "../src/functions/readability";
import { useStore } from "../src/store";
import { debounce } from "ts-debounce";

const calculateScores = debounce((draft: string) => {
  const { setResults } = useStore.getState();
  // handle submitting draft
  const scores = getScores(draft);
  setResults({ scores });
  // router.push("/results");
}, 400);

// NOTE: This just exists, so that the main page, does not has to be rerendered for every change
const TextArea = () => {
  const { updateDraft, draft } = useStore();

  const onChange = useCallback<
    TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"]
  >(
    (e) => {
      updateDraft(e.currentTarget.value);
      calculateScores(e.currentTarget.value);
    },
    [updateDraft]
  );

  return (
    <textarea
      value={draft}
      onChange={onChange}
      className="flex-1 textarea resize-none textarea-bordered"
    />
  );
};

const RightBox = () => {
  const results = useStore((s) => s.results);

  return (
    <div className="card bg-base-100 shadow-xl">
      {/* {results === undefined ? (
        <div className="card-body">
          <h3 className="card-title">Informations</h3>
          <p>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,
            no sea takimata sanctus est Lorem ipsum dolor sit amet.
          </p>
        </div>
      ) : (
      )} */}
      <ReadabilityResults scores={results?.scores ?? defaultScores} />
    </div>
  );
};

export default function Home() {
  const router = useRouter();

  const onReset = useCallback(() => {
    useStore.getState().updateDraft("");
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="container flex w-full h-full flex-col items-center justify-center self-center">
        <div className="container flex-row grid justify-center">
          <img
            src={"/reachedin-logo.png"}
            className={"align-middle max-w-sm my-8"}
            alt={"logo"}
          ></img>
        </div>
        <div className="container grid justify-center max-w-[1000px]">
          <div className="grid grid-cols-2 auto-rows-min gap-3">
            <div className="card row-span-2 bg-base-100 shadow-xl">
              <div className="card-body">
                <h1 className="card-title">Check your LinkedIn Post</h1>
                <TextArea />
                <div className="card-actions justify-end">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={onReset}
                  >
                    Reset
                  </button>
                  {/* <button
                  className="btn btn-small btn-primary"
                  onClick={onSubmit}
                >
                  Submit
                </button> */}
                </div>
              </div>
            </div>
            <RightBox />
            <a
              href="https://www.buymeacoffee.com/lucafanselau"
              target={"__blank"}
              rel={"noopener noreferrer"}
            >
              <div className="h-[96px] max-w-md card bg-base-100 shadow-xl bg-[url('/bmc-button.png')] bg-cover bg-center"></div>
            </a>
          </div>
        </div>
        <div className="container bottom-0 flex-row grid justify-center max-w-[1000px]">
          <div className="container flex flex-row justify-center my-16">
            <div className="item m-4">
              <p>We (currently) don&apos;t track you!</p>
            </div>
            <div className="item m-4">
              <p>Made with 💖 for everyone to use!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
