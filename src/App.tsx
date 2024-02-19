import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import "./App.css";

function App() {
  const [catchEvent, setCatchEvent] = useState(false);
  const [delay, setDelay] = useState(10);
  const [url, setUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [log, setLog] = useState("");

  const handleFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const handleCatchEvent = useCallback(
    async (ev: MouseEvent) => {
      if (!catchEvent) return;
      console.log("fetch: ", url);
      setCatchEvent(false);
      if (url) {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);
        const _log = `${new Date().toLocaleTimeString()} - send to ${url} and Waiting ${delay} sec`;
        setLog(_log);
      }

      setTimeout(() => {
        console.log("Delayed", delay);
        setCatchEvent(true);
        setLog(`${new Date().toLocaleTimeString()} - Waiting for event`);
      }, delay * 1000);
    },
    [catchEvent, delay, url],
  );

  const handleSubmit = (ev: SyntheticEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const formData = new FormData(ev.target as HTMLFormElement);
    console.log("submit", formData.has("delay") && formData.has("url"));
    if (formData.has("delay") && formData.has("url")) {
      setDelay(Number(formData.get("delay")));
      setUrl(formData.get("url")?.toString() ?? "http://locahost");
      setReady(true);
    } else {
      setReady(false);
    }
  };

  useEffect(() => {
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        sleep(2000).then(() => setCatchEvent(true));
        console.log("full screen on");
      } else {
        setCatchEvent(false);
        console.log("full screen off");
      }
    });
    document.addEventListener("mousemove", handleCatchEvent);
    return () => document.removeEventListener("mousemove", handleCatchEvent);
  }, [handleCatchEvent]);

  return (
    <div
      className="App"
      style={{
        display: "grid",
        placeContent: "center",
        gap: "2rem",
        padding: "2rem",
        overflow: "clip",
        border: "1px solid blue",
        borderRadius: "1rem",
      }}
    >
      <div className="log">{log}</div>
      <div className="settings">
        <button
          onClick={handleFullScreen}
          style={{
            padding: "1rem",
            backgroundColor: "blue",
            borderRadius: "0.5rem",
            color: "white",
            fontWeight: 700,
            outline: "none",
            border: "none",
          }}
          disabled={!ready}
        >
          Full Screen
        </button>
        <form className="form" onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              alignItems: "center",
              gap: "2rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <label htmlFor="url" style={{ fontWeight: 700 }}>
              Url
            </label>
            <input
              className="input"
              type="url"
              id="url"
              name="url"
              placeholder="http://addres"
              required
            />
          </div>
          <div
            style={{
              display: "grid",
              justifyItems: "center",
              alignItems: "center",
              gap: "2rem",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <label htmlFor="delay" style={{ fontWeight: 700 }}>
              Delay in seconds
            </label>
            <input
              className="input"
              type="number"
              min={10}
              id="delay"
              name="delay"
              value={delay}
              onChange={(ev) => {
                let num = Number(ev.target.value ?? "10");
                setDelay(Math.floor(num));
              }}
              required
            />
          </div>
          <button
            style={{
              padding: "1rem",
              backgroundColor: "rgb(100, 0, 100)",
              borderRadius: "0.5rem",
              color: "white",
              fontWeight: 700,
              outline: "none",
              border: "none",
            }}
          >
            Set
          </button>
        </form>
      </div>
    </div>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default App;
