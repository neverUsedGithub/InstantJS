import * as Instant from "../../src/instant.ts";
import { state, effect, ref } from "../../src/instant.ts";
import * as InstantDOM from "../../src/dom.ts";

function Counter({ initial }) {
  const count = state(initial);

  return (
    <>
      <h3>Count is {count()}</h3>
      <button onClick={() => count(count() - 1)}>Decrease to {count() - 1}</button>
      <button onClick={() => count(count() + 1)}>Increase to {count() + 1}</button>
    </>
  )
}

function App() {
  return (
    <>
      <Counter initial={0} />
      <Counter initial={5} />
      <Counter initial={10} />
    </>
  );
}

InstantDOM.render(<App />, document.querySelector("#app"));