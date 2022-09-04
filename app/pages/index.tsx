import { useRouter } from "next/router";
import { TextareaHTMLAttributes, useCallback } from "react";
import getScores from "../src/functions/readability";
import { useStore } from "../src/store";


const TextArea = () => {
  const { updateDraft, draft } = useStore();

  const onChange = useCallback<TextareaHTMLAttributes<HTMLTextAreaElement>["onChange"]>((e) => {
    updateDraft(e.currentTarget.value);
  }, [updateDraft])

  return (
              <textarea value={draft} onChange={onChange} className="flex-1 textarea resize-none textarea-bordered" />
  )
}

export default function Home() {
  const router = useRouter();

  const onSubmit = useCallback(() => {
    const { draft, setResults } = useStore.getState();
    // handle submitting draft
    const results = getScores(draft)
    setResults(results)
    router.push("/results");
  }, [])

  const onReset = useCallback(() => {
    useStore.getState().updateDraft("");
  }, []);


  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="container">
        <div className="grid grid-cols-2 auto-rows-min gap-3">
          <div className="card row-span-2 bg-base-100 shadow-xl">
            <div className="card-body">
             <h1 className="card-title">Check your LinkedIn Post</h1>
             <TextArea />
              <div className="card-actions justify-end">
                <button className="btn btn-small btn-error" onClick={onReset}>Reset</button>
                <button className="btn btn-small" onClick={onSubmit}>Submit</button>
              </div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Informations</h3>
              <p>
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                diam nonumy eirmod tempor invidunt ut labore et dolore magna
                aliquyam erat, sed diam voluptua. At vero eos et accusam et
                justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum
                dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
                sed diam voluptua. At vero eos et accusam et justo duo dolores
                et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                est Lorem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                BUY A COFFEE{" "}
                <a
                  className="link link-primary"
                  href="https://www.buymeacoffee.com/lucafanselau"
                >
                  NOW
                </a>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
